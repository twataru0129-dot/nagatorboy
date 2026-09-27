import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear} from '../components/anim';
import {ArrowFlow} from '../components/ArrowFlow';
import {Clock} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {CardIcon, CardsStackIcon, PersonIcon, ThermometerIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 6 21:50ごろ ④健康チェックカード（4ステップ）

const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
	<span style={{color: COLORS.blue}}>{children}</span>
);

export const HealthScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();

	return (
		<SceneFrame>
			<SceneHeader day={1} number={4} title="健康チェックカード" time={<Clock time="21:50" day={1} start={4} />} />

			{/* 「夜、寝る前には健康チェックがあります」 */}
			<div
				style={{
					position: 'absolute',
					left: 50,
					top: 225,
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					background: COLORS.blueDark,
					color: '#fff',
					fontSize: 52,
					fontWeight: 700,
					borderRadius: 999,
					padding: '8px 40px 8px 20px',
					...appear(frame, b('night'), 30, 15),
				}}
			>
				<MoonIcon />
				寝る前に 健康チェック
			</div>

			{/* 話し始め〜体温の説明の前まで：大きく「寝る前に 健康チェック」 */}
			{frame < b('step1') ? (
				<div
					style={{
						position: 'absolute',
						left: 50,
						top: 380,
						display: 'flex',
						alignItems: 'center',
						gap: 40,
						background: '#fff',
						borderRadius: 40,
						padding: '36px 64px',
						border: `6px solid ${COLORS.blueDark}`,
						boxShadow: `0 10px 30px ${COLORS.shadow}`,
						opacity: interpolate(frame, [b('step1', -0.3), b('step1')], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						...appear(frame, b('night', 0.3), 40, 18),
					}}
				>
					<CardIcon size={220} />
					<div style={{fontSize: 84, fontWeight: 700, color: COLORS.text, lineHeight: 1.3}}>
						夜、寝る前に
						<br />
						<span style={{color: COLORS.blue}}>健康チェック</span>
					</div>
				</div>
			) : null}

			<ArrowFlow
				style={{position: 'absolute', left: 20, right: 20, top: 350}}
				color={COLORS.blue}
				cardWidth={320}
				cardHeight={470}
				fontSize={38}
				arrowSize={56}
				gap={6}
				steps={[
					{label: <StepLabel n={1}>体温を測る</StepLabel>, icon: <ThermometerIcon size={160} />, at: b('step1')},
					{
						label: (
							<StepLabel n={2}>
								健康チェック
								<br />
								カードに記入
							</StepLabel>
						),
						icon: <CardIcon size={160} />,
						at: b('step2'),
					},
					{
						label: (
							<StepLabel n={3}>
								<Em>生活係</Em>が
								<br />
								担当する部屋
								<br />
								を回って集める
							</StepLabel>
						),
						icon: <CardsStackIcon size={140} />,
						at: b('step3'),
					},
					{
						label: (
							<StepLabel n={4}>
								クラス分を
								<br />
								まとめる
							</StepLabel>
						),
						icon: <CardsStackIcon size={140} color={COLORS.green} />,
						at: b('step4'),
					},
					{
						label: (
							<StepLabel n={5}>
								<Em>担任の先生</Em>
								<br />
								へ渡す
							</StepLabel>
						),
						icon: <PersonIcon size={140} color={COLORS.green} />,
						at: b('step5'),
					},
				]}
			/>

			{/* 先生（顔アップ・まじめに確認） */}
			<TeacherCharacter
				height={250}
				shot="close"
				expression="serious"
				pose="check"
				cues={[{at: b('step5', 0.6), expression: 'smile'}]}
				nods={[b('step1'), b('step2'), b('step3', 1.0), b('step4'), b('step5')]}
				calm
				style={{right: 40, bottom: 0}}
			/>
		</SceneFrame>
	);
};

const MoonIcon: React.FC = () => (
	<svg width="60" height="60" viewBox="0 0 100 100">
		<path d="M64 12 A40 40 0 1 0 88 70 A32 32 0 1 1 64 12 Z" fill={COLORS.yellow} />
	</svg>
);

const StepLabel: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div
			style={{
				width: 64,
				height: 64,
				borderRadius: '50%',
				background: COLORS.blue,
				color: '#fff',
				fontSize: 42,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{n}
		</div>
		<div>{children}</div>
	</div>
);
