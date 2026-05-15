import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherForecast, fetchWeatherByCoords } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  try {
    let data;

    if (lat !== null && lon !== null) {
      const latNum = Number(lat);
      const lonNum = Number(lon);
      if (isNaN(latNum) || isNaN(lonNum)) {
        return NextResponse.json({ error: '位置情報の形式が正しくありません' }, { status: 400 });
      }
      data = await fetchWeatherByCoords(latNum, lonNum);
    } else if (city && city.trim()) {
      data = await fetchWeatherForecast(city.trim());
    } else {
      return NextResponse.json(
        { error: '都市名または位置情報を指定してください' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '天気情報を取得できませんでした';
    const status = message.includes('見つかりませんでした')
      ? 404
      : message.includes('APIキー')
      ? 401
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
