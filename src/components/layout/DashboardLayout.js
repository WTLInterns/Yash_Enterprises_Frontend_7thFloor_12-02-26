import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ navigation, header, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar items={navigation?.items || []} activeKey={navigation?.activeKey} brand={navigation?.brand} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            project={header?.project}
            user={header?.user}
            notifications={header?.notifications}
            tabs={header?.tabs || []}
            activeTabKey={header?.activeTabKey}
          />

          <main className="mx-auto w-full max-w-[1600px] px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
