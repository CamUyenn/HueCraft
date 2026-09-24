'use client';

import React, { useState } from 'react';
import { StreetViewNode } from './types';
import { Maximize2, Minimize2, MapPin, Navigation, Eye, Compass, Layers } from 'lucide-react';

interface StreetViewMiniMapProps {
  nodes: StreetViewNode[];
  currentNodeId: string;
  cameraHeading: number; // in degrees [0, 360)
  onSelectNode: (nodeId: string) => void;
}

export default function StreetViewMiniMap({
  nodes,
  currentNodeId,
  cameraHeading,
  onSelectNode,
}: StreetViewMiniMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const currentNode = nodes.find((n) => n.id === currentNodeId) || nodes[0];

  // SVG dimensions
  const mapWidth = 500;
  const mapHeight = 350;

  // Convert percentage coords to SVG pixels
  const getCoords = (node: StreetViewNode) => ({
    x: (node.mapCoords.x / 100) * mapWidth,
    y: (node.mapCoords.y / 100) * mapHeight,
  });

  const activePos = getCoords(currentNode);

  // Calculate radar cone path for SVG
  const radarLength = 45;
  const fovDegrees = 65;
  const leftAngleRad = ((cameraHeading - fovDegrees / 2 - 90) * Math.PI) / 180;
  const rightAngleRad = ((cameraHeading + fovDegrees / 2 - 90) * Math.PI) / 180;

  const f = (n: number) => Math.round(n * 10) / 10;
  const leftX = activePos.x + radarLength * Math.cos(leftAngleRad);
  const leftY = activePos.y + radarLength * Math.sin(leftAngleRad);
  const rightX = activePos.x + radarLength * Math.cos(rightAngleRad);
  const rightY = activePos.y + radarLength * Math.sin(rightAngleRad);

  const radarPath = `M ${f(activePos.x)} ${f(activePos.y)} L ${f(leftX)} ${f(leftY)} A ${radarLength} ${radarLength} 0 0 1 ${f(rightX)} ${f(rightY)} Z`;

  return (
    <div
      className={`relative transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-stone-900/90 backdrop-blur-md ${
        isExpanded
          ? 'w-[300px] sm:w-[380px] md:w-[480px] h-[240px] sm:h-[300px] md:h-[380px]'
          : 'w-[190px] sm:w-[230px] md:w-[280px] h-[135px] sm:h-[160px] md:h-[190px]'
      }`}
    >
      {/* Mini-map Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-white drop-shadow">
            BẢN ĐỒ CỐ ĐÔ HUẾ
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-white/90 hover:text-white transition-colors border border-white/10"
          title={isExpanded ? 'Thu nhỏ bản đồ' : 'Phóng to bản đồ'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Styled Interactive SVG Map */}
      <div className="w-full h-full relative cursor-crosshair">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* River Gradient */}
            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Radar Vision Cone Gradient */}
            <radialGradient id="radarGrad" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </radialGradient>

            {/* Path Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Land */}
          <rect width="100%" height="100%" fill="#1c1917" />

          {/* City blocks & parks */}
          <rect x="20" y="20" width="160" height="90" rx="8" fill="#292524" />
          <rect x="210" y="30" width="130" height="80" rx="8" fill="#1e293b" />
          <rect x="360" y="40" width="120" height="110" rx="8" fill="#292524" />

          <rect x="30" y="220" width="180" height="100" rx="8" fill="#292524" />
          <rect x="240" y="230" width="230" height="90" rx="8" fill="#292524" />

          {/* Imperial Citadel Moat & Wall schematic (Khu Đại Nội Huế) */}
          <rect
            x="330"
            y="25"
            width="140"
            height="90"
            rx="4"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeDasharray="6 3"
            opacity="0.75"
          />
          <text x="345" y="45" fill="#f59e0b" fontSize="10" fontWeight="bold" opacity="0.8">
            ĐẠI NỘI HUẾ
          </text>

          {/* Sông Hương (Perfume River) flowing across map */}
          <path
            d="M -10 170 C 120 150, 200 190, 310 160 C 400 135, 450 170, 510 155 L 510 215 C 450 225, 380 195, 300 215 C 190 240, 100 200, -10 220 Z"
            fill="url(#riverGradient)"
            opacity="0.85"
          />
          <text
            x="140"
            y="185"
            fill="#e0f2fe"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            opacity="0.7"
          >
            SÔNG HƯƠNG
          </text>

          {/* Bridges across Sông Hương */}
          {/* Cầu Phú Xuân */}
          <line
            x1="220"
            y1="165"
            x2="235"
            y2="225"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <text x="210" y="158" fill="#cbd5e1" fontSize="8">
            Cầu Phú Xuân
          </text>

          {/* Cầu Tràng Tiền */}
          <line
            x1="390"
            y1="140"
            x2="400"
            y2="200"
            stroke="#e2e8f0"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <text x="380" y="132" fill="#cbd5e1" fontSize="8">
            Cầu Tràng Tiền
          </text>

          {/* Road Network (Đường Lê Lợi, Phố đi bộ) */}
          <path
            d="M 20 220 L 480 220"
            stroke="#44403c"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text x="50" y="240" fill="#78716c" fontSize="9">
            Đường Lê Lợi
          </text>

          {/* Connecting Walk Route Line (Route connecting nodes) */}
          <path
            d={`M ${getCoords(nodes[0]).x} ${getCoords(nodes[0]).y} L ${getCoords(nodes[1]).x} ${getCoords(nodes[1]).y} L ${getCoords(nodes[2]).x} ${getCoords(nodes[2]).y}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="6 4"
            className="animate-pulse"
            filter="url(#glow)"
          />

          {/* Dynamic Radar Vision Cone (Google Maps Style) */}
          <path
            d={radarPath}
            fill="url(#radarGrad)"
            className="transition-all duration-75 pointer-events-none"
          />

          {/* Waypoint Markers */}
          {nodes.map((node, index) => {
            const pos = getCoords(node);
            const isActive = node.id === currentNodeId;
            const isHovered = node.id === hoveredNodeId;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200 group"
                onClick={() => onSelectNode(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Outer halo when active or hovered */}
                {isActive && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="14"
                    fill="#38bdf8"
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Base Pin Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 8 : 6}
                  fill={isActive ? '#0284c7' : isHovered ? '#f59e0b' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className="shadow-md transition-all duration-200"
                />

                {/* Pin Index Number */}
                <text
                  x={pos.x}
                  y={pos.y + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}

          {/* Active User Position Beacon (Blue Dot) */}
          <circle
            cx={activePos.x}
            cy={activePos.y}
            r="4.5"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="2"
            pointerEvents="none"
          />
        </svg>

        {/* Hovered Waypoint Tooltip preview */}
        {hoveredNodeId && (
          <div
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 left-1/2 bottom-12 px-2.5 py-1.5 rounded-lg bg-stone-900/95 text-white text-xs border border-white/20 shadow-xl backdrop-blur-md max-w-[200px]"
          >
            <p className="font-semibold text-amber-300 truncate">
              {nodes.find((n) => n.id === hoveredNodeId)?.title}
            </p>
            <p className="text-[10px] text-stone-300">Click để di chuyển đến đây</p>
          </div>
        )}
      </div>

      {/* Mini-map Footer / Legend */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-[10px] text-stone-300">
        <div className="flex items-center gap-1.5 truncate">
          <Navigation
            className="w-3 h-3 text-sky-400 transition-transform duration-75"
            style={{ transform: `rotate(${cameraHeading}deg)` }}
          />
          <span className="truncate font-medium text-white">
            {currentNode.title.split(':')[0]}
          </span>
        </div>
        <span className="text-sky-400 font-mono text-[9px] shrink-0">
          {Math.round(cameraHeading)}°
        </span>
      </div>
    </div>
  );
}
