import React from 'react';

export default function CategoryPill({ name, count, icon, colorClass, isActive, onClick }) {
  const activeClasses = isActive 
    ? 'bg-primary-container text-on-primary shadow-[0_4px_12px_rgba(217,142,63,0.35)]' 
    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container shadow-sm';

  return (
    <button 
      className={`category-pill flex items-center gap-2 px-space-md py-3 rounded-full font-label-lg text-label-lg shrink-0 transition-all active:scale-95 ${activeClasses}`}
      type="button"
      onClick={onClick}
    >
      <span className={`material-symbols-outlined text-[20px] ${!isActive ? colorClass : ''}`}>{icon}</span>
      <span>{name} ({count})</span>
    </button>
  );
}
