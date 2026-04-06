"use client";

import { useState } from "react";

export default function PasswordChange() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPass !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setStatus("saving");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: newPass }),
    });

    if (res.ok) {
      setStatus("done");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to change password");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-ink/20 bg-transparent focus:border-accent focus:outline-none text-sm";

  return (
    <div className="max-w-md">
      <h2 className="font-heading text-2xl mb-6">Change Password</h2>

      {status === "done" && (
        <p className="text-green-600 text-sm mb-4">Password updated successfully.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-ink/40 mb-1">Current Password</label>
          <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-ink/40 mb-1">New Password</label>
          <input type="password" required value={newPass} onChange={(e) => setNewPass(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs uppercase text-ink/40 mb-1">Confirm New Password</label>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={status === "saving"}
          className="px-6 py-2 bg-ink text-cream text-sm tracking-wide hover:bg-ink/80 transition-colors disabled:opacity-50"
        >
          {status === "saving" ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
