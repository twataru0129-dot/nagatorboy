import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, overshoot, progress, stampIn} from '../components/anim';
import {useBeats, useSceneDuration} from '../components/Contexts';
import {FutonIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {Sparkle, TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 4 ②ベッド・布団の準備（生活係は「声かけ・確認」）

export const BedScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const duration = useSceneDuration();
	// 写真をゆっくりズーム
	const zoom = interpolate(frame, [0, duration], [1, 1.08]);
	const emphasis = b('call');
	const strike = progress(frame, b('rather'), 12);

	return (
		<SceneFrame
			hud={<SceneHeader day={1} number={2} title="ベッド・布団の準備" />}
			camera={[
				{at: b('call', 0.3), zoom: 1.08, x: 1150, y: 470, ease: 14},
				{at: b('help', -0.4), zoom: 1, x: 1150, y: 470, ease: 18},
			]}
		>

			<div
				style={{
					position: 'absolute',
					left: 60,
					top: 280,
					width: 780,
					height: 470,
					borderRadius: 30,
					overflow: 'hidden',
					border: '8px solid #fff',
					boxShadow: `0 10px 26px ${COLORS.shadow}`,
					...appear(frame, b('photo'), 40, 18),
				}}
			>
				<div style={{width: '100%', height: '100%', transform: `scale(${zoom})`}}>
					<SafeImg
						name="bedMaking"
						style={{width: '100%', height: '100%'}}
						fallback={
							<ImagePlaceholder label="bed-making.png" style={{width: '100%', height: '100%'}}>
								<FutonIcon size={260} />
							</ImagePlaceholder>
						}
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(28,111,214,0.9)',
						color: '#fff',
						fontSize: 40,
						fontWeight: 700,
						textAlign: 'center',
						padding: '6px 0',
					}}
				>
					ベッドメイキング 完成図
				</div>
			</div>

			{/* 生活係は… 全部やる ではなく 声かけ・確認 */}
			<div style={{position: 'absolute', left: 880, top: 240, width: 660}}>
				<div style={{fontSize: 64, fontWeight: 700, color: COLORS.subText, ...appear(frame, b('lead'))}}>生活係は…</div>

				<div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 24, marginTop: 18, ...appear(frame, b('notAll'))}}>
					<div style={{position: 'relative', fontSize: 72, fontWeight: 700, color: COLORS.subText}}>
						全部やる
						<div
							style={{
								position: 'absolute',
								left: -6,
								top: '52%',
								height: 10,
								width: `${strike * 104}%`,
								background: COLORS.red,
								borderRadius: 5,
							}}
						/>
					</div>
					<div
						style={{
							fontSize: 80,
							fontWeight: 700,
							color: COLORS.red,
							lineHeight: 1,
							...(frame >= b('rather') ? stampIn(frame, b('rather')) : {opacity: 0}),
						}}
					>
						✕
					</div>
					<div style={{fontSize: 52, fontWeight: 700, color: COLORS.text, ...appear(frame, b('rather'))}}>ではなく</div>

				</div>

				<div
					style={{
						marginTop: 30,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 16,
						background: COLORS.yellow,
						borderRadius: 30,
						padding: '24px 40px',
						border: `8px solid ${COLORS.orange}`,
						boxShadow: `0 12px 30px rgba(255,138,31,0.35)`,
						transformOrigin: 'left center',
						position: 'relative',
						...stampIn(frame, emphasis),
					}}
				>
					<span style={{fontSize: 100, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>
						声かけ
						<span style={{display: 'inline-block', ...(frame >= b('check') ? stampIn(frame, b('check')) : {opacity: 0})}}>・確認</span>
					</span>
					{frame >= b('check') ? (
						<Sparkle x={620} y={10} size={36} scale={overshoot(frame, b('check', 0.3), 12, 0.3) * (0.8 + 0.2 * Math.sin(frame / 5))} />
					) : null}
				</div>

				<div
					style={{
						marginTop: 40,
						fontSize: 50,
						fontWeight: 700,
						color: COLORS.green,
						background: COLORS.greenLight,
						borderRadius: 24,
						padding: '16px 30px',
						lineHeight: 1.35,
						display: 'inline-block',
						...appear(frame, b('help')),
					}}
				>
					困っている人には
					<br />
					<span style={{opacity: progress(frame, b('teach'), 10)}}>やさしく教える</span>
				</div>
			</div>

			<TeacherCharacter
				height={560}
				expression="smile"
				cues={[
					{at: b('photo'), pose: 'point', pointDir: 'left'},
					{at: b('lead'), pose: 'explain'},
					{at: b('notAll'), expression: 'thinking'},
					{at: b('rather'), expression: 'serious'},
					{at: emphasis, expression: 'happy'},
					{at: b('check'), pose: 'check'},
					{at: b('help'), pose: 'explain', expression: 'gentle'},
				]}
				nods={[b('call', 0.5), b('check', 0.5), b('teach', 0.3)]}
				style={{right: 30, bottom: -20}}
			/>
		</SceneFrame>
	);
};
