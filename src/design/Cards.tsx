import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {SafeImg} from '../components/SafeImg';
import {ImageKey} from '../data/assets';
import {Eyebrow, ramp} from './Kinetic';
import {IconName, LineIcon} from './LineIcon';
import {FONT_EN, FONT_JP, INK} from './tokens';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** すりガラス風のパネル（下からふわっと出る） */
export const Glass: React.FC<{at: number; style?: React.CSSProperties; accent?: string; children: React.ReactNode}> = ({
	at,
	style,
	accent,
	children,
}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, at, 22);
	return (
		<div
			style={{
				position: 'absolute',
				boxSizing: 'border-box',
				background: INK.glass,
				border: `1.5px solid ${INK.line}`,
				borderTop: accent ? `4px solid ${accent}` : `1.5px solid ${INK.line}`,
				borderRadius: 28,
				boxShadow: `0 30px 60px ${INK.shadow}`,
				opacity: p,
				transform: `translateY(${(1 - p) * 50}px) scale(${0.96 + 0.04 * p})`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

/** 写真：左からマスクで開いて、ゆっくりズーム。下にキャプション */
export const PhotoCard: React.FC<{
	name: ImageKey;
	at: number;
	caption: string;
	accent: string;
	style: React.CSSProperties;
	fallbackIcon: IconName;
	position?: string;
}> = ({name, at, caption, accent, style, fallbackIcon, position = '50% 50%'}) => {
	const frame = useCurrentFrame();
	const open = interpolate(frame, [at, at + 22], [100, 0], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});
	const zoom = interpolate(frame, [at, at + 300], [1.12, 1.0], clamp);
	return (
		<div style={{position: 'absolute', ...style}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 24,
					overflow: 'hidden',
					clipPath: `inset(0 ${open}% 0 0 round 24px)`,
					boxShadow: `0 30px 60px ${INK.shadow}`,
					background: INK.base3,
				}}
			>
				<div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
					<SafeImg
						name={name}
						style={{width: '100%', height: '100%', objectPosition: position}}
						fallback={
							<div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<LineIcon name={fallbackIcon} size={200} color={INK.mute} />
							</div>
						}
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'linear-gradient(180deg, rgba(10,19,38,0) 55%, rgba(10,19,38,0.85) 100%)',
					}}
				/>
			</div>
			<Eyebrow text={caption} at={at + 14} color={accent} size={26} style={{position: 'absolute', left: 28, bottom: 22}} />
		</div>
	);
};

/**
 * 覚えてほしいポイント（アンバーの「POINT」＋大きな一言）
 */
export const PointCallout: React.FC<{
	at: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	size?: number;
}> = ({at, children, style, size = 60}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, at, 18);
	const bar = ramp(frame, at + 6, 18);
	if (frame < at) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				display: 'flex',
				alignItems: 'stretch',
				gap: 0,
				opacity: p,
				transform: `translateX(${(1 - p) * -40}px)`,
				...style,
			}}
		>
			<div
				style={{
					background: INK.point,
					color: INK.base,
					fontFamily: FONT_EN,
					fontWeight: 800,
					fontSize: size * 0.42,
					letterSpacing: 4,
					padding: `0 ${size * 0.35}px`,
					display: 'flex',
					alignItems: 'center',
					borderRadius: '16px 0 0 16px',
				}}
			>
				POINT
			</div>
			<div
				style={{
					position: 'relative',
					background: 'rgba(255,200,87,0.10)',
					border: `2px solid ${INK.point}`,
					borderLeft: 'none',
					borderRadius: '0 16px 16px 0',
					padding: `${size * 0.22}px ${size * 0.55}px`,
					fontFamily: FONT_JP,
					fontWeight: 700,
					fontSize: size,
					color: INK.white,
					lineHeight: 1.3,
					whiteSpace: 'nowrap',
					overflow: 'hidden',
				}}
			>
				{/* 光がすっと横切る */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: `${-30 + bar * 160}%`,
						width: '30%',
						background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.18), rgba(255,255,255,0))',
					}}
				/>
				{children}
			</div>
		</div>
	);
};

/** 横に並ぶ手順（ノードとノードを線がつないでいく） */
export const StepLine: React.FC<{
	steps: {label: React.ReactNode; icon: IconName; at: number}[];
	accent: string;
	left: number;
	top: number;
	width: number;
	node?: number;
	labelSize?: number;
}> = ({steps, accent, left, top, width, node = 150, labelSize = 40}) => {
	const frame = useCurrentFrame();
	const gap = (width - node) / Math.max(1, steps.length - 1);
	const active = steps.reduce((a, s, i) => (frame >= s.at ? i : a), -1);
	return (
		<div style={{position: 'absolute', left, top, width, height: node + 200}}>
			{/* 背景の線 */}
			<div
				style={{
					position: 'absolute',
					left: node / 2,
					top: node / 2 - 2,
					width: (width - node) * ramp(frame, steps[0].at - 4, 20),
					height: 4,
					background: INK.faint,
					borderRadius: 2,
				}}
			/>
			{/* 進んだ分だけ光る線 */}
			{steps.map((s, i) =>
				i === 0 ? null : (
					<div
						key={`l${i}`}
						style={{
							position: 'absolute',
							left: node / 2 + gap * (i - 1),
							top: node / 2 - 2,
							height: 4,
							width: gap * ramp(frame, s.at - 12, 14),
							background: accent,
							borderRadius: 2,
							boxShadow: `0 0 16px ${accent}`,
						}}
					/>
				),
			)}
			{steps.map((s, i) => {
				const p = ramp(frame, s.at - 4, 16);
				const isActive = i === active;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: gap * i,
							top: 0,
							width: node,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							opacity: frame >= s.at - 4 ? Math.max(0.001, p) : 0,
							transform: `translateY(${(1 - p) * 30}px)`,
						}}
					>
						<div
							style={{
								width: node,
								height: node,
								borderRadius: '50%',
								background: isActive ? accent : INK.base2,
								border: `3px solid ${accent}`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: isActive ? `0 0 40px ${accent}88` : 'none',
								transform: `scale(${isActive ? 1.06 : 1})`,
							}}
						>
							<LineIcon name={s.icon} size={node * 0.56} color={isActive ? INK.base : INK.white} />
						</div>
						<div
							style={{
								marginTop: 22,
								width: gap + node - 30,
								textAlign: 'center',
								fontFamily: FONT_JP,
								fontWeight: 700,
								fontSize: labelSize,
								lineHeight: 1.3,
								color: isActive ? INK.white : INK.mute,
							}}
						>
							{s.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

/** チェック行（丸の中にチェックが描かれる） */
export const CheckRow: React.FC<{
	label: string;
	appearAt: number;
	checkAt: number;
	accent: string;
	size?: number;
	icon?: IconName;
}> = ({label, appearAt, checkAt, accent, size = 60, icon}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, appearAt, 16);
	const c = ramp(frame, checkAt, 12);
	const done = frame >= checkAt;
	const box = size * 1.1;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: size * 0.4,
				padding: `${size * 0.16}px ${size * 0.4}px ${size * 0.16}px ${size * 0.2}px`,
				borderRadius: 20,
				background: done ? `${accent}1F` : 'rgba(255,255,255,0.04)',
				border: `1.5px solid ${done ? accent : INK.line}`,
				opacity: p,
				transform: `translateX(${(1 - p) * -50}px)`,
			}}
		>
			<div
				style={{
					width: box,
					height: box,
					borderRadius: '50%',
					border: `3px solid ${done ? accent : INK.line}`,
					background: done ? accent : 'transparent',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${done ? 1 + 0.12 * Math.sin(Math.min(1, c) * Math.PI) : 1})`,
				}}
			>
				<svg width={box * 0.62} height={box * 0.62} viewBox="0 0 100 100">
					<path
						d="M18 52 L40 74 L84 26"
						fill="none"
						stroke={INK.base}
						strokeWidth="13"
						strokeLinecap="round"
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray={1}
						strokeDashoffset={1 - c}
					/>
				</svg>
			</div>
			{icon ? <LineIcon name={icon} size={size * 1.05} color={done ? accent : INK.mute} /> : null}
			<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: size, color: INK.white, whiteSpace: 'nowrap'}}>{label}</div>
		</div>
	);
};

/** シンプルなふきだし（白・角丸・アクセントの線） */
export const Bubble: React.FC<{
	at: number;
	children: React.ReactNode;
	accent: string;
	size?: number;
	tail?: 'left' | 'right' | 'bottom';
	style?: React.CSSProperties;
}> = ({at, children, accent, size = 58, tail = 'bottom', style}) => {
	const frame = useCurrentFrame();
	const s = interpolate(frame - at, [0, 8, 13], [0.6, 1.04, 1], clamp);
	const o = interpolate(frame - at, [0, 6], [0, 1], clamp);
	if (frame < at) {
		return null;
	}
	const tailStyle: React.CSSProperties =
		tail === 'bottom'
			? {left: 70, bottom: -26, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '28px solid #fff'}
			: tail === 'left'
				? {left: -26, top: '50%', marginTop: -20, borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderRight: '28px solid #fff'}
				: {right: -26, top: '50%', marginTop: -20, borderTop: '20px solid transparent', borderBottom: '20px solid transparent', borderLeft: '28px solid #fff'};
	return (
		<div
			style={{
				position: 'absolute',
				background: '#fff',
				color: INK.base,
				borderRadius: 28,
				padding: `${size * 0.42}px ${size * 0.7}px`,
				fontFamily: FONT_JP,
				fontWeight: 700,
				fontSize: size,
				lineHeight: 1.35,
				boxShadow: `0 24px 50px ${INK.shadow}`,
				borderLeft: `10px solid ${accent}`,
				opacity: o,
				transform: `scale(${s})`,
				transformOrigin: tail === 'bottom' ? '15% 100%' : tail === 'left' ? '0% 50%' : '100% 50%',
				...style,
			}}
		>
			{children}
			<div style={{position: 'absolute', width: 0, height: 0, ...tailStyle}} />
		</div>
	);
};

/** 大きな数字（カウント・ステップ番号など） */
export const BigNumber: React.FC<{value: string; at: number; size?: number; color?: string; outline?: boolean; style?: React.CSSProperties}> = ({
	value,
	at,
	size = 300,
	color = INK.white,
	outline = false,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, at, 20);
	return (
		<div
			style={{
				fontFamily: FONT_EN,
				fontWeight: 800,
				fontSize: size,
				lineHeight: 0.85,
				letterSpacing: -size * 0.04,
				color: outline ? 'transparent' : color,
				WebkitTextStroke: outline ? `3px ${color}` : undefined,
				opacity: p,
				transform: `translateY(${(1 - p) * size * 0.25}px)`,
				...style,
			}}
		>
			{value}
		</div>
	);
};
