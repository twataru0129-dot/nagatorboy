import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FONT_EN, INK} from './tokens';

// 奥行きのある背景：グラデーション＋光のにじみ＋薄いドット＋大きな透かし文字
// 各レイヤーを違う速さで動かして、ゆるいパララックスにする

export const Backdrop: React.FC<{
	accent?: string;
	/** 背景に大きく薄く置く文字（例: "01"） */
	watermark?: string;
	/** 光の位置のバリエーション */
	variant?: number;
	children?: React.ReactNode;
}> = ({accent = INK.day1, watermark, variant = 0, children}) => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const ox = [0, 380, -260][variant % 3];
	return (
		<AbsoluteFill style={{background: `linear-gradient(160deg, ${INK.base2} 0%, ${INK.base} 55%, #070E1C 100%)`, overflow: 'hidden'}}>
			{/* 光のにじみ（ゆっくり漂う） */}
			<div
				style={{
					position: 'absolute',
					left: 1150 + ox + Math.sin(t * 0.35) * 60,
					top: -260 + Math.cos(t * 0.3) * 40,
					width: 1100,
					height: 1100,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 62%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: -420 - ox * 0.5 + Math.cos(t * 0.25) * 50,
					top: 520 + Math.sin(t * 0.3) * 40,
					width: 1000,
					height: 1000,
					borderRadius: '50%',
					background: `radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)`,
				}}
			/>
			{/* 薄いドット（少しずつ流れる） */}
			<AbsoluteFill
				style={{
					backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1.6px, transparent 1.6px)',
					backgroundSize: '44px 44px',
					backgroundPosition: `${-t * 6}px ${-t * 3}px`,
					maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.25))',
					WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.25))',
				}}
			/>
			{/* 大きな透かし文字（いちばん奥：ゆっくり横へ） */}
			{watermark ? (
				<div
					style={{
						position: 'absolute',
						right: -60 + t * 4,
						bottom: -160,
						fontFamily: FONT_EN,
						fontWeight: 800,
						fontSize: 720,
						lineHeight: 1,
						color: 'transparent',
						WebkitTextStroke: '3px rgba(255,255,255,0.06)',
						letterSpacing: -20,
					}}
				>
					{watermark}
				</div>
			) : null}
			{children}
		</AbsoluteFill>
	);
};

/** 画面の四隅を少し暗くして、映画っぽく締める */
export const Vignette: React.FC = () => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)',
		}}
	/>
);

/** 人物の後ろに置く、やわらかいスポットライト */
export const Spotlight: React.FC<{x: number; y: number; size?: number; color?: string; opacity?: number}> = ({
	x,
	y,
	size = 900,
	color = INK.day1,
	opacity = 1,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x - size / 2,
			top: y - size / 2,
			width: size,
			height: size,
			borderRadius: '50%',
			background: `radial-gradient(circle, ${color}66 0%, ${color}00 65%)`,
			opacity,
		}}
	/>
);
