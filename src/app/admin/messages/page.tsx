import { getMessages } from "@/lib/firestore/messages";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      {messages.length === 0 ? (
        <p className="text-text-muted">No messages found.</p>
      ) : (
        <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Sender</th>
                <th className="p-4 font-medium">Subject</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-surface/50 ${msg.status === 'unread' ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${msg.status === 'unread' ? 'bg-accent/20 text-accent' : msg.status === 'read' ? 'bg-surface border border-border' : 'bg-surface text-text-muted'}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 truncate max-w-[150px]">
                    <div>{msg.name}</div>
                    <div className="text-xs text-text-muted">{msg.email}</div>
                  </td>
                  <td className="p-4 truncate max-w-[200px]">{msg.subject || "(No Subject)"}</td>
                  <td className="p-4">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/messages/${msg.id}`} className="text-accent hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
