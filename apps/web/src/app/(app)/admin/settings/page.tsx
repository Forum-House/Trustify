export const metadata = {
  title: "Settings | Trustify",
  description: "Manage admin settings",
};

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage Trustify registry settings and configurations.</p>
        </div>

        {/* Settings content */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-100">Admin Settings</h2>
            <p className="text-slate-400">Settings panel coming soon.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
