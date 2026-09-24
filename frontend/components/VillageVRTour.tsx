"use client";

import React, { useState } from "react";
import { Pannellum } from "pannellum-react";
import { X } from "lucide-react";

type Scene = "vr0" | "vr1" | "vr2";

export default function VillageVRTour() {
    const [currentScene, setCurrentScene] = useState<Scene>("vr0");
    const [activeDetailImage, setActiveDetailImage] = useState<string | null>(null);

    const sceneImages = {
        vr0: "/tranhlangsinh-img/tranhlangsinh-vr0.jpg",
        vr1: "/tranhlangsinh-img/tranhlangsinh-vr1.png",
        vr2: "/tranhlangsinh-img/tranhlangsinh-vr2.png",
    };

    const renderScene = () => {
        switch (currentScene) {
            case "vr0":
                return (
                    <Pannellum
                        id="vr-scene-0"
                        width="100%"
                        height="100%"
                        image={sceneImages.vr0}
                        pitch={-5}
                        yaw={0}
                        hfov={130}
                        maxHfov={150}
                        minHfov={50}
                        autoLoad
                        compass={false}
                    >
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={-5}
                            yaw={5}
                            handleClick={() => setCurrentScene("vr1")}
                            cssClass="custom-hotspot-with-text hotspot-cong"
                        />
                    </Pannellum>
                );

            case "vr1":
                return (
                    <Pannellum
                        id="vr-scene-1"
                        width="100%"
                        height="100%"
                        image={sceneImages.vr1}
                        pitch={0}
                        yaw={0}
                        hfov={130}
                        maxHfov={150}
                        minHfov={50}
                        autoLoad
                        compass={false}
                    >
                        {/* Đã tinh chỉnh lại vị trí nút Vào xưởng theo ý bạn */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={-2}
                            yaw={35}
                            handleClick={() => setCurrentScene("vr2")}
                            cssClass="custom-hotspot-with-text hotspot-xuong"
                        />
                    </Pannellum>
                );

            case "vr2":
                return (
                    <Pannellum
                        id="vr-scene-2"
                        width="100%"
                        height="100%"
                        image={sceneImages.vr2}
                        pitch={0}
                        yaw={0}
                        hfov={130}
                        maxHfov={150}
                        minHfov={50}
                        autoLoad
                        compass={false}
                    >
                        {/* Xem chi tiết tranh */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={15}
                            yaw={60}
                            handleClick={() => setActiveDetailImage("/tranhlangsinh-img/tranhlangsinh-vr2.1.png")}
                            cssClass="custom-hotspot-with-text hotspot-tranh"
                        />

                        {/* Gỗ Điêu khắc (thay cho Mộc bản) */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={-20}
                            yaw={-40}
                            handleClick={() => setActiveDetailImage("/tranhlangsinh-img/tranhlangsinh-vr2.2.png")}
                            cssClass="custom-hotspot-with-text hotspot-woodcarving"
                        />

                        {/* Lịch 12 con giáp (thay cho Chứng nhận nghệ nhân) */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={10}
                            yaw={-10}
                            handleClick={() => setActiveDetailImage("/tranhlangsinh-img/tranhlangsinh-vr2.3.png")}
                            cssClass="custom-hotspot-with-text hotspot-zodiaccalendar"
                        />

                        {/* Bách Tuế Đồ (thay cho Lịch sử làng nghề) */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={5}
                            yaw={-25}
                            handleClick={() => setActiveDetailImage("/tranhlangsinh-img/tranhlangsinh-vr2.4.png")}
                            cssClass="custom-hotspot-with-text hotspot-centuriestexture"
                        />

                        {/* Quay lại sân */}
                        <Pannellum.Hotspot
                            type="custom"
                            pitch={0}
                            yaw={180}
                            handleClick={() => setCurrentScene("vr1")}
                            cssClass="custom-hotspot-with-text hotspot-quaylai"
                        />
                    </Pannellum>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            {renderScene()}

            {activeDetailImage && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="relative max-w-4xl w-full bg-stone-900 rounded-lg p-2 shadow-2xl border border-amber-500/30 animate-in zoom-in-95">
                        <button
                            onClick={() => setActiveDetailImage(null)}
                            className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg z-10"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={activeDetailImage}
                            alt="Chi tiết không gian"
                            className="w-full h-auto max-h-[75vh] object-contain rounded-md"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}