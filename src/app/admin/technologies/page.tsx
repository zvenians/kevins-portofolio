import { getTechnologies } from "@/lib/firestore/home";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TechnologiesPage() {
  const items = await getTechnologies();

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Technologies</h1>
        <Link 
          href="/admin/technologies/new"
          className="px-4 py-2 bg-text-primary text-background font-medium rounded hover:bg-text-secondary"
        >
          New Technology
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-text-muted">No technologies found.</p>
      ) : (
        <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium w-32">Order</th>
                <th className="p-4 font-medium w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface/50">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">{item.order}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/technologies/${item.id}`} className="text-accent hover:underline">
                      Edit
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