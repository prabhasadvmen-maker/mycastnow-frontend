import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, flagUrl } from '../utils/countries';

export const Flag = ({ iso, className = 'w-6 h-[18px]' }) => {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <span className={`inline-flex items-center justify-center rounded-sm bg-slate-100 text-[9px] font-bold text-slate-500 ${className}`}>{iso}</span>;
  }
  return (
    <img
      src={flagUrl(iso, 40)}
      srcSet={`${flagUrl(iso, 40)} 1x, ${flagUrl(iso, 80)} 2x`}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className={`rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(15,23,42,0.08)] ${className}`}
    />
  );
};

/**
 * Country dial-code dropdown. Renders the trigger button and a searchable popover;
 * the parent supplies a `relative` wrapper so the popover can span the whole field.
 */
export default function CountryPicker({ value, onChange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.parentElement?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, '');
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.startsWith(q));
  }, [query]);

  const pick = (c) => {
    onChange(c);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={rootRef} className="contents">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${value.name} +${value.dial}. Change country`}
        className="flex items-center gap-1.5 pl-3 pr-2.5 text-blue-950 font-medium border-r border-slate-200 my-2.5 hover:text-blue-700 transition-colors disabled:opacity-60"
      >
        <Flag iso={value.iso} />
        <span>+{value.dial}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-blue-900/15">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              aria-label="Search country"
              className="w-full bg-transparent text-sm text-blue-950 outline-none placeholder:text-slate-400"
            />
          </div>
          <ul role="listbox" aria-label="Countries" className="max-h-56 overflow-y-auto overscroll-contain py-1">
            {list.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No country found</li>}
            {list.map((c) => {
              const selected = c.iso === value.iso;
              return (
                <li key={c.iso} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => pick(c)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${selected ? 'bg-blue-50/70 font-semibold text-blue-700' : 'text-slate-700'}`}
                  >
                    <Flag iso={c.iso} />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-slate-400">+{c.dial}</span>
                    {selected && <Check size={14} className="text-blue-600" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
