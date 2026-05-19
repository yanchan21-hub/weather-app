'use client';

import { useState, useEffect } from 'react';
import CitySearch from '@/components/CitySearch';
import DateSelector from '@/components/DateSelector';
import WeatherCard from '@/components/WeatherCard';
import { WeatherForecast } from '@/lib/weather';

export default function Home() {
  // ── 現在地パネル ────────────────────────────────────
  const [locationWeather, setLocationWeather] = useState<WeatherForecast | null>(null);
  const [locationDate, setLocationDate] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // ── 検索パネル ──────────────────────────────────────
  const [searchWeather, setSearchWeather] = useState<WeatherForecast | null>(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 現在地を自動取得
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocationError('お使いのブラウザは現在地取得に対応していません。');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setLocationWeather(data as WeatherForecast);
          setLocationDate(data.forecasts[0]?.date ?? '');
        } catch (e) {
          setLocationError(e instanceof Error ? e.message : '天気情報を取得できませんでした。');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? '現在地の取得が許可されていません。'
            : '現在地を取得できませんでした。'
        );
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSearch = async (city: string) => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchWeather(null);
    setSearchDate('');
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSearchWeather(data as WeatherForecast);
      setSearchDate(data.forecasts[0]?.date ?? '');
    } catch (e) {
      setSearchError(
        e instanceof Error
          ? e.message
          : '天気情報を取得できませんでした。都市名を確認してください。'
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const locationForecast = locationWeather?.forecasts.find((f) => f.date === locationDate) ?? null;
  const searchForecast = searchWeather?.forecasts.find((f) => f.date === searchDate) ?? null;

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

          {/* ── 左（上）：現在地の天気 ─────────────────── */}
          <section className="w-full md:w-1/2 space-y-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span aria-hidden="true">📍</span> 現在地の天気
            </h2>

            {locationLoading && (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">現在地を取得中...</p>
              </div>
            )}

            {locationError && !locationLoading && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 space-y-1">
                <p className="text-red-700 font-semibold text-base">⚠️ 取得できませんでした</p>
                <p className="text-red-600 text-sm">{locationError}</p>
              </div>
            )}

            {locationWeather && !locationLoading && (
              <>
                <DateSelector
                  dates={locationWeather.forecasts.map((f) => f.date)}
                  selectedDate={locationDate}
                  onSelectDate={setLocationDate}
                />
                {locationForecast ? (
                  <WeatherCard
                    forecast={locationForecast}
                    city={locationWeather.city}
                    country={locationWeather.country}
                  />
                ) : (
                  <p className="text-center text-white/70 text-sm py-6">
                    選択した日の予報が見つかりませんでした
                  </p>
                )}
              </>
            )}
          </section>

          {/* ── 右（下）：都市検索 ─────────────────────── */}
          <section className="w-full md:w-1/2 space-y-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span aria-hidden="true">🔍</span> 都市を検索
            </h2>

            <CitySearch onSearch={handleSearch} loading={searchLoading} />

            {searchLoading && (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm">天気情報を取得中...</p>
              </div>
            )}

            {searchError && !searchLoading && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 space-y-1">
                <p className="text-red-700 font-semibold text-base">⚠️ 取得できませんでした</p>
                <p className="text-red-600 text-sm">{searchError}</p>
              </div>
            )}

            {searchWeather && !searchLoading && (
              <>
                <DateSelector
                  dates={searchWeather.forecasts.map((f) => f.date)}
                  selectedDate={searchDate}
                  onSelectDate={setSearchDate}
                />
                {searchForecast ? (
                  <WeatherCard
                    forecast={searchForecast}
                    city={searchWeather.city}
                    country={searchWeather.country}
                  />
                ) : (
                  <p className="text-center text-white/70 text-sm py-6">
                    選択した日の予報が見つかりませんでした
                  </p>
                )}
              </>
            )}

            {!searchWeather && !searchLoading && !searchError && (
              <div className="text-center text-white/60 text-sm pt-4 space-y-1">
                <p>上の検索欄に都市名を入力してください</p>
                <p className="text-xs text-white/40">例：Tokyo / Osaka / Saitama / New York</p>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
