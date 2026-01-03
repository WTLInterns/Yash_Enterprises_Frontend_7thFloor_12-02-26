export default function Topbar({ tabs, activeTabKey, onTabClick }) {
  return (
    <div className="border-b border-slate-200/70 bg-white/80 px-6 backdrop-blur">
      <div className="flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors
              ${
                activeTabKey === tab.key
                  ? 'border-indigo-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
