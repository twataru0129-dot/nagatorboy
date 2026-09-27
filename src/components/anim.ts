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
