import { cn } from "@/utils/helpers";

function NavIcon({ name, className }) {
  const common = cn("h-5 w-5", className);

  if (name === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M3 13.5c0-4.714 0-7.071 1.464-8.535C5.929 3.5 8.286 3.5 13 3.5h-2c4.714 0 7.071 0 8.536 1.465C21 6.429 21 8.786 21 13.5v-3c0 4.714 0 7.071-1.464 8.536C18.071 20.5 15.714 20.5 11 20.5h2c-4.714 0-7.071 0-8.536-1.464C3 17.571 3 15.214 3 10.5v3Z"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <path
          d="M8 12h3v8H8v-8Zm5-5h3v13h-3V7Z"
          className="fill-current"
          opacity="0.25"
        />
      </svg>
    );
  }

  if (name === "attendance") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M7 3.5V6m10-2.5V6M4.5 9.5h15"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.5 6h11c1.4 0 2.1 0 2.6.27.45.23.82.6 1.05 1.05.27.5.27 1.2.27 2.6v7c0 1.4 0 2.1-.27 2.6-.23.45-.6.82-1.05 1.05-.5.27-1.2.27-2.6.27h-11c-1.4 0-2.1 0-2.6-.27-.45-.23-.82-.6-1.05-1.05-.27-.5-.27-1.2-.27-2.6v-7c0-1.4 0-2.1.27-2.6.23-.45.6-.82 1.05-1.05C4.4 6 5.1 6 6.5 6Z"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <path
          d="M8 13h4m-4 4h8"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "leaves") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M20 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9Z"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <path
          d="M8.5 14.5c2.5 1.5 4.5 1.5 7 0"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9 10h.01M15 10h.01"
          className="stroke-current"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "org") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <path
          d="M4 20c.8-3.3 4-5.5 8-5.5s7.2 2.2 8 5.5"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Add new icons for the additional menu items
  if (name === "tasks") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 4h4m-4 4h4m-4 4h4"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "form") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "order") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h3m-3 4h3m-6 3h.01M9 16h.01"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "expenses") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M12 2v20m9-9H3m15 0l-7 7m7-7l-7-7"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "client") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 0v6m-3-3h6"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "reports") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M9 17v-6m3 6v-3m3 3v-1.5M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2.5"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "support") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 0v-4.5m0 0c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          className="stroke-current"
          strokeWidth="1.5"
        />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
        <path
          d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 9l3 3-3 3m-3-3h9"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
      <path
        d="M5 12h14"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 5v14"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Sidebar({ items = [], activeKey = "dashboard", brand = "YAS", onLogout }) {
  // Default menu items
  const defaultItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard"
    },
    {
      key: "attendance",
      label: "Attendance",
      href: "/attendance",
      icon: "attendance"
    },
    {
      key: "leaves",
      label: "Leaves",
      href: "/leaves",
      icon: "leaves"
    },
    {
      key: "org",
      label: "Organization",
      href: "/organization",
      icon: "org"
    },
    {
      key: "tasks",
      label: "Tasks",
      href: "/tasks",
      icon: "tasks"
    },
    {
      key: "form",
      label: "Form",
      href: "/form",
      icon: "form"
    },
    {
      key: "order",
      label: "Order",
      href: "/order",
      icon: "order"
    },
    {
      key: "expenses",
      label: "Expenses",
      href: "/expenses",
      icon: "expenses"
    },
    {
      key: "client",
      label: "Client & Sites",
      href: "/client",
      icon: "client"
    },
    {
      key: "reports",
      label: "Reports",
      href: "/reports",
      icon: "reports"
    },
    // Divider
    {
      key: "divider",
      type: "divider"
    },
    {
      key: "support",
      label: "Support",
      href: "/support",
      icon: "support"
    },
    {
      key: "settings",
      label: "Settings",
      href: "/settings",
      icon: "settings"
    }
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-4 lg:border-r lg:border-slate-200 lg:bg-white lg:px-4 lg:py-5">
      {/* Logo and brand */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
          {brand}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{brand}</div>
          <div className="truncate text-xs text-slate-500">Workforce Suite</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.type === "divider") {
            return <div key={item.key} className="my-2 border-t border-slate-200" />;
          }

          const isActive = item.key === activeKey;
          return (
            <a
              key={item.key}
              href={item.href || "#"}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <NavIcon
                name={item.icon}
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="truncate">{item.label}</span>
            </a>
          );
        })}
        {onLogout && (
          <>
            <div className="my-2 border-t border-slate-200" />
            <button
              type="button"
              onClick={onLogout}
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <NavIcon name="logout" className="text-red-500" />
              <span className="truncate">Logout</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}