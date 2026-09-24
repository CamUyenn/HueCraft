'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { rewards, Reward } from '@/data/villages';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  Gift,
  Lock,
  Unlock,
  Hotel,
  ShoppingBag,
  Coffee,
  MapPin,
  Utensils,
  Sparkles,
  Copy,
  CheckCircle2,
  ChevronRight,
  Compass,
  PartyPopper,
  Tag,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

const REWARD_ICONS: Record<string, React.ElementType> = {
  homestay: Hotel,
  souvenir: ShoppingBag,
  cafe: Coffee,
  tour: Compass,
  restaurant: Utensils,
  spa: Sparkles,
};

const REWARD_COLORS: Record<
  string,
  { from: string; to: string; badge: string; border: string }
> = {
  homestay: {
    from: '#8B1A00',
    to: '#C05010',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    border: '#C05010',
  },
  souvenir: {
    from: '#14532D',
    to: '#16A34A',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    border: '#16A34A',
  },
  cafe: {
    from: '#78350F',
    to: '#D97706',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: '#D97706',
  },
  tour: {
    from: '#1E3A8A',
    to: '#2563EB',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    border: '#2563EB',
  },
  restaurant: {
    from: '#581C87',
    to: '#9333EA',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    border: '#9333EA',
  },
  spa: {
    from: '#0F766E',
    to: '#14B8A6',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    border: '#14B8A6',
  },
};

// Requirement: How many completed villages to naturally unlock each reward
const REWARD_REQUIREMENTS: Record<string, { minVillages: number; categoryGroup: string }> = {
  'reward-3': { minVillages: 1, categoryGroup: 'cafe' }, // Cafe Cổ Đô
  'reward-2': { minVillages: 2, categoryGroup: 'souvenir' }, // Đông Ba 15%
  'reward-1': { minVillages: 3, categoryGroup: 'homestay' }, // Phú Mộng 20%
  'reward-6': { minVillages: 4, categoryGroup: 'souvenir' }, // Làng Nghề Việt Mua 2 tặng 1
  'reward-5': { minVillages: 5, categoryGroup: 'homestay' }, // Nhà Cổ Huế Free Breakfast
  'reward-7': { minVillages: 6, categoryGroup: 'restaurant' }, // Ẩm thực Cung Đình 30%
  'reward-4': { minVillages: 7, categoryGroup: 'tour' }, // Tour Làng Nghề 25%
  'reward-8': { minVillages: 8, categoryGroup: 'spa' }, // Wellness Spa Liệu Pháp Thảo Mộc
};

export default function Rewards() {
  const router = useRouter();
  const { language } = useLanguage();
  const { unlockedRewards, unlockReward, getCompletedVillagesCount } = useProgress();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const currentLang = language || 'vi';
  const langKey = currentLang === 'sign' ? 'vi' : currentLang;
  const completedCount = getCompletedVillagesCount();

  // Helper function to check if reward is unlocked (either via progress context or completed count milestone)
  const isRewardUnlocked = (rewardId: string) => {
    if (unlockedRewards[rewardId]) return true;
    const req = REWARD_REQUIREMENTS[rewardId];
    if (req && completedCount >= req.minVillages) return true;
    return false;
  };

  const unlockedList = rewards.filter((r) => isRewardUnlocked(r.id));
  const unlockedCount = unlockedList.length;

  const handleCopy = (code: string, partner: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);

    // Fire royal festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'],
    });

    toast.success(
      currentLang === 'en'
        ? `Voucher code ${code} copied for ${partner}!`
        : `Đã sao chép mã ${code} cho ${partner}!`
    );

    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Instant starter claim button for visitors
  const handleClaimStarterGift = () => {
    unlockReward('reward-3'); // Cafe Cổ Đô
    unlockReward('reward-2'); // Đông Ba
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#D97706', '#FBBF24'],
    });
    toast.success(
      currentLang === 'en'
        ? 'Starter Gift Unlocked! Enjoy Cafe & Souvenir vouchers in Hue.'
        : 'Đã mở khóa Quà Tân Thủ! Bạn nhận được voucher Cafe Cổ Đô & Lưu Niệm Đông Ba.'
    );
  };

  const t = {
    vi: {
      eyebrow: 'Kho Báu Hoàng Gia • Tri Ân Du Khách',
      title: 'Voucher & Phần Thưởng Đối Tác Cố Đô',
      subtitle:
        'Hành trình khám phá làng nghề mở lối cho những trải nghiệm trọn vẹn tại Huế. Thu thập trọn bộ 8 voucher giá trị từ hệ thống khách sạn, ẩm thực cung đình và xưởng thủ công danh tiếng.',
      stat_completed: 'Làng nghề hoàn thành',
      stat_unlocked: 'Voucher đã mở khóa',
      stat_value: 'Ước tính tiết kiệm',
      stat_value_num: '500.000đ+',
      btn_starter: 'Nhận Quà Tân Thủ Trải Nghiệm',
      btn_explore: 'Khám Phá Thêm Làng Nghề',
      filter_all: 'Tất cả',
      filter_unlocked: 'Đã mở khóa',
      filter_homestay: 'Khách sạn & Homestay',
      filter_dining: 'Ẩm thực & Cafe',
      filter_tour: 'Tour & Quà lưu niệm',
      filter_spa: 'Spa Thảo Mộc',
      empty_unlocked: 'Chưa có voucher nào được mở khóa.',
      empty_unlocked_sub:
        'Hãy hoàn thành ít nhất 1 làng nghề hoặc bấm nút "Nhận Quà Tân Thủ" để bắt đầu nhận ưu đãi!',
      voucher_code: 'MÃ VOUCHER',
      copy_code: 'Sao chép mã',
      copied: 'Đã sao chép!',
      condition_locked: 'Hoàn thành thêm',
      condition_unit: 'làng nghề để mở khóa',
      valid_until: 'Hạn dùng: 31/12/2026 • Xuất trình khi thanh toán',
      unlocked_badge: 'Sẵn Sàng Sử Dụng',
      locked_badge: 'Chưa Đủ Điều Kiện',
      starter_claimed: 'Đã Nhận Quà Tân Thủ',
      milestone_title: 'Lộ Trình Mở Khóa Kho Báu Hoàng Gia',
    },
    en: {
      eyebrow: 'Imperial Treasury • Traveler Appreciation',
      title: 'Hue Partner Vouchers & Rewards',
      subtitle:
        'Your craft village expedition unlocks authentic experiences across Hue. Collect 8 exclusive vouchers from premier traditional homestays, royal cuisine restaurants, and craft studios.',
      stat_completed: 'Villages Completed',
      stat_unlocked: 'Vouchers Unlocked',
      stat_value: 'Estimated Savings',
      stat_value_num: '$25+ (500k VND)',
      btn_starter: 'Claim Starter Gift Voucher',
      btn_explore: 'Explore More Villages',
      filter_all: 'All',
      filter_unlocked: 'Unlocked',
      filter_homestay: 'Homestay & Hotels',
      filter_dining: 'Dining & Cafe',
      filter_tour: 'Tours & Souvenirs',
      filter_spa: 'Herbal Spa',
      empty_unlocked: 'No vouchers unlocked yet.',
      empty_unlocked_sub:
        'Complete at least 1 village or click "Claim Starter Gift" to begin collecting rewards!',
      voucher_code: 'VOUCHER CODE',
      copy_code: 'Copy Voucher Code',
      copied: 'Copied!',
      condition_locked: 'Complete',
      condition_unit: 'more village(s) to unlock',
      valid_until: 'Valid until: Dec 31, 2026 • Present upon payment',
      unlocked_badge: 'Ready to Redeem',
      locked_badge: 'Locked',
      starter_claimed: 'Starter Gift Claimed',
      milestone_title: 'Imperial Treasury Unlock Milestones',
    },
    sign: {
      eyebrow: 'Kho Báu Quà Tặng 🎁',
      title: 'Voucher & Phần Thưởng Huế',
      subtitle:
        'Hoàn thành các làng nghề để mở khóa voucher giảm giá ăn uống, khách sạn và quà tặng du lịch!',
      stat_completed: 'Làng đã xong ✅',
      stat_unlocked: 'Quà đã mở 🔓',
      stat_value: 'Tiết kiệm',
      stat_value_num: '500.000đ+',
      btn_starter: 'Nhận Quà Tân Thủ 🎁',
      btn_explore: 'Đi làm nghề 🏘️',
      filter_all: 'Tất cả',
      filter_unlocked: 'Của tôi 🎁',
      filter_homestay: 'Khách sạn 🏨',
      filter_dining: 'Ẩm thực 🍵',
      filter_tour: 'Quà tặng 🛍️',
      filter_spa: 'Spa 🌿',
      empty_unlocked: 'Chưa có quà nào!',
      empty_unlocked_sub: 'Hoàn thành làng nghề để mở khóa quà tặng nhé!',
      voucher_code: 'MÃ ƯU ĐÃI',
      copy_code: 'Sao chép mã 📋',
      copied: 'Đã copy! ✅',
      condition_locked: 'Cần làm thêm',
      condition_unit: 'làng nghề 🏘️',
      valid_until: 'Hạn dùng: 2026 • Đưa mã khi thanh toán',
      unlocked_badge: 'Đã Mở Khóa 🔓',
      locked_badge: 'Đang Khóa 🔒',
      starter_claimed: 'Đã Nhận Quà 🎁',
      milestone_title: 'Lộ trình mở khóa quà tặng 📊',
    },
  };

  const copy = t[currentLang];

  // Filtering display list
  const filteredList = rewards.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return isRewardUnlocked(r.id);
    if (filter === 'homestay') return r.type === 'homestay';
    if (filter === 'dining') return r.type === 'cafe' || r.type === 'restaurant';
    if (filter === 'tour') return r.type === 'tour' || r.type === 'souvenir';
    if (filter === 'spa') return r.type === 'spa';
    return true;
  });

  return (
    <div
      className="relative min-h-screen bg-[#0E0602] text-white selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* Shared Floating Navbar */}
      <Navbar currentPage="rewards" />

      {/* Ambient Regal Purple-Amber Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1705823637026-92c0ef6d6222?w=1800&h=1000&fit=crop&auto=format')`,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-purple-900/20 via-amber-700/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24">
        {/* ─── HERO & TREASURY OVERVIEW ───────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#1F082B] via-[#2D0F38] to-[#12050B] p-6 sm:p-10 lg:p-12 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Subtle Geometric Lattice */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #E9D5FF 0, #E9D5FF 1px, transparent 0, transparent 40%)`,
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Headline & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 flex flex-col items-start"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                <span>{copy.eyebrow}</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {copy.title}
              </h1>

              <p
                className="text-purple-200/90 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {copy.subtitle}
              </p>

              <div className="flex items-center gap-3.5 flex-wrap">
                {/* Starter gift claim button */}
                <button
                  onClick={handleClaimStarterGift}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-stone-950" />
                  <span>{copy.btn_starter}</span>
                </button>

                <button
                  onClick={() => router.push('/home')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>{copy.btn_explore}</span>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </motion.div>

            {/* Right: 3 Stats Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-4"
            >
              <div className="rounded-2xl bg-stone-950/85 border border-amber-500/30 p-3 sm:p-4 text-center shadow-xl backdrop-blur-md flex flex-col justify-center">
                <div
                  className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span>{completedCount}</span>
                  <span className="text-base sm:text-lg text-amber-400/60 font-semibold">/8</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight">
                  {copy.stat_completed}
                </div>
              </div>

              <div className="rounded-2xl bg-stone-950/85 border border-emerald-500/30 p-3 sm:p-4 text-center shadow-xl backdrop-blur-md flex flex-col justify-center">
                <div
                  className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span>{unlockedCount}</span>
                  <span className="text-base sm:text-lg text-emerald-400/60 font-semibold">/8</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight">
                  {copy.stat_unlocked}
                </div>
              </div>

              <div className="rounded-2xl bg-stone-950/85 border border-purple-500/30 p-3 sm:p-4 text-center shadow-xl backdrop-blur-md flex flex-col justify-center overflow-hidden">
                <div
                  className="text-lg sm:text-xl lg:text-lg xl:text-2xl font-black text-purple-300 mb-1 tracking-tight truncate flex items-center justify-center"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  title={copy.stat_value_num}
                >
                  {copy.stat_value_num}
                </div>
                <div className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight">
                  {copy.stat_value}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── MILESTONE PROGRESSION TRACKER ───────────────────────────────────── */}
        <div className="rounded-3xl border border-white/10 bg-stone-950/80 p-6 mb-8 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-xs uppercase tracking-wider text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{copy.milestone_title}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {rewards.map((r, i) => {
              const req = REWARD_REQUIREMENTS[r.id] || { minVillages: i + 1 };
              const unlocked = isRewardUnlocked(r.id);
              const Icon = REWARD_ICONS[r.type] || Gift;

              return (
                <div
                  key={r.id}
                  onClick={() => setFilter('all')}
                  className={`rounded-xl p-3 border transition-all cursor-pointer flex flex-col items-center text-center ${
                    unlocked
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      unlocked
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-bold truncate max-w-full text-white">
                    {r.discount}
                  </div>
                  <div className="text-[9px] text-stone-400 truncate max-w-full">
                    {r.partner}
                  </div>
                  <div className="mt-1.5 text-[9px] font-semibold">
                    {unlocked ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Mở
                      </span>
                    ) : (
                      <span className="text-stone-500 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> {req.minVillages} làng
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── STARTER GIFT PROMPT BANNER ───────────────────────────────────── */}
        {unlockedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <Gift className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-200">
                  {currentLang === 'en' ? 'Welcome Traveler Gift Available!' : 'Quà Tặng Chào Mừng Dành Cho Du Khách!'}
                </div>
                <div className="text-xs text-stone-300">
                  {currentLang === 'en'
                    ? 'Click to instantly unlock Cafe Cổ Đô & Souvenir voucher to experience.'
                    : 'Bấm nhận ngay voucher Cafe Cổ Đô và Lưu Niệm Chợ Đông Ba để trải nghiệm sử dụng.'}
                </div>
              </div>
            </div>
            <button
              onClick={handleClaimStarterGift}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              {currentLang === 'en' ? 'Claim Gift Now' : 'Nhận Quà Ngay'}
            </button>
          </motion.div>
        )}

        {/* ─── FILTER TABS WITH ICONS & COUNTS ──────────────────────────────────── */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-950/90 border border-white/10 overflow-x-auto max-w-full mb-8">
          {[
            { key: 'all', label: copy.filter_all, count: rewards.length, icon: Sparkles },
            { key: 'unlocked', label: copy.filter_unlocked, count: unlockedCount, icon: Unlock },
            { key: 'homestay', label: copy.filter_homestay, icon: Hotel },
            { key: 'dining', label: copy.filter_dining, icon: Utensils },
            { key: 'tour', label: copy.filter_tour, icon: Compass },
            { key: 'spa', label: copy.filter_spa, icon: Sparkles },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-stone-950/25 text-stone-950' : 'bg-white/10 text-stone-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ─── ROYAL HERITAGE VIP PASS GRID (3-4 COLUMNS) ───────────────────────── */}
        {filteredList.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-stone-950/60 p-12 text-center my-8">
            <Gift className="w-12 h-12 text-stone-500 mx-auto mb-4" />
            <h3
              className="text-white text-xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {copy.empty_unlocked}
            </h3>
            <p
              className="text-stone-300 text-sm max-w-md mx-auto mb-6"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {copy.empty_unlocked_sub}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleClaimStarterGift}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all cursor-pointer"
              >
                {copy.btn_starter}
              </button>
              <button
                onClick={() => setFilter('all')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold transition-all cursor-pointer"
              >
                Xem tất cả ưu đãi
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredList.map((reward, index) => {
              const unlocked = isRewardUnlocked(reward.id);
              const Icon = REWARD_ICONS[reward.type] || Gift;
              const color = REWARD_COLORS[reward.type] || {
                from: '#8B1A00',
                to: '#C05010',
                badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                border: '#F59E0B',
              };
              const req = REWARD_REQUIREMENTS[reward.id] || { minVillages: 1 };
              const neededCount = Math.max(0, req.minVillages - completedCount);
              const progressPct = Math.min(100, Math.round((completedCount / req.minVillages) * 100));

              // Curated high quality photos for each partner
              const REWARD_PHOTOS: Record<string, string> = {
                'reward-1':
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&h=450&fit=crop&auto=format',
                'reward-2':
                  'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&h=450&fit=crop&auto=format',
                'reward-3':
                  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&h=450&fit=crop&auto=format',
                'reward-4':
                  'https://images.unsplash.com/photo-1528181304800-259b08848526?w=700&h=450&fit=crop&auto=format',
                'reward-5':
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=450&fit=crop&auto=format',
                'reward-6':
                  'https://images.unsplash.com/photo-1574614366831-900f959788c9?w=700&h=450&fit=crop&auto=format',
                'reward-7':
                  'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&h=450&fit=crop&auto=format',
                'reward-8':
                  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&h=450&fit=crop&auto=format',
              };

              const photoUrl = REWARD_PHOTOS[reward.id] || REWARD_PHOTOS['reward-1'];

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.5 }}
                  className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${
                    unlocked
                      ? 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-stone-900/95 to-[#120703] shadow-2xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.95)] hover:-translate-y-1.5'
                      : 'border-white/10 hover:border-amber-500/30 bg-gradient-to-b from-stone-950/90 to-[#0A0402] opacity-85 hover:opacity-100 hover:-translate-y-1'
                  }`}
                >
                  {/* ── CARD PHOTO BANNER (TOP) ─────────────────────────────── */}
                  <div className="relative h-48 overflow-hidden bg-stone-950">
                    <img
                      src={photoUrl}
                      alt={reward.partner}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, #120703 0%, ${color.from}70 60%, rgba(0,0,0,0.5) 100%)`,
                      }}
                    />

                    {/* Top Row: Category Tag & Lock/Unlock Status */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/65 text-amber-200 border border-amber-500/30 backdrop-blur-md shadow-sm">
                        {reward.partner}
                      </span>

                      {unlocked ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white border border-emerald-400/40 backdrop-blur-md shadow-sm flex items-center gap-1">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>{copy.unlocked_badge}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                          <span>Mốc {req.minVillages} Làng</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Big Discount Pill + Expiry */}
                    <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2">
                      {/* Big Floating Gold Discount Pill */}
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-400/60 shadow-lg">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-stone-950 font-bold shadow-sm"
                          style={{ background: `linear-gradient(135deg, #F59E0B, #D97706)` }}
                        >
                          <Icon className="w-4 h-4 text-stone-950" />
                        </div>
                        <span
                          className="text-xl font-black text-amber-300 tracking-tight"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {reward.discount}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] text-stone-300 bg-black/60 backdrop-blur-sm border border-white/10 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-amber-400" />
                        <span>2026</span>
                      </span>
                    </div>
                  </div>

                  {/* ── CARD BODY ─────────────────────────────────────────────── */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3
                        className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-200 transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {reward.title[langKey]}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-stone-300 text-xs leading-relaxed mb-4 line-clamp-2"
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {reward.description[langKey]}
                      </p>
                    </div>

                    {/* ── CARD ACTION FOOTER ───────────────────────────────────── */}
                    <div className="pt-3 border-t border-white/10 mt-auto">
                      {unlocked ? (
                        <div className="space-y-2">
                          {/* Golden Voucher Code Box */}
                          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-dashed border-amber-500/50 flex items-center justify-between px-3">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                                {copy.voucher_code}
                              </span>
                              <span className="text-base font-mono font-black tracking-widest text-amber-200">
                                {reward.code}
                              </span>
                            </div>
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                          </div>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(reward.code, reward.partner)}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                              copiedCode === reward.code
                                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {copiedCode === reward.code ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{copy.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>{copy.copy_code}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {/* Mini progress tracker */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-stone-400">
                                Tiến độ:{' '}
                                <strong className="text-amber-300">
                                  {completedCount}/{req.minVillages} làng
                                </strong>
                              </span>
                              <span className="text-[10px] text-stone-400">
                                Cần thêm {neededCount}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Action button leading to /home */}
                          <button
                            onClick={() => router.push('/home')}
                            className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            <span>Làm làng nghề mở khóa</span>
                            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-stone-400 text-center truncate">
                        {copy.valid_until}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
