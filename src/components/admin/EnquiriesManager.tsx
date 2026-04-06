"use client";

import { useState, useEffect, useCallback } from "react";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
  painting?: { title: string } | null;
}

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/enquiries");
    if (res.ok) setEnquiries(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleRead(id: number, read: boolean) {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    load();
  }

  return (
    <div>
      <h2 className="font-heading text-2xl mb-6">Enquiries</h2>

      {enquiries.length === 0 && (
        <p className="text-ink/50 text-sm">No enquiries yet.</p>
      )}

      <div className="space-y-4">
        {enquiries.map((e) => (
          <div
            key={e.id}
            className={`p-5 border transition-colors ${
              e.read ? "border-ink/10 bg-transparent" : "border-accent/30 bg-accent/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium">{e.name}</span>
                  {!e.read && (
                    <span className="text-xs bg-accent text-cream px-2 py-0.5">New</span>
                  )}
                </div>
                <p className="text-sm text-ink/50">
                  {e.email} {e.phone && `\u00B7 ${e.phone}`}
                </p>
                {e.painting && (
                  <p className="text-sm text-accent mt-1">
                    Re: {e.painting.title}
                  </p>
                )}
                <p className="text-sm text-ink/70 mt-3 leading-relaxed">{e.message}</p>
                <p className="text-xs text-ink/30 mt-3">
                  {new Date(e.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => toggleRead(e.id, e.read)}
                className="text-xs text-ink/40 hover:text-accent transition-colors shrink-0"
              >
                {e.read ? "Mark unread" : "Mark read"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
