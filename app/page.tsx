'use client';

import { useState } from 'react';
import CitySearch from '@/components/CitySearch';
import DateSelector from '@/components/DateSelector';
import WeatherCard from '@/components/WeatherCard';
import { WeatherForecast } from '@/lib/weather';

export default function Home() {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyData = (data: WeatherForecast) => {
    setWeather(data);
    setSelectedDate(data.forecasts[0]?.date ?? '');
  };

  const resetState = () => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setSelectedDate('');
  };

  // 都市名検索
  const handleSearch = async (city: string) => {
    resetState();
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      applyData(data as WeatherForecast);
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

  // 現在地から取得
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('お使いのブラウザは現在地取得に対応していません。都市名で検索してください。');
      return;
    }

    resetState();

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          applyData(data as WeatherForecast);
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : '天気情報を取得できませんでした。しばらくしてからお試しください。'
          );
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? '現在地の取得が許可されていません。都市名で検索してください。'
            : '現在地を取得できませんでした。都市名で検索してください。'
        );
      },
      { timeout: 10000 }
    );
  };

  const selectedForecast =
    weather?.forecasts.find((f) => f.date === selectedDate) ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 px-4 py-10 sm:py-16">
      <div className="max-w-lg mx-auto space-y-6">

        {/* ① タイトル */}
        <header className="text-center space-y-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow">
            天気予報アプリ
          </h1>
          <p className="text-white/70 text-base">
            都市名を入力して5日間の天気を確認できます
          </p>
        </header>

        {/* ② 検索欄 */}
        <CitySearch
          onSearch={handleSearch}
          onGetLocation={handleGetLocation}
          loading={loading}
        />

        {/* ローディング */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-base font-medium">天気情報を取得中です...</p>
          </div>
        )}

        {/* エラー */}
        {error && !loading && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 space-y-1"
          >
            <p className="text-red-700 font-semibold text-base">⚠️ 取得できませんでした</p>
            <p className="text-red-600 text-base">{error}</p>
          </div>
        )}

        {/* ③ 日付選択 → ④ 天気表示 */}
        {weather && !loading && (
          <section className="space-y-4">
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
              <p className="text-center text-white/70 text-base py-6">
                選択した日の予報が見つかりませんでした
              </p>
            )}
          </section>
        )}

        {/* 初期案内（何も操作していないとき） */}
        {!weather && !loading && !error && (
          <div className="text-center text-white/60 text-base pt-4 space-y-1">
            <p>上の検索欄に都市名を入力してください</p>
            <p className="text-sm text-white/40">
              例：Tokyo / Osaka / Saitama / New York
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
