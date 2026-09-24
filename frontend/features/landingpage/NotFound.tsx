'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🏘️</div>
        <h1 className="text-6xl font-bold text-amber-900 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-2">
          Không tìm thấy trang / Page not found
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Làng nghề bạn tìm kiếm không tồn tại / The village you're looking for doesn't exist
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white gap-2"
            size="lg"
          >
            <Home className="w-5 h-5" />
            Về trang chủ / Go Home
          </Button>
          <Button
            onClick={() => router.push("/home")}
            variant="outline"
            className="gap-2"
            size="lg"
          >
            <MapPin className="w-5 h-5" />
            Khám phá làng nghề / Explore Villages
          </Button>
        </div>
      </div>
    </div>
  );
}
