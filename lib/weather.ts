const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface ForecastItem {
  date: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  pop: number; // 降水確率 0–100 (%)
}

export interface WeatherForecast {
  city: string;
  country: string;
  forecasts: ForecastItem[];
}

interface RawItem {
  dt_txt: string;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
  pop: number; // 0.0–1.0
}

interface RawResponse {
  list: RawItem[];
  city: { name: string; country: string };
}

function parseResponse(data: RawResponse): WeatherForecast {
  // 日付ごとに全エントリをグループ化
  const dailyMap = new Map<string, RawItem[]>();
  for (const item of data.list) {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) dailyMap.set(date, []);
    dailyMap.get(date)!.push(item);
  }

  const forecasts: ForecastItem[] = Array.from(dailyMap.entries())
    .slice(0, 5)
    .map(([date, items]) => {
      // 代表値: 12:00 に最も近いエントリを選ぶ
      const rep = items.reduce((closest, item) => {
        const hour = Number(item.dt_txt.split(' ')[1].slice(0, 2));
        const closestHour = Number(closest.dt_txt.split(' ')[1].slice(0, 2));
        return Math.abs(hour - 12) < Math.abs(closestHour - 12) ? item : closest;
      });

      // 最高・最低気温はその日の全スロットから算出
      const temps = items.map((i) => i.main.temp);

      return {
        date,
        temp: Math.round(rep.main.temp),
        temp_min: Math.round(Math.min(...temps)),
        temp_max: Math.round(Math.max(...temps)),
        description: rep.weather[0].description,
        icon: rep.weather[0].icon,
        humidity: rep.main.humidity,
        wind_speed: Math.round(rep.wind.speed * 10) / 10,
        pop: Math.round((rep.pop ?? 0) * 100),
      };
    });

  return { city: data.city.name, country: data.city.country, forecasts };
}

async function callForecastAPI(query: string): Promise<WeatherForecast> {
  if (!API_KEY) throw new Error('OPENWEATHER_API_KEY が設定されていません');

  const res = await fetch(
    `${BASE_URL}/forecast?${query}&appid=${API_KEY}&units=metric&lang=ja&cnt=40`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    if (res.status === 404)
      throw new Error('都市が見つかりませんでした。都市名（英語）を確認してください。');
    if (res.status === 401)
      throw new Error('APIキーが無効です。設定を確認してください。');
    throw new Error('天気情報を取得できませんでした。しばらくしてからお試しください。');
  }

  return parseResponse(await res.json());
}

export function fetchWeatherForecast(city: string): Promise<WeatherForecast> {
  return callForecastAPI(`q=${encodeURIComponent(city)}`);
}

export function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherForecast> {
  return callForecastAPI(`lat=${lat}&lon=${lon}`);
}
