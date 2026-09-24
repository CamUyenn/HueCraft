'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StreetViewNode, Hotspot } from './types';
import {
  ArrowLeft,
  Compass,
  Maximize2,
  Minimize2,
  RotateCw,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  Share2,
  MapPin,
  Sparkles,
  Layers,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

interface StreetViewControlsProps {
  currentNode: StreetViewNode;
  nodes: StreetViewNode[];
  cameraHeading: number;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onNavigate: (targetId: string) => void;
  onResetHeading: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectedHotspot: Hotspot | null;
  onCloseHotspot: () => void;
}

export default function StreetViewControls({
  currentNode,
  nodes,
  cameraHeading,
  autoRotate,
  onToggleAutoRotate,
  onNavigate,
  onResetHeading,
  onZoomIn,
  onZoomOut,
  selectedHotspot,
  onCloseHotspot,
}: StreetViewControlsProps) {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWaypoints, setShowWaypoints] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Share URL to clipboard
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      });
    }
  };

  const currentIndex = nodes.findIndex((n) => n.id === currentNode.id);
  const prevNode = currentIndex > 0 ? nodes[currentIndex - 1] : null;
  const nextNode = currentIndex < nodes.length - 1 ? nodes[currentIndex + 1] : null;

  return (
    <>
      {/* ─── TOP HEADER BAR (Google Street View Style) ─────────────────────────── */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Back button & Location Info */}
        <div className="flex items-center gap-2.5 pointer-events-auto max-w-[70%]">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-white text-xs font-semibold backdrop-blur-md border border-white/15 shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Quay về Trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Trang Chủ</span>
          </button>

          {/* Location Title Card */}
          <div className="px-3.5 py-1.5 md:py-2 rounded-xl bg-stone-900/85 backdrop-blur-md border border-white/15 shadow-xl text-white min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <h1 className="text-xs md:text-sm font-bold text-white tracking-wide truncate">
                {currentNode.title}
              </h1>
            </div>
            <p className="text-[10px] md:text-[11px] text-amber-200/80 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentNode.address}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Waypoints Drawer Toggle */}
          <button
            onClick={() => setShowWaypoints(!showWaypoints)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all shadow-xl ${
              showWaypoints
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                : 'bg-stone-900/85 text-white hover:bg-stone-800 border-white/15'
            }`}
            title="Xem danh sách 3 điểm phố"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3 Điểm Phố</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 md:p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-white/90 hover:text-white border border-white/15 backdrop-blur-md shadow-xl transition-all"
            title="Chia sẻ liên kết"
          >
            {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`p-2 md:p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-xl ${
              autoRotate
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                : 'bg-stone-900/85 text-white/90 hover:text-white hover:bg-stone-800 border-white/15'
            }`}
            title={autoRotate ? 'Tắt tự động xoay' : 'Bật tự động xoay'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 md:p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-white/90 hover:text-white border border-white/15 backdrop-blur-md shadow-xl transition-all"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Help Modal Toggle */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 md:p-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-white/90 hover:text-white border border-white/15 backdrop-blur-md shadow-xl transition-all"
            title="Hướng dẫn điều khiển"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── TOAST NOTIFICATION ──────────────────────────────────────────────── */}
      {copiedToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-2xl border border-emerald-400 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Đã sao chép liên kết chia sẻ vào khay nhớ tạm!</span>
        </div>
      )}

      {/* ─── WAYPOINT GALLERY DRAWER ─────────────────────────────────────────── */}
      {showWaypoints && (
        <div className="absolute top-20 right-4 z-40 w-72 md:w-80 rounded-2xl bg-stone-900/95 border border-white/20 shadow-2xl p-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Tuyến Phố Tham Quan 360°
            </h3>
            <button
              onClick={() => setShowWaypoints(false)}
              className="p-1 text-stone-400 hover:text-white rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {nodes.map((node, index) => {
              const isCurrent = node.id === currentNode.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    onNavigate(node.id);
                    setShowWaypoints(false);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400 shadow-md scale-[1.01]'
                      : 'bg-stone-800/60 border-white/10 hover:border-white/30 hover:bg-stone-800'
                  }`}
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-stone-950">
                    <img
                      src={node.thumbnail}
                      alt={node.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[9px] font-bold text-white">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{node.title.split(':')[0]}</p>
                      {isCurrent && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold uppercase shrink-0">
                          Đang xem
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-300 truncate mt-0.5">
                      {node.title.split(':')[1] || node.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── BOTTOM-CENTER NAVIGATION STEPPER ─────────────────────────────────── */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-white/15 shadow-2xl pointer-events-auto">
          {/* Previous Node Button */}
          <button
            onClick={() => prevNode && onNavigate(prevNode.id)}
            disabled={!prevNode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              prevNode
                ? 'bg-stone-800 hover:bg-amber-600 text-white shadow-md active:scale-95'
                : 'bg-stone-800/40 text-stone-500 cursor-not-allowed'
            }`}
            title="Quay lại điểm trước (Phím S hoặc ↓)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Điểm trước</span>
          </button>

          {/* Waypoints Indicators */}
          <div className="flex items-center gap-1.5 px-2">
            {nodes.map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className={`transition-all rounded-full ${
                  n.id === currentNode.id
                    ? 'w-6 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-stone-600 hover:bg-stone-400'
                }`}
                title={n.title}
              />
            ))}
          </div>

          {/* Next Node Button */}
          <button
            onClick={() => nextNode && onNavigate(nextNode.id)}
            disabled={!nextNode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              nextNode
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md active:scale-95'
                : 'bg-stone-800/40 text-stone-500 cursor-not-allowed'
            }`}
            title="Tiến sang điểm kế tiếp (Phím W hoặc ↑)"
          >
            <span className="hidden sm:inline">Điểm kế tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── BOTTOM-RIGHT CONTROLS (COMPASS & ZOOM) ────────────────────────────── */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2.5 pointer-events-none">
        {/* Zoom In & Zoom Out Buttons (Google Maps Style) */}
        <div className="flex flex-col rounded-xl bg-stone-900/85 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden pointer-events-auto">
          <button
            onClick={onZoomIn}
            className="p-2.5 hover:bg-white/10 text-white border-b border-white/10 active:scale-95 transition-all"
            title="Phóng to (hoặc cuộn chuột lên, phím +)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2.5 hover:bg-white/10 text-white active:scale-95 transition-all"
            title="Thu nhỏ (hoặc cuộn chuột xuống, phím -)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Google Compass Needle */}
        <button
          onClick={onResetHeading}
          className="relative w-11 h-11 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center pointer-events-auto hover:scale-105 active:scale-95 transition-all group"
          title="Bấm để xoay về hướng Bắc (0°)"
        >
          {/* Rotating Compass dial */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{ transform: `rotate(${-cameraHeading}deg)` }}
          >
            {/* Red North needle */}
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[13px] border-b-rose-500 absolute top-1.5" />
            {/* White South needle */}
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[13px] border-t-stone-400 absolute bottom-1.5" />
            <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
          </div>
          <span className="absolute -top-1.5 text-[9px] font-bold text-rose-400 group-hover:scale-110 transition-transform">
            N
          </span>
        </button>
      </div>

      {/* ─── HOTSPOT DETAIL MODAL / DRAWER ───────────────────────────────────── */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900/95 border border-amber-400/40 shadow-2xl p-6 text-white backdrop-blur-xl animate-scaleUp">
            {/* Close button */}
            <button
              onClick={onCloseHotspot}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge & Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Khám Phá Di Sản & Làng Nghề
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-amber-100 mb-2">
              {selectedHotspot.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-stone-300 leading-relaxed mb-6">
              {selectedHotspot.description}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              {selectedHotspot.villageId ? (
                <button
                  onClick={() => router.push(`/village/${selectedHotspot.villageId}`)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Trải nghiệm làm nghề này</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={onCloseHotspot}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── HELP MODAL ──────────────────────────────────────────────────────── */}
      {showHelp && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-stone-900/95 border border-white/20 shadow-2xl p-6 text-white backdrop-blur-xl">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Hướng Dẫn Xem Phố 360° (Street View)
              </h2>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-lg">🖱️</span>
                <div>
                  <h4 className="font-semibold text-white">Xoay góc nhìn 360°</h4>
                  <p className="mt-0.5">Nhấn giữ chuột trái và kéo (hoặc vuốt tay trên điện thoại) để nhìn toàn cảnh xung quanh.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-lg">🔍</span>
                <div>
                  <h4 className="font-semibold text-white">Phóng to / Thu nhỏ</h4>
                  <p className="mt-0.5">Cuộn con lăn chuột, bấm nút `+ / -` ở góc dưới phải, hoặc nhấn đúp chuột vào màn hình.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-lg">⌨️</span>
                <div>
                  <h4 className="font-semibold text-white">Phím tắt bàn phím</h4>
                  <p className="mt-0.5">Dùng phím `W / S` hoặc `Mũi tên Lên / Xuống` để tiến/lùi. Phím `A / D` để quay trái/phải.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-lg">🚶</span>
                <div>
                  <h4 className="font-semibold text-white">Di chuyển tới / lui</h4>
                  <p className="mt-0.5">Click vào các vòng tròn mũi tên dưới mặt đường hoặc thanh điều khiển bên dưới để bước tới điểm tiếp theo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-lg">🗺️</span>
                <div>
                  <h4 className="font-semibold text-white">Bản đồ mini tương tác</h4>
                  <p className="mt-0.5">Bản đồ góc trái hiển thị vị trí và nón quét camera thực tế. Click vào bất kỳ điểm dừng nào trên bản đồ để nhảy đến đó.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all"
            >
              Đã hiểu, bắt đầu khám phá
            </button>
          </div>
        </div>
      )}
    </>
  );
}
