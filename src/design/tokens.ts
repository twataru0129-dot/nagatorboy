// =====================================================================
// スタイリッシュ版のデザイン基準（色・文字・動きの速さ）
// ベース（深いネイビー）＋白＋アクセント（1日目ブルー／2日目ミント）
// 「覚えてほしいポイント」だけアンバーで示す
// =====================================================================

export const INK = {
	base: '#0A1326',
	base2: '#101E3A',
	base3: '#18294B',
	white: '#FFFFFF',
	mute: 'rgba(255,255,255,0.64)',
	faint: 'rgba(255,255,255,0.12)',
	line: 'rgba(255,255,255,0.18)',
	glass: 'rgba(255,255,255,0.06)',
	day1: '#4C9DFF',
	day2: '#35D5A2',
	point: '#FFC857',
	shadow: 'rgba(0,0,0,0.35)',
};

export const DAY_ACCENT = {1: INK.day1, 2: INK.day2} as const;

export const FONT_JP = "'BIZ UDPGothic', 'Hiragino Sans', 'Noto Sans JP', sans-serif";
export const FONT_EN = "'Montserrat', 'Helvetica Neue', Arial, sans-serif";

/** 7つの仕事（一覧・カード用。2行表示用の改行つき） */
export const JOB_LIST: {name: string; lines: [string, string?]; day: 1 | 2}[] = [
	{name: 'リネンを配る', lines: ['リネンを', '配る'], day: 1},
	{name: 'ベッド・布団の準備', lines: ['ベッド・布団の', '準備'], day: 1},
	{name: 'お風呂掃除', lines: ['お風呂', '掃除'], day: 1},
	{name: '健康チェックカード', lines: ['健康チェック', 'カード'], day: 1},
	{name: '荷物・布団整理の声かけ', lines: ['荷物・布団整理の', '声かけ'], day: 2},
	{name: 'リネンを回収して返す', lines: ['リネンを回収して', '返す'], day: 2},
	{name: '部屋の自主点検', lines: ['部屋の', '自主点検'], day: 2},
];

export const pad2 = (n: number) => String(n).padStart(2, '0');
