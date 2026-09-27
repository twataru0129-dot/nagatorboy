import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {appear, pop} from '../components/anim';
import {useBeats} from '../components/Contexts';
import {SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {NumberCircle} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS, DAY_COLORS} from '../theme';

// SCENE 2 長瀞げんきプラザ：生活係の仕事は7つ！

export const JOBS: {label: string; day: 1 | 2}[] = [
	{label: 'リネンを配る', day: 1},
	{label: 'ベッド・布団の準備', day: 1},
	{label: 'お風呂掃除', day: 1},
	{label: '健康チェックカード', day: 1},
	{label: '荷物・布団整理の声かけ', day: 2},
	{label: 'リネンを回収して返す', day: 2},
	{label: '部屋の自主点検', day: 2},
];

export const FacilityScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const zoom = interpolate(frame, [0, 180], [1.0, 1.08], {extrapolateRight: 'clamp'});

	return (
		<SceneFrame background={<PlazaBackground zoom={zoom} />}>
			{/* 見出し：「長瀞げんきプラザで」→「生活係の仕事は7つ！」 */}
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 60,
					background: 'rgba(255,255,255,0.95)',
					borderRadius: 36,
					padding: '26px 56px',
					boxShadow: `0 10px 30px ${COLORS.shadow}`,
					borderBottom: `10px solid ${COLORS.blue}`,
					...appear(frame, b('place'), 40, 18),
				}}
			>
				<div style={{fontSize: 64, fontWeight: 700, color: COLORS.blue, whiteSpace: 'nowrap'}}>長瀞げんきプラザ</div>
				{frame >= b('jobs') ? (
					<div style={{fontSize: 104, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap', ...appear(frame, b('jobs'), 20)}}>
						生活係の仕事は<span style={{color: COLORS.orange, fontSize: 140}}>7つ</span>！
					</div>
				) : null}
			</div>

			{/* 「生活係は、みんなが気持ちよく過ごせるように動きます」 */}
			{frame < b('jobs') ? (
				<div
					style={{
						position: 'absolute',
						left: 80,
						top: 330,
						background: 'rgba(255,255,255,0.96)',
						borderRadius: 36,
						padding: '30px 56px',
						boxShadow: `0 10px 30px ${COLORS.shadow}`,
						border: `6px solid ${COLORS.green}`,
						lineHeight: 1.35,
						opacity: interpolate(frame, [b('jobs') - 8, b('jobs')], [1, 0], {extrapolateLeft: 'clamp'}),
						...appear(frame, b('role'), 40, 18),
					}}
				>
					<div style={{fontSize: 72, fontWeight: 700, color: COLORS.text}}>生活係は</div>
					{frame >= b('comfort') ? (
						<div style={{fontSize: 72, fontWeight: 700, color: COLORS.green, ...appear(frame, b('comfort'), 20)}}>
							みんなが気持ちよく
							<br />
							過ごせるように動く！
						</div>
					) : null}
				</div>
			) : null}

			{/* 7つの仕事（1日目＝青、2日目＝緑） */}
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 420,
					width: 1320,
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '18px 24px',
				}}
			>
				{JOBS.map((job, i) => {
					const p = pop(frame, b('jobs', 0.5) + i * 7);
					const c = DAY_COLORS[job.day];
					return (
						<div
							key={job.label}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 18,
								background: 'rgba(255,255,255,0.96)',
								borderRadius: 22,
								padding: '12px 22px',
								border: `5px solid ${c.main}`,
								boxShadow: `0 6px 16px ${COLORS.shadow}`,
								opacity: Math.min(1, p * 1.5),
								transform: `scale(${0.7 + 0.3 * p})`,
							}}
						>
							<NumberCircle n={i + 1} color={c.main} size={70} />
							<div style={{fontSize: 44, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>{job.label}</div>
						</div>
					);
				})}
			</div>

			<TeacherCharacter height={820} motion="nod" motionStart={b('jobs')} style={{right: 70, bottom: -20}} />
		</SceneFrame>
	);
};

/** 長瀞げんきプラザの写真（なければ建物のシンプルなイラスト） */
export const PlazaBackground: React.FC<{zoom?: number; dim?: number}> = ({zoom = 1, dim = 0.25}) => (
	<AbsoluteFill style={{overflow: 'hidden', background: '#DDEFFF'}}>
		<AbsoluteFill style={{transform: `scale(${zoom})`}}>
			<SafeImg name="plaza" style={{width: '100%', height: '100%'}} fallback={<PlazaIllustration />} />
		</AbsoluteFill>
		<AbsoluteFill style={{background: `linear-gradient(90deg, rgba(255,255,255,${dim + 0.35}) 0%, rgba(255,255,255,${dim}) 70%, rgba(255,255,255,0) 100%)`}} />
	</AbsoluteFill>
);

const PlazaIllustration: React.FC = () => (
	<svg width="1920" height="1080" viewBox="0 0 1920 1080">
		<defs>
			<linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#9ED8FF" />
				<stop offset="1" stopColor="#EAF7FF" />
			</linearGradient>
		</defs>
		<rect width="1920" height="1080" fill="url(#psky)" />
		<path d="M0 520 L260 360 L520 480 L820 330 L1120 470 L1420 340 L1700 460 L1920 380 V700 H0 Z" fill="#8CC7A5" />
		<path d="M0 600 L400 500 L900 590 L1400 510 L1920 580 V760 H0 Z" fill="#5BAE7C" />
		{/* 建物 */}
		<rect x="560" y="470" width="900" height="330" fill="#FFFFFF" stroke="#B8C3D6" strokeWidth="6" />
		<path d="M530 480 L1010 380 L1490 480 Z" fill="#2E6FB5" />
		{Array.from({length: 4}).map((_, r) =>
			Array.from({length: 8}).map((__, c) => (
				<rect key={`${r}-${c}`} x={600 + c * 105} y={500 + r * 70} width="70" height="44" fill="#CFE6FF" stroke="#9DB7D6" strokeWidth="3" />
			)),
		)}
		<rect x="960" y="720" width="100" height="80" fill="#8FB8E0" />
		<rect y="800" width="1920" height="280" fill="#7CC08E" />
		<rect x="880" y="800" width="260" height="280" fill="#E7DCC8" />
	</svg>
);
