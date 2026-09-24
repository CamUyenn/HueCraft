'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useProgress } from "@/context/ProgressContext";
import { villages } from "@/data/villages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hand, X, BookOpen, Workflow, Palette, CheckCircle2, MessageCircle, Volume2, VolumeX, CalendarDays, Clock3, Users, ChevronRight, SquareCheckBig } from "lucide-react";
import { motion } from "framer-motion";
import PaintingActivity from "@/features/activities/PaintingActivity";
import SequencingActivity from "@/features/activities/SequencingActivity";
import IncenseActivity from "@/features/activities/IncenseActivity";
import CraftingActivity from "@/features/activities/CraftingActivity";
import EnamelActivity from "@/features/activities/EnamelActivity";
import PotteryActivity from "@/features/activities/PotteryActivity";
import WeavingActivity from "@/features/activities/WeavingActivity";
import WoodworkActivity from "@/features/activities/WoodworkActivity";

type LangKey = "vi" | "en";

interface SceneConfig {
    bgStyle: React.CSSProperties;
    clothingColor: string;
    isFemale: boolean;
    greeting: Record<LangKey, string>;
    signGreeting: string;
    particles: string[];
}

const round = (value: number) => Math.round(value);

const SCENES: Record<string, SceneConfig> = {
    "sinh-painting": {
        bgStyle: { background: "linear-gradient(180deg, #120600 0%, #5A1500 45%, #B03008 80%, #D05010 100%)" },
        clothingColor: "#7A1800",
        isFemale: false,
        greeting: {
            vi: "Xin chào! Tôi là nghệ nhân Lê Văn Sửu — 72 tuổi, hơn 50 năm gắn bó với tranh dân gian Sình. Mỗi nét vẽ, mỗi màu sắc đều mang tâm hồn của người nghệ nhân. Tranh Sình không chỉ là hình vẽ mà còn là câu chuyện văn hóa ngàn năm của cha ông để lại.",
            en: "Hello! I am artisan Le Van Suu — 72 years old, devoted over 50 years to Sinh folk painting. Each stroke and colour carries the craftsman's soul. Sinh paintings are not mere images — they are thousand-year cultural stories from our ancestors.",
        },
        signGreeting: "👋 Xin chào!\n🎨 Nghệ nhân Lê Văn Sửu\n👴 72 tuổi • 50+ năm nghề\n🖌️ Tranh dân gian Sình\n📜 Di sản UNESCO 2021",
        particles: ["🖌️", "📜", "✨", "🔴", "🖌️"],
    },
    "thanh-tien-paper-flower": {
        bgStyle: { background: "linear-gradient(180deg, #050F0A 0%, #0F3D20 45%, #2A7A40 80%, #4AAA65 100%)" },
        clothingColor: "#1A5A2A",
        isFemale: true,
        greeting: {
            vi: "Chào mừng đến làng Thanh Tiên! Tôi là nghệ nhân Phan Thị Tuyết — thế hệ thứ năm làm hoa giấy. Mỗi cánh hoa được tạo hình từ đôi bàn tay khéo léo, mang đến niềm vui và may mắn cho mọi nhà mỗi dịp Tết đến xuân về.",
            en: "Welcome to Thanh Tien village! I am artisan Phan Thi Tuyet — 5th generation paper flower maker. Each petal shaped by skilled hands brings joy and luck to every home at Tet.",
        },
        signGreeting: "👋 Chào mừng!\n🌸 Phan Thị Tuyết\n👵 65 tuổi • Thế hệ thứ 5\n🌺 Hoa giấy Thanh Tiên\n🎊 Biểu tượng Tết Huế",
        particles: ["🌸", "🌺", "🌷", "🌸", "✿"],
    },
    "thuy-xuan-incense": {
        bgStyle: { background: "linear-gradient(180deg, #060410 0%, #12093A 45%, #2A1868 80%, #3D2880 100%)" },
        clothingColor: "#1E2A7A",
        isFemale: false,
        greeting: {
            vi: "Xin chào! Tôi là nghệ nhân Nguyễn Văn Hải — 58 tuổi, kế thừa nghề từ ông nội. Mùi hương Thủy Xuân không chỉ là hương thơm mà là sự thanh tịnh, kết nối con người với tâm linh. Mỗi cây hương chứa đựng tâm huyết và tình yêu với nghề truyền thống.",
            en: "Hello! I am artisan Nguyen Van Hai — 58 years old, inheriting the craft from my grandfather. Thuy Xuan incense is not just fragrance — it is purity, connecting people with spirituality. Each stick holds dedication and love for our traditional craft.",
        },
        signGreeting: "👋 Xin chào!\n🕯️ Nguyễn Văn Hải\n👨 58 tuổi • Kế thừa ông nội\n🌿 Hương thảo mộc tự nhiên\n🏛️ Dùng trong đình chùa",
        particles: ["✨", "💜", "🌫️", "⭐", "🌿"],
    },
    "non-la-conical-hat": {
        bgStyle: { background: "linear-gradient(180deg, #040D1A 0%, #0F2F60 45%, #2060A0 80%, #3A88C8 100%)" },
        clothingColor: "#4A3820",
        isFemale: true,
        greeting: {
            vi: "Kính chào! Tôi là nghệ nhân Trần Thị Mai — 68 tuổi, cả đời gắn bó với nghề nón lá. Mỗi chiếc nón bài thơ là một tác phẩm nghệ thuật. Khi ánh nắng chiếu qua, những vần thơ ẩn hiện như lời ru của đất trời Huế.",
            en: "Greetings! I am artisan Tran Thi Mai — 68 years old, devoted a lifetime to hat making. Each poem hat is a work of art. When sunlight shines through, verses shimmer like lullabies from Hue's ancient land and sky.",
        },
        signGreeting: "🙏 Kính chào!\n👒 Trần Thị Mai\n👵 68 tuổi • Cả đời nghề\n🌿 Nón bài thơ truyền thống\n☀️ Thơ hiện khi soi nắng",
        particles: ["🍃", "🌿", "🎋", "🍃", "☀️"],
    },
    "phap-lam-enamel": {
        bgStyle: { background: "linear-gradient(180deg, #080520 0%, #0E1060 45%, #1A1AB0 80%, #2830D0 100%)" },
        clothingColor: "#1A108A",
        isFemale: true,
        greeting: {
            vi: "Xin chào! Tôi là nghệ nhân Nguyễn Thị Kim Hoa — 60 tuổi, thế hệ thứ ba của gia đình làm pháp lam tại Huế. Sau khi nung trong lò ở nhiệt độ hơn 800 độ, màu men mới hiện ra đúng sắc — đó là khoảnh khắc kỳ diệu nhất trong nghề. Mỗi tác phẩm pháp lam là sự kết hợp giữa lửa, kim loại và nghệ thuật.",
            en: "Hello! I am artisan Nguyen Thi Kim Hoa — 60 years old, third generation phap lam family in Hue. After firing at over 800 degrees, the enamel colors finally reveal their true shade — that is the most magical moment in this craft. Each phap lam piece is the union of fire, metal, and art.",
        },
        signGreeting: "👋 Xin chào!\n✨ Nguyễn Thị Kim Hoa\n👩 60 tuổi • Thế hệ thứ 3\n🎨 Nghề pháp lam triều Nguyễn\n🔥 Nung 800°C để màu hiện",
        particles: ["✨", "💎", "🔵", "⭐", "💙"],
    },
    "phuoc-tich-pottery": {
        bgStyle: { background: "linear-gradient(180deg, #1A0A04 0%, #5A2A10 45%, #8B4818 80%, #B06030 100%)" },
        clothingColor: "#7A3A18",
        isFemale: false,
        greeting: {
            vi: "Xin chào! Tôi là nghệ nhân Hoàng Tấn Đức — 65 tuổi, thế hệ thứ 15 làm gốm tại làng Phước Tích. Khi tôi đặt tay lên khối đất xoay, tôi cảm nhận được sự kết nối với 14 thế hệ trước. Đất sét Phước Tích có hồn — mỗi chiếc lu gốm là cuộc đối thoại giữa đôi tay, đất và lửa.",
            en: "Hello! I am artisan Hoang Tan Duc — 65 years old, 15th generation potter at Phuoc Tich village. When I place my hands on the spinning clay, I feel connected to 14 previous generations. Phuoc Tich clay has a soul — each jar is a dialogue between hands, earth, and fire.",
        },
        signGreeting: "👋 Xin chào!\n🏺 Hoàng Tấn Đức\n👨 65 tuổi • Thế hệ thứ 15\n🏛️ Gốm cung đình Nguyễn\n🔥 Nung lò củi 1000°C",
        particles: ["🏺", "🌿", "🔥", "💧", "🟤"],
    },
    "a-luoi-weaving": {
        bgStyle: { background: "linear-gradient(180deg, #030A04 0%, #0A2A10 45%, #1A5A20 80%, #2A8030 100%)" },
        clothingColor: "#3A1A60",
        isFemale: true,
        greeting: {
            vi: "Chào bạn! Tôi là Kăn Noan — 55 tuổi, người Pa Kô làng Ra Lin, A Lưới. Tôi học dệt Zèng từ năm 15 tuổi trên chiếc khung cửi của bà nội. Mỗi tấm Zèng là bức thư gửi cho con cháu — hoa văn kể chuyện rừng núi, thần linh và lòng người phụ nữ Pa Kô.",
            en: "Hello! I am Kan Noan — 55 years old, Pa Ko woman from Ra Lin village, A Luoi. I learned Zeng weaving at age 15 on my grandmother's loom. Each Zeng cloth is a letter to our descendants — the patterns tell stories of mountains, deities, and the Pa Ko woman's heart.",
        },
        signGreeting: "👋 Chào bạn!\n🧵 Kăn Noan — Pa Kô\n👩 55 tuổi • 40 năm nghề\n🌿 Dệt Zèng UNESCO 2016\n🎨 30+ hoa văn cổ truyền",
        particles: ["🧵", "🌿", "🎨", "🦋", "🌺"],
    },
    "kim-long-woodwork": {
        bgStyle: { background: "linear-gradient(180deg, #0A0600 0%, #3A1A08 45%, #6A3010 80%, #A05020 100%)" },
        clothingColor: "#4A2808",
        isFemale: false,
        greeting: {
            vi: "Chào mừng đến làng mộc Kim Long! Tôi là nghệ nhân Trần Văn Lâm — 70 tuổi, Nghệ nhân Ưu tú quốc gia. Gỗ cũng có hồn như người. Người thợ giỏi phải lắng nghe hồn gỗ, hiểu thớ gỗ, rồi mới biết nên chạm khắc hình gì. Mỗi tác phẩm là cuộc đối thoại giữa người và gỗ.",
            en: "Welcome to Kim Long woodcarving village! I am artisan Tran Van Lam — 70 years old, National Excellent Artisan. Wood has a soul like people. A skilled craftsman must listen to the wood's soul, understand its grain, before knowing what to carve. Each piece is a dialogue between person and wood.",
        },
        signGreeting: "👋 Chào mừng!\n🪵 Trần Văn Lâm\n👴 70 tuổi • 52 năm nghề\n🏆 Nghệ nhân Ưu tú 2015\n🎨 Chạm khắc và sơn mài",
        particles: ["🪵", "✨", "🎨", "⭐", "🌿"],
    },
};

const ArtisanSVG = ({ villageId, clothingColor }: { villageId: string; clothingColor: string }) => {
    const skin = "#E8C09A";
    const hair = "#0D0400";
    const hat = "#D4B460";
    const hatStroke = "#8B6914";

    return (
        <svg viewBox="0 0 200 285" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            <ellipse cx="100" cy="282" rx="64" ry="10" fill="rgba(0,0,0,0.4)" />
            <path d="M40 226 Q22 265 68 274 L100 266 L132 274 Q178 265 160 226 Z" fill={clothingColor} />
            <ellipse cx="60" cy="275" rx="26" ry="10" fill="#160900" />
            <ellipse cx="140" cy="275" rx="26" ry="10" fill="#160900" />
            <path d="M46 150 L154 150 L168 234 L32 234 Z" fill={clothingColor} />
            <path d="M85 150 L100 175 L115 150" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
            <line x1="100" y1="175" x2="100" y2="234" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
            <path d="M50 166 Q25 200 22 237" stroke={clothingColor} strokeWidth="30" fill="none" strokeLinecap="round" />
            <ellipse cx="20" cy="240" rx="16" ry="13" fill={skin} />
            <path d="M150 166 Q175 200 178 237" stroke={clothingColor} strokeWidth="30" fill="none" strokeLinecap="round" />
            <ellipse cx="180" cy="240" rx="16" ry="13" fill={skin} />
            <rect x="85" y="135" width="30" height="22" rx="9" fill={skin} />
            <ellipse cx="100" cy="106" rx="38" ry="38" fill={hair} />
            <ellipse cx="100" cy="104" rx="32" ry="33" fill={skin} />
            <path d="M100 0 L4 88 L196 88 Z" fill={hat} />
            <ellipse cx="100" cy="88" rx="96" ry="16" fill="#B89A40" />
        </svg>
    );
};

const SceneBg = ({ villageId }: { villageId: string }) => {
    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-stone-900 to-stone-950" />
    );
};

const FloatingParticle = ({ emoji, index }: { emoji: string; index: number }) => {
    const left = 8 + (index * 71 + 13) % 84;
    const delay = (index * 0.7) % 3;
    const dur = 3 + (index % 3);
    return (
        <motion.div className="absolute text-xl pointer-events-none select-none"
                    style={{ left: `${left}%`, bottom: "15%" }}
                    animate={{ y: [0, -60 - index * 10, 0], opacity: [0.6, 1, 0], x: [0, (index % 2 === 0 ? 12 : -12), 0] }}
                    transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}>
            {emoji}
        </motion.div>
    );
};

export default function VillageTour() {
    const params = useParams<{ villageId?: string }>() ?? {};
    const villageId = Array.isArray(params.villageId) ? params.villageId[0] : params.villageId ?? "";
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const { completeActivity, villageProgress } = useProgress();

    const [showBubble, setShowBubble] = useState(false);
    const [artisanTapped, setArtisanTapped] = useState(false);
    const [activeTab, setActiveTab] = useState<"story" | "process" | "activity">("story");
    const [activityCompleted, setActivityCompleted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("09:00");
    const [bookingGuests, setBookingGuests] = useState(2);
    const [bookingNote, setBookingNote] = useState("");
    const [selectedWorkshopArtisans, setSelectedWorkshopArtisans] = useState<string[]>([]);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const village = villages.find((v) => v.id === villageId);
    const scene = SCENES[villageId] ?? SCENES["sinh-painting"];
    const lang: LangKey = language === "sign" ? "vi" : (language as LangKey);
    const isSign = language === "sign";

    if (!village) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Village not found</p></div>;
    }

    const isActivityDone = villageProgress[villageId]?.activityCompleted || activityCompleted;
    const workshopArtisans = village.workshopArtisans?.length ? village.workshopArtisans : [village.artisan];

    const handleArtisanClick = () => {
        setShowBubble((p) => !p);
        if (!artisanTapped) setArtisanTapped(true);
    };

    const handleActivityComplete = () => {
        setActivityCompleted(true);
        completeActivity(villageId);
    };

    const openBookingModal = () => {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 7);
        if (!bookingDate) setBookingDate(nextDate.toISOString().slice(0, 10));
        setBookingGuests(2);
        setBookingTime("09:00");
        setBookingNote("");
        setSelectedWorkshopArtisans([workshopArtisans[0].name]);
        setBookingConfirmed(false);
        setIsBookingOpen(true);
    };

    const toggleWorkshopArtisan = (artisanName: string) => {
        setSelectedWorkshopArtisans((current) => {
            if (current.includes(artisanName)) {
                if (current.length === 1) return current;
                return current.filter((name) => name !== artisanName);
            }
            return [...current, artisanName];
        });
    };

    const handleBookingSubmit = () => {
        if (!bookingDate || !bookingTime) return;
        setBookingConfirmed(true);
    };

    const handleSignToggle = () => {
        if (isSpeaking) { window.speechSynthesis?.cancel(); setIsSpeaking(false); }
        setLanguage(isSign ? "vi" : "sign");
        setShowBubble(false);
    };

    const handleSpeak = () => {
        if (!window.speechSynthesis) return;
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const text = isSign ? scene.signGreeting.replace(/\n/g, ". ") : scene.greeting[lang];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "en" ? "en-US" : "vi-VN";
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const renderActivity = () => {
        switch (village.activity.type) {
            case "painting": return <PaintingActivity onComplete={handleActivityComplete} />;
            case "sequencing": return <SequencingActivity steps={village.process.steps[lang]} onComplete={handleActivityComplete} />;
            case "incense": return <IncenseActivity onComplete={handleActivityComplete} />;
            case "crafting": return <CraftingActivity onComplete={handleActivityComplete} />;
            case "enamel": return <EnamelActivity onComplete={handleActivityComplete} />;
            case "pottery": return <PotteryActivity onComplete={handleActivityComplete} />;
            case "weaving": return <WeavingActivity onComplete={handleActivityComplete} />;
            case "woodwork": return <WoodworkActivity onComplete={handleActivityComplete} />;
            default: return null;
        }
    };

    const t = {
        vi: { back: "Quay lại", story: "Câu chuyện", process: "Quy trình", activity: "Hoạt động", workshop: "Đặt lịch workshop", workshopHint: "Chọn ngày, giờ và nghệ nhân để hẹn làm workshop", tap: "Chạm vào nghệ nhân để lắng nghe", signBtn: "Ký hiệu", quiz: "Làm bài kiểm tra", done: "Hoạt động hoàn thành!", quizHint: "Bạn đã sẵn sàng làm bài kiểm tra để nhận phần thưởng", artisan: "Nghệ nhân", speak: "Nghe", stop: "Dừng", confirmBooking: "Xác nhận lịch hẹn", cancelBooking: "Hủy", guestCount: "Số khách", note: "Ghi chú", selectedArtisans: "Chọn nghệ nhân", date: "Ngày", time: "Giờ", bookingSuccess: "Đã gửi yêu cầu đặt lịch", bookingSuccessHint: "Chúng tôi sẽ liên hệ để xác nhận workshop với các nghệ nhân bạn đã chọn.", singleArtisanNote: "Làng này hiện chỉ có 1 nghệ nhân trong dữ liệu mẫu." },
        en: { back: "Back", story: "Story", process: "Process", activity: "Activity", workshop: "Book workshop", workshopHint: "Choose a date, time, and artisan(s) for a craft workshop", tap: "Tap the artisan to listen", signBtn: "Sign", quiz: "Take Quiz", done: "Activity complete!", quizHint: "You are ready to take the quiz for your reward", artisan: "Master Artisan", speak: "Listen", stop: "Stop", confirmBooking: "Confirm booking", cancelBooking: "Cancel", guestCount: "Guests", note: "Note", selectedArtisans: "Select artisan(s)", date: "Date", time: "Time", bookingSuccess: "Booking request sent", bookingSuccessHint: "We will contact you to confirm the workshop with the artisan(s) you selected.", singleArtisanNote: "This village currently has only one artisan." },
        sign: { back: "⬅️", story: "📖 Câu chuyện", process: "⚙️ Quy trình", activity: "🎨 Hoạt động", workshop: "📅 Đặt lịch", workshopHint: "🗓️ Chọn ngày giờ và nghệ nhân", tap: "👆 Chạm nghệ nhân", signBtn: "🤟 ON", quiz: "📝 Kiểm tra", done: "✅ Xong!", quizHint: "📝 Làm bài kiểm tra", artisan: "👤 Nghệ nhân", speak: "🔊 Nghe", stop: "⏹ Dừng", confirmBooking: "✅ Xác nhận", cancelBooking: "Hủy", guestCount: "👥 Khách", note: "📝 Ghi chú", selectedArtisans: "👤 Nghệ nhân", date: "📅 Ngày", time: "⏰ Giờ", bookingSuccess: "✅ Đã gửi yêu cầu", bookingSuccessHint: "Chúng tôi sẽ liên hệ xác nhận workshop.", singleArtisanNote: "📌 Dữ liệu mẫu mới có 1 nghệ nhân." },
    };
    const copy = t[language];

    return (
        <div className="min-h-screen" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "var(--background)" }}>
            <header className="relative py-5 px-4 shadow-lg" style={{ background: "linear-gradient(135deg, #1A0800 0%, #5A1A00 60%, #8B3010 100%)" }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 gap-2" onClick={() => router.push("/home")}>
                        <ArrowLeft className="w-5 h-5" />
                        {copy.back}
                    </Button>
                    <div className="text-center">
                        <h1 className="text-xl md:text-2xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {village.name[lang]}
                        </h1>
                        <p className="text-amber-300/60 text-xs mt-0.5">{village.artisan.name} • {village.artisan.age} tuổi</p>
                    </div>
                    <button onClick={handleSignToggle}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isSign ? "bg-green-500 text-white border-green-400" : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"}`}>
                        <Hand className="w-4 h-4" />
                        <span className="hidden sm:inline">{isSign ? "🤟 ON" : copy.signBtn}</span>
                    </button>
                </div>
            </header>

            <div className="relative w-full overflow-hidden" style={{ height: "540px", ...scene.bgStyle }}>
                <SceneBg villageId={villageId} />
                {isSign && (
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 bg-green-900/60 backdrop-blur-sm z-20">
                        <span className="text-green-200 text-sm font-medium">🤟 Ngôn ngữ ký hiệu đang bật</span>
                    </div>
                )}
                <div className="absolute inset-0 pointer-events-none z-10">
                    {scene.particles.map((e, i) => <FloatingParticle key={i} emoji={e} index={i} />)}
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20" style={{ width: "180px", height: "280px" }}>
                    {showBubble && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }}
                                    className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl z-30 ${isSign ? "bg-gray-950 text-white border-2 border-green-500" : "bg-white text-gray-900"}`}
                                    style={{ minWidth: "270px", maxWidth: "310px" }}>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: scene.clothingColor }}>
                                        {village.artisan.name.split(" ").pop()?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold leading-tight">{village.artisan.name}</p>
                                        <p className="text-xs opacity-60">{copy.artisan} • {village.artisan.age} tuổi</p>
                                    </div>
                                    <button onClick={handleSpeak}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSpeaking ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setShowBubble(false); if (isSpeaking) { window.speechSynthesis?.cancel(); setIsSpeaking(false); } }}
                                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                        <X className="w-3.5 h-3.5 text-gray-600" />
                                    </button>
                                </div>
                                {isSign ? (
                                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-green-300">{scene.signGreeting}</pre>
                                ) : (
                                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{scene.greeting[lang]}</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <motion.div onClick={handleArtisanClick} className="cursor-pointer w-full h-full"
                                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        <ArtisanSVG villageId={villageId} clothingColor={scene.clothingColor} />
                    </motion.div>
                </div>

                {!artisanTapped && (
                    <motion.div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none"
                                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.8, repeat: Infinity }}>
                        <div className="flex items-center gap-2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                            <MessageCircle className="w-4 h-4 text-amber-400" />
                            {copy.tap}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-stretch">
                    <div className="flex flex-1 gap-1 bg-black/5 p-1 rounded-xl">
                        {(["story", "process", "activity"] as const).map((tab) => {
                            const icons = { story: BookOpen, process: Workflow, activity: Palette };
                            const labels = { story: copy.story, process: copy.process, activity: copy.activity };
                            const Icon = icons[tab];
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-white shadow text-amber-900" : "text-gray-500 hover:text-gray-800"}`}>
                                    <Icon className="w-4 h-4" />
                                    <span>{labels[tab]}</span>
                                    {tab === "activity" && isActivityDone && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </button>
                            );
                        })}
                    </div>
                    <button onClick={openBookingModal}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-900/15 bg-white px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md lg:min-w-[220px]">
                        <CalendarDays className="w-4 h-4" />
                        <span>{copy.workshop}</span>
                    </button>
                </div>

                {activeTab === "story" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <div className="rounded-2xl overflow-hidden mb-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `${scene.clothingColor}18` }}>
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                                     style={{ background: `linear-gradient(135deg, ${scene.clothingColor}, ${scene.clothingColor}99)` }}>
                                    {village.artisan.name.split(" ").pop()?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{village.artisan.name}</p>
                                    <p className="text-sm text-stone-600">{lang === "vi" ? `Nghệ nhân ưu tú • ${village.artisan.age} tuổi` : `Master Artisan • Age ${village.artisan.age}`}</p>
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-base leading-relaxed italic border-l-4 pl-4" style={{ fontFamily: "'Lora', serif", borderColor: scene.clothingColor }}>
                                    "{village.artisan.story[lang]}"
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {lang === "vi" ? "Lịch sử làng nghề" : "Village History"}
                            </h3>
                            <p className="text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Lora', serif" }}>{village.history[lang]}</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === "process" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <div className="rounded-2xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{village.process.title[lang]}</h3>
                            <div className="space-y-4">
                                {village.process.steps[lang].map((step, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                                className="flex items-start gap-4 p-4 rounded-xl" style={{ background: `${scene.clothingColor}12`, border: `1px solid ${scene.clothingColor}25` }}>
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: scene.clothingColor }}>{i + 1}</div>
                                        <p className="text-base pt-1 leading-snug" style={{ fontFamily: "'Lora', serif" }}>{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "activity" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <div className="rounded-2xl p-6 border mb-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{village.activity.title[lang]}</h3>
                            <p className="mb-6 text-stone-600" style={{ fontFamily: "'Lora', serif" }}>{village.activity.description[lang]}</p>
                            {renderActivity()}
                        </div>
                        {isActivityDone && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl p-6 border-2 border-green-500 bg-green-50">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    <div>
                                        <h4 className="text-lg font-bold text-green-900">{copy.done}</h4>
                                        <p className="text-green-700 text-sm">{copy.quizHint}</p>
                                    </div>
                                </div>
                                <Button onClick={() => router.push(`/quiz/${villageId}`)} className="w-full py-6 text-white font-semibold rounded-xl"
                                        style={{ background: "linear-gradient(135deg, #1A7A30, #2AAA50)" }}>
                                    {copy.quiz} →
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>

            {isBookingOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                                className="w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FBF5E8] shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-amber-900/10 bg-gradient-to-r from-amber-100 to-orange-50 px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Workshop</p>
                                <h3 className="text-2xl font-bold text-amber-950">{copy.workshop}</h3>
                                <p className="mt-1 text-sm text-amber-800/80">{copy.workshopHint}</p>
                            </div>
                            <button onClick={() => setIsBookingOpen(false)} className="rounded-full bg-white/80 p-2 text-amber-900 transition-colors hover:bg-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-sm text-amber-900">{copy.singleArtisanNote}</p>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setIsBookingOpen(false)} className="rounded-2xl border border-amber-900/15 px-5 py-3 text-sm font-semibold text-amber-950">
                                        {copy.cancelBooking}
                                    </button>
                                    <Button onClick={() => setBookingConfirmed(true)} className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                                            style={{ background: "linear-gradient(135deg, #8B1A00, #C07A25)" }}>
                                        {copy.confirmBooking}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}