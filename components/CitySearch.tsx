'use client';

import { useState } from 'react';
import { COUNTRIES } from '@/lib/cities';

interface CitySearchProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

// select + カスタム矢印のラッパー
function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}

const selectClass =
  'w-full px-4 py-3 pr-10 text-base rounded-xl bg-white/90 text-gray-800 ' +
  'appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/80 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export default function CitySearch({ onSearch, loading }: CitySearchProps) {
  // ── プルダウン用ステート ──────────────────────────
  const [countryIdx, setCountryIdx] = useState('');
  const [cityValue, setCityValue] = useState('');

  const selectedCountry = countryIdx !== '' ? COUNTRIES[Number(countryIdx)] : null;
  const cityOptions = selectedCountry?.cities ?? [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryIdx(e.target.value);
    setCityValue(''); // 国が変わったら都市をリセット
  };

  const handleDropdownSearch = () => {
    if (cityValue) onSearch(cityValue); // 英語の value をそのまま渡す
  };

  // ── 手入力用ステート ─────────────────────────────
  const [manualInput, setManualInput] = useState('');

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualInput.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <div className="space-y-4">

      {/* ── セクション①：プルダウン検索 ── */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-4 space-y-3">
        <div className="space-y-0.5">
          <p className="text-white font-semibold text-base">プルダウンから選ぶ</p>
          <p className="text-white/60 text-sm">国を選ぶ → 都市を選ぶ → 天気を調べる</p>
        </div>

        {/* 国選択 */}
        <div className="space-y-1">
          <label htmlFor="country-select" className="text-white/80 text-sm font-medium">
            ① 国を選択
          </label>
          <SelectWrapper>
            <select
              id="country-select"
              value={countryIdx}
              onChange={handleCountryChange}
              disabled={loading}
              className={selectClass}
            >
              <option value="">国を選択してください</option>
              {COUNTRIES.map((country, idx) => (
                <option key={idx} value={String(idx)}>
                  {country.label}
                </option>
              ))}
            </select>
          </SelectWrapper>
        </div>

        {/* 都市選択（国が選ばれていないと無効） */}
        <div className="space-y-1">
          <label htmlFor="city-select" className="text-white/80 text-sm font-medium">
            ② 都市を選択
          </label>
          <SelectWrapper>
            <select
              id="city-select"
              value={cityValue}
              onChange={(e) => setCityValue(e.target.value)}
              disabled={loading || !selectedCountry}
              className={selectClass}
            >
              <option value="">都市を選択してください</option>
              {cityOptions.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </SelectWrapper>
          {!selectedCountry && (
            <p className="text-white/40 text-xs">※ 先に国を選択してください</p>
          )}
        </div>

        {/* 検索ボタン */}
        <button
          type="button"
          onClick={handleDropdownSearch}
          disabled={loading || !cityValue}
          className="w-full py-3 bg-white text-blue-600 font-bold text-base rounded-xl hover:bg-blue-50 active:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          ③ 天気を調べる
        </button>
      </div>

      {/* ── 区切り線 ── */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="flex-1 h-px bg-white/30" />
        <span className="text-white/50 text-sm">または</span>
        <div className="flex-1 h-px bg-white/30" />
      </div>

      {/* ── セクション②：手入力検索 ── */}
      <div className="space-y-2">
        <p className="text-white/80 text-sm font-medium">都市名を直接入力する</p>
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="例：Tokyo / Osaka / Saitama"
            disabled={loading}
            aria-label="または都市名を直接入力"
            className="flex-1 min-w-0 px-4 py-3 text-base rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !manualInput.trim()}
            className="shrink-0 px-5 py-3 bg-white text-blue-600 font-bold text-base rounded-xl hover:bg-blue-50 active:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            天気を調べる
          </button>
        </form>
      </div>

    </div>
  );
}
