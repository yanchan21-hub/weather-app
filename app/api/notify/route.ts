import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherForecast, ForecastItem } from '@/lib/weather';

const LINE_PUSH_API = 'https://api.line.me/v2/bot/message/push';

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token  = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;
  const city   = process.env.NOTIFY_CITY ?? 'Tokyo';

  if (!token || !userId) {
    return NextResponse.json(
      { error: 'LINE_CHANNEL_ACCESS_TOKEN または LINE_USER_ID が未設定です' },
      { status: 500 }
    );
  }

  const weather = await fetchWeatherForecast(city);
  const today   = weather.forecasts[0];

  if (!today) {
    return NextResponse.json({ error: '予報データがありません' }, { status: 500 });
  }

  const force = request.nextUrl.searchParams.get('force') === 'true';
  if (!force && today.pop < 50) {
    return NextResponse.json({ sent: false, reason: '降水確率50%未満のため通知なし', pop: today.pop });
  }

  const text = buildMessage(today, weather.city);

  const res = await fetch(LINE_PUSH_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: 'LINE API エラー', detail: body }, { status: 500 });
  }

  return NextResponse.json({ sent: true, pop: today.pop });
}

function buildMessage(forecast: ForecastItem, city: string): string {
  const umbrella =
    forecast.pop >= 50
      ? '☂️ 傘を持っていきましょう！'
      : '🌂 折りたたみ傘があると安心です';

  return [
    `🌧️ 今日の${city}は雨の可能性があります`,
    '',
    `降水確率　: ${forecast.pop}%`,
    `最高気温　: ${forecast.temp_max}°C`,
    `最低気温　: ${forecast.temp_min}°C`,
    `天気　　　: ${forecast.description}`,
    '',
    umbrella,
  ].join('\n');
}
