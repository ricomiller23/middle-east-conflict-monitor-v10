import { NextRequest, NextResponse } from 'next/server';
import { getLiveEnergyBenchmarks } from '@/lib/energy-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const force = searchParams.get('force') === 'true';
    const timeframe = searchParams.get('timeframe') || '24m';

    const liveData = await getLiveEnergyBenchmarks(force);

    let history = [...liveData.history];
    const now = Date.now();
    let cutoffMs = 0;
    if (timeframe === '1m') {
      cutoffMs = now - 30 * 86400000;
    } else if (timeframe === '3m') {
      cutoffMs = now - 90 * 86400000;
    } else if (timeframe === '6m') {
      cutoffMs = now - 182 * 86400000;
    } else if (timeframe === '12m') {
      cutoffMs = now - 365 * 86400000;
    } else {
      cutoffMs = now - 730 * 86400000;
    }

    if (cutoffMs > 0) {
      history = history.filter((p) => p.timestamp >= cutoffMs);
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: liveData.fetchedAt,
        isLive: liveData.isLive,
        benchmarks: liveData.benchmarks,
        telemetry: liveData.telemetry,
        history,
        milestones: liveData.milestones,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load energy market data' },
      { status: 500 }
    );
  }
}
