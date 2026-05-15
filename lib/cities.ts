export interface CityOption {
  label: string; // 日本語表示名
  value: string; // OpenWeatherMap API に渡す英語名
}

export interface CountryData {
  label: string; // 日本語国名
  cities: CityOption[];
}

export const COUNTRIES: CountryData[] = [
  {
    label: '日本',
    cities: [
      { label: '東京', value: 'Tokyo' },
      { label: '大阪', value: 'Osaka' },
      { label: '埼玉', value: 'Saitama' },
      { label: '京都', value: 'Kyoto' },
      { label: '福岡', value: 'Fukuoka' },
      { label: '札幌', value: 'Sapporo' },
    ],
  },
  {
    label: 'アメリカ',
    cities: [
      { label: 'ニューヨーク', value: 'New York' },
      { label: 'ロサンゼルス', value: 'Los Angeles' },
      { label: 'シカゴ', value: 'Chicago' },
      { label: 'シアトル', value: 'Seattle' },
      { label: 'ホノルル', value: 'Honolulu' },
    ],
  },
  {
    label: 'イギリス',
    cities: [
      { label: 'ロンドン', value: 'London' },
      { label: 'マンチェスター', value: 'Manchester' },
      { label: 'リバプール', value: 'Liverpool' },
    ],
  },
  {
    label: 'フランス',
    cities: [
      { label: 'パリ', value: 'Paris' },
      { label: 'リヨン', value: 'Lyon' },
      { label: 'マルセイユ', value: 'Marseille' },
    ],
  },
  {
    label: 'オーストラリア',
    cities: [
      { label: 'シドニー', value: 'Sydney' },
      { label: 'メルボルン', value: 'Melbourne' },
      { label: 'ブリスベン', value: 'Brisbane' },
    ],
  },
];
