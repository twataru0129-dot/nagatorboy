// 色・文字の設定（白・青・緑が基調）
export const COLORS = {
	white: '#FFFFFF',
	bg: '#F4F9FF',
	text: '#1D2B4F',
	subText: '#4A5B80',
	blue: '#1C6FD6',
	blueDark: '#0F4FA3',
	blueLight: '#E3EFFF',
	green: '#17A35A',
	greenDark: '#0E7A42',
	greenLight: '#E2F6EA',
	yellow: '#FFD23F',
	orange: '#FF8A1F',
	red: '#E5484D',
	gray: '#B8C3D6',
	shadow: 'rgba(20, 50, 100, 0.18)',
};

/** 1日目＝青、2日目＝緑 */
export const DAY_COLORS = {
	1: {main: COLORS.blue, dark: COLORS.blueDark, light: COLORS.blueLight},
	2: {main: COLORS.green, dark: COLORS.greenDark, light: COLORS.greenLight},
} as const;

export const FONT_FAMILY =
	"'BIZ UDPGothic', 'BIZ UDPゴシック', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Meiryo', sans-serif";
