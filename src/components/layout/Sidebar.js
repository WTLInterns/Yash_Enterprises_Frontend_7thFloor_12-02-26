import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  CalendarCheck2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MapPin,
  LogOut,
  Landmark,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { cn } from "@/utils/helpers";

function NavIcon({ name, className }) {
  const Icon =
    name === "dashboard"
      ? LayoutDashboard
      : name === "attendance"
        ? CalendarCheck2
        : name === "leaves"
          ? ClipboardList
          : name === "org"
            ? Building2
            : name === "bank"
              ? Landmark
              : name === "products"
                ? Package
                : name === "sites"
                  ? MapPin
            : name === "tasks"
              ? ClipboardList
              : name === "form"
                ? ClipboardList
                : name === "order"
                  ? ShoppingBag
                  : name === "expenses"
                    ? CreditCard
                    : name === "client"
                      ? Users
                      : name === "reports"
                        ? BarChart3
                        : name === "settings"
                          ? Settings
                          : name === "logout"
                            ? LogOut
                            : Package;

  return <Icon className={cn("h-5 w-5", className)} aria-hidden="true" />;
}

function ChevronIcon({ open, className }) {
  return (
    <ChevronRight
      className={cn(
        "h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200",
        open ? "rotate-90" : "rotate-0",
        className
      )}
      aria-hidden="true"
    />
  );
}

export default function Sidebar({
  items = [],
  activeKey = "dashboard",
  brand = "YAS",
  onLogout,
  sections,
}) {
  const defaultItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      key: "attendance",
      label: "Attendance",
      href: "/attendance",
      icon: "attendance",
    },
    {
      key: "leaves",
      label: "Leaves",
      href: "/leaves",
      icon: "leaves",
    },
    {
      key: "org",
      label: "Organization",
      href: "/organization",
      icon: "org",
    },
    {
      key: "tasks",
      label: "Tasks",
      href: "/tasks",
      icon: "tasks",
    },
    {
      key: "form",
      label: "Form",
      href: "/form",
      icon: "form",
    },
    {
      key: "order",
      label: "Order",
      href: "/order",
      icon: "order",
    },
    {
      key: "expenses",
      label: "Expenses",
      href: "/expenses",
      icon: "expenses",
    },
    {
      key: "sites",
      label: "Sites",
      href: "/sites",
      icon: "sites",
    },
    {
      key: "reports",
      label: "Reports",
      href: "/reports",
      icon: "reports",
    },
    {
      key: "divider",
      type: "divider",
    },
    {
      key: "support",
      label: "Support",
      href: "/support",
      icon: "support",
    },
    {
      key: "settings",
      label: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  const pathname = usePathname();
  const [openSection, setOpenSection] = useState(null);

  const accentStyles = useMemo(
    () => ({
      indigo: {
        icon: "text-indigo-600",
        hoverIcon: "group-hover:text-indigo-600",
        hover: "hover:bg-indigo-50/60",
        active: "bg-gradient-to-r from-indigo-600/12 via-indigo-600/8 to-transparent text-indigo-700",
        rail: "bg-indigo-500",
      },
      emerald: {
        icon: "text-emerald-600",
        hoverIcon: "group-hover:text-emerald-600",
        hover: "hover:bg-emerald-50/60",
        active: "bg-gradient-to-r from-emerald-600/12 via-emerald-600/8 to-transparent text-emerald-700",
        rail: "bg-emerald-500",
      },
      amber: {
        icon: "text-amber-600",
        hoverIcon: "group-hover:text-amber-600",
        hover: "hover:bg-amber-50/60",
        active: "bg-gradient-to-r from-amber-600/12 via-amber-600/8 to-transparent text-amber-700",
        rail: "bg-amber-500",
      },
      violet: {
        icon: "text-violet-600",
        hoverIcon: "group-hover:text-violet-600",
        hover: "hover:bg-violet-50/60",
        active: "bg-gradient-to-r from-violet-600/12 via-violet-600/8 to-transparent text-violet-700",
        rail: "bg-violet-500",
      },
      cyan: {
        icon: "text-cyan-600",
        hoverIcon: "group-hover:text-cyan-600",
        hover: "hover:bg-cyan-50/60",
        active: "bg-gradient-to-r from-cyan-600/12 via-cyan-600/8 to-transparent text-cyan-700",
        rail: "bg-cyan-500",
      },
      rose: {
        icon: "text-rose-600",
        hoverIcon: "group-hover:text-rose-600",
        hover: "hover:bg-rose-50/60",
        active: "bg-gradient-to-r from-rose-600/12 via-rose-600/8 to-transparent text-rose-700",
        rail: "bg-rose-500",
      },
      slate: {
        icon: "text-slate-600",
        hoverIcon: "group-hover:text-slate-700",
        hover: "hover:bg-slate-100/60",
        active: "bg-gradient-to-r from-slate-600/10 via-slate-600/6 to-transparent text-slate-900",
        rail: "bg-slate-500",
      },
      teal: {
        icon: "text-teal-600",
        hoverIcon: "group-hover:text-teal-600",
        hover: "hover:bg-teal-50/60",
        active: "bg-gradient-to-r from-teal-600/12 via-teal-600/8 to-transparent text-teal-700",
        rail: "bg-teal-500",
      },
      orange: {
        icon: "text-orange-600",
        hoverIcon: "group-hover:text-orange-600",
        hover: "hover:bg-orange-50/60",
        active: "bg-gradient-to-r from-orange-600/12 via-orange-600/8 to-transparent text-orange-700",
        rail: "bg-orange-500",
      },
      "blue-gray": {
        icon: "text-slate-700",
        hoverIcon: "group-hover:text-slate-900",
        hover: "hover:bg-slate-100/60",
        active: "bg-gradient-to-r from-slate-700/12 via-slate-700/8 to-transparent text-slate-900",
        rail: "bg-slate-600",
      },
      lime: {
        icon: "text-lime-600",
        hoverIcon: "group-hover:text-lime-600",
        hover: "hover:bg-lime-50/60",
        active: "bg-gradient-to-r from-lime-600/12 via-lime-600/8 to-transparent text-lime-700",
        rail: "bg-lime-500",
      },
    }),
    []
  );

  const getAccent = (item) => accentStyles[item?.accent] || accentStyles.indigo;

  const isItemActive = (item) => {
    if (!item?.href) return false;
    if (item.href === "/") {
      return pathname === "/";
    } else {
      return pathname?.startsWith(item.href);
    }
  };

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const found = sections.find((section) =>
      section.items?.some((item) => isItemActive(item))
    );

    if (found) {
      setOpenSection(found.key);
    } else {
      setOpenSection(sections[0]?.key || null);
    }
  }, [pathname, sections]);

  return (
    <aside className="hidden md:flex md:w-20 lg:w-72 md:flex-col md:gap-4 md:fixed md:h-screen md:left-0 md:top-0 md:z-10 md:px-3 md:py-4">
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-[12px_0_40px_-25px_rgba(2,6,23,0.45)] ring-1 ring-white/20 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-white/20 to-slate-100/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />

        <div className="relative z-10 mx-2 mt-2 flex items-center gap-3 rounded-2xl border border-white/35 bg-white/65 px-3 py-4 shadow-[0_10px_30px_-25px_rgba(2,6,23,0.32)] ring-1 ring-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/55">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-sm font-bold text-white shadow-[0_10px_30px_-15px_rgba(99,102,241,0.8)]">
            <span className="relative z-10">{brand}</span>
            <div className="absolute inset-0 opacity-30 blur-2xl" />
          </div>
          <div className="min-w-0 hidden lg:block">
            <div className="truncate text-sm font-semibold text-slate-900">{brand}</div>
            <div className="truncate text-xs text-slate-500">Workforce Suite</div>
          </div>
        </div>

        <nav className="relative z-10 flex flex-1 flex-col gap-2 px-2 pb-3 pt-3">
          {sections && sections.length > 0
            ? sections.map((section) => {
                const isOpen = openSection === section.key;
                const sectionTone = section.key === "zoho" ? "indigo" : "emerald";
                const sectionAccent = accentStyles[sectionTone] || accentStyles.indigo;
                return (
                  <div
                    key={section.key}
                    className="rounded-2xl border border-white/30 bg-white/70 p-1 shadow-[0_10px_30px_-28px_rgba(2,6,23,0.30)] ring-1 ring-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/60"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSection((prev) => (prev === section.key ? null : section.key))
                      }
                      aria-expanded={isOpen}
                      className={cn(
                        "group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                        "text-slate-700 hover:text-slate-900",
                        "hover:bg-white/80",
                        isOpen && "bg-white/85 shadow-sm ring-1 ring-white/50"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "relative h-9 w-9 rounded-xl border border-white/55 bg-white/70 shadow-sm ring-1 ring-slate-200/50 transition-all",
                            "grid place-items-center",
                            "group-hover:shadow-md",
                            isOpen && "shadow-md"
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full", sectionAccent.rail)} />
                        </span>
                        <span className="truncate hidden lg:block">{section.label}</span>
                      </span>
                      <ChevronIcon open={isOpen} className={cn(!isOpen && "group-hover:text-slate-600")} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={`${section.key}-submenu`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="mt-2 overflow-hidden"
                        >
                          <div className="relative space-y-1 pl-3">
                            <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-slate-200 via-slate-200/40 to-transparent" />

                            {section.items?.map((item, idx) => {
                              if (item.type === "divider") {
                                return (
                                  <div
                                    key={item.key}
                                    className="my-2 ml-2 border-t border-slate-200/70"
                                  />
                                );
                              }

                              const active = isItemActive(item);
                              const accent = getAccent(item);

                              return (
                                <motion.a
                                  key={item.key}
                                  href={item.href || "#"}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.18, ease: "easeOut", delay: idx * 0.02 }}
                                  className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium",
                                    "transition-all duration-200",
                                    "text-slate-600 hover:text-slate-900",
                                    accent.hover,
                                    active && accent.active
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-opacity",
                                      accent.rail,
                                      (active || undefined) && "opacity-100",
                                      "group-hover:opacity-100"
                                    )}
                                  />
                                  {item.icon && (
                                    <span
                                      className={cn(
                                        "grid h-8 w-8 place-items-center rounded-xl border border-transparent",
                                        "bg-white/50 ring-1 ring-slate-200/70",
                                        "transition-all duration-200",
                                        "group-hover:scale-[1.05] group-hover:shadow-sm"
                                      )}
                                    >
                                      <NavIcon
                                        name={item.icon}
                                        className={cn(
                                          "transition-colors",
                                          active ? accent.icon : cn("text-slate-400", accent.hoverIcon)
                                        )}
                                      />
                                    </span>
                                  )}
                                  <span className="truncate hidden lg:block">{item.label}</span>
                                  <span className="pointer-events-none absolute left-16 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-lg md:block lg:hidden group-hover:block">
                                    {item.label}
                                  </span>
                                </motion.a>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            : menuItems.map((item) => {
                if (item.type === "divider") {
                  return (
                    <div key={item.key} className="my-2 border-t border-slate-200" />
                  );
                }

                const active = isItemActive(item);
                const accent = getAccent(item);

                return (
                  <a
                    key={item.key}
                    href={item.href || "#"}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                      "transition-all duration-200",
                      "text-slate-600 hover:text-slate-900",
                      accent.hover,
                      active && accent.active
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full opacity-0 transition-opacity",
                        accent.rail,
                        (active || undefined) && "opacity-100",
                        "group-hover:opacity-100"
                      )}
                    />
                    {item.icon && (
                      <span
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-xl border border-transparent",
                          "bg-white/50 ring-1 ring-slate-200/70",
                          "transition-all duration-200",
                          "group-hover:scale-[1.05] group-hover:shadow-sm"
                        )}
                      >
                        <NavIcon
                          name={item.icon}
                          className={cn(
                            "transition-colors",
                            active ? accent.icon : cn("text-slate-400", accent.hoverIcon)
                          )}
                        />
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
          {onLogout && (
            <>
              <div className="mt-1 border-t border-slate-200/50" />
              <button
                type="button"
                onClick={onLogout}
                className={cn(
                  "group relative mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium",
                  "border border-white/30 bg-white/70 text-rose-600 shadow-[0_10px_30px_-28px_rgba(2,6,23,0.30)] ring-1 ring-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/60",
                  "transition-all hover:bg-white/80"
                )}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 ring-1 ring-slate-200/70 group-hover:scale-[1.03] transition-transform">
                  <NavIcon name="logout" className="text-rose-600" />
                </span>
                <span className="truncate hidden lg:block">Logout</span>
                <span className="pointer-events-none absolute left-16 hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-lg md:block lg:hidden group-hover:block">
                  Logout
                </span>
              </button>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}