import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export interface CreateSlotPayload {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  description?: string;
}

export interface AddTaskPayload {
  type: "CUSTOM" | "TEXTBOOK";
  topicId?: string;
  titleSnapshot: string;
  description?: string;
}

// ── Slots ──────────────────────────────────────────────────────────────────

export async function getSlots(params?: { date?: string }) {
  return axiosInstance.get(ROUTES.DASHBOARD.GET_SLOTS, { params });
}

export async function createSlot(data: CreateSlotPayload) {
  return axiosInstance.post(ROUTES.DASHBOARD.CREATE_SLOT, data);
}

export async function editSlot(
  slotId: string,
  data: Partial<CreateSlotPayload>,
) {
  return axiosInstance.patch(ROUTES.DASHBOARD.EDIT_SLOT(slotId), data);
}

export async function deleteSlot(slotId: string) {
  return axiosInstance.delete(ROUTES.DASHBOARD.DELETE_SLOT(slotId));
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export async function addTask(slotId: string, data: AddTaskPayload) {
  return axiosInstance.post(ROUTES.TASKS.ADD_TASK(slotId), data);
}

export async function editTask(
  slotId: string,
  taskId: string,
  data: { titleSnapshot?: string; description?: string },
) {
  return axiosInstance.patch(ROUTES.TASKS.EDIT_TASK(slotId, taskId), data);
}

export async function deleteTask(slotId: string, taskId: string) {
  return axiosInstance.delete(ROUTES.TASKS.DELETE_TASK(slotId, taskId));
}

export async function toggleTask(slotId: string, taskId: string) {
  return axiosInstance.patch(ROUTES.TASKS.TOGGLE_TASK(slotId, taskId));
}
