import { AdminKpiRow } from "../../../components/admin/admin-kpi-row";
import { IssuersTable } from "../../../components/admin/issuers-table";
import { ApproveIssuerForm } from "../../../components/admin/approve-issuer-form";
import { ActivityFeed } from "../../../components/admin/activity-feed";

export const metadata = {
  title: "Admin Dashboard | Trustify",
  description: "Manage issuers and monitor registry activity",
};

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage approved issuers, monitor activity, and govern the Trustify registry.</p>
          </div>

          {/* KPI Row */}
          <AdminKpiRow />

          {/* Main content grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Approve new issuers */}
            <div className="space-y-8 lg:col-span-1">
              {/* Approve Issuer Form */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
                <h2 className="mb-6 text-xl font-bold text-white">Approve New Issuer</h2>
                <ApproveIssuerForm />
              </div>
            </div>

            {/* Right column - Issuers list and activity */}
            <div className="space-y-8 lg:col-span-2">
              {/* Issuers Table */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
                <h2 className="mb-6 text-xl font-bold text-white">Approved Issuers</h2>
                <IssuersTable />
              </div>

              {/* Activity Feed */}
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
                <h2 className="mb-6 text-xl font-bold text-white">Recent Activity</h2>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
