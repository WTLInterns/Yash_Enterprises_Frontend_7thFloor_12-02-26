'use client'; // Add this at the very top

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useRouter } from 'next/navigation';

// Navigation items
const navigationItems = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: "dashboard" },
    { key: "customers", label: "Customers", href: "/customers", icon: "org" },
  { key: "attendance", label: "Attendance", href: "/attendance", icon: "attendance" },
  { key: "leaves", label: "Leaves", href: "/leaves", icon: "leaves" },
  { key: "organization", label: "Organization", href: "/organization", icon: "org" },
  { key: "tasks", label: "Tasks", href: "/tasks", icon: "tasks" },
  { key: "form", label: "Form", href: "/form", icon: "form" },
  { key: "order", label: "Order", href: "/order", icon: "order" },
  { key: "expenses", label: "Expenses", href: "/expenses", icon: "expenses" },
  { key: "client", label: "Client", href: "/client", icon: "client" },
  { key: "reports", label: "Reports", href: "/reports", icon: "reports" },
  { key: "support", label: "Support", href: "/support", icon: "support" },
  { key: "setting", label: "Setting", href: "/settings", icon: "settings" },
];

export default function DashboardLayout({ header, children }) {
    const pathname = usePathname();
  const router = useRouter();
   // Sidebar active item
  const getActiveKey = () => {
    const item = navigationItems.find(item =>
      item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href)
    );
    return item?.key || "dashboard";
  };

   // Auto-detect active tab
  const getActiveTabKey = () => {
    if (!header?.tabs) return null;

    const activeTab = header.tabs.find(tab =>
      pathname === tab.href || pathname.startsWith(tab.href)
    );

    return activeTab?.key || header?.activeTabKey;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar 
          items={navigationItems} 
          activeKey={getActiveKey()} 
          brand="YAS" 
        />
        

          <div className="flex min-w-0 flex-1 flex-col">
          {/* TOPBAR */}
          <Topbar
            project={header?.project}
            user={header?.user}
            notifications={header?.notifications}
            tabs={header?.tabs || []}
            activeTabKey={getActiveTabKey()}
            onTabClick={(tab) => {
              if (tab?.href) {
                router.push(tab.href);
              }
            }}
          />
          <main className="mx-auto w-full max-w-[1600px] px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}