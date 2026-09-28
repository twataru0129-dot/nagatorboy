import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CameraKey} from '../components/Camera';
import {SceneFrame} from '../components/SceneFrame';
import {Sfx} from '../components/Sfx';
import {Backdrop, Vignette} from './Backdrop';
import {INK} from './tokens';

/**
 * スタイリッシュ版の共通シーン枠
 * ・奥行きのある背景（Backdrop）
 * ・シーン開始のトランジション（ネイビーの幕がアクセントの線とともに横へ抜ける）
 * ・周辺を少し暗くするビネット
 * ・カメラ（寄り・戻り）と、カメラの影響を受けない見出し（hud）
 */
export const StylishFrame: React.FC<{
	accent: string;
	watermark?: string;
	variant?: number;
	camera?: CameraKey[];
	hud?: React.ReactNode;
	/** 背景を差し替える（オープニングの川など） */
	background?: React.ReactNode;
	/** 開始時のトランジションを使うか */
	wipe?: boolean;
	/** 開始時の効果音 */
	whoosh?: boolean;
	fadeOut?: number;
	children: React.ReactNode;
}> = ({accent, watermark, variant = 0, camera = [], hud, background, wipe = true, whoosh = true, fadeOut = 12, children}) => {
	return (
		<SceneFrame
			fadeIn={wipe ? 0 : 10}
			fadeOut={fadeOut}
			camera={camera}
			background={background ?? <Backdrop accent={accent} watermark={watermark} variant={variant} />}
			hud={
				<>
					<Vignette />
					{hud}
					{wipe ? <Wipe accent={accent} /> : null}
					{whoosh ? <Sfx name="whoosh" at={0} volume={0.5} /> : null}
				</>
			}
		>
			{children}
		</SceneFrame>
	);
};

/** シーンの頭：ネイビーの幕が横に抜けて、次の画面が現れる */
const Wipe: React.FC<{accent: string}> = ({accent}) => {
	const frame = useCurrentFrame();
	if (frame > 20) {
		return null;
	}
	const x = interpolate(frame, [0, 18], [0, 105], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.7, 0, 0.3, 1),
	});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: `${x}%`,
					width: '110%',
					background: INK.base,
					transform: 'skewX(-12deg)',
					transformOrigin: '0 100%',
				}}
			>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: accent, boxShadow: `0 0 30px ${accent}`}} />
			</div>
		</AbsoluteFill>
	);
};
