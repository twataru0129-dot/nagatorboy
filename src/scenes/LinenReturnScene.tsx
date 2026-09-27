import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, pop} from '../components/anim';
import {ArrowFlow} from '../components/ArrowFlow';
import {useBeats} from '../components/Contexts';
import {BagIcon, DoorIcon, PillowIcon, SheetIcon, StairsIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 8 2日目 ⑥リネンを回収して返す

export const LinenReturnScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const bags = pop(frame, b('bags'), 13);

	return (
		<SceneFrame>
			<SceneHeader day={2} number={6} title="リネンを回収して返す" />

			{/* 「使ったリネンを回収します」 */}
			{frame < b('step1') ? (
				<div
					style={{
						position: 'absolute',
						left: 60,
						top: 300,
						display: 'flex',
						alignItems: 'center',
						gap: 30,
						background: '#fff',
						borderRadius: 40,
						padding: '30px 60px',
						border: `6px solid ${COLORS.green}`,
						boxShadow: `0 10px 30px ${COLORS.shadow}`,
						opacity: interpolate(frame, [b('step1', -0.3), b('step1')], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						...appear(frame, b('used'), 40, 18),
					}}
				>
					<SheetIcon size={180} />
					<PillowIcon size={180} />
					<div style={{fontSize: 84, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>
						使ったリネンを<span style={{color: COLORS.green}}>回収</span>
					</div>
				</div>
			) : null}

			<ArrowFlow
				style={{position: 'absolute', left: 40, top: 240}}
				color={COLORS.green}
				cardWidth={350}
				cardHeight={290}
				fontSize={44}
				arrowSize={76}
				gap={10}
				steps={[
					{label: '担当する部屋', icon: <DoorIcon size={120} />, at: b('step1')},
					{
						label: (
							<span style={{fontSize: 42}}>
								シーツ・
								<br />
								枕カバーを回収
							</span>
						),
						icon: (
							<div style={{display: 'flex'}}>
								<SheetIcon size={100} />
								<PillowIcon size={100} />
							</div>
						),
						at: b('step2'),
					},
					{label: <span style={{fontSize: 64}}>3階</span>, icon: <StairsIcon size={120} />, at: b('step3')},
					{label: <span style={{color: COLORS.blue}}>青い返却袋</span>, icon: <BagIcon size={120} />, at: b('step4')},
				]}
			/>

			{/* 返却袋の写真を大きく */}
			<div
				style={{
					position: 'absolute',
					left: 200,
					top: 570,
					width: 500,
					height: 470,
					borderRadius: 30,
					overflow: 'hidden',
					border: `8px solid ${COLORS.blue}`,
					boxShadow: `0 12px 30px ${COLORS.shadow}`,
					background: '#fff',
					opacity: Math.min(1, bags * 1.5),
					transform: `scale(${0.6 + 0.4 * bags})`,
				}}
			>
				<SafeImg
					name="returnBags"
					style={{width: '100%', height: '100%', objectPosition: '50% 100%'}}
					fallback={
						<ImagePlaceholder label="return-bags.png" style={{width: '100%', height: '100%'}}>
							<div style={{display: 'flex', gap: 20}}>
								<BagIcon size={200} />
								<BagIcon size={200} />
							</div>
						</ImagePlaceholder>
					}
				/>
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						background: COLORS.blue,
						color: '#fff',
						fontSize: 48,
						fontWeight: 700,
						padding: '8px 30px',
						borderBottomRightRadius: 24,
					}}
				>
					3階・青い返却袋
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 790,
					top: 760,
					background: COLORS.orange,
					color: '#fff',
					fontSize: 56,
					fontWeight: 700,
					borderRadius: 30,
					padding: '18px 40px',
					boxShadow: `0 8px 20px ${COLORS.shadow}`,
					lineHeight: 1.3,
					...appear(frame, b('forget')),
				}}
			>
				取り忘れは
				<br />
				ないかな？
			</div>

			<TeacherCharacter height={480} motion="nod" motionStart={b('forget')} style={{right: 50, bottom: -15}} />
		</SceneFrame>
	);
};
