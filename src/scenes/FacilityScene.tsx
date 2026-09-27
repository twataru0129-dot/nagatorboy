import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {appear, overshoot} from '../components/anim';
import {useBeats} from '../components/Contexts';
import {SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {NumberCircle} from '../components/SceneHeader';
import {Sparkle, TeacherCharacter} from '../components/TeacherCharacter';
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
	const allShown = b('allShown');
	// 背景はゆっくりズーム（7つ出そろったら止める）
	const zoom = interpolate(frame, [0, allShown], [1.0, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// 「7つ！」をぐっと大きく（行き過ぎて戻る）
	const sevenScale = overshoot(frame, b('jobs', 0.15), 16, 0.35);
	const sevenGlow = interpolate(frame - b('jobs'), [0, 10, 40], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<SceneFrame
			background={<PlazaBackground zoom={zoom} />}
			camera={[
				{at: b('jobs', 0.3), zoom: 1.06, x: 500, y: 180, ease: 10},
				{at: b('jobs', 1.2), zoom: 1, x: 500, y: 180, ease: 16},
			]}
		>
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
						生活係の仕事は
						<span
							style={{
								display: 'inline-block',
								color: COLORS.orange,
								fontSize: 150,
								transform: `scale(${sevenScale}) rotate(${(1 - Math.min(1, sevenScale)) * 20}deg)`,
								textShadow: `0 0 ${24 * sevenGlow}px rgba(255,138,31,0.7)`,
							}}
						>
							7つ
						</span>
						！
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
					const p = overshoot(frame, b('jobs', 0.6) + i * 7, 14, 0.14);
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
								opacity: Math.min(1, p * 2),
								transform: `translateY(${(1 - Math.min(1, p)) * 40}px) scale(${0.7 + 0.3 * p})`,
							}}
						>
							<NumberCircle n={i + 1} color={c.main} size={70} />
							<div style={{fontSize: 44, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>{job.label}</div>
						</div>
					);
				})}
			</div>

			<TeacherCharacter
				height={820}
				expression="smile"
				cues={[
					{at: b('place'), pose: 'point', pointDir: 'left'},
					{at: b('role'), pose: 'explain', expression: 'smile'},
					{at: b('comfort'), expression: 'gentle'},
					{at: b('jobs'), pose: 'point', pointDir: 'left', expression: 'happy'},
					{at: b('jobs', 1.0), pose: 'explain'},
					// 7つ出そろったら説明を終えて、落ち着いて待つ（漫符なし・動きなし）
					{at: allShown, pose: 'normal', expression: 'neutral'},
				]}
				nods={[b('comfort', 0.6), allShown]}
				calm={frame >= allShown}
				style={{right: 70, bottom: -20}}
			/>
			{frame >= b('jobs') && frame < allShown ? (
				<Sparkle x={1400} y={120} size={40} scale={overshoot(frame, b('jobs', 0.2), 12, 0.3) * (0.8 + 0.2 * Math.sin(frame / 5))} />
			) : null}

			{/* 確認の時間：短い見出しだけを静かに出す */}
			{frame >= allShown ? (
				<div
					style={{
						position: 'absolute',
						left: 80,
						top: 900,
						background: COLORS.green,
						color: '#fff',
						fontSize: 56,
						fontWeight: 700,
						borderRadius: 999,
						padding: '10px 44px',
						boxShadow: `0 8px 20px ${COLORS.shadow}`,
						whiteSpace: 'nowrap',
						...appear(frame, allShown, 20, 15),
					}}
				>
					7つの仕事を確認しよう！
				</div>
			) : null}
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
