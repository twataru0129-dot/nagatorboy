import {continueRender, delayRender, staticFile} from 'remotion';

// 教室でも読みやすいユニバーサルデザインフォント（BIZ UDPゴシック / SIL OFL）を
// public/fonts から読み込みます。読み込みに失敗しても止まらず、別のフォントで表示します。
const FONTS = [
	{family: 'BIZ UDPGothic', file: 'fonts/BIZUDPGothic-Regular.ttf', weight: '400'},
	{family: 'BIZ UDPGothic', file: 'fonts/BIZUDPGothic-Bold.ttf', weight: '700'},
	// 英字ラベル用（DAY 1 / JOB 01 / POINT など）
	{family: 'Montserrat', file: 'fonts/Montserrat-SemiBold.ttf', weight: '600'},
	{family: 'Montserrat', file: 'fonts/Montserrat-ExtraBold.ttf', weight: '800'},
];

let started = false;

export const loadFonts = () => {
	if (started || typeof document === 'undefined') {
		return;
	}
	started = true;
	const handle = delayRender('Loading fonts');
	Promise.all(
		FONTS.map(async ({family, file, weight}) => {
			try {
				const face = new FontFace(family, `url(${staticFile(file)})`, {weight});
				await face.load();
				document.fonts.add(face);
			} catch (err) {
				console.warn(`フォントを読み込めませんでした: ${file}`, err);
			}
		}),
	).finally(() => continueRender(handle));
};
