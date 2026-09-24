'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage, Language } from '@/context/LanguageContext';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import {
  Compass,
  Sparkles,
  Globe,
  Languages,
  Hand,
  ChevronRight,
  ArrowRight,
  MapPin,
  Scroll,
  Palette,
  Award,
  Layers,
  CheckCircle2,
  Heart,
  Eye,
  Gift,
  ExternalLink,
} from 'lucide-react';

const LANG_OPTIONS = [
  {
    code: 'vi' as Language,
    shortLabel: 'VI',
    label: 'Tiếng Việt',
    sub: 'Tiếng Việt',
  },
  {
    code: 'en' as Language,
    shortLabel: 'EN',
    label: 'English',
    sub: 'English',
  },
  {
    code: 'sign' as Language,
    shortLabel: 'Ký hiệu',
    label: 'Ngôn ngữ ký hiệu',
    sub: 'Sign Language',
  },
];

const FEATURED_VILLAGES = [
  {
    id: 'sinh-painting',
    title: {
      vi: 'Làng Tranh Dân Gian Sình',
      en: 'Sinh Folk Painting Village',
      sign: 'Làng Tranh Sình 🎨',
    },
    tag: 'Di sản UNESCO 2021',
    description: {
      vi: 'Lịch sử hơn 400 năm với nghệ thuật in khắc gỗ và pha chế màu tự nhiên từ lá cây, vỏ điệp, than tro.',
      en: 'Over 400 years of block-printing heritage with natural organic pigments.',
      sign: 'Tranh in khắc gỗ cổ truyền 400 năm.',
    },
    image:
      'https://images.unsplash.com/photo-1574614366831-900f959788c9?w=600&h=420&fit=crop&auto=format',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  {
    id: 'thanh-tien-paper-flower',
    title: {
      vi: 'Làng Hoa Giấy Thanh Tiên',
      en: 'Thanh Tien Paper Flower Village',
      sign: 'Hoa Giấy Thanh Tiên 🌸',
    },
    tag: 'Biểu tượng Tết Huế',
    description: {
      vi: 'Nghề làm hoa giấy thủ công tinh xảo, biểu tượng đón xuân và lòng hiếu kính tổ tiên của người dân xứ Huế.',
      en: 'Intricate handmade paper lotus and flowers, the timeless symbol of Tet in Hue.',
      sign: 'Nghệ thuật hoa giấy truyền thống Tết.',
    },
    image:
      'https://images.unsplash.com/photo-1578409682213-e27b3355cad7?w=600&h=420&fit=crop&auto=format',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'thuy-xuan-incense',
    title: {
      vi: 'Làng Hương Trầm Thủy Xuân',
      en: 'Thuy Xuan Incense Village',
      sign: 'Làng Hương Thủy Xuân 🌿',
    },
    tag: 'Sắc Màu Cố Đô',
    description: {
      vi: 'Con đường ngập tràn những bó hương xòe rộng như hoa đủ sắc màu rực rỡ dưới chân đồi Vọng Cảnh.',
      en: 'Vibrant bouquets of multicolored incense blooming like flower fields along the Perfume River.',
      sign: 'Bó hương thơm rực rỡ ngũ sắc.',
    },
    image:
      'https://images.unsplash.com/photo-1480742440191-ab4ea2aac8e7?w=600&h=420&fit=crop&auto=format',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'non-la-conical-hat',
    title: {
      vi: 'Làng Nón Lá Bài Thơ',
      en: 'Poem Conical Hat Village',
      sign: 'Nón Lá Bài Thơ 👒',
    },
    tag: 'Duyên Dáng Xứ Huế',
    description: {
      vi: 'Chiếc nón trắng tinh khôi soi bóng Tràng Tiền, khi rọi sáng sẽ thấy bài thơ và thắng cảnh xứ Huế ẩn hiện.',
      en: 'The iconic traditional conical hat hiding delicate poems and landmarks under the sunlight.',
      sign: 'Nón lá truyền thống soi bóng bài thơ.',
    },
    image:
      'https://images.unsplash.com/photo-1472087982327-49192446ed6b?w=600&h=420&fit=crop&auto=format',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
];

export default function LanguageSelection() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const currentLang = language || 'vi';

  const t = {
    vi: {
      eyebrow: 'Di sản Văn hóa Phi vật thể • Cố đô Huế',
      hero_title_1: 'Hành Trình Di Sản',
      hero_title_2: '& Khám Phá 360°',
      hero_subtitle:
        'Cổng thông tin văn hóa số đưa bạn khám phá 8 làng nghề truyền thống hơn 400 năm lịch sử và dạo bước thực tế ảo sống động qua từng góc phố Cố đô Huế.',
      cta_street_view: 'Dạo Bước 360° Street View',
      cta_explore_villages: 'Khám Phá Làng Nghề',
      preview_badge: 'Trải Nghiệm Mới',
      preview_title: 'Chế Độ Xem Phố 360° Độc Bản',
      preview_desc:
        'Di chuyển tới lui, xoay toàn cảnh 360 độ, khám phá hiện vật và bản đồ mini tương tác thời gian thực.',
      try_street_view: 'Khám phá ngay',
      stat_villages: '8 Làng nghề',
      stat_villages_desc: 'Di sản 400+ năm',
      stat_street_view: 'Xem Phố 360°',
      stat_street_view_desc: 'Hình ảnh sắc nét HD',
      stat_interactive: '100% Tương tác',
      stat_interactive_desc: 'Tự tay làm nghề ảo',
      stat_rewards: 'Quà lưu niệm',
      stat_rewards_desc: 'Đổi voucher du lịch',
      section_villages_title: 'Tuyến Làng Nghề Nổi Bật',
      section_villages_subtitle:
        'Gặp gỡ các bậc nghệ nhân lão thành và tìm hiểu bí quyết thủ công ngàn năm',
      view_all_villages: 'Xem tất cả làng nghề',
      pillar_title: 'Trải Nghiệm Văn Hóa Khác Biệt',
      pillar_1_title: 'Tự Tay Làm Nghề Thủ Công',
      pillar_1_desc:
        'Tương tác mô phỏng từng công đoạn: tô màu tranh Sình, gấp hoa giấy, se hương trầm ngay trên màn hình.',
      pillar_2_title: 'Dạo Phố 360° Như Thực Địa',
      pillar_2_desc:
        'Hệ thống Street View giúp bạn lướt qua các ngõ phố Cố đô, xem radar camera và nhảy điểm trên bản đồ.',
      pillar_3_title: 'Hỏi Đáp & Nhận Quà Thật',
      pillar_3_desc:
        'Tham gia câu đố văn hóa sau mỗi làng nghề để nhận mã giảm giá lưu niệm, homestay và ẩm thực tại Huế.',
      footer_text:
        'Dự án số hóa Di sản Văn hóa phi vật thể Cố đô Huế • Bảo tồn & Phát huy truyền thống Việt Nam',
    },
    en: {
      eyebrow: 'UNESCO Intangible Cultural Heritage • Hue Ancient Capital',
      hero_title_1: 'Imperial Heritage',
      hero_title_2: '& 360° VR Journey',
      hero_subtitle:
        'Digital cultural gateway exploring 8 traditional craft villages with 400+ years of history and immersive 360° Street View through the ancient streets of Hue.',
      cta_street_view: 'Explore 360° Street View',
      cta_explore_villages: 'Discover Craft Villages',
      preview_badge: 'New Experience',
      preview_title: 'Immersive 360° Street View',
      preview_desc:
        'Walk forward and backward, pan 360 degrees, inspect hotspots and real-time interactive mini-map.',
      try_street_view: 'Launch 360 View',
      stat_villages: '8 Villages',
      stat_villages_desc: '400+ years history',
      stat_street_view: '360° Street View',
      stat_street_view_desc: 'Crystal HD panoramas',
      stat_interactive: '100% Interactive',
      stat_interactive_desc: 'Virtual crafting tools',
      stat_rewards: 'Travel Rewards',
      stat_rewards_desc: 'Real discounts & vouchers',
      section_villages_title: 'Featured Craft Villages',
      section_villages_subtitle:
        'Meet master artisans and uncover centuries of royal craft secrets',
      view_all_villages: 'View All Craft Villages',
      pillar_title: 'A Truly Immersive Cultural Journey',
      pillar_1_title: 'Hands-on Virtual Crafting',
      pillar_1_desc:
        'Simulate authentic crafting steps: block-printing Sinh paintings, folding paper lotuses, rolling incense.',
      pillar_2_title: 'Authentic 360° Street View',
      pillar_2_desc:
        'Walk down the cobblestone streets of Hue with dynamic camera vision cone and interactive waypoint pins.',
      pillar_3_title: 'Quizzes & Real Rewards',
      pillar_3_desc:
        'Complete cultural quizzes to earn vouchers for local homestays, boat trips, and dining in Hue.',
      footer_text:
        'Hue Cultural Heritage Digital Preservation Project • Preserving & Celebrating Vietnamese Tradition',
    },
    sign: {
      eyebrow: '🤟 Di sản Văn hóa Huế • Trực quan hóa',
      hero_title_1: 'Khám Phá Di Sản',
      hero_title_2: '& Bản Đồ 360°',
      hero_subtitle:
        'Hành trình trực quan số qua 8 làng nghề truyền thống và chế độ xem phố 360 độ trực quan, sinh động.',
      cta_street_view: '🧭 Bản Đồ 360° Street View',
      cta_explore_villages: '🏮 Xem Các Làng Nghề',
      preview_badge: 'Khám Phá Ngay',
      preview_title: 'Xem Phố 360° Trực Quan',
      preview_desc: 'Xem phố 360 độ, di chuyển tới lui và chạm vào các hiện vật làng nghề.',
      try_street_view: 'Mở bản đồ',
      stat_villages: '8 Làng Nghề',
      stat_villages_desc: 'Nghề cổ truyền',
      stat_street_view: 'Bản Đồ 360°',
      stat_street_view_desc: 'Ảnh góc rộng',
      stat_interactive: 'Thực Hành Ảo',
      stat_interactive_desc: 'Tự tay làm thử',
      stat_rewards: 'Phần Thưởng',
      stat_rewards_desc: 'Quà lưu niệm',
      section_villages_title: 'Làng Nghề Tiêu Biểu',
      section_villages_subtitle: 'Tìm hiểu những làng nghề danh tiếng nhất của Cố đô Huế',
      view_all_villages: 'Xem tất cả',
      pillar_title: 'Trải Nghiệm Nổi Bật',
      pillar_1_title: 'Thực Hành Nghề Thủ Công',
      pillar_1_desc: 'Tương tác vẽ tranh, làm hoa giấy và làm hương trực quan trên màn hình.',
      pillar_2_title: 'Xem Phố 360° Toàn Cảnh',
      pillar_2_desc: 'Dạo quanh các góc phố Huế bằng góc nhìn 360 độ bao quát.',
      pillar_3_title: 'Thử Thách Nhận Quà',
      pillar_3_desc: 'Trả lời câu hỏi trắc nghiệm để nhận quà tặng du lịch ý nghĩa.',
      footer_text: 'Dự án Di sản Văn hóa Huế • Trải nghiệm số thân thiện và dễ tiếp cận',
    },
  };

  const copy = t[currentLang];

  return (
    <div
      className="relative min-h-screen bg-[#0E0602] text-white selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ─── AMBIENT BACKGROUND WITH ROYAL TEXTURE ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background imagery with subtle dark overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1705823637026-92c0ef6d6222?w=1800&h=1000&fit=crop&auto=format')`,
          }}
        />
        {/* Radial Hue imperial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-600/15 via-red-950/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* ─── TOP NAVBAR (FIXED AT THE TOP WITH GLASSMORPHISM) ────────────────── */}
      <Navbar currentPage="landing" />

      {/* ─── MAIN HERO SECTION ─────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column: Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{copy.eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {copy.hero_title_1}
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                {copy.hero_title_2}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mb-8"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {copy.hero_subtitle}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              {/* Primary 360 Street View CTA */}
              <button
                onClick={() => router.push('/map')}
                className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 border border-amber-300/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <Compass className="w-5 h-5 text-stone-950 group-hover:rotate-45 transition-transform duration-300" />
                <span>{copy.cta_street_view}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Craft Villages Tour CTA */}
              <button
                onClick={() => router.push('/home')}
                className="px-6 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all hover:border-amber-400/60 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>{copy.cta_explore_villages}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Four Stats Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-6 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-bold text-amber-300">{copy.stat_villages}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{copy.stat_villages_desc}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-bold text-sky-300">{copy.stat_street_view}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{copy.stat_street_view_desc}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-bold text-emerald-300">{copy.stat_interactive}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{copy.stat_interactive_desc}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm font-bold text-rose-300">{copy.stat_rewards}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{copy.stat_rewards_desc}</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Column: Interactive 360 Feature Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Glowing background halo */}
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-500/40 via-red-600/30 to-amber-600/40 blur-xl opacity-70 animate-pulse" />

            <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 bg-stone-900/90 shadow-2xl backdrop-blur-xl group">
              {/* Card Preview Image with Panorama Aspect */}
              <div className="relative h-64 sm:h-72 overflow-hidden cursor-pointer" onClick={() => router.push('/map')}>
                <img
                  src="/panoramas/hue_walking_street_day.jpg"
                  alt="Phố đi bộ Huế 360"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                {/* Floating 360 Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>360° PHOTO SPHERE</span>
                </div>

                {/* Hotspot Indicators */}
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-bold shadow-lg animate-bounce">
                  <Sparkles className="w-3 h-3" />
                  <span>Gian Hàng Lồng Đèn</span>
                </div>

                <div className="absolute bottom-16 right-8 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-white/20 text-white text-[10px] font-bold shadow-lg">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>Cửa Ngõ Đại Nội</span>
                </div>

                {/* Play / Enter Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <div className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                    <Compass className="w-4 h-4" />
                    <span>Vào Dạo Phố 360° Ngay</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Content */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    {copy.preview_badge}
                  </span>
                  <span className="text-xs text-stone-400">Huế, Việt Nam</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {copy.preview_title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-5">
                  {copy.preview_desc}
                </p>

                <button
                  onClick={() => router.push('/map')}
                  className="w-full py-3 rounded-xl bg-stone-800 hover:bg-amber-600 text-white hover:text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-amber-400 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>{copy.try_street_view} →</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── FEATURED CRAFT VILLAGES SECTION ─────────────────────────────────── */}
        <section className="mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">
                <Scroll className="w-3.5 h-3.5" />
                <span>Di Sản Bách Nghệ</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {copy.section_villages_title}
              </h2>
              <p className="text-sm text-stone-400 mt-1 max-w-xl">
                {copy.section_villages_subtitle}
              </p>
            </div>

            <button
              onClick={() => router.push('/home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors shrink-0"
            >
              <span>{copy.view_all_villages}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Villages Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_VILLAGES.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                onClick={() => router.push(`/village/${v.id}`)}
                className="group relative rounded-2xl overflow-hidden border border-white/15 bg-stone-900/80 hover:border-amber-400/60 shadow-xl transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/60 cursor-pointer flex flex-col"
              >
                {/* Image header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.title[currentLang]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${v.badgeColor}`}
                  >
                    {v.tag}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                      {v.title[currentLang]}
                    </h3>
                    <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                      {v.description[currentLang]}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                    <span>Khám phá làng này</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 3 CORE EXPERIENCE PILLARS ──────────────────────────────────────── */}
        <section className="mt-28 py-12 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {copy.pillar_title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Sự kết hợp giữa công nghệ hiện đại và chiều sâu di sản Cố đô
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{copy.pillar_1_title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{copy.pillar_1_desc}</p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-sky-400/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{copy.pillar_2_title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{copy.pillar_2_desc}</p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{copy.pillar_3_title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{copy.pillar_3_desc}</p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── HERITAGE FOOTER ───────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wider uppercase">
                TOUR HUẾ • DI SẢN CỐ ĐÔ
              </p>
              <p className="text-[10px] text-stone-400">{copy.footer_text}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-300">
            <button
              onClick={() => router.push('/map')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Bản Đồ 360°</span>
            </button>
            <span>•</span>
            <button
              onClick={() => router.push('/home')}
              className="hover:text-amber-300 transition-colors"
            >
              8 Làng Nghề
            </button>
            <span>•</span>
            <button
              onClick={() => router.push('/rewards')}
              className="hover:text-amber-300 transition-colors"
            >
              Phần Thưởng
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
