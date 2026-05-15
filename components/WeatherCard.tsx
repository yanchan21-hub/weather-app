import Image from 'next/image';
import { ForecastItem } from '@/lib/weather';

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
