import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface OtpModalProps {
  isOpen: boolean;
  email?: string;
  onClose: () => void;
  onSubmit?: (otp: string) => void;
  isLoading?: boolean;
}

function OtpModal({
  isOpen,
  email,
  onClose,
  onSubmit,
  isLoading = false,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");

    if (!otp.trim()) {
      setError("Enter OTP");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    onSubmit?.(otp.trim());
  }

  if (!isOpen) return null;

  return (
    <div className="w-screen h-screen fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 p-6 rounded-lg relative min-w-100">
        {/* Close Button */}
        <div
          className="absolute right-4 top-4 text-2xl text-neutral-300 hover:bg-neutral-700/75 p-1 rounded-md cursor-pointer"
          onClick={onClose}
        >
          <IoClose />
        </div>

        {/* Heading */}
        <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
          Verify OTP
        </h1>

        {/* Subtitle */}
        {email && (
          <p className="text-neutral-400 text-center text-base max-w-100">
            A 6-digit verification code has been sent to{" "}
            <span className="font-medium text-neutral-300">{email}</span>. Enter
            it below to verify your account. The code will expire shortly.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {/* OTP Input */}
          <div className="flex flex-col gap-1">
            {/* <h2 className="font-medium text-neutral-300">OTP</h2> */}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
              className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 text-center tracking-widest text-lg ${
                error ? "ring ring-red-400" : ""
              }`}
            />
            {error && <div className="text-red-400 pl-1">{error}</div>}
          </div>

          {/* Verify Button */}
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 h-14 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpModal;
