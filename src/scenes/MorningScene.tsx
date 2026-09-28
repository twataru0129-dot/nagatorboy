import React from 'react';
import {useCurrentFrame} from 'remotion';
import {punchIn} from '../components/Camera';
import {useBeats} from '../components/Contexts';
import {Sfx} from '../components/Sfx';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {Spotlight} from '../design/Backdrop';
import {Bubble, PointCallout, StepLine} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {ramp} from '../design/Kinetic';
import {LineIcon} from '../design/LineIcon';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {INK} from '../design/tokens';

// SCENE 7 ⑤荷物・布団整理の声かけ（2日目 6:00ごろ）※このシーンだけギャグあり
// 仕事名 → 内容（ねむい → 声かけ → 整理スタート） → ポイント（やさしく声をかける）

const A = INK.day2;

export const MorningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const gag = b('gag');
	const alarm = b('alarm');
	const wry = b('wry');
	const shake = frame >= alarm && frame < alarm + 40 ? Math.sin(frame * 2.2) * 9 : 0;
	return (
		<StylishFrame
			accent={A}
			watermark="05"
			variant={2}
			hud={<JobHeader n={5} title="荷物・布団整理の声かけ" eyebrow="DAY 2  ·  6:00ごろ" accent={A} settleAt={SETTLE} />}
			camera={[...punchIn(alarm, 260, 760, 1.1, 26)]}
		>
			{/* 朝の光 */}
			<Spotlight x={1700} y={120} size={1200} color={INK.point} opacity={0.5 * ramp(frame, 0, 60)} />

			<StepLine
				accent={A}
				left={80}
				top={260}
				width={1120}
				node={140}
				labelSize={40}
				steps={[
					{label: 'まだねむい…', icon: 'futon', at: afterSettle(b('sleepy'))},
					{label: <>生活係が<br />声をかける</>, icon: 'voice', at: afterSettle(b('call'), 6)},
					{label: <>荷物・布団の<br />整理スタート</>, icon: 'box', at: b('start')},
				]}
			/>

			{frame < gag ? (
				<PointCallout at={b('callAgain')} style={{left: 80, top: 720}} size={60}>
					みんなに、やさしく声をかけよう
				</PointCallout>
			) : (
				<>
					<div style={{position: 'absolute', left: 110, top: 660, transform: `rotate(${shake}deg)`}}>
						<LineIcon name="alarm" size={200} color={INK.point} stroke={6} />
					</div>
					<Bubble at={gag} accent={A} tail="right" size={54} style={{left: 360, top: 660}}>
						まだ<span style={{color: A}}>夢の中</span>の人がいたら…
						<br />
						<span style={{opacity: ramp(frame, wry, 10)}}>
							やさしく<span style={{color: '#E08A00'}}>現実</span>に戻してあげよう
						</span>
					</Bubble>
				</>
			)}

			<TeacherCharacter
				height={600}
				expression="gentle"
				cues={[
					{at: b('call'), pose: 'explain'},
					{at: b('callAgain'), pose: 'wave', expression: 'happy'},
					{at: alarm, pose: 'normal', expression: 'surprised'},
					{at: wry, expression: 'gentle'},
				]}
				nods={[b('start', 0.3)]}
				sweat={ramp(frame, wry, 10)}
				style={{right: 70, bottom: -15}}
			/>
			<Sfx name="alarm" at={alarm} volume={0.8} />
		</StylishFrame>
	);
};
