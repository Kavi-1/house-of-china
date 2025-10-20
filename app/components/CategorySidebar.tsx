"use client";
import { useEffect, useState } from 'react';

interface Props {
  categories: string[];
}

export default function CategorySidebar({ categories }: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach(cat => {
      const el = document.getElementById(`cat-${cat}`);
      if (!el) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(cat);
        });
      }, { root: null, threshold: 0.4 });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [categories]);

  const handleClick = (cat: string) => {
    const el = document.getElementById(`cat-${cat}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="font-poppins hidden lg:block w-48 sticky" style={{ top: '4rem' }}>
      <div style={{ maxHeight: 'calc(100vh - 4rem)', overflow: 'hidden' }}>
        <ul className="space-y-1">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => handleClick(cat)}
                className={`w-full hover:cursor-pointer text-left px-2 py-2 rounded-md text-sm transition-colors ${active === cat ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-red-50'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
