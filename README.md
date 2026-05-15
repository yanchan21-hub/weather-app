# 天気予報アプリ

Next.js (App Router) + TypeScript + Tailwind CSS で構築した天気予報 Web アプリです。  
OpenWeatherMap API を使用して、入力した都市の5日間天気予報を表示します。

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. APIキーの設定

[OpenWeatherMap](https://openweathermap.org/) でアカウントを作成し、APIキーを取得してください。  
`.env.local` ファイルに以下を追記します。

```
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

1. 検索ボックスに都市名を英語で入力（例: `Tokyo`, `London`, `New York`）
2. 「検索」ボタンを押す
3. 5日間の予報が表示されるので、日付ボタンで切り替える

## ディレクトリ構成

```
weather-app/
├─ app/
│  ├─ layout.tsx          # ルートレイアウト
│  ├─ page.tsx            # メインページ（都市検索・日付選択・天気表示を統合）
│  ├─ globals.css         # Tailwind CSS エントリポイント
│  └─ api/
│     └─ weather/
│        └─ route.ts      # 天気 API ルート（外部 API はここから呼ぶ）
├─ components/
│  ├─ CitySearch.tsx      # 都市名入力フォーム
│  ├─ DateSelector.tsx    # 日付選択（5日間）
│  └─ WeatherCard.tsx     # 天気情報表示カード
├─ lib/
│  └─ weather.ts          # OpenWeatherMap API 取得処理
├─ .env.local             # 環境変数（APIキーをここに設定）
└─ .gitignore
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **外部 API**: OpenWeatherMap Forecast API (`/data/2.5/forecast`)

## 環境変数

| 変数名 | 説明 |
|---|---|
| `OPENWEATHER_API_KEY` | OpenWeatherMap の API キー |
