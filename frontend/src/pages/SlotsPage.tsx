import { useState, useEffect, useCallback, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import {
  IoPencil,
  IoTrash,
  IoAdd,
  IoCheckmark,
  IoChevronDown,
  IoChevronForward,
} from "react-icons/io5";
import Navbar from "../components/Navbar";
import CreateSlotModal from "../components/CreateSlotModal";
import EditSlotModal from "../components/EditSlotModal";
import AddTaskModal from "../components/AddTaskModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { daysFull, months } from "../constants/dateTime";
import {
  getSlots,
  deleteSlot,
  deleteTask,
  toggleTask,
  editTask,
} from "../api/slotService";
import { toggleTopic } from "../api/topicService";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

type SlotTask = {
  _id: string;
  type: "CUSTOM" | "TEXTBOOK";
  topicId?: string;
  titleSnapshot: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
};

type Slot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
  tasks: SlotTask[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toLocalISO(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar({
  value,
  onChange,
  onClose,
}: {
  value: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1),
  );
  const todayISO = toLocalISO(new Date());

  function prevMonth() {
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  }
  function nextMonth() {
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
  }

  const firstDay = view.getDay();
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0,
  ).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="absolute top-full right-0 mt-2 z-[70] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-4 w-[300px]">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg active:bg-neutral-700"
        >
          <IoIosArrowBack size={18} />
        </button>
        <span className="text-neutral-300 font-semibold text-sm">
          {months[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          onClick={nextMonth}
          className="p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg rotate-180 active:bg-neutral-700"
        >
          <IoIosArrowBack size={18} />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-neutral-600 text-xs py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const iso = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = iso === toLocalISO(value);
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              onClick={() => {
                onChange(new Date(view.getFullYear(), view.getMonth(), day));
                onClose();
              }}
              className={`text-sm rounded-lg py-2 transition-colors ${
                isSelected
                  ? "bg-neutral-600 text-white font-bold"
                  : isToday
                    ? "text-neutral-200 font-semibold ring-1 ring-neutral-600"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

function SlotsPage() {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Slot | null>(null);
  const [addTaskSlot, setAddTaskSlot] = useState<Slot | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Collapsible tasks per slot
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Inline editing task
  const [editingTask, setEditingTask] = useState<{
    slotId: string;
    taskId: string;
    title: string;
    description: string;
  } | null>(null);

  // Delete confirmations
  const [deleteSlotConfirm, setDeleteSlotConfirm] = useState<Slot | null>(null);
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState<{
    slot: Slot;
    task: SlotTask;
  } | null>(null);

  // Toggle TEXTBOOK confirm
  const [toggleTopicConfirm, setToggleTopicConfirm] = useState<{
    slot: Slot;
    task: SlotTask;
  } | null>(null);

  // ── Close calendar on outside click ──────────────────────────────────────

  useEffect(() => {
    if (!calendarOpen) return;
    function handler(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  // ── Fetch slots ───────────────────────────────────────────────────────────

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const res = await getSlots({ date: toLocalISO(currDate) });
      setSlots(res.data.data ?? []);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to load slots.");
    } finally {
      setLoadingSlots(false);
    }
  }, [currDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // ── Helpers to update slot in local state ─────────────────────────────────

  function applySlotUpdate(updated: Slot) {
    setSlots((prev) => prev.map((s) => (s._id === updated._id ? updated : s)));
  }

  // ── Date navigation ───────────────────────────────────────────────────────

  function navigate(delta: number) {
    const d = new Date(currDate);
    d.setDate(d.getDate() + delta);
    setCurrDate(d);
  }

  // ── Toggle tasks expand ───────────────────────────────────────────────────

  function toggleTasksExpand(slotId: string) {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      next.has(slotId) ? next.delete(slotId) : next.add(slotId);
      return next;
    });
  }

  // ── Delete Slot ───────────────────────────────────────────────────────────

  function confirmDeleteSlot() {
    if (!deleteSlotConfirm) return;
    const slotId = deleteSlotConfirm._id;
    setDeleteSlotConfirm(null);
    deleteSlot(slotId)
      .then(() => {
        toast.success("Slot deleted.");
        setSlots((prev) => prev.filter((s) => s._id !== slotId));
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to delete slot."),
      );
  }

  // ── Toggle Task ───────────────────────────────────────────────────────────

  function handleToggleTask(slot: Slot, task: SlotTask) {
    // If textbook task and currently incomplete → ask about topic too
    if (task.type === "TEXTBOOK" && !task.isCompleted) {
      setToggleTopicConfirm({ slot, task });
      return;
    }
    doToggleTask(slot, task, false);
  }

  function doToggleTask(slot: Slot, task: SlotTask, alsoToggleTopic: boolean) {
    toggleTask(slot._id, task._id)
      .then((r) => {
        applySlotUpdate(r.data.data);
        if (alsoToggleTopic && task.topicId) {
          toggleTopic(task.topicId).catch(() =>
            toast.error("Failed to toggle topic completion."),
          );
        }
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to toggle task."),
      );
  }

  // ── Delete Task ───────────────────────────────────────────────────────────

  function confirmDeleteTask() {
    if (!deleteTaskConfirm) return;
    const { slot, task } = deleteTaskConfirm;
    setDeleteTaskConfirm(null);
    deleteTask(slot._id, task._id)
      .then((r) => {
        toast.success("Task deleted.");
        applySlotUpdate(r.data.data);
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to delete task."),
      );
  }

  // ── Edit Task (inline save) ───────────────────────────────────────────────

  function saveEditTask() {
    if (!editingTask) return;
    const { slotId, taskId, title, description } = editingTask;
    editTask(slotId, taskId, { titleSnapshot: title, description })
      .then((r) => {
        toast.success("Task updated.");
        applySlotUpdate(r.data.data);
        setEditingTask(null);
      })
      .catch((e: any) =>
        toast.error(e?.response?.data?.message || "Failed to update task."),
      );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const isToday = toLocalISO(currDate) === toLocalISO(new Date());

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-screen bg-neutral-950 flex flex-col py-8 px-10">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-white font-extrabold text-4xl">My Slots</h1>

          <div className="flex gap-3 items-center flex-wrap">
            {/* Date navigator */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5">
              <button
                onClick={() => navigate(-1)}
                className="text-neutral-400 hover:text-white p-3 rounded-xl hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
                title="Previous day"
              >
                <IoIosArrowBack size={20} />
              </button>
              <span className="text-neutral-300 text-base font-medium min-w-52 text-center select-none">
                {`${currDate.getDate()} ${months[currDate.getMonth()]} ${currDate.getFullYear()}, ${daysFull[currDate.getDay()]}`}
              </span>
              <button
                onClick={() => navigate(1)}
                className="text-neutral-400 hover:text-white p-3 rounded-xl hover:bg-neutral-800 active:bg-neutral-700 transition-colors rotate-180"
                title="Next day"
              >
                <IoIosArrowBack size={20} />
              </button>
            </div>

            {/* Today shortcut */}
            {!isToday && (
              <button
                onClick={() => setCurrDate(new Date())}
                className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 active:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-xl px-5 py-3 text-sm font-medium transition-colors"
              >
                Today
              </button>
            )}

            {/* Calendar picker */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setCalendarOpen((v) => !v)}
                className={`bg-neutral-900 border rounded-xl p-3 transition-colors ${
                  calendarOpen
                    ? "border-neutral-600 text-neutral-200 bg-neutral-800"
                    : "border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
                title="Pick a date"
              >
                <FaCalendarAlt size={20} />
              </button>
              {calendarOpen && (
                <MiniCalendar
                  value={currDate}
                  onChange={(d) => {
                    setCurrDate(d);
                  }}
                  onClose={() => setCalendarOpen(false)}
                />
              )}
            </div>

            {/* Create slot */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 rounded-xl px-5 py-3 font-medium transition-colors"
            >
              <IoAdd size={20} />
              Create Slot
            </button>
          </div>
        </div>

        {/* ── Slot list ── */}
        {loadingSlots ? (
          <p className="text-neutral-600 text-center mt-16 text-lg">
            Loading...
          </p>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center mt-20 gap-4 text-neutral-700">
            <FaCalendarAlt size={48} />
            <p className="text-xl font-medium">No slots for this day.</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-xl px-5 py-2.5 font-medium transition-colors h-14 "
            >
              + Create one
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pb-16">
            {slots.map((slot) => {
              const progress =
                slot.totalTasks > 0
                  ? Math.round((slot.completedTasks / slot.totalTasks) * 100)
                  : null;
              const tasksExpanded = expandedTasks.has(slot._id);
              const incomplete =
                slot.tasks?.filter((t) => !t.isCompleted) ?? [];
              const complete = slot.tasks?.filter((t) => t.isCompleted) ?? [];

              return (
                <div
                  key={slot._id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden"
                >
                  {/* ── Slot header (clicking anywhere expands tasks) ── */}
                  <div
                    className="px-5 pt-5 pb-4 flex items-start gap-5 cursor-pointer select-none"
                    onClick={() => toggleTasksExpand(slot._id)}
                  >
                    {/* Time column */}
                    <div className="flex flex-col items-center min-w-[86px] pt-0.5">
                      <span className="text-neutral-300 font-semibold text-base">
                        {formatTime(slot.startTime)}
                      </span>
                      <div className="w-px h-4 bg-neutral-700 my-1" />
                      <span className="text-neutral-500 text-sm">
                        {formatTime(slot.endTime)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="w-px self-stretch bg-neutral-800" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-neutral-200 font-semibold text-xl leading-tight">
                        {slot.title}
                      </h3>
                      {slot.description && (
                        <p className="text-neutral-500 text-base mt-1 leading-relaxed">
                          {slot.description}
                        </p>
                      )}

                      {/* Progress bar + task count */}
                      <div className="flex items-center gap-3 mt-3">
                        {slot.totalTasks > 0 && (
                          <>
                            <div className="w-32 h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-neutral-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-neutral-500 text-sm">
                              {slot.completedTasks}/{slot.totalTasks} tasks
                            </span>
                          </>
                        )}
                        <span className="ml-auto flex items-center gap-1 text-neutral-600 text-sm">
                          {tasksExpanded ? (
                            <IoChevronDown size={16} />
                          ) : (
                            <IoChevronForward size={16} />
                          )}
                          {slot.totalTasks === 0
                            ? "No tasks"
                            : `${slot.totalTasks} task${slot.totalTasks !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                    </div>

                    {/* Slot actions — always visible, stop propagation so card click doesn't fire */}
                    <div
                      className="flex gap-1 flex-shrink-0 pt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Add Task"
                        onClick={() => {
                          setAddTaskSlot(slot);
                          setExpandedTasks((p) => new Set([...p, slot._id]));
                        }}
                        className="p-3 text-neutral-500 hover:text-white hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
                      >
                        <IoAdd size={20} />
                      </button>
                      <button
                        title="Edit Slot"
                        onClick={() => setEditTarget(slot)}
                        className="p-3 text-neutral-500 hover:text-white hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
                      >
                        <IoPencil size={18} />
                      </button>
                      <button
                        title="Delete Slot"
                        onClick={() => setDeleteSlotConfirm(slot)}
                        className="p-3 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
                      >
                        <IoTrash size={18} />
                      </button>
                    </div>
                  </div>

                  {/* ── Task list (collapsible) ── */}
                  {tasksExpanded && (
                    <div className="border-t border-neutral-800 px-5 py-4 bg-neutral-950/40">
                      {slot.tasks.length === 0 && (
                        <p className="text-neutral-600 text-base text-center py-3">
                          No tasks yet.{" "}
                          <button
                            onClick={() => setAddTaskSlot(slot)}
                            className="underline hover:text-neutral-400"
                          >
                            Add one
                          </button>
                        </p>
                      )}

                      {/* Incomplete tasks */}
                      {incomplete.map((task) => (
                        <TaskRow
                          key={task._id}
                          task={task}
                          slot={slot}
                          editingTask={editingTask}
                          setEditingTask={setEditingTask}
                          saveEditTask={saveEditTask}
                          onToggle={() => handleToggleTask(slot, task)}
                          onDelete={() => setDeleteTaskConfirm({ slot, task })}
                        />
                      ))}

                      {/* Separator */}
                      {incomplete.length > 0 && complete.length > 0 && (
                        <div className="flex items-center gap-2 my-3">
                          <div className="flex-1 h-px bg-neutral-800" />
                          <span className="text-neutral-600 text-sm">
                            Completed
                          </span>
                          <div className="flex-1 h-px bg-neutral-800" />
                        </div>
                      )}

                      {/* Completed tasks */}
                      {complete.map((task) => (
                        <TaskRow
                          key={task._id}
                          task={task}
                          slot={slot}
                          editingTask={editingTask}
                          setEditingTask={setEditingTask}
                          saveEditTask={saveEditTask}
                          onToggle={() => handleToggleTask(slot, task)}
                          onDelete={() => setDeleteTaskConfirm({ slot, task })}
                        />
                      ))}

                      {/* Add task button at bottom */}
                      <button
                        onClick={() => setAddTaskSlot(slot)}
                        className="mt-3 w-full flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-300 text-base py-3 rounded-xl hover:bg-neutral-800/60 active:bg-neutral-800 transition-colors"
                      >
                        <IoAdd size={18} /> Add Task
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <CreateSlotModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchSlots}
        defaultDate={toLocalISO(currDate)}
      />

      <EditSlotModal
        isOpen={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSuccess={() => {
          fetchSlots();
          setEditTarget(null);
        }}
        slot={editTarget}
      />

      {addTaskSlot && (
        <AddTaskModal
          isOpen={true}
          onClose={() => setAddTaskSlot(null)}
          onSuccess={(updatedSlot) => {
            applySlotUpdate(updatedSlot);
            setAddTaskSlot(null);
          }}
          slotId={addTaskSlot._id}
        />
      )}

      {/* Delete slot confirm */}
      <ConfirmationModal
        isOpen={deleteSlotConfirm !== null}
        onClose={() => setDeleteSlotConfirm(null)}
        onConfirm={confirmDeleteSlot}
        title="Delete Slot"
        message={`Are you sure you want to delete "${deleteSlotConfirm?.title}"? All tasks within it will also be deleted.`}
        confirmText="Delete"
        isDangerous
      />

      {/* Delete task confirm */}
      <ConfirmationModal
        isOpen={deleteTaskConfirm !== null}
        onClose={() => setDeleteTaskConfirm(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Delete task "${deleteTaskConfirm?.task.titleSnapshot}"?`}
        confirmText="Delete"
        isDangerous
      />

      {/* Toggle topic confirmation (for TEXTBOOK tasks being completed) */}
      <ConfirmationModal
        isOpen={toggleTopicConfirm !== null}
        onClose={() => {
          if (toggleTopicConfirm)
            // doToggleTask(
            //   toggleTopicConfirm.slot,
            //   toggleTopicConfirm.task,
            //   false,
            // );
            setToggleTopicConfirm(null);
        }}
        onConfirm={() => {
          if (toggleTopicConfirm)
            doToggleTask(
              toggleTopicConfirm.slot,
              toggleTopicConfirm.task,
              true,
            );
          setToggleTopicConfirm(null);
        }}
        title="Mark Topic Complete?"
        message={`Also mark the linked topic "${toggleTopicConfirm?.task.titleSnapshot}" as completed in the textbook?`}
        confirmText="Yes, mark both"
        cancelText="Just this task"
      />
    </>
  );
}

// ── TaskRow sub-component ─────────────────────────────────────────────────────

type TaskRowProps = {
  task: SlotTask;
  slot: Slot;
  editingTask: {
    slotId: string;
    taskId: string;
    title: string;
    description: string;
  } | null;
  setEditingTask: (v: any) => void;
  saveEditTask: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

function TaskRow({
  task,
  slot,
  editingTask,
  setEditingTask,
  saveEditTask,
  onToggle,
  onDelete,
}: TaskRowProps) {
  const isEditing =
    editingTask?.slotId === slot._id && editingTask?.taskId === task._id;

  const inputBase =
    "bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-neutral-300 text-sm focus:outline-none focus:border-neutral-500 w-full";

  return (
    <div className="flex items-center gap-4 py-2.5 group/task">
      {/* Checkbox — large touch target */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
          task.isCompleted
            ? "bg-neutral-500 border-neutral-500"
            : "border-neutral-600 hover:border-neutral-400 active:border-neutral-300"
        }`}
      >
        {task.isCompleted && <IoCheckmark size={14} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              autoFocus
              className={inputBase}
              value={editingTask!.title}
              onChange={(e) =>
                setEditingTask((p: any) => ({ ...p, title: e.target.value }))
              }
            />
            <input
              className={inputBase}
              placeholder="Description (optional)"
              value={editingTask!.description}
              onChange={(e) =>
                setEditingTask((p: any) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
            />
            <div className="flex gap-2">
              <button
                onClick={saveEditTask}
                className="text-sm bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-300 px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="text-sm text-neutral-600 hover:text-neutral-400 px-2 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span
              className={`text-base ${
                task.isCompleted
                  ? "line-through text-neutral-600"
                  : "text-neutral-300"
              }`}
            >
              {task.titleSnapshot}
              {task.type === "TEXTBOOK" && (
                <span className="ml-2 text-xs text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
                  textbook
                </span>
              )}
            </span>
            {task.description && (
              <p className="text-sm text-neutral-600 mt-0.5">
                {task.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Task actions — always visible on touch */}
      {!isEditing && (
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() =>
              setEditingTask({
                slotId: slot._id,
                taskId: task._id,
                title: task.titleSnapshot,
                description: task.description,
              })
            }
            className="p-2.5 text-neutral-600 hover:text-white hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
          >
            <IoPencil size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-colors"
          >
            <IoTrash size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default SlotsPage;
