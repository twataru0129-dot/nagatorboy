import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../data/scenes';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** start から duration フレームで 0→1 */
export const progress = (frame: number, start: number, duration = 15) =>
	interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

/** ばねで 0→1（少しだけ弾む） */
export const pop = (frame: number, start: number, damping = 14) =>
	spring({frame: frame - start, fps: FPS, config: {damping, stiffness: 160, mass: 0.7}});

/** フェード＋下からスライドで出てくるスタイル */
export const appear = (frame: number, start: number, distance = 40, duration = 15): React.CSSProperties => {
	const p = progress(frame, start, duration);
	return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};

/** ズームしながら出てくるスタイル */
export const zoomIn = (frame: number, start: number): React.CSSProperties => {
	const p = pop(frame, start);
	return {opacity: Math.min(1, p * 1.5), transform: `scale(${0.6 + 0.4 * p})`};
};

/** 少し行き過ぎて戻る（overshoot）。0→1 */
export const overshoot = (frame: number, start: number, len = 14, amount = 0.18) =>
	interpolate(frame - start, [0, len * 0.55, len * 0.8, len], [0, 1 + amount, 1 - amount * 0.3, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** ぽんっと弾んで出る（bounce-in） */
export const bounceIn = (frame: number, start: number): React.CSSProperties => {
	const s = overshoot(frame, start, 16, 0.16);
	return {opacity: Math.min(1, s * 2), transform: `scale(${s})`};
};

/** 横からすべり込む（slide-in） */
export const slideIn = (frame: number, start: number, from: 'left' | 'right' = 'left', distance = 120): React.CSSProperties => {
	const p = progress(frame, start, 14);
	const sign = from === 'left' ? -1 : 1;
	return {opacity: p, transform: `translateX(${(1 - p) * distance * sign}px)`};
};

/** はんこのように上から押される（stamp-in） */
export const stampIn = (frame: number, start: number): React.CSSProperties => {
	const s = interpolate(frame - start, [0, 6, 10, 14], [2.2, 0.92, 1.04, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});
	return {opacity: frame < start ? 0 : Math.min(1, (frame - start + 1) / 4), transform: `scale(${s})`};
};

/** 大事な言葉を「ぷくっ」と強調（強調の瞬間だけ少し大きく） */
export const emphasize = (frame: number, at: number) => {
	const t = frame - at;
	return t < 0 || t > 16 ? 1 : 1 + 0.12 * Math.sin((t / 16) * Math.PI);
};
