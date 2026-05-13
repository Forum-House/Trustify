import { ActivityFeed } from "../../../../components/admin/activity-feed";

export default function AdminActivityPage() {
  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">System Activity Log</h1>
        <p className="text-slate-400">Monitor all document registrations, revocations, and updates across the registry.</p>
      </div>
      <ActivityFeed />
    </main>
  );
}
