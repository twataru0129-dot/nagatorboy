import React, {useState} from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {IMAGES} from '../data/assets';
import {COLORS} from '../theme';
import {useAssets} from './Contexts';
import {PersonIcon, ThumbsUpIcon} from './Icons';

// 説明役の人物（public/assets/teacher.png）
// 画像そのものは一切描き直さず、位置・拡大縮小・回転・上下移動だけで動かします。
// （左右反転もしません。見た目が変わってしまうため）

export type TeacherMotion = 'idle' | 'wave' | 'point' | 'nod' | 'still';

export const TeacherCharacter: React.FC<{
	/** 表示の高さ(px) */
	height: number;
	motion?: TeacherMotion;
	/** 動きの開始フレーム（wave / point / nod 用） */
	motionStart?: number;
	/** 手を振っている「動きの線」を出す */
	waveLines?: boolean;
	/** 親指を立てるバッジ（まとめシーン用） */
	thumbsUp?: number;
	/** 汗マーク（苦笑い・SCENE7 用） */
	sweat?: number;
	style?: React.CSSProperties;
}> = ({height, motion = 'idle', motionStart = 0, waveLines = false, thumbsUp = 0, sweat = 0, style}) => {
	const frame = useCurrentFrame();
	const assets = useAssets();
	const [failed, setFailed] = useState(false);
	const t = frame - motionStart;

	// 呼吸のような、ごく小さな上下の動き
	const bob = Math.sin(frame / 12) * 4;
	let rotate = 0;
	let dy = bob;
	let dx = 0;
	if (motion === 'wave' && t >= 0) {
		rotate = Math.sin(t / 4) * 4;
	}
	if (motion === 'point' && t >= 0) {
		const p = interpolate(t, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
		rotate = -6 * p;
		dx = -14 * p;
	}
	if (motion === 'nod' && t >= 0 && t < 30) {
		dy += Math.sin((t / 30) * Math.PI * 2) * 10;
	}
	if (motion === 'still') {
		dy = 0;
	}

	const showImage = assets.images.teacher && !failed;

	return (
		<div
			style={{
				position: 'absolute',
				height,
				transformOrigin: '50% 100%',
				transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
				...style,
			}}
		>
			{showImage ? (
				<Img
					src={staticFile(IMAGES.teacher)}
					onError={() => setFailed(true)}
					maxRetries={0}
					style={{
						height,
						width: 'auto',
						display: 'block',
						filter: 'drop-shadow(0 12px 18px rgba(20,50,100,0.25))',
					}}
				/>
			) : (
				<TeacherPlaceholder height={height} />
			)}

			{waveLines && motion === 'wave' && t >= 0 ? <WaveLines frame={t} height={height} /> : null}

			{thumbsUp > 0 ? (
				<div
					style={{
						position: 'absolute',
						right: -height * 0.28,
						top: height * 0.22,
						transform: `scale(${thumbsUp}) rotate(${(1 - thumbsUp) * -30}deg)`,
						background: '#fff',
						borderRadius: '50%',
						padding: 14,
						boxShadow: `0 8px 20px ${COLORS.shadow}`,
						border: `5px solid ${COLORS.orange}`,
						display: 'flex',
					}}
				>
					<ThumbsUpIcon size={height * 0.16} />
				</div>
			) : null}

			{sweat > 0 ? (
				<svg
					width={height * 0.09}
					height={height * 0.13}
					viewBox="0 0 40 60"
					style={{
						position: 'absolute',
						left: height * 0.37,
						top: -height * 0.02 + (1 - sweat) * -20,
						opacity: sweat,
					}}
				>
					<path d="M20 4 Q34 30 34 40 A14 14 0 0 1 6 40 Q6 30 20 4 Z" fill="#8CC8FF" stroke={COLORS.blue} strokeWidth="3" />
				</svg>
			) : null}
		</div>
	);
};

const WaveLines: React.FC<{frame: number; height: number}> = ({frame, height}) => {
	const o = 0.5 + 0.5 * Math.sin(frame / 3);
	return (
		<svg
			width={height * 0.22}
			height={height * 0.22}
			viewBox="0 0 100 100"
			style={{position: 'absolute', left: -height * 0.17, top: -height * 0.06, opacity: o, transform: 'scaleX(-1)'}}
		>
			<path d="M20 30 Q40 10 60 20" stroke={COLORS.orange} strokeWidth="7" fill="none" strokeLinecap="round" />
			<path d="M30 55 Q60 35 80 45" stroke={COLORS.orange} strokeWidth="7" fill="none" strokeLinecap="round" />
		</svg>
	);
};

/** teacher.png が見つからない時の仮表示（特定の人物は描かない） */
const TeacherPlaceholder: React.FC<{height: number}> = ({height}) => (
	<div
		style={{
			height,
			width: height * 0.5,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'flex-start',
		}}
	>
		<div
			style={{
				fontSize: Math.max(16, height * 0.035),
				color: COLORS.subText,
				background: 'rgba(255,255,255,0.85)',
				padding: '4px 10px',
				borderRadius: 8,
				whiteSpace: 'nowrap',
			}}
		>
			teacher.png
		</div>
		<PersonIcon size={height * 0.5} color="#9FB3D1" style={{width: height * 0.5, height: height * 0.9}} />
	</div>
);
