"use client";

import { useState } from "react";
import PaintingsManager from "./PaintingsManager";
import EnquiriesManager from "./EnquiriesManager";
import PasswordChange from "./PasswordChange";
import { useRouter } from "next/navigation";

type Tab = "paintings" | "enquiries" | "password";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("paintings");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "paintings", label: "Paintings" },
    { key: "enquiries", label: "Enquiries" },
    { key: "password", label: "Password" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading text-3xl font-light">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-ink/50 hover:text-accent transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="flex gap-4 border-b border-ink/10 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 px-2 text-sm tracking-wide transition-colors ${
              tab === t.key
                ? "border-b-2 border-accent text-accent"
                : "text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "paintings" && <PaintingsManager />}
      {tab === "enquiries" && <EnquiriesManager />}
      {tab === "password" && <PasswordChange />}
    </div>
  );
}
