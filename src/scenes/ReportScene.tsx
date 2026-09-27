import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, pop} from '../components/anim';
import {ArrowFlow} from '../components/ArrowFlow';
import {useBeats} from '../components/Contexts';
import {CheckMark, PersonIcon, SearchIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {Sfx} from '../components/Sfx';
import {SpeechBubble} from '../components/SpeechBubble';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 10 2日目 担任へ報告 → 確認 → OK！

export const ReportScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const walk = b('walk');
	const bubble = b('bubble');
	const inspect = b('inspect');
	const ok = b('ok');
	const complete = b('complete');

	// 生活係（生徒）が先生のところへ歩いていく
	const walkP = interpolate(frame, [walk, walk + 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const studentX = 120 + (1 - (1 - walkP) ** 2) * 640;
	const stepBob = walkP > 0 && walkP < 1 ? Math.abs(Math.sin(frame / 3)) * -16 : 0;
	const okIn = pop(frame, ok, 10);

	return (
		<SceneFrame>
			<SceneHeader day={2} title="最後に 担任の先生へ報告" />

			{/* 報告 → 確認 → OK の流れ */}
			<ArrowFlow
				style={{position: 'absolute', left: 60, top: 220}}
				color={COLORS.green}
				cardWidth={200}
				cardHeight={110}
				fontSize={50}
				arrowSize={64}
				gap={10}
				steps={[
					{label: '報告', at: bubble},
					{label: '確認', at: inspect},
					{label: '直す', at: b('fix')},
					{label: 'OK！', at: ok},
					{label: '完了', at: complete},
				]}
			/>

			{/* 生活係（生徒のピクトグラム） */}
			<div style={{position: 'absolute', left: studentX, top: 690 + stepBob, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<PersonIcon size={300} color={COLORS.green} />
				<div
					style={{
						marginTop: -6,
						background: COLORS.green,
						color: '#fff',
						fontSize: 40,
						fontWeight: 700,
						borderRadius: 14,
						padding: '4px 22px',
						whiteSpace: 'nowrap',
					}}
				>
					生活係
				</div>
			</div>

			{/* 「○○号室、終わりました！」 */}
			{frame >= bubble && frame < ok ? (
				<div
					style={{
						position: 'absolute',
						left: 330,
						top: 380,
						transform: `scale(${pop(frame, bubble)})`,
						transformOrigin: '20% 100%',
					}}
				>
					<SpeechBubble tail="bottom" color={COLORS.green} fontSize={80}>
						○○号室、
						<br />
						終わりました！
					</SpeechBubble>
				</div>
			) : null}

			{/* 担任の先生（説明役の人物） */}
			<TeacherCharacter height={720} motion="nod" motionStart={ok} style={{right: 180, bottom: -20}} />
			<div
				style={{
					position: 'absolute',
					right: 170,
					top: 290,
					background: '#fff',
					border: `4px solid ${COLORS.blue}`,
					color: COLORS.blue,
					fontSize: 40,
					fontWeight: 700,
					borderRadius: 14,
					padding: '4px 22px',
					...appear(frame, walk),
				}}
			>
				担任の先生
			</div>

			{/* 先生が部屋を確認 */}
			{frame >= inspect && frame < ok ? (
				<div
					style={{
						position: 'absolute',
						left: 1130,
						top: 400,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 10,
						...appear(frame, inspect),
					}}
				>
					<div style={{transform: `translate(${Math.sin(frame / 6) * 16}px, ${Math.cos(frame / 6) * 10}px)`}}>
						<SearchIcon size={170} />
					</div>
					<div
						style={{
							fontSize: 44,
							fontWeight: 700,
							color: COLORS.text,
							background: '#fff',
							borderRadius: 20,
							padding: '10px 24px',
							boxShadow: `0 6px 16px ${COLORS.shadow}`,
							textAlign: 'center',
							lineHeight: 1.3,
							...appear(frame, b('fix')),
						}}
					>
						直すところは
						<br />
						直そう
					</div>
				</div>
			) : null}

			{/* OK！ */}
			{frame >= ok ? (
				<div
					style={{
						position: 'absolute',
						left: 900,
						top: 360,
						width: 520,
						height: 520,
						borderRadius: '50%',
						background: '#fff',
						border: `18px solid ${COLORS.green}`,
						boxShadow: `0 16px 40px rgba(23,163,90,0.35)`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${okIn}) rotate(${(1 - okIn) * -20}deg)`,
					}}
				>
					<CheckMark size={220} />
					<div style={{fontSize: 150, fontWeight: 700, color: COLORS.green, lineHeight: 1}}>OK！</div>
				</div>
			) : null}

			{/* 「生活係の仕事は完了です」 */}
			{frame >= complete ? (
				<div
					style={{
						position: 'absolute',
						left: 60,
						top: 440,
						background: COLORS.green,
						color: '#fff',
						fontSize: 76,
						fontWeight: 700,
						borderRadius: 30,
						padding: '16px 50px',
						boxShadow: `0 12px 30px rgba(23,163,90,0.4)`,
						transform: `scale(${pop(frame, complete)})`,
						transformOrigin: 'left center',
						whiteSpace: 'nowrap',
					}}
				>
					生活係の仕事 完了！
				</div>
			) : null}

			<Sfx name="ok" at={ok} />
		</SceneFrame>
	);
};
