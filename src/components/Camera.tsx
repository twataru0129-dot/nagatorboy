import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

// 仮想カメラ：scale と transform-origin で、画面の一部にゆっくり寄る／戻る。
// 教育用なので、寄りは最大でも 1.2 倍程度にして、揺れは入れない。

export type CameraKey = {
	/** このフレームで、この状態になる */
	at: number;
	/** 倍率（1 = 全体） */
	zoom: number;
	/** 寄る中心（1920×1080 の座標） */
	x?: number;
	y?: number;
	/** 前の状態からの移動にかけるフレーム数（0 なら一瞬で寄る） */
	ease?: number;
};

export const useCamera = (keys: CameraKey[]) => {
	const frame = useCurrentFrame();
	let zoom = 1;
	let x = 960;
	let y = 540;
	const sorted = [...keys].sort((a, b) => a.at - b.at);
	for (const k of sorted) {
		const len = k.ease ?? 20;
		const start = k.at - len;
		if (frame < start) {
			break;
		}
		const p = len === 0 ? 1 : interpolate(frame, [start, k.at], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.inOut(Easing.cubic),
		});
		zoom = zoom + (k.zoom - zoom) * p;
		x = x + ((k.x ?? 960) - x) * p;
		y = y + ((k.y ?? 540) - y) * p;
	}
	return {zoom, x, y};
};

export const Camera: React.FC<{keys: CameraKey[]; children: React.ReactNode}> = ({keys, children}) => {
	const {zoom, x, y} = useCamera(keys);
	return (
		<AbsoluteFill style={{transformOrigin: `${x}px ${y}px`, transform: `scale(${zoom})`}}>{children}</AbsoluteFill>
	);
};

/** ギャグのオチなどで「一瞬寄って戻る」カメラキー */
export const punchIn = (at: number, x: number, y: number, zoom = 1.12, hold = 18): CameraKey[] => [
	{at: at + 4, zoom, x, y, ease: 4},
	{at: at + 4 + hold + 14, zoom: 1, x, y, ease: 14},
];
