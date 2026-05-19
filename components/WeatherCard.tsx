import Image from 'next/image';
import { ForecastItem } from '@/lib/weather';

function getClothingAdvice(temp: number): { emoji: string; text: string } {
  if (temp >= 25) return { emoji: '👕', text: '半袖でOK' };
  if (temp >= 20) return { emoji: '👔', text: '長袖シャツや薄手の羽織りがおすすめ' };
  if (temp >= 15) return { emoji: '🧥', text: '薄手の上着が必要です' };
  if (temp >= 10) return { emoji: '🧣', text: 'コートやニットがおすすめ' };
  return { emoji: '🧤', text: '厚手のコート・しっかり防寒対策を' };
}

function getUmbrellaAdvice(pop: number): { emoji: string; text: string } {
  if (pop >= 50) return { emoji: '☂️', text: '傘を持っていきましょう' };
  if (pop >= 30) return { emoji: '🌂', text: '折りたたみ傘があると安心' };
  return { emoji: '🌤️', text: '傘なしでも大丈夫そう' };
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
  const umbrella = getUmbrellaAdvice(forecast.pop);
  const outing = getOutingScore(forecast.temp, forecast.pop, forecast.icon);
  return (
    <article className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4">
      {/* 都市名・日付 */}
      <header className="text-center mb-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {city}
          <span className="text-sm font-normal text-gray-400 ml-2">{country}</span>
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">{formatFullDate(forecast.date)}</p>
      </header>

      {/* 気温・アイコン・天気説明 */}
      <div className="flex items-center justify-center gap-4 my-3">
        <Image
          src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
          alt={forecast.description}
          width={72}
          height={72}
          unoptimized
        />
        <div>
          <p className="text-5xl font-thin text-gray-800 leading-none">
            {forecast.temp}
            <span className="text-xl align-top mt-1 inline-block text-gray-500">°C</span>
          </p>
          <p className="text-gray-600 text-sm mt-1">{forecast.description}</p>
        </div>
      </div>

      {/* 詳細統計 */}
      <dl className="grid grid-cols-5 gap-2 border-t border-gray-100 pt-3">
        <StatItem icon="🌡️" label="最高" value={`${forecast.temp_max}°C`} color="text-red-500" />
        <StatItem icon="🌡️" label="最低" value={`${forecast.temp_min}°C`} color="text-blue-500" />
        <StatItem icon="💧" label="湿度" value={`${forecast.humidity}%`} color="text-teal-600" />
        <StatItem icon="☔" label="降水" value={`${forecast.pop}%`} color="text-indigo-500" />
        <StatItem icon="💨" label="風速" value={`${forecast.wind_speed}m/s`} color="text-gray-500" />
      </dl>

      {/* 服装アドバイス・傘アドバイス・お出かけおすすめ度（横並び） */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2 py-2">
          <span className="text-xl" aria-hidden="true">{clothing.emoji}</span>
          <p className="text-xs text-amber-600 font-medium leading-none">服装</p>
          <p className="text-gray-700 font-semibold text-xs leading-snug">{clothing.text}</p>
        </div>
        <div className="flex flex-col gap-1 bg-blue-50 border border-blue-200 rounded-xl px-2 py-2">
          <span className="text-xl" aria-hidden="true">{umbrella.emoji}</span>
          <p className="text-xs text-blue-600 font-medium leading-none">傘</p>
          <p className="text-gray-700 font-semibold text-xs leading-snug">{umbrella.text}</p>
        </div>
        <div className="flex flex-col gap-1 bg-sky-50 border border-sky-200 rounded-xl px-2 py-2">
          <span className="text-xl" aria-hidden="true">🏃</span>
          <p className="text-xs text-sky-600 font-medium leading-none">お出かけ度</p>
          <p className="text-yellow-400 text-sm leading-none tracking-wide" aria-label={`${outing.stars}点 / 5点`}>
            {'★'.repeat(outing.stars)}{'☆'.repeat(5 - outing.stars)}
          </p>
          <p className="text-gray-600 text-xs leading-snug">{outing.label}</p>
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
    <div className="flex flex-col items-center bg-gray-50 rounded-xl py-2 px-1">
      <span className="text-base mb-0.5" aria-hidden="true">{icon}</span>
      <dt className="text-xs text-gray-400 text-center leading-tight mb-0.5">{label}</dt>
      <dd className={`text-sm font-bold ${color}`}>{value}</dd>
    </div>
  );
}
