"use client";

import { type Message } from "@/types/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMessageStatus, deleteMessage } from "@/app/admin/actions";
import Link from "next/link";

export function MessageDetail({ message }: { message: Message }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatus = async (status: "unread" | "read" | "archived") => {
    setLoading(true);
    try {
      await updateMessageStatus(message.id, status);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setLoading(true);
    try {
      await deleteMessage(message.id);
      router.push("/admin/messages");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-4 mb-4">
        <Link href="/admin/messages" className="text-sm text-text-muted hover:text-text-primary">
          &larr; Back to Inbox
        </Link>
      </div>

      <div className="bg-surface-elevated border border-border rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-start border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{message.subject || "(No Subject)"}</h1>
            <div className="text-sm text-text-secondary">
              From: <span className="font-medium text-text-primary">{message.name}</span> &lt;<a href={`mailto:${message.email}`} className="text-accent hover:underline">{message.email}</a>&gt;
            </div>
            <div className="text-xs text-text-muted mt-1">
              {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${message.status === 'unread' ? 'bg-accent/20 text-accent' : message.status === 'read' ? 'bg-surface border border-border' : 'bg-surface text-text-muted'}`}>
            {message.status}
          </span>
        </div>

        <div className="whitespace-pre-wrap text-text-primary leading-relaxed min-h-[200px]">
          {message.message}
        </div>
      </div>

      <div className="flex gap-4 justify-between bg-surface-elevated p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          {message.status !== "read" && (
            <button 
              onClick={() => handleStatus("read")} 
              disabled={loading}
              className="px-4 py-2 bg-text-primary text-background text-sm font-medium rounded hover:bg-text-secondary disabled:opacity-50"
            >
              Mark Read
            </button>
          )}
          {message.status !== "unread" && (
            <button 
              onClick={() => handleStatus("unread")} 
              disabled={loading}
              className="px-4 py-2 bg-surface border border-border text-sm font-medium rounded hover:bg-surface-elevated disabled:opacity-50"
            >
              Mark Unread
            </button>
          )}
          {message.status !== "archived" && (
            <button 
              onClick={() => handleStatus("archived")} 
              disabled={loading}
              className="px-4 py-2 bg-surface border border-border text-sm font-medium rounded hover:bg-surface-elevated disabled:opacity-50"
            >
              Archive
            </button>
          )}
        </div>
        <button 
          onClick={handleDelete} 
          disabled={loading}
          className="px-4 py-2 border border-danger text-danger text-sm font-medium rounded hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
