'use client';

import { useState, useEffect } from 'react';
import CitySearch from '@/components/CitySearch';
import DateSelector from '@/components/DateSelector';
import WeatherCard from '@/components/WeatherCard';
import { WeatherForecast } from '@/lib/weather';

export default function Home() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelLabel, setPanelLabel] = useState('現在地の天気');

  const applyWeather = (data: WeatherForecast, label: string) => {
    setWeather(data);
    setSelectedDate(data.forecasts[0]?.date ?? '');
    setPanelLabel(label);
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setLoading(false);
      setError('お使いのブラウザは現在地取得に対応していません。');
      return;
    }
    setLoading(true);
    setError(null);
    setWeather(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          applyWeather(data as WeatherForecast, '現在地の天気');
        } catch (e) {
          setError(e instanceof Error ? e.message : '天気情報を取得できませんでした。');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? '現在地の取得が許可されていません。'
            : '現在地を取得できませんでした。'
        );
      },
      { timeout: 10000 }
    );
  };

  // 現在地を自動取得
  useEffect(() => { fetchLocation(); }, []);

  // 都市検索 → 左パネルに表示
  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      applyWeather(data as WeatherForecast, `${(data as WeatherForecast).city} の天気`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : '天気情報を取得できませんでした。都市名を確認してください。'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedForecast = weather?.forecasts.find((f) => f.date === selectedDate) ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 px-4 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* タイトル */}
        <header className="text-center space-y-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow">
            天気予報アプリ
          </h1>
          <p className="text-white/70 text-base">
            現在地の天気確認と都市名検索ができます
          </p>
        </header>

        {/* 2ペインレイアウト：スマホ＝縦、PC＝横 */}
        <div className="flex flex-col md:flex-row md:items-start gap-6">

          {/* ── 左（上）：天気表示パネル ─────────────── */}
          <section className="w-full md:w-1/2 space-y-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span aria-hidden="true">📍</span> {panelLabel}
            </h2>

            {loading && (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">取得中...</p>
              </div>
            )}

            {error && !loading && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 space-y-1">
                <p className="text-red-700 font-semibold text-base">⚠️ 取得できませんでした</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {weather && !loading && (
              <>
                <DateSelector
                  dates={weather.forecasts.map((f) => f.date)}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                {selectedForecast ? (
                  <WeatherCard
                    forecast={selectedForecast}
                    city={weather.city}
                    country={weather.country}
                  />
                ) : (
                  <p className="text-center text-white/70 text-sm py-6">
                    選択した日の予報が見つかりませんでした
                  </p>
                )}
              </>
            )}
          </section>

          {/* ── 右（下）：検索パネル ───────────────────── */}
          <section className="w-full md:w-1/2 space-y-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span aria-hidden="true">🔍</span> 都市を検索
            </h2>
            <CitySearch onSearch={handleSearch} loading={loading} />

            <button
              type="button"
              onClick={fetchLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-base font-medium text-white border border-white/40 rounded-xl hover:bg-white/10 active:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span aria-hidden="true">📍</span>
              現在地の天気を見る
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}
