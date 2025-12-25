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

export default function Sidebar({ items = [], activeKey = "dashboard", brand = "YAS" }) {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-4 lg:border-r lg:border-slate-200 lg:bg-white lg:px-4 lg:py-5">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
          {brand}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{brand}</div>
          <div className="truncate text-xs text-slate-500">Workforce Suite</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <a
              key={item.key}
              href={item.href || "#"}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <NavIcon
                name={item.icon}
                className={cn(isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")}
              />
              <span className="truncate">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 p-4 ring-1 ring-slate-200">
        <div className="text-sm font-semibold text-slate-900">Quick Tips</div>
        <div className="mt-1 text-xs leading-5 text-slate-600">
          Dashboard uses mock services. Swap `dashboard.service.js` with a Java API client later.
        </div>
      </div>
    </aside>
  );
}
