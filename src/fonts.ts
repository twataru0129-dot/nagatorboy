import {continueRender, delayRender, staticFile} from 'remotion';

// 教室でも読みやすいユニバーサルデザインフォント（BIZ UDPゴシック / SIL OFL）を
// public/fonts から読み込みます。読み込みに失敗しても止まらず、別のフォントで表示します。
const FONTS = [
	{file: 'fonts/BIZUDPGothic-Regular.ttf', weight: '400'},
	{file: 'fonts/BIZUDPGothic-Bold.ttf', weight: '700'},
];

let started = false;

export const loadFonts = () => {
	if (started || typeof document === 'undefined') {
		return;
	}
	started = true;
	const handle = delayRender('Loading BIZ UDPGothic');
	Promise.all(
		FONTS.map(async ({file, weight}) => {
			try {
				const face = new FontFace('BIZ UDPGothic', `url(${staticFile(file)})`, {weight});
				await face.load();
				document.fonts.add(face);
			} catch (err) {
				console.warn(`フォントを読み込めませんでした: ${file}`, err);
			}
		}),
	).finally(() => continueRender(handle));
};
