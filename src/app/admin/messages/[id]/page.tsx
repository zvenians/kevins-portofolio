import { getMessage } from "@/lib/firestore/messages";
import { MessageDetail } from "@/components/admin/MessageDetail";
import { notFound } from "next/navigation";
import { updateMessageStatus } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function MessagePage({ params }: { params: { id: string } }) {
  const message = await getMessage(params.id);

  if (!message) {
    notFound();
  }

  // Auto-mark as read if it's currently unread
  if (message.status === "unread") {
    await updateMessageStatus(message.id, "read");
    message.status = "read";
  }

  return <MessageDetail message={message} />;
}
