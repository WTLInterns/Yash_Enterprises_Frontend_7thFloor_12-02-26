import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import RealtimeStatusCard from "@/components/dashboard/RealtimeStatusCard";
import StaffingStrengthCard from "@/components/dashboard/StaffingStrengthCard";
import TeamwiseAttendance from "@/components/dashboard/TeamwiseAttendance";
import EmployeesTable from "@/components/dashboard/EmployeesTable";
import OffDutyEmployees from "@/components/dashboard/OffDutyEmployees";
import StatCard from "@/components/dashboard/StatCard";
import { getDashboardOverview } from "@/services/dashboard.service";

function DownloadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        className="stroke-current"
        strokeWidth="1.5"
      />
      <path
        d="M4 20c.8-3.3 4-5.5 8-5.5s7.2 2.2 8 5.5"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10.2a3.2 3.2 0 1 1 4.2-3.1"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function PauseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 7v10M16 7v10" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
        className="stroke-current"
        strokeWidth="1.5"
        opacity="0.25"
      />
    </svg>
  );
}

export default async function Home() {
  const data = await getDashboardOverview();

  return (
    <DashboardLayout
      navigation={data.navigation}
      header={{
        project: data.project,
        user: data.user,
        notifications: data.notifications,
        tabs: data.headerTabs?.items || [],
        activeTabKey: data.headerTabs?.activeTabKey,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900">Realtime Dashboard</div>
          <div className="mt-1 text-sm text-slate-500">Overview of punch activity and staffing</div>
        </div>

        <Button className="rounded-xl">
          <DownloadIcon className="h-5 w-5" />
          Attendance Status
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <RealtimeStatusCard data={data.realtimeStatus} />
        </div>

        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 gap-5">
            <StatCard
              title="Punched In (Inactive)"
              value={data.realtimeStatus?.punchedInInactive ?? 0}
              subtitle="Employees who are punched in but marked inactive"
              accent="amber"
              icon={<PauseIcon className="h-6 w-6" />}
            />

            <StaffingStrengthCard staffingStrength={data.staffingStrength} />
          </div>
        </div>

        <div className="xl:col-span-5">
          <TeamwiseAttendance items={data.teamwiseAttendance} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <EmployeesTable employees={data.employees} />
        </div>
        <div className="xl:col-span-4">
          <OffDutyEmployees employees={data.offDutyEmployees} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          title="Total Employees"
          value={data.realtimeStatus?.totalEmployees ?? 0}
          subtitle="Total mapped employees"
          accent="sky"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Punched In"
          value={data.realtimeStatus?.punchedIn ?? 0}
          subtitle="Currently inside"
          accent="emerald"
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Punched Out"
          value={data.realtimeStatus?.punchedOut ?? 0}
          subtitle="Currently outside"
          accent="rose"
          icon={<UsersIcon className="h-6 w-6" />}
        />
      </div>
    </DashboardLayout>
  );
}
