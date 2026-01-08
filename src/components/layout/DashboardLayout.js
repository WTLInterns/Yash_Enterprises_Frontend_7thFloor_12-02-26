'use client'; // Add this at the very top

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

// Grouped navigation for sidebar
const sidebarSections = [
  {
    key: "zoho",
    label: "Zoho",
    items: [
      { key: "zoho-dashboard", label: "Dashboard", href: "/", icon: "dashboard", accent: "indigo" },
      { key: "zoho-customers", label: "Customers", href: "/customers", icon: "client", accent: "emerald" },
      { key: "zoho-bank", label: "Bank", href: "/bank", icon: "bank", accent: "amber" },
      { key: "zoho-products", label: "Products", href: "/products", icon: "products", accent: "violet" },
    ],
  },
  {
    key: "unolo",
    label: "Unolo",
    items: [
      { key: "unolo-dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard", accent: "indigo" },
      { key: "unolo-attendance", label: "Attendance", href: "/attendance", icon: "attendance", accent: "cyan" },
      { key: "unolo-leave", label: "Leave", href: "/leaves", icon: "leaves", accent: "rose" },
      { key: "unolo-organization", label: "Organization", href: "/organization", icon: "org", accent: "slate" },
      { key: "unolo-form", label: "Form", href: "/form", icon: "form", accent: "teal" },
      { key: "unolo-order", label: "Order", href: "/order", icon: "order", accent: "orange" },
      { key: "unolo-client", label: "Client", href: "/clients", icon: "client", accent: "blue-gray" },
      { key: "unolo-sites", label: "Sites", href: "/sites", icon: "sites", accent: "lime" },
    ],
  },
];

// Flattened list for active key detection (kept for backward compatibility)
const navigationItems = sidebarSections.flatMap((section) => section.items);

export default function DashboardLayout({ header, children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Simple auth guard: redirect to /login if not logged in
  useEffect(() => {

    // Do not guard the login page itself
    if (pathname === '/login') return;

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.replace('/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('auth_token');
      } catch (e) {
        // ignore
      }
    }
    toast.success('Logged out successfully');
    router.push('/login');
  };

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

    const activeTab = header.tabs.find(tab => {
      if (tab.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(tab.href);
    });

    return activeTab?.key || header?.activeTabKey;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar
          sections={sidebarSections}
          activeKey={getActiveKey()}
          brand="Yash"
          onLogout={handleLogout}
        />

        <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
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
          <main className="mx-auto w-full max-w-[1600px] px-6 py-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}