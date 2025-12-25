import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

function BellIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
        className="fill-current"
        opacity="0.25"
      />
      <path
        d="M18 10a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Topbar({ project, user, notifications, tabs = [], activeTabKey = "overview" }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold text-slate-900">{project?.name || "Dashboard"}</div>
            {project?.environment ? <Badge variant="info">{project.environment}</Badge> : null}
          </div>
          <div className="mt-1 hidden text-xs text-slate-500 md:block">
            Attendance & Workforce Management
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="relative">
            <BellIcon className="h-5 w-5 text-slate-700" />
            {notifications?.unreadCount ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] font-bold text-white">
                {notifications.unreadCount}
              </span>
            ) : null}
          </Button>

          <div className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 md:flex">
            <Avatar name={user?.name} className="h-9 w-9" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">{user?.name || "User"}</div>
              <div className="truncate text-xs text-slate-500">{user?.email || ""}</div>
            </div>
          </div>
        </div>
      </div>

      {tabs.length ? (
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((t) => {
              const isActive = t.key === activeTabKey;
              return (
                <button
                  key={t.key}
                  type="button"
                  className={
                    "rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors " +
                    (isActive
                      ? "bg-indigo-600 text-white ring-indigo-600"
                      : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 hover:text-slate-900")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
