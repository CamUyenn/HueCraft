'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { Compass, Scroll, Globe, Gift } from 'lucide-react';

interface NavbarProps {
  currentPage?: 'landing' | 'home' | 'map' | 'rewards';
}

const LANG_OPTIONS = [
  {
    code: 'vi' as Language,
    shortLabel: 'VI',
    label: 'Tiếng Việt',
  },
  {
    code: 'en' as Language,
    shortLabel: 'EN',
    label: 'English',
  },
  {
    code: 'sign' as Language,
    shortLabel: 'Ký hiệu',
    label: 'Ngôn ngữ ký hiệu',
  },
];

export default function Navbar({ currentPage }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { unlockedRewards, getCompletedVillagesCount } = useProgress();

  const currentLang = language || 'vi';

  // Determine active page either from prop or current pathname
  const activePage =
    currentPage ||
    (pathname === '/'
      ? 'landing'
      : pathname.startsWith('/home')
      ? 'home'
      : pathname.startsWith('/map')
      ? 'map'
      : pathname.startsWith('/rewards')
      ? 'rewards'
      : undefined);

  const unlockedCount = Object.keys(unlockedRewards).filter((k) => unlockedRewards[k]).length;
  const completedCount = getCompletedVillagesCount();

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full px-4 sm:px-8 lg:px-12 pt-4 pb-2 transition-all pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-2xl bg-[#120703]/95 backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.85)] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 pointer-events-auto">
        {/* Brand Logo & Title */}
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-500/20 border border-amber-300/50 group-hover:scale-105 transition-all">
            <Scroll className="w-5 h-5 text-stone-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className="font-extrabold text-base sm:text-lg tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                TOUR HUẾ
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider uppercase">
                360° VR
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-stone-400 tracking-wide font-medium">
              Di Sản & Làng Nghề Cố Đô
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/80 border border-white/10 backdrop-blur-md shadow-inner">
          <button
            onClick={() => router.push('/')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'landing'
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentLang === 'en' ? 'Welcome' : 'Trang Chủ'}
          </button>

          <button
            onClick={() => router.push('/home')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePage === 'home'
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{currentLang === 'en' ? '8 Craft Villages' : '8 Làng Nghề'}</span>
            {completedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                {completedCount}/8
              </span>
            )}
          </button>

          <button
            onClick={() => router.push('/map')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePage === 'map'
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLang === 'en' ? '360° Map' : 'Bản Đồ 360°'}</span>
          </button>

          <button
            onClick={() => router.push('/rewards')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activePage === 'rewards'
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLang === 'en' ? 'Rewards' : 'Phần Thưởng'}</span>
            {unlockedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white animate-pulse">
                {unlockedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions: 360 CTA & Language Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick Map Button (if not on /map) */}
          {activePage !== 'map' && (
            <button
              onClick={() => router.push('/map')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-stone-950" />
              <span>{currentLang === 'en' ? '360° Map' : 'Bản Đồ 360°'}</span>
            </button>
          )}

          {/* Language Switcher Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-stone-950/90 border border-white/15 shadow-inner gap-0.5">
            <div className="px-1 text-stone-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            {LANG_OPTIONS.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentLang === item.code
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
                title={item.label}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
