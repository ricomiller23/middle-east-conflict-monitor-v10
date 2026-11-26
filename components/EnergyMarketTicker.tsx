'use client';

import React from 'react';
import {
  Fuel,
  TrendingUp,
  TrendingDown,
  Anchor,
  ShieldAlert,
  BarChart2,
  ChevronRight,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { LIVE_BENCHMARKS, CHOKEPOINT_TELEMETRY, EnergyBenchmark } from '@/lib/energy-data';

interface EnergyMarketTickerProps {
  benchmarks?: Record<string, EnergyBenchmark>;
  telemetry?: typeof CHOKEPOINT_TELEMETRY;
  onFilterEnergyOnly?: () => void;
  isEnergyFiltered?: boolean;
  onOpenEnergyTab?: (benchmarkId?: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
  isLive?: boolean;
}

export const EnergyMarketTicker: React.FC<EnergyMarketTickerProps> = ({
  benchmarks,
  telemetry,
  onFilterEnergyOnly,
  isEnergyFiltered,
  onOpenEnergyTab,
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  isLive = true,
}) => {
  const active = benchmarks || LIVE_BENCHMARKS;
  const activeTelemetry = telemetry || CHOKEPOINT_TELEMETRY;

  const brent = active.brent || LIVE_BENCHMARKS.brent;
  const wti = active.wti || LIVE_BENCHMARKS.wti;
  const dubai = active.dubai || LIVE_BENCHMARKS.dubai;
  const vlcc = active.vlcc || LIVE_BENCHMARKS.vlcc;

  return (
    <div className="border-b border-slate-800/90 bg-[#070d1a] py-2 px-3 sm:px-4 text-xs font-mono shadow-inner">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Horizontally swipeable ticker rail */}
        <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none py-1 gap-3.5 text-slate-300 -mx-3 px-3 sm:mx-0 sm:px-0">
          
          {/* Live Stream Pulse Badge */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE OIL TICKER</span>
          </div>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* Brent Crude Pill */}
          <button
            onClick={() => onOpenEnergyTab && onOpenEnergyTab('brent')}
            className="flex items-center space-x-1.5 flex-shrink-0 hover:text-amber-300 transition group cursor-pointer active:scale-95"
            title="Click to view 24-Month Brent Price Tracking Graph"
          >
            <span className="text-slate-400 text-[11px] group-hover:underline">BRENT:</span>
            <span className="font-bold text-amber-400 text-sm sm:text-xs">${brent.currentPrice.toFixed(2)}</span>
            <span className={`flex items-center text-[10px] font-bold ${brent.changePct24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {brent.changePct24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5 text-rose-400" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5 text-emerald-400" />
              )}
              {brent.changePct24h >= 0 ? '+' : ''}{brent.changePct24h.toFixed(1)}%
            </span>
          </button>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* WTI Crude Pill */}
          <button
            onClick={() => onOpenEnergyTab && onOpenEnergyTab('wti')}
            className="flex items-center space-x-1.5 flex-shrink-0 hover:text-amber-300 transition group cursor-pointer active:scale-95"
            title="Click to view 24-Month WTI Price Tracking Graph"
          >
            <span className="text-slate-400 text-[11px] group-hover:underline">WTI:</span>
            <span className="font-bold text-amber-300 text-sm sm:text-xs">${wti.currentPrice.toFixed(2)}</span>
            <span className={`flex items-center text-[10px] font-bold ${wti.changePct24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {wti.changePct24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5 text-rose-400" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5 text-emerald-400" />
              )}
              {wti.changePct24h >= 0 ? '+' : ''}{wti.changePct24h.toFixed(1)}%
            </span>
          </button>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* Dubai / Oman Crude Pill */}
          <button
            onClick={() => onOpenEnergyTab && onOpenEnergyTab('dubai')}
            className="flex items-center space-x-1.5 flex-shrink-0 hover:text-amber-300 transition group cursor-pointer active:scale-95"
            title="Click to view 24-Month Middle East Dubai/Oman Blend Graph"
          >
            <span className="text-slate-400 text-[11px] group-hover:underline">DUBAI/OMAN:</span>
            <span className="font-bold text-slate-200">${dubai.currentPrice.toFixed(2)}</span>
            <span className={`flex items-center text-[10px] font-bold ${dubai.changePct24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {dubai.changePct24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-0.5 text-rose-400" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-0.5 text-emerald-400" />
              )}
              {dubai.changePct24h >= 0 ? '+' : ''}{dubai.changePct24h.toFixed(1)}%
            </span>
          </button>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* VLCC Tanker Day Rate Pill */}
          <button
            onClick={() => onOpenEnergyTab && onOpenEnergyTab('vlcc')}
            className="flex items-center space-x-1.5 flex-shrink-0 hover:text-cyan-300 transition group cursor-pointer active:scale-95"
            title="Click to view 24-Month VLCC Tanker Day Rates Graph"
          >
            <span className="text-slate-400 text-[11px] group-hover:underline">VLCC RATE:</span>
            <span className="font-bold text-cyan-400">${(vlcc.currentPrice / 1000).toFixed(1)}k/day</span>
            <span className={`flex items-center text-[10px] font-bold ${vlcc.changePct24h >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              <TrendingUp className="h-3 w-3 mr-0.5" />
              {vlcc.changePct24h >= 0 ? '+' : ''}{vlcc.changePct24h.toFixed(0)}%
            </span>
          </button>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* Red Sea Tanker Rerouting */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Anchor className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
            <span className="text-slate-400 text-[11px]">RED SEA DIVERSION:</span>
            <span className="font-bold text-rose-400">{activeTelemetry.redSeaDiversionPct}%</span>
          </div>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* War Risk Insurance */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
            <span className="text-slate-400 text-[11px]">WAR RISK:</span>
            <span className="rounded bg-rose-950/80 px-1.5 py-0.5 font-bold text-rose-300 border border-rose-500/40 text-[10px]">
              {activeTelemetry.warRiskInsurancePct}% HULL
            </span>
          </div>

          <div className="h-3 w-px bg-slate-800 flex-shrink-0" />

          {/* East-West Petroline */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Fuel className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400 text-[11px]">PETROLINE:</span>
            <span className="font-semibold text-emerald-300">{activeTelemetry.petrolineThroughputBpd}M BPD</span>
          </div>
        </div>

        {/* Action Controls: Refresh Button + 24M History Graph + Quick Energy Filter */}
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5 md:pt-0">
          
          {/* Real-time Refresh Oil Prices Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex min-h-[34px] items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/80 border border-cyan-500/40 transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
              title="Refresh Live Oil & Energy Prices Now"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Prices'}</span>
              <span className="sm:hidden">{isRefreshing ? '...' : 'Refresh'}</span>
            </button>
          )}

          {onOpenEnergyTab && (
            <button
              onClick={() => onOpenEnergyTab('brent')}
              className="flex min-h-[34px] items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition active:scale-95 shadow-sm cursor-pointer"
              title="Open 24-Month Oil Price Tracking Graph"
            >
              <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">24M Price History</span>
              <span className="sm:hidden">Graph</span>
              <ChevronRight className="h-3 w-3 text-amber-400/70" />
            </button>
          )}

          {onFilterEnergyOnly && (
            <button
              onClick={onFilterEnergyOnly}
              className={`flex min-h-[34px] items-center justify-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition border active:scale-95 cursor-pointer ${
                isEnergyFiltered
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                  : 'bg-slate-800/90 text-amber-400 border-amber-500/30 hover:bg-slate-700'
              }`}
            >
              <Fuel className="h-3.5 w-3.5" />
              <span>{isEnergyFiltered ? 'Filtered' : 'Filter Oil'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
