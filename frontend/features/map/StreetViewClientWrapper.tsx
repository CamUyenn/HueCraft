'use client';

import dynamic from 'next/dynamic';

const StreetViewMapPage = dynamic(
  () => import('./StreetViewMapPage'),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-stone-950 text-white">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-amber-200 text-sm font-medium tracking-wide">
          Đang khởi tạo chế độ xem phố 360° Cố đô Huế...
        </p>
      </div>
    ),
  }
);

export default function StreetViewClientWrapper() {
  return <StreetViewMapPage />;
}
