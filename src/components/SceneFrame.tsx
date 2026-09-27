import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {Camera, CameraKey} from './Camera';
import {useSceneDuration} from './Contexts';

/**
 * シーン共通の枠：背景＋フェードイン／フェードアウト
 * camera … 仮想カメラ（背景と本体に効く）
 * hud    … カメラの影響を受けない前面の要素（見出し・時計など）
 */
export const SceneFrame: React.FC<{
	children: React.ReactNode;
	background?: React.ReactNode;
	fadeIn?: number;
	fadeOut?: number;
	camera?: CameraKey[];
	hud?: React.ReactNode;
}> = ({children, background, fadeIn = 10, fadeOut = 10, camera = [], hud}) => {
	const frame = useCurrentFrame();
	const duration = useSceneDuration();
	const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
	const inOpacity = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], clamp) : 1;
	const outOpacity = fadeOut > 0 ? interpolate(frame, [duration - fadeOut, duration], [1, 0], clamp) : 1;
	const opacity = Math.min(inOpacity, outOpacity);
	return (
		<AbsoluteFill style={{opacity}}>
			<Camera keys={camera}>
				{background ?? <DefaultBackground />}
				{children}
			</Camera>
			{hud}
		</AbsoluteFill>
	);
};

/** 白〜水色のやさしい背景 */
export const DefaultBackground: React.FC<{tint?: string}> = ({tint = COLORS.blueLight}) => (
	<AbsoluteFill
		style={{
			background: `linear-gradient(180deg, #FFFFFF 0%, ${COLORS.bg} 55%, ${tint} 100%)`,
		}}
	>
		<svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
			<circle cx="1780" cy="980" r="260" fill={COLORS.greenLight} opacity="0.7" />
			<circle cx="120" cy="1040" r="180" fill={COLORS.blueLight} opacity="0.8" />
		</svg>
	</AbsoluteFill>
);
