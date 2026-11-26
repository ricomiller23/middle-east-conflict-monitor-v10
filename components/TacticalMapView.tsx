'use client';

import { MiddleEastVectorMap } from './MiddleEastVectorMap';

import React, { useState } from 'react';
import { SecurityEvent } from '@/lib/types';
import { MapPin, Shield, Crosshair, ZoomIn, ZoomOut, Compass, ExternalLink, Fuel, Anchor, Flame } from 'lucide-react';

interface TacticalMapViewProps {
  events: SecurityEvent[];
  onSelect: (event: SecurityEvent) => void;
}

export const TacticalMapView: React.FC<TacticalMapViewProps> = ({ events, onSelect }) => {
  const [selectedPin, setSelectedPin] = useState<SecurityEvent | null>(null);
  const [activeTheater, setActiveTheater] = useState<'all' | 'yemen' | 'saudi' | 'iran' | 'energy'>('all');

  // Geographic bounds of the region:
  // Lat: 10°N to 40°N
  // Lng: 34°E to 64°E
  const MIN_LAT = 10;
  const MAX_LAT = 40;
  const MIN_LNG = 33;
  const MAX_LNG = 65;

  const projectToMap = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return { x: 50, y: 50 };
    // Invert lat for SVG Y (high lat = lower Y)
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const getPinColor = (category: string) => {
    switch (category) {
      case 'tanker_attack': return '#e11d48'; // crimson rose
      case 'refinery_disruption': return '#f97316'; // orange flame
      case 'pipeline_infrastructure': return '#10b981'; // emerald pipeline
      case 'energy_market': return '#f59e0b'; // amber oil
      case 'strike': return '#ef4444'; // red
      case 'military': return '#38bdf8'; // sky-400
      case 'diplomatic': return '#34d399'; // green
      case 'statement': return '#fbbf24'; // yellow
      default: return '#94a3b8';
    }
  };

  const getPinIcon = (category: string) => {
    switch (category) {
      case 'tanker_attack': return '🚢';
      case 'pipeline_infrastructure': return '⚡';
      case 'refinery_disruption': return '⛽';
      case 'energy_market': return '🛢️';
      case 'strike': return '🎯';
      default: return null;
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (activeTheater === 'all') return true;
    if (activeTheater === 'yemen') return ev.country === 'Yemen';
    if (activeTheater === 'saudi') return ev.country === 'Saudi Arabia';
    if (activeTheater === 'iran') return ev.country === 'Iran';
    if (activeTheater === 'energy') {
      return (
        ev.category === 'tanker_attack' ||
        ev.category === 'pipeline_infrastructure' ||
        ev.category === 'refinery_disruption' ||
        ev.category === 'energy_market'
      );
    }
    return true;
  });

  return (
    <div className="relative rounded-xl border border-slate-800 bg-[#F8FAFC] overflow-hidden shadow-2xl">
      {/* Top Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 bg-[#0c1322]/95 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur z-10 relative gap-2">
        <div className="flex items-center space-x-2">
          <Crosshair className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          <span className="font-mono text-xs font-bold text-slate-200 truncate">
            THEATER & ENERGY RADAR
          </span>
          <span className="rounded bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] text-cyan-400 border border-cyan-500/30 flex-shrink-0">
            {filteredEvents.length} PINS
          </span>
        </div>

        {/* Quick Theater Selectors (Swipeable on Mobile) */}
        <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-1.5 font-mono text-xs -mx-3 px-3 sm:mx-0 sm:px-0 py-0.5">
          <button
            onClick={() => setActiveTheater('all')}
            className={`flex-shrink-0 min-h-[32px] rounded-lg px-2.5 py-1 transition active:scale-95 ${
              activeTheater === 'all'
                ? 'bg-cyan-600 text-white font-semibold shadow'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Theaters
          </button>
          <button
            onClick={() => setActiveTheater('energy')}
            className={`flex-shrink-0 min-h-[32px] rounded-lg px-2.5 py-1 transition active:scale-95 ${
              activeTheater === 'energy'
                ? 'bg-amber-600 text-white font-semibold shadow'
                : 'bg-slate-800/90 text-amber-400 hover:bg-slate-700'
            }`}
          >
            🛢️ Energy & Tankers
          </button>
          <button
            onClick={() => setActiveTheater('yemen')}
            className={`flex-shrink-0 min-h-[32px] rounded-lg px-2.5 py-1 transition active:scale-95 ${
              activeTheater === 'yemen'
                ? 'bg-amber-700 text-white font-semibold shadow'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇾🇪 Yemen
          </button>
          <button
            onClick={() => setActiveTheater('saudi')}
            className={`flex-shrink-0 min-h-[32px] rounded-lg px-2.5 py-1 transition active:scale-95 ${
              activeTheater === 'saudi'
                ? 'bg-emerald-600 text-white font-semibold shadow'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇸🇦 Saudi
          </button>
          <button
            onClick={() => setActiveTheater('iran')}
            className={`flex-shrink-0 min-h-[32px] rounded-lg px-2.5 py-1 transition active:scale-95 ${
              activeTheater === 'iran'
                ? 'bg-rose-600 text-white font-semibold shadow'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🇮🇷 Iran
          </button>
        </div>
      </div>

      {/* SVG Tactical Map Surface */}
      <div className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] bg-[#F8FAFC] select-none touch-pan-x touch-pan-y">
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <MiddleEastVectorMap />
        </svg>

        {/* Dynamic Incident Pins with Mobile Touch Targets */}
        {filteredEvents.map((ev) => {
          const pos = projectToMap(ev.lat, ev.lng);
          const color = getPinColor(ev.category);
          const icon = getPinIcon(ev.category);
          const isSelected = selectedPin?.id === ev.id;
          const isTanker = ev.category === 'tanker_attack';

          return (
            <div
              key={ev.id}
              onClick={() => {
                setSelectedPin(ev);
                onSelect(ev);
              }}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-110 transition-transform"
            >
              {/* Pulsing ring for strikes/tanker attacks */}
              <div
                style={{ borderColor: color }}
                className={`absolute inset-1 rounded-full border opacity-75 pointer-events-none ${
                  isTanker ? 'animate-ping' : 'animate-pulse_slow'
                }`}
              />

              {/* Pin Head */}
              <div
                style={{ backgroundColor: color }}
                className={`flex h-6 w-6 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-[#080c14] shadow-lg transition-transform group-hover:scale-125 text-xs ${
                  isSelected ? 'ring-4 ring-cyan-400 scale-125' : ''
                }`}
              >
                {icon ? (
                  <span className="text-[11px] leading-none">{icon}</span>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Tooltip on hover (Desktop) */}
              <div className="hidden sm:block pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950/95 px-2.5 py-1.5 text-[11px] text-slate-100 opacity-0 border border-slate-700 shadow-xl transition-opacity group-hover:opacity-100 z-30 font-mono">
                <div className="font-bold text-cyan-400">
                  {ev.category.toUpperCase().replace('_', ' ')} • {ev.country}
                </div>
                {ev.vessel_name && (
                  <div className="text-rose-300 font-bold text-[10px]">
                    🚢 Vessel: {ev.vessel_name}
                  </div>
                )}
                {ev.barrel_risk_estimate && (
                  <div className="text-amber-300 text-[10px]">
                    🛢️ {ev.barrel_risk_estimate}
                  </div>
                )}
                <div className="truncate max-w-[220px] text-slate-300 font-sans">{ev.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Incident Mobile Preview Card */}
      {selectedPin && (
        <div className="border-t border-slate-800 bg-[#0c1424] p-3 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-[11px]">
              <span>📍 {selectedPin.country}</span>
              <span>•</span>
              <span className="uppercase text-amber-300">{selectedPin.category.replace('_', ' ')}</span>
            </div>
            <p className="truncate text-slate-200 text-xs font-sans mt-0.5">{selectedPin.title}</p>
            {selectedPin.vessel_name && (
              <span className="text-rose-300 text-[10px] font-bold block">🚢 {selectedPin.vessel_name}</span>
            )}
          </div>
          <button
            onClick={() => onSelect(selectedPin)}
            className="flex-shrink-0 min-h-[36px] rounded-lg bg-cyan-600 px-3 py-1.5 font-sans text-xs font-semibold text-white hover:bg-cyan-500 active:scale-95 transition"
          >
            Dossier →
          </button>
        </div>
      )}

      {/* Map Legend (Horizontally Swipeable on Mobile) */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#0b1220] px-3 py-2 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-xs">🚢</span>
            <span className="text-rose-400 font-semibold">Tanker Attacks</span>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="h-1.5 w-4 bg-emerald-500 rounded" />
            <span className="text-emerald-400">Petroline</span>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="h-1.5 w-4 bg-amber-500 rounded" />
            <span className="text-amber-400">Goureh-Jask</span>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-xs">⛽</span>
            <span>Refineries/Terminals</span>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            <span>Military/Naval</span>
          </div>
        </div>

        <span className="text-slate-500 hidden lg:inline flex-shrink-0 pl-4">
          Tap any incident pin to open tactical dossier
        </span>
      </div>
    </div>
  );
};
