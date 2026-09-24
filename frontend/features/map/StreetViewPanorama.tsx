'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { StreetViewNode, NavigationLink, Hotspot } from './types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Info, Flame, Landmark, Ship } from 'lucide-react';

interface ProjectedItem {
  id: string;
  type: 'link' | 'hotspot';
  data: NavigationLink | Hotspot;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

interface StreetViewPanoramaProps {
  node: StreetViewNode;
  onNavigate: (targetId: string) => void;
  onSelectHotspot: (hotspot: Hotspot) => void;
  onHeadingChange?: (headingDeg: number) => void;
  autoRotate?: boolean;
  zoomLevel?: number;
}

export default function StreetViewPanorama({
  node,
  onNavigate,
  onSelectHotspot,
  onHeadingChange,
  autoRotate = false,
  zoomLevel = 0,
}: StreetViewPanoramaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projectedItems, setProjectedItems] = useState<ProjectedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWarping, setIsWarping] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  // Angles & Motion
  const currentYawRef = useRef(node.initialYaw);
  const currentPitchRef = useRef(node.initialPitch);
  const targetYawRef = useRef(node.initialYaw);
  const targetPitchRef = useRef(node.initialPitch);
  const currentFovRef = useRef(75);
  const targetFovRef = useRef(75);

  // Interaction tracking
  const isPointerDownRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const yawStartRef = useRef(0);
  const pitchStartRef = useRef(0);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Keep node ref up to date
  const nodeRef = useRef(node);
  nodeRef.current = node;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1500);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Inverted Sphere for 360 Panorama
    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1); // Invert geometry so inside is visible
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff, // Pure white to preserve full texture brightness
    });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    textureLoaderRef.current = new THREE.TextureLoader();

    // 5. Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Load / update texture whenever `node.image` changes
  useEffect(() => {
    if (!sphereMeshRef.current || !textureLoaderRef.current) return;

    setIsLoading(true);
    setIsWarping(true);

    // Animate target fov slightly to give a forward warp feel
    targetFovRef.current = 65;

    const loader = textureLoaderRef.current;
    loader.load(
      node.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.map = texture;
          mat.color.setHex(0xffffff);
          mat.needsUpdate = true;
        }

        setIsLoading(false);
        // Reset FOV smoothly back to 75
        setTimeout(() => {
          targetFovRef.current = 75;
          setIsWarping(false);
        }, 300);
      },
      undefined,
      (error) => {
        console.error('Failed to load 360 panorama texture:', error);
        setIsLoading(false);
        setIsWarping(false);
      }
    );

    // Reset heading / pitch to node's initial if specified
    targetYawRef.current = node.initialYaw;
    targetPitchRef.current = node.initialPitch;
  }, [node.image, node.initialYaw, node.initialPitch]);

  // Main Render & Projection Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const container = containerRef.current;

      if (camera && renderer && scene && container) {
        // Auto-rotation when not interacting
        if (autoRotate && !isPointerDownRef.current) {
          targetYawRef.current += 10 * delta;
        }

        // Apply momentum inertia when released
        if (!isPointerDownRef.current) {
          targetYawRef.current += velocityRef.current.x;
          targetPitchRef.current += velocityRef.current.y;
          velocityRef.current.x *= 0.9;
          velocityRef.current.y *= 0.9;
        }

        // Clamp target pitch
        targetPitchRef.current = Math.max(-85, Math.min(85, targetPitchRef.current));

        // Smooth interpolate angles (damping lerp)
        currentYawRef.current += (targetYawRef.current - currentYawRef.current) * 0.15;
        currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * 0.15;
        currentFovRef.current += (targetFovRef.current - currentFovRef.current) * 0.15;

        camera.fov = currentFovRef.current;
        camera.updateProjectionMatrix();

        // Calculate spherical look-at vector
        const phi = THREE.MathUtils.degToRad(90 - currentPitchRef.current);
        const theta = THREE.MathUtils.degToRad(currentYawRef.current);

        const lookTarget = new THREE.Vector3(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta)
        );

        camera.lookAt(lookTarget);
        renderer.render(scene, camera);

        // Normalize heading to [0, 360) and report
        const normalizedHeading = ((currentYawRef.current % 360) + 360) % 360;
        if (onHeadingChange) {
          onHeadingChange(normalizedHeading);
        }

        // Project Hotspots & Navigation Links to 2D Screen Space
        const w = container.clientWidth;
        const h = container.clientHeight;
        const items: ProjectedItem[] = [];

        // Project links
        const currentNode = nodeRef.current;
        for (const link of currentNode.links) {
          const lPhi = THREE.MathUtils.degToRad(90 - link.pitch);
          const lTheta = THREE.MathUtils.degToRad(link.yaw);
          const pos = new THREE.Vector3(
            450 * Math.sin(lPhi) * Math.cos(lTheta),
            450 * Math.cos(lPhi),
            450 * Math.sin(lPhi) * Math.sin(lTheta)
          );

          pos.project(camera);

          const isVisible = pos.z < 1;
          const sx = (pos.x * 0.5 + 0.5) * w;
          const sy = (-(pos.y * 0.5) + 0.5) * h;

          items.push({
            id: `link-${link.targetId}`,
            type: 'link',
            data: link,
            x: sx,
            y: sy,
            visible: isVisible && sx >= -50 && sx <= w + 50 && sy >= -50 && sy <= h + 50,
            scale: Math.max(0.7, 1 - (link.pitch < -20 ? 0.2 : 0)),
          });
        }

        // Project hotspots
        for (const spot of currentNode.hotspots) {
          const sPhi = THREE.MathUtils.degToRad(90 - spot.pitch);
          const sTheta = THREE.MathUtils.degToRad(spot.yaw);
          const pos = new THREE.Vector3(
            480 * Math.sin(sPhi) * Math.cos(sTheta),
            480 * Math.cos(sPhi),
            480 * Math.sin(sPhi) * Math.sin(sTheta)
          );

          pos.project(camera);

          const isVisible = pos.z < 1;
          const sx = (pos.x * 0.5 + 0.5) * w;
          const sy = (-(pos.y * 0.5) + 0.5) * h;

          items.push({
            id: `spot-${spot.id}`,
            type: 'hotspot',
            data: spot,
            x: sx,
            y: sy,
            visible: isVisible && sx >= -50 && sx <= w + 50 && sy >= -50 && sy <= h + 50,
            scale: 1,
          });
        }

        setProjectedItems(items);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [autoRotate, onHeadingChange]);

  // Pointer & Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    yawStartRef.current = targetYawRef.current;
    pitchStartRef.current = targetPitchRef.current;
    velocityRef.current = { x: 0, y: 0 };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;

    const sensitivity = 0.15 * (currentFovRef.current / 75);

    targetYawRef.current = yawStartRef.current - dx * sensitivity;
    targetPitchRef.current = Math.max(-85, Math.min(85, pitchStartRef.current + dy * sensitivity));

    // Calculate instantaneous velocity for inertia
    const now = performance.now();
    const dt = Math.max(now - lastPointerRef.current.time, 1);
    velocityRef.current = {
      x: -((e.clientX - lastPointerRef.current.x) / dt) * 1.5 * sensitivity,
      y: ((e.clientY - lastPointerRef.current.y) / dt) * 1.5 * sensitivity,
    };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.05;
    targetFovRef.current = Math.max(35, Math.min(95, targetFovRef.current + zoomFactor));
  };

  // Step trigger with animation
  const handleTriggerLink = (link: NavigationLink) => {
    // Smooth forward warp
    targetFovRef.current = 50;
    setIsWarping(true);
    setTimeout(() => {
      onNavigate(link.targetId);
    }, 200);
  };

  // Helper icon selector for hotspots
  const renderHotspotIcon = (iconName?: string) => {
    switch (iconName) {
      case 'shopping-bag':
        return <ShoppingBag className="w-4 h-4 text-amber-300" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-yellow-300" />;
      case 'flame':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'landmark':
        return <Landmark className="w-4 h-4 text-emerald-300" />;
      case 'ship':
        return <Ship className="w-4 h-4 text-sky-300" />;
      default:
        return <Info className="w-4 h-4 text-blue-300" />;
    }
  };

  // Sync zoom level from parent controls
  useEffect(() => {
    if (zoomLevel !== undefined) {
      targetFovRef.current = Math.max(35, Math.min(95, 75 - zoomLevel * 12));
    }
  }, [zoomLevel]);

  // Keyboard controls for Street View navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetYawRef.current -= 6;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetYawRef.current += 6;
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        const fwd = nodeRef.current.links.find(
          (l) => l.direction === 'forward' || Math.abs(l.yaw - targetYawRef.current) < 60
        );
        if (fwd) handleTriggerLink(fwd);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        const bwd = nodeRef.current.links.find((l) => l.direction === 'backward');
        if (bwd) handleTriggerLink(bwd);
      } else if (e.key === '+' || e.key === '=') {
        targetFovRef.current = Math.max(35, targetFovRef.current - 8);
      } else if (e.key === '-' || e.key === '_') {
        targetFovRef.current = Math.min(95, targetFovRef.current + 8);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Double click to zoom in
  const handleDoubleClick = () => {
    targetFovRef.current = Math.max(35, targetFovRef.current - 15);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-stone-950"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* Loading & Warp transition overlay */}
      <div
        className={`absolute inset-0 bg-stone-950/80 backdrop-blur-sm pointer-events-none transition-opacity duration-500 flex flex-col items-center justify-center z-20 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-amber-100 font-medium tracking-wide">Đang tải toàn cảnh 360°...</p>
        </div>
      </div>

      {/* Warp blur effect during navigation */}
      <div
        className={`absolute inset-0 pointer-events-none bg-stone-900/30 backdrop-blur-[2px] transition-opacity duration-300 z-10 ${
          isWarping && !isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Projected Interactive Hotspots & Ground Navigation Chevrons */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {projectedItems.map((item) => {
          if (!item.visible) return null;

          // Render Navigation Ground Chevron (Google Street View Style)
          if (item.type === 'link') {
            const link = item.data as NavigationLink;
            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 group"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  transform: `translate(-50%, -50%) scale(${item.scale})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerLink(link);
                }}
              >
                {/* Google Street View Disc & Arrow */}
                <div className="relative flex flex-col items-center cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:-translate-y-2 mb-2 px-3 py-1.5 rounded-full bg-stone-900/90 text-white text-xs font-medium shadow-xl border border-white/20 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{link.label}</span>
                  </div>

                  {/* Ground Disc Ring */}
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center">
                    {/* Pulsing outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-ping opacity-30" />
                    {/* Middle glowing disc */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-amber-400/40 to-stone-900/80 border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-110 group-hover:border-white transition-all duration-300 backdrop-blur-sm" />
                    {/* Inner Chevron Arrow */}
                    <div className="relative z-10 text-white group-hover:text-amber-200 transition-colors">
                      {link.direction === 'backward' ? (
                        <ChevronDown className="w-8 h-8 animate-bounce" />
                      ) : link.direction === 'left' ? (
                        <ChevronLeft className="w-8 h-8" />
                      ) : link.direction === 'right' ? (
                        <ChevronRight className="w-8 h-8" />
                      ) : (
                        <ChevronUp className="w-8 h-8 animate-bounce" />
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1 tracking-wide">
                    {link.direction === 'backward' ? 'Bước lui' : 'Bước tới'}
                  </span>
                </div>
              </div>
            );
          }

          // Render Interactive Exploration Hotspot (Pin/Badge)
          if (item.type === 'hotspot') {
            const spot = item.data as Hotspot;
            return (
              <div
                key={item.id}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 group"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(spot);
                }}
              >
                <div className="relative flex items-center cursor-pointer">
                  {/* Pulsing aura ring */}
                  <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping opacity-75" />

                  {/* Hotspot Badge */}
                  <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-400/60 shadow-lg text-white group-hover:scale-105 group-hover:bg-amber-600 group-hover:border-amber-300 transition-all duration-200">
                    <div className="p-1 rounded-full bg-stone-800/80 border border-white/10">
                      {renderHotspotIcon(spot.icon)}
                    </div>
                    <span className="text-xs font-semibold max-w-[130px] truncate pr-1">
                      {spot.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
