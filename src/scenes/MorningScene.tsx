import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {pop, progress} from '../components/anim';
import {SafeImg} from '../components/SafeImg';
import {ArrowFlow} from '../components/ArrowFlow';
import {Clock} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {AlarmIcon, BoxIcon, FutonIcon, MegaphoneIcon, SleepyPersonIcon, SunIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {Sfx} from '../components/Sfx';
import {SpeechBubble} from '../components/SpeechBubble';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 7 2日目 6:00ごろ ⑤荷物・布団整理の声かけ（ギャグあり）

export const MorningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const gag = b('gag');
	const alarm = b('alarm');
	const wry = b('wry');
	const gagIn = pop(frame, gag);
	// 目覚まし時計がブルブル震える
	const shake = frame >= alarm && frame < alarm + 40 ? Math.sin(frame * 2.2) * 8 : 0;

	return (
		<SceneFrame background={<MorningRoom frame={frame} />}>
			<SceneHeader day={2} number={5} title="荷物・布団整理の声かけ" time={<Clock time="6:00" day={2} start={4} />} />

			<ArrowFlow
				style={{position: 'absolute', left: 40, top: 250}}
				color={COLORS.green}
				cardWidth={400}
				cardHeight={330}
				fontSize={46}
				arrowSize={90}
				gap={14}
				steps={[
					{label: 'まだねむい…', icon: <SleepyPersonIcon size={200} zzz={frame / 20} />, at: b('sleepy')},
					{
						label: (
							<>
								生活係が
								<br />
								声をかける
							</>
						),
						icon: <MegaphoneIcon size={120} />,
						at: b('call'),
					},
					{
						label: (
							<>
								荷物・布団
								<br />
								整理スタート
							</>
						),
						icon: (
							<SafeImg
								name="bedCleanup"
								fit="contain"
								style={{width: 340, height: 130}}
								fallback={
									<div style={{display: 'flex'}}>
										<FutonIcon size={110} />
										<BoxIcon size={110} />
									</div>
								}
							/>
						),
						at: b('start'),
					},
				]}
			/>

			{/* ギャグ：まだ夢の中の人がいたら… */}
			{frame >= gag ? (
				<div
					style={{
						position: 'absolute',
						left: 70,
						top: 660,
						display: 'flex',
						alignItems: 'center',
						gap: 70,
						opacity: Math.min(1, gagIn * 1.5),
						transform: `scale(${0.7 + 0.3 * gagIn})`,
						transformOrigin: 'left center',
					}}
				>
					<div style={{transform: `rotate(${shake}deg)`}}>
						<AlarmIcon size={220} />
					</div>
					<SpeechBubble tail="right" color={COLORS.green} fontSize={54}>
						まだ<span style={{color: COLORS.blue}}>夢の中</span>の人がいたら…
						<br />
						やさしく<span style={{color: COLORS.orange}}>現実</span>に戻してあげよう
					</SpeechBubble>
				</div>
			) : null}

			<TeacherCharacter
				height={470}
				motion="nod"
				motionStart={wry}
				sweat={progress(frame, wry, 10)}
				style={{right: 50, bottom: -15}}
			/>

			<Sfx name="alarm" at={alarm} volume={0.8} />
		</SceneFrame>
	);
};

/** 朝の宿泊室（窓から朝日） */
const MorningRoom: React.FC<{frame: number}> = ({frame}) => {
	const sunY = interpolate(frame, [0, 120], [300, 170], {extrapolateRight: 'clamp'});
	const glow = 0.25 + 0.1 * Math.sin(frame / 15);
	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #FFF8E6 0%, #FFFDF6 55%, #EAF7EF 100%)'}}>
			{/* 窓 */}
			<div
				style={{
					position: 'absolute',
					right: 60,
					top: 220,
					width: 360,
					height: 330,
					borderRadius: 16,
					border: '14px solid #D9C7A8',
					overflow: 'hidden',
					background: 'linear-gradient(180deg, #FFD89A 0%, #CDEBFF 100%)',
					opacity: 0.9,
				}}
			>
				<div style={{position: 'absolute', left: 100, top: sunY - 200}}>
					<SunIcon size={170} />
				</div>
				<div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 12, background: '#D9C7A8'}} />
				<svg width="360" height="330" style={{position: 'absolute', inset: 0}}>
					<path d="M0 260 L120 190 L220 240 L300 180 L360 230 V330 H0 Z" fill="#7CC08E" />
				</svg>
			</div>
			{/* 朝の光 */}
			<svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
				<path d="M1380 240 L600 1080 L1100 1080 L1760 560 Z" fill="#FFE9A8" opacity={glow} />
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: '#EFE3CC'}} />
		</AbsoluteFill>
	);
};
