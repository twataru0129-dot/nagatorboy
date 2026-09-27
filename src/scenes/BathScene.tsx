import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, bounceIn, emphasize} from '../components/anim';
import {CheckItem} from '../components/CheckItem';
import {TimeLabel} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {BathIcon, BoxIcon, BroomIcon, PersonIcon, SearchIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 5 入浴後 ③お風呂掃除

export const BathScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();

	return (
		<SceneFrame
			hud={<SceneHeader
				day={1}
				number={3}
				title="お風呂掃除"
				time={<TimeLabel text="入浴後" day={1} start={b('afterBath')} icon={<BathIcon size={100} />} />}
			/>}
			camera={[
				{at: b('together', 0.3), zoom: 1.07, x: 420, y: 900, ease: 14},
				{at: b('together', 2.6), zoom: 1, x: 420, y: 900, ease: 20},
			]}
		>

			{/* 「入浴が終わったら、お風呂掃除です」 */}
			{frame < b('check1', -0.5) ? (
				<div
					style={{
						position: 'absolute',
						left: 140,
						top: 330,
						display: 'flex',
						alignItems: 'center',
						gap: 40,
						background: '#fff',
						borderRadius: 40,
						padding: '36px 60px',
						border: `6px solid ${COLORS.blue}`,
						boxShadow: `0 10px 30px ${COLORS.shadow}`,
						opacity: interpolate(frame, [b('check1', -0.8), b('check1', -0.5)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						...appear(frame, b('afterBath', 0.3), 40, 18),
					}}
				>
					<BathIcon size={220} />
					<div style={{fontSize: 80, fontWeight: 700, color: COLORS.text, lineHeight: 1.3}}>
						入浴が終わったら
						<br />
						<span style={{color: COLORS.blue, opacity: interpolate(frame, [b('afterBath', 2.0), b('afterBath', 2.3)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
							お風呂掃除！
						</span>
					</div>
				</div>
			) : null}

			<div style={{position: 'absolute', left: 140, top: 280, display: 'flex', flexDirection: 'column', gap: 34}}>
				<CheckItem label="掃除" icon={<BroomIcon size={96} />} appearAt={b('check1', -0.5)} checkAt={b('check1')} fontSize={84} />
				<CheckItem label="片付け" icon={<BoxIcon size={96} />} appearAt={b('check2', -0.5)} checkAt={b('check2')} fontSize={84} />
				<CheckItem label="忘れ物チェック" icon={<SearchIcon size={96} />} appearAt={b('check3', -0.5)} checkAt={b('check3')} fontSize={84} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: 140,
					top: 900,
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					background: COLORS.blueLight,
					border: `5px solid ${COLORS.blue}`,
					borderRadius: 999,
					padding: '10px 40px 10px 24px',
					...bounceIn(frame, b('together')),
				}}
			>
				{/* 3人が順番に「ぴょん」 */}
				<div style={{display: 'flex'}}>
					{[COLORS.blue, COLORS.green, COLORS.orange].map((c, i) => {
						const t = frame - b('together', 0.3 + i * 0.15);
						const hop = t >= 0 && t < 12 ? -Math.sin((t / 12) * Math.PI) * 16 : 0;
						return <PersonIcon key={c} size={70} color={c} style={{marginLeft: i === 0 ? 0 : -20, transform: `translateY(${hop}px)`}} />;
					})}
				</div>
				<span style={{fontSize: 52, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>
					担当の人で<span style={{display: 'inline-block', color: COLORS.blue, fontSize: 60, transform: `scale(${emphasize(frame, b('together', 0.8))})`}}>協力</span>
				</span>
			</div>

			<TeacherCharacter
				height={700}
				expression="smile"
				cues={[
					{at: b('afterBath', 0.3), pose: 'explain'},
					{at: b('check1', -0.3), pose: 'check'},
					{at: b('check3'), expression: 'serious'},
					{at: b('together'), pose: 'normal', expression: 'happy'},
				]}
				nods={[b('check1'), b('check2'), b('check3', 0.4)]}
				style={{right: 60, bottom: -20}}
			/>
		</SceneFrame>
	);
};
