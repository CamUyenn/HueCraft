'use client';

import React, { useState, useCallback } from 'react';
import { STREET_VIEW_NODES } from './data';
import { Hotspot } from './types';
import StreetViewPanorama from './StreetViewPanorama';
import StreetViewMiniMap from './StreetViewMiniMap';
import StreetViewControls from './StreetViewControls';

export default function StreetViewMapPage() {
  const [currentNodeId, setCurrentNodeId] = useState<string>('node-1');
  const [cameraHeading, setCameraHeading] = useState<number>(15);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(0);

  const currentNode =
    STREET_VIEW_NODES.find((n) => n.id === currentNodeId) || STREET_VIEW_NODES[0];

  const handleNavigate = useCallback((targetId: string) => {
    setCurrentNodeId(targetId);
  }, []);

  const handleHeadingChange = useCallback((heading: number) => {
    setCameraHeading(heading);
  }, []);

  const handleResetHeading = useCallback(() => {
    setCameraHeading(0);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 1, -2));
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-stone-950 select-none">
      {/* 360 Panorama View Canvas */}
      <StreetViewPanorama
        node={currentNode}
        onNavigate={handleNavigate}
        onSelectHotspot={setSelectedHotspot}
        onHeadingChange={handleHeadingChange}
        autoRotate={autoRotate}
        zoomLevel={zoomLevel}
      />

      {/* Street View UI Overlays & Controls */}
      <StreetViewControls
        currentNode={currentNode}
        nodes={STREET_VIEW_NODES}
        cameraHeading={cameraHeading}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onNavigate={handleNavigate}
        onResetHeading={handleResetHeading}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        selectedHotspot={selectedHotspot}
        onCloseHotspot={() => setSelectedHotspot(null)}
      />

      {/* Google Maps Style Mini-Map (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">
        <StreetViewMiniMap
          nodes={STREET_VIEW_NODES}
          currentNodeId={currentNodeId}
          cameraHeading={cameraHeading}
          onSelectNode={handleNavigate}
        />
      </div>
    </main>
  );
}
