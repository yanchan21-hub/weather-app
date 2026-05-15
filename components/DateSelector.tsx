'use client';

interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const mmdd = `${month}/${day}`;
  const weekday = date.toLocaleDateString('ja-JP', { weekday: 'short' });

  let badge = '';
  if (date.toDateString() === today.toDateString()) badge = '今日';
  else if (date.toDateString() === tomorrow.toDateString()) badge = '明日';

  return { mmdd, weekday, badge };
}

function getWeekdayColor(weekday: string, isSelected: boolean): string {
  if (weekday === '土') return 'text-blue-500';
  if (weekday === '日') return 'text-red-500';
  return isSelected ? 'text-blue-500' : 'text-gray-400';
}

export default function DateSelector({ dates, selectedDate, onSelectDate }: DateSelectorProps) {
  return (
    // 白いカードUI全体ラッパー
    <div
      role="group"
      aria-label="予報日を選択"
      className="bg-white rounded-2xl shadow-md px-4 pt-3 pb-4"
    >
      <p className="text-xs text-gray-400 font-medium mb-2 px-1">予報日を選択</p>

      {/*
        overflow-x-auto は縦方向のはみ出し（shadow・translate）もクリップする。
        内側の flex 行に px-3 pt-2 pb-3 を付けてシャドウの描画領域を確保する。
      */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 px-3 pt-2 pb-3">
          {dates.map((date) => {
            const { mmdd, weekday, badge } = formatDate(date);
            const isSelected = date === selectedDate;
            const wdColor = getWeekdayColor(weekday, isSelected);

            return (
              <button
                key={date}
                onClick={() => onSelectDate(date)}
                aria-pressed={isSelected}
                aria-label={`${mmdd} ${weekday}${badge ? ` (${badge})` : ''}`}
                className={[
                  // 共通スタイル
                  'flex flex-col items-center shrink-0',
                  'w-20 pt-2 pb-3 rounded-2xl border-2',
                  'transition-all duration-150 cursor-pointer',
                  // 選択中 / 未選択で切り替え
                  isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-lg -translate-y-0.5'
                    : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
                ].join(' ')}
              >
                {/* ─── 今日・明日バッジ（高さ固定でレイアウトを統一） ─── */}
                <span
                  className={[
                    'h-4 flex items-center text-[11px] font-bold leading-none',
                    badge === '今日'  ? 'text-blue-500'
                    : badge === '明日' ? 'text-orange-400'
                    : '',
                  ].join(' ')}
                  aria-hidden={!badge}
                >
                  {badge}
                </span>

                {/* ─── 日付（例: 5/14） ─── */}
                <span
                  className={[
                    'text-lg font-bold leading-none mt-1',
                    isSelected ? 'text-blue-700' : 'text-gray-800',
                  ].join(' ')}
                >
                  {mmdd}
                </span>

                {/* ─── 曜日 ─── */}
                <span
                  className={[
                    'text-xs font-semibold leading-none mt-1.5',
                    wdColor,
                  ].join(' ')}
                >
                  {weekday}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
