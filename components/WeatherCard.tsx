import Image from 'next/image';
import { ForecastItem } from '@/lib/weather';

function getClothingAdvice(temp: number): { emoji: string; text: string } {
  if (temp >= 25) return { emoji: '👕', text: '半袖でOK' };
  if (temp >= 20) return { emoji: '👔', text: '長袖シャツや薄手の羽織りがおすすめ' };
  if (temp >= 15) return { emoji: '🧥', text: '薄手の上着が必要です' };
  if (temp >= 10) return { emoji: '🧣', text: 'コートやニットがおすすめ' };
  return { emoji: '🧤', text: '厚手のコート・しっかり防寒対策を' };
}

function getOutingScore(temp: number, pop: number, icon: string): { stars: number; label: string } {
  const isSunny = icon.startsWith('01') || icon.startsWith('02');
  const isComfortableTemp = temp >= 15 && temp <= 28;
  const isExtremeTemp = temp > 33 || temp < 5;

  if (isSunny && pop <= 20 && isComfortableTemp) return { stars: 5, label: 'お出かけ日和！' };
  if (pop >= 70)                                  return { stars: 2, label: '雨が多いのでお出かけは控えめに' };
  if (isExtremeTemp)                              return { stars: 3, label: '気温が極端なので注意が必要' };
  if (pop <= 40 && isComfortableTemp)             return { stars: 4, label: 'まずまずのお出かけ日和' };
  return                                                 { stars: 3, label: 'お出かけは要検討です' };
}

interface WeatherCardProps {
  forecast: ForecastItem;
  city: string;
  country: string;
}

function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export default function WeatherCard({ forecast, city, country }: WeatherCardProps) {
  const clothing = getClothingAdvice(forecast.temp);
  const outing = getOutingScore(forecast.temp, forecast.pop, forecast.icon);
  return (
    <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
      {/* 都市名・日付 */}
      <header className="text-center mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {city}
          <span className="text-base font-normal text-gray-400 ml-2">{country}</span>
        </h2>
        <p className="text-gray-500 text-base mt-1">{formatFullDate(forecast.date)}</p>
      </header>

      {/* 気温・アイコン・天気説明 */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
        <Image
          src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
          alt={forecast.description}
          width={96}
          height={96}
          unoptimized
        />
        <div>
          <p className="text-6xl sm:text-7xl font-thin text-gray-800 leading-none">
            {forecast.temp}
            <span className="text-2xl sm:text-3xl align-top mt-1 inline-block text-gray-500">
              °C
            </span>
          </p>
          <p className="text-gray-600 text-base mt-2">{forecast.description}</p>
        </div>
      </div>

      {/* 詳細統計 */}
      <dl className="grid grid-cols-3 sm:grid-cols-5 gap-3 border-t border-gray-100 pt-5">
        <StatItem icon="🌡️" label="最高気温" value={`${forecast.temp_max}°C`} color="text-red-500" />
        <StatItem icon="🌡️" label="最低気温" value={`${forecast.temp_min}°C`} color="text-blue-500" />
        <StatItem icon="💧" label="湿度" value={`${forecast.humidity}%`} color="text-teal-600" />
        <StatItem icon="☔" label="降水確率" value={`${forecast.pop}%`} color="text-indigo-500" />
        <StatItem icon="💨" label="風速" value={`${forecast.wind_speed}m/s`} color="text-gray-500" />
      </dl>

      {/* 服装アドバイス */}
      <div className="mt-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <span className="text-3xl" aria-hidden="true">{clothing.emoji}</span>
        <div>
          <p className="text-xs text-amber-600 font-medium mb-0.5">今日の服装アドバイス</p>
          <p className="text-gray-700 font-semibold text-base">{clothing.text}</p>
        </div>
      </div>

      {/* お出かけおすすめ度 */}
      <div className="mt-3 flex items-center gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3">
        <span className="text-3xl" aria-hidden="true">🏃</span>
        <div>
          <p className="text-xs text-sky-600 font-medium mb-0.5">お出かけおすすめ度</p>
          <p className="text-yellow-400 text-xl leading-none tracking-wide" aria-label={`${outing.stars}点 / 5点`}>
            {'★'.repeat(outing.stars)}{'☆'.repeat(5 - outing.stars)}
          </p>
          <p className="text-gray-600 text-sm mt-0.5">{outing.label}</p>
        </div>
      </div>
    </article>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 px-1">
      <span className="text-xl mb-1" aria-hidden="true">{icon}</span>
      <dt className="text-xs text-gray-400 text-center leading-tight mb-1">{label}</dt>
      <dd className={`text-lg font-bold ${color}`}>{value}</dd>
    </div>
  );
}
