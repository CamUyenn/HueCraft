'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { villages } from '@/data/villages';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic'; // Đã thêm thư viện dynamic
import { motion } from 'motion/react';
import {
    Compass,
    Gift,
    CheckCircle2,
    PlayCircle,
    ChevronRight,
    Scroll,
    Award,
    Crown,
    Search,
    Sparkles,
    User,
    ExternalLink,
    HeartHandshake,
} from 'lucide-react';

// ĐÃ SỬA LỖI WINDOW IS NOT DEFINED BẰNG DYNAMIC IMPORT (TẮT SSR)
const VillageVRTour = dynamic(() => import('@/components/VillageVRTour'), {
    ssr: false
});

const VILLAGE_IMAGES: Record<string, string> = {
    'sinh-painting': '/tranhlangsinh-img/backroud-tranhlangsinh.png',
    'thanh-tien-paper-flower':
        'https://images.unsplash.com/photo-1578409682213-e27b3355cad7?w=800&h=500&fit=crop&auto=format',
    'thuy-xuan-incense':
        'https://images.unsplash.com/photo-1480742440191-ab4ea2aac8e7?w=800&h=500&fit=crop&auto=format',
    'non-la-conical-hat':
        'https://images.unsplash.com/photo-1472087982327-49192446ed6b?w=800&h=500&fit=crop&auto=format',
    'phap-lam-enamel':
        'https://images.unsplash.com/photo-1668184599395-14e6a15fadcb?w=800&h=500&fit=crop&auto=format',
    'phuoc-tich-pottery':
        'https://images.unsplash.com/photo-1760894192884-37a7037200ba?w=800&h=500&fit=crop&auto=format',
    'a-luoi-weaving':
        'https://images.unsplash.com/photo-1676294990266-f6283e77ee48?w=800&h=500&fit=crop&auto=format',
    'kim-long-woodwork':
        'https://images.unsplash.com/photo-1679108229360-8b6e996d9034?w=800&h=500&fit=crop&auto=format',
};

const VILLAGE_METADATA: Record<
    string,
    {
        category: 'unesco' | 'royal' | 'folk';
        heritageTag: { vi: string; en: string; sign: string };
        gradientFrom: string;
        gradientTo: string;
        badgeBorder: string;
    }
> = {
    'sinh-painting': {
        category: 'unesco',
        heritageTag: {
            vi: 'Di sản UNESCO 2021',
            en: 'UNESCO Heritage 2021',
            sign: 'UNESCO 2021 🎨',
        },
        gradientFrom: '#8B1A00',
        gradientTo: '#C05010',
        badgeBorder: '#F59E0B',
    },
    'thanh-tien-paper-flower': {
        category: 'folk',
        heritageTag: {
            vi: 'Biểu tượng Tết Xứ Huế',
            en: 'Tet Spring Cultural Icon',
            sign: 'Hoa Tết Xứ Huế 🌸',
        },
        gradientFrom: '#154A28',
        gradientTo: '#2D7D45',
        badgeBorder: '#34D399',
    },
    'thuy-xuan-incense': {
        category: 'folk',
        heritageTag: {
            vi: 'Sắc Màu Dưới Chân Vọng Cảnh',
            en: 'Vibrant Colors of Vong Canh',
            sign: 'Sắc Màu Làng Hương 🌿',
        },
        gradientFrom: '#4A1D6B',
        gradientTo: '#7B2CBF',
        badgeBorder: '#C084FC',
    },
    'non-la-conical-hat': {
        category: 'folk',
        heritageTag: {
            vi: 'Nét Duyên Nón Bài Thơ',
            en: 'Grace of Poem Conical Hat',
            sign: 'Nón Lá Bài Thơ 👒',
        },
        gradientFrom: '#1E3A8A',
        gradientTo: '#2563EB',
        badgeBorder: '#60A5FA',
    },
    'phap-lam-enamel': {
        category: 'royal',
        heritageTag: {
            vi: 'Xưởng Hoàng Gia Triều Nguyễn',
            en: 'Nguyen Royal Workshop Art',
            sign: 'Pháp Lam Hoàng Gia 🏺',
        },
        gradientFrom: '#0B2559',
        gradientTo: '#1D4ED8',
        badgeBorder: '#FBBF24',
    },
    'phuoc-tich-pottery': {
        category: 'unesco',
        heritageTag: {
            vi: 'Làng Cổ 500 Năm Tuổi',
            en: '500-Year Ancient Village',
            sign: 'Làng Cổ 500 Năm 🏺',
        },
        gradientFrom: '#78350F',
        gradientTo: '#B45309',
        badgeBorder: '#F59E0B',
    },
    'a-luoi-weaving': {
        category: 'unesco',
        heritageTag: {
            vi: 'UNESCO Cần Bảo Vệ Khẩn Cấp',
            en: 'UNESCO Urgent Safeguarding',
            sign: 'UNESCO Dệt Zèng 🧵',
        },
        gradientFrom: '#14532D',
        gradientTo: '#15803D',
        badgeBorder: '#4ADE80',
    },
    'kim-long-woodwork': {
        category: 'royal',
        heritageTag: {
            vi: 'Nội Thất Cung Đình Triều Nguyễn',
            en: 'Royal Court Woodcraft Heritage',
            sign: 'Mộc Cung Đình 🪵',
        },
        gradientFrom: '#451A03',
        gradientTo: '#92400E',
        badgeBorder: '#F59E0B',
    },
};

export default function Home() {
    const router = useRouter();
    const { language } = useLanguage();
    const { villageProgress, getCompletedVillagesCount, unlockedRewards } = useProgress();

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'unesco' | 'royal' | 'folk'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeVR, setActiveVR] = useState<string | null>(null);

    const currentLang = language || 'vi';
    const completedCount = getCompletedVillagesCount();
    const unlockedCount = Object.keys(unlockedRewards).filter((k) => unlockedRewards[k]).length;
    const pct = Math.round((completedCount / villages.length) * 100);

    const getRankInfo = () => {
        if (completedCount === 8) {
            return {
                title: { vi: 'Đại Sứ Di Sản Cố Đô', en: 'Hue Heritage Ambassador', sign: 'Đại Sứ Di Sản 👑' },
                desc: { vi: 'Bạn đã hoàn thành trọn vẹn cả 8 làng nghề! Toàn bộ kho báu ưu đãi hoàng gia đã mở khóa.', en: 'You have completed all 8 craft villages! All royal rewards are unlocked.', sign: 'Đã hoàn thành 8 làng nghề! 👑' },
                icon: Crown,
            };
        }
        if (completedCount >= 5) {
            return {
                title: { vi: 'Nghệ Nhân Tập Sự', en: 'Junior Craftsman', sign: 'Nghệ Nhân Tập Sự 📜' },
                desc: { vi: `Đã thành thạo ${completedCount}/8 nghề truyền thống. Tiếp tục khám phá để đạt danh hiệu Đại Sứ!`, en: `Mastered ${completedCount}/8 crafts. Keep exploring to become an Ambassador!`, sign: `Đạt ${completedCount}/8 nghề 📜` },
                icon: Award,
            };
        }
        if (completedCount >= 3) {
            return {
                title: { vi: 'Thợ Học Việc Cố Đô', en: 'Royal Apprentice', sign: 'Thợ Học Việc ⚒️' },
                desc: { vi: `Đã hoàn thành ${completedCount}/8 làng nghề. Nhiều ưu đãi ẩm thực và homestay đã sẵn sàng.`, en: `Completed ${completedCount}/8 villages. Food and homestay rewards await.`, sign: `Hoàn thành ${completedCount}/8 ⚒️` },
                icon: Sparkles,
            };
        }
        return {
            title: { vi: 'Khách Thập Phương', en: 'Curious Traveler', sign: 'Khách Thập Phương 🧭' },
            desc: { vi: 'Bắt đầu hành trình qua từng làng nghề, hoàn thành bài tập thực hành để nhận huy hiệu và voucher!', en: 'Begin your journey across the craft villages, complete mini-crafts to earn badges and vouchers!', sign: 'Bắt đầu hành trình khám phá 🧭' },
            icon: Compass,
        };
    };

    const rank = getRankInfo();
    const RankIcon = rank.icon;

    const filteredVillages = useMemo(() => {
        return villages.filter((v) => {
            const meta = VILLAGE_METADATA[v.id];
            const matchesCategory = selectedCategory === 'all' ? true : meta?.category === selectedCategory;
            const q = searchQuery.toLowerCase().trim();
            const langKey = currentLang === 'sign' ? 'vi' : currentLang;
            const name = v.name[langKey]?.toLowerCase() || '';
            const desc = v.description[langKey]?.toLowerCase() || '';
            const artisanName = v.artisan.name?.toLowerCase() || '';
            const matchesSearch = q === '' || name.includes(q) || desc.includes(q) || artisanName.includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, currentLang]);

    const t = {
        vi: {
            eyebrow: 'Bản Đồ Hành Trình Di Sản Cố Đô Huế',
            title: 'Khám Phá 8 Làng Nghề Truyền Thống',
            subtitle: 'Hành trình tương tác số qua hơn 400 năm vàng son xứ Huế. Trực tiếp thực hành tay nghề, trò chuyện cùng các nghệ nhân và mở khóa kho báu voucher hoàng gia.',
            btn_map: 'Dạo Bước 360° Street View',
            btn_rewards: 'Kho Báu Voucher',
            progress_label: 'Tiến độ khám phá di sản',
            completed_count: 'đã hoàn thành',
            tab_all: 'Tất cả (8)',
            tab_unesco: 'Di sản UNESCO',
            tab_royal: 'Xưởng Hoàng Cung',
            tab_folk: 'Dân Gian Xứ Huế',
            search_placeholder: 'Tìm tên làng nghề, nghệ nhân hoặc sản phẩm...',
            btn_start: 'Bắt đầu làm nghề',
            btn_revisit: 'Xem lại làng nghề',
            btn_detail: 'Tìm hiểu lịch sử & nghệ nhân',
            activity_done: 'Đã thực hành',
            completed_badge: 'Đã Hoàn Thành',
            quote_title: 'Tiếng Lòng Người Giữ Lửa Di Sản',
            quote_artisan: 'Nghệ nhân Phan Thị Tuyết • 45 năm gắn bó với Hoa giấy Thanh Tiên',
            quote_content: '“Làm hoa giấy cần cả tâm và khéo. Từng cánh hoa là một lời chúc cho gia chủ. Khi nhà ai đó đặt hoa Thanh Tiên trên bàn thờ đón Tết, tôi cảm thấy nghề của mình có ý nghĩa thiêng liêng lắm. Chúng tôi gìn giữ nghề không chỉ để sống, mà để linh hồn của Huế không bao giờ phai nhạt.”',
        },
        en: {
            eyebrow: 'Imperial Hue Heritage Journey Map',
            title: 'Explore 8 Traditional Craft Villages',
            subtitle: 'A digital interactive voyage through 400 years of Hue craftmanship. Practice ancestral techniques, listen to master artisans, and unlock exclusive local rewards.',
            btn_map: 'Walk in 360° Street View',
            btn_rewards: 'Royal Voucher Treasury',
            progress_label: 'Heritage Exploration Progress',
            completed_count: 'completed',
            tab_all: 'All (8)',
            tab_unesco: 'UNESCO Heritage',
            tab_royal: 'Royal Court Crafts',
            tab_folk: 'Folk Traditions',
            search_placeholder: 'Search village, master artisan, or craft...',
            btn_start: 'Begin Craft Experience',
            btn_revisit: 'Revisit Village',
            btn_detail: 'View History & Master Artisan',
            activity_done: 'Practiced',
            completed_badge: 'Completed',
            quote_title: 'Wisdom of Heritage Keepers',
            quote_artisan: 'Master Artisan Phan Thi Tuyet • 45 years devoted to Thanh Tien Paper Flowers',
            quote_content: '“Making paper flowers requires both heart and dedication. Each petal is a blessing for the household. When someone places our flowers on their altar for Tet, I feel our craft has a sacred purpose. We preserve this art so that the soul of Hue never fades away.”',
        },
        sign: {
            eyebrow: 'Bản Đồ 8 Làng Nghề Cố Đô 🏘️',
            title: 'Khám Phá 8 Làng Nghề Huế',
            subtitle: 'Thực hành các nghề thủ công truyền thống qua thực tế ảo, học cùng nghệ nhân và nhận phần thưởng quà tặng!',
            btn_map: 'Xem 360° VR 🧭',
            btn_rewards: 'Xem Phần Thưởng 🎁',
            progress_label: 'Tiến độ hành trình 📊',
            completed_count: 'đã hoàn thành ✅',
            tab_all: 'Tất cả (8)',
            tab_unesco: 'UNESCO 🏆',
            tab_royal: 'Hoàng Cung 👑',
            tab_folk: 'Dân Gian 🌸',
            search_placeholder: 'Tìm kiếm làng nghề...',
            btn_start: 'Bắt đầu làm nghề ▶️',
            btn_revisit: 'Xem lại 🔄',
            btn_detail: 'Xem lịch sử 📜',
            activity_done: 'Đã làm xong ✅',
            completed_badge: 'Đã hoàn thành ✅',
            quote_title: 'Lời nhắn gửi từ Nghệ nhân',
            quote_artisan: 'Nghệ nhân Phan Thị Tuyết • Hoa giấy Thanh Tiên',
            quote_content: '“Làm hoa giấy cần cả tâm và khéo. Từng cánh hoa là một lời chúc may mắn cho gia chủ khi đón Tết xứ Huế.”',
        },
    };

    const copy = t[currentLang];
    const langKey = currentLang === 'sign' ? 'vi' : currentLang;

    return (
        <div
            className="relative min-h-screen bg-[#0E0602] text-white selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
            <Navbar currentPage="home" />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity scale-105"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1705823637026-92c0ef6d6222?w=1800&h=1000&fit=crop&auto=format')` }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-amber-600/15 via-red-950/20 to-transparent blur-3xl" />
                <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24">
                {/* HERO HEADER */}
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#1C0902] via-[#2A0F05] to-[#120602] p-6 sm:p-10 lg:p-12 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C07A25 0, #C07A25 1px, transparent 0, transparent 40%)`, backgroundSize: '16px 16px' }} />
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-7 flex flex-col items-start">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>{copy.eyebrow}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {copy.title}
                            </h1>
                            <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl" style={{ fontFamily: "'Lora', serif" }}>
                                {copy.subtitle}
                            </p>
                            <div className="flex items-center gap-3.5 flex-wrap">
                                <button onClick={() => router.push('/map')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                                    <Compass className="w-4 h-4 text-stone-950" />
                                    <span>{copy.btn_map}</span>
                                </button>
                                <button onClick={() => router.push('/rewards')} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-500/30 text-amber-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer">
                                    <Gift className="w-4 h-4 text-amber-400" />
                                    <span>{copy.btn_rewards}</span>
                                    {unlockedCount > 0 && <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950">{unlockedCount}/8</span>}
                                    <ChevronRight className="w-4 h-4 text-stone-400" />
                                </button>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-5">
                            <div className="rounded-2xl bg-stone-950/85 border border-amber-500/30 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
                                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
                                            <RankIcon className="w-6 h-6 text-stone-950" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-amber-300 uppercase tracking-widest font-semibold">Cấp Độ Người Chơi</div>
                                            <div className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>{rank.title[langKey]}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-amber-400">{pct}%</span>
                                        <div className="text-[10px] text-stone-400 uppercase tracking-wider">Hoàn thành</div>
                                    </div>
                                </div>
                                <p className="text-xs text-stone-300 leading-relaxed mb-5">{rank.desc[langKey]}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-stone-300">
                                        <span className="font-medium">{copy.progress_label}</span>
                                        <span className="text-amber-300 font-bold">{completedCount}/{villages.length} {copy.completed_count}</span>
                                    </div>
                                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 4)}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* TABS & SEARCH */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-950/90 border border-white/10 overflow-x-auto max-w-full">
                        {[{ key: 'all', label: copy.tab_all }, { key: 'unesco', label: copy.tab_unesco }, { key: 'royal', label: copy.tab_royal }, { key: 'folk', label: copy.tab_folk }].map((tab) => (
                            <button key={tab.key} onClick={() => setSelectedCategory(tab.key as any)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === tab.key ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={copy.search_placeholder} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950/90 border border-white/10 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-500/60 transition-all" />
                    </div>
                </div>

                {/* CARDS LIST */}
                {filteredVillages.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-stone-950/60 p-12 text-center my-8">
                        <Compass className="w-12 h-12 text-stone-500 mx-auto mb-4" />
                        <p className="text-stone-300 text-lg">Không tìm thấy làng nghề.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {filteredVillages.map((village, index) => {
                            const prog = villageProgress[village.id];
                            const isCompleted = prog?.completed || false;
                            const hasActivity = prog?.activityCompleted || false;
                            const meta = VILLAGE_METADATA[village.id] || VILLAGE_METADATA['sinh-painting'];
                            const imgUrl = VILLAGE_IMAGES[village.id] || village.image;

                            return (
                                <motion.div key={village.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.5 }} className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-stone-900/90 to-[#120703]/95 shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                                    <div className="relative h-52 overflow-hidden bg-stone-950">
                                        <img src={imgUrl} alt={village.name[langKey]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #120703 0%, ${meta.gradientFrom}70 50%, transparent 100%)` }} />
                                        <div className="absolute top-3.5 left-3.5">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-amber-200 border border-amber-500/40">{meta.heritageTag[langKey]}</span>
                                        </div>
                                        {isCompleted && (
                                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/50">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                                                <span>{copy.completed_badge}</span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <h2 className="text-xl font-bold text-white group-hover:text-amber-200" style={{ fontFamily: "'Playfair Display', serif" }}>{village.name[langKey]}</h2>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col p-5">
                                        <div className="flex items-center gap-2 text-xs text-amber-300/90 mb-3 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
                                            <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            <span className="font-semibold truncate">{village.artisan.name}</span>
                                        </div>
                                        <p className="text-stone-300 text-xs leading-relaxed mb-4 line-clamp-2 flex-1" style={{ fontFamily: "'Lora', serif" }}>
                                            {village.description[langKey]}
                                        </p>

                                        <div className="space-y-2 mt-auto">
                                            <button onClick={() => router.push(`/village/${village.id}`)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white shadow-md cursor-pointer" style={{ background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})` }}>
                                                <PlayCircle className="w-4 h-4" />
                                                <span>{isCompleted ? copy.btn_revisit : copy.btn_start}</span>
                                                <ChevronRight className="w-4 h-4 text-white/70" />
                                            </button>

                                            <button onClick={(e) => { e.stopPropagation(); setActiveVR(village.id); }} className="w-full py-2.5 bg-stone-900 text-amber-400 border border-amber-500/50 rounded-xl font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                                                <Compass className="w-4 h-4" />
                                                <span>Khám phá VR360</span>
                                            </button>

                                            <button onClick={() => router.push(`/village/${village.id}`)} className="w-full py-1.5 text-center text-[11px] text-stone-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                                                <span>{copy.btn_detail}</span>
                                                <ExternalLink className="w-3 h-3 text-stone-500" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ARTISAN WISDOM */}
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-[#170701] via-[#240A02] to-[#120501] p-8 sm:p-12 shadow-2xl">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/20">
                                <img src="https://images.unsplash.com/photo-1578409682213-e27b3355cad7?w=300&h=300&fit=crop&auto=format" alt="Nghệ nhân Phan Thị Tuyết" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-500 text-stone-950 shadow-md">
                                <HeartHandshake className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-xs text-amber-300 uppercase tracking-widest font-bold mb-2">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>{copy.quote_title}</span>
                            </div>
                            <p className="text-stone-200 text-base sm:text-lg italic leading-relaxed mb-4" style={{ fontFamily: "'Lora', serif" }}>{copy.quote_content}</p>
                            <div className="text-amber-400 font-bold text-sm tracking-wide">{copy.quote_artisan}</div>
                        </div>
                    </div>
                </div>

                {/* CỬA SỔ POPUP VR360 */}
                {activeVR && (
                    <div className="fixed inset-0 z-[9999] bg-black w-screen h-screen flex items-center justify-center">
                        <button onClick={() => setActiveVR(null)} className="absolute top-6 right-6 bg-red-600/80 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 z-50 backdrop-blur-sm cursor-pointer">
                            Đóng X
                        </button>
                        <div className="w-full h-full">
                            <VillageVRTour />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}