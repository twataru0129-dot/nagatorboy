import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {punchIn} from '../components/Camera';
import {useBeats} from '../components/Contexts';
import {Sfx} from '../components/Sfx';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {Spotlight} from '../design/Backdrop';
import {Bubble, PointCallout, StepLine} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {Eyebrow} from '../design/Kinetic';
import {LineIcon} from '../design/LineIcon';
import {StylishFrame} from '../design/StylishFrame';
import {SETTLE} from '../design/jobScene';
import {FONT_EN, INK} from '../design/tokens';

// SCENE 10 担任へ報告 → 確認 → 直す → OK → 完了

const A = INK.day2;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ReportScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const walk = b('walk');
	const bubble = b('bubble');
	const inspect = b('inspect');
	const ok = b('ok');
	const complete = b('complete');
	// 生活係（生徒）が先生のほうへ歩く
	const walkP = interpolate(frame, [walk, walk + 80], [0, 1], {...clamp});
	const studentX = 120 + (1 - (1 - walkP) ** 2) * 520;
	const stepBob = walkP > 0 && walkP < 1 ? -Math.abs(Math.sin(frame / 3)) * 12 : 0;
	// OK の円
	const okS = interpolate(frame - ok, [0, 6, 10, 14], [1.8, 0.94, 1.03, 1], clamp);
	const ring = interpolate(frame - ok, [0, 20], [0, 1], clamp);

	return (
		<StylishFrame
			accent={A}
			watermark="OK"
			variant={2}
			hud={<JobHeader title="担任の先生へ報告" eyebrow="DAY 2  ·  FINAL STEP" accent={A} settleAt={SETTLE} showProgress={false} />}
			camera={[
				{at: bubble + 6, zoom: 1.05, x: 600, y: 620, ease: 14},
				{at: inspect - 10, zoom: 1, x: 600, y: 620, ease: 18},
				...punchIn(ok, 1150, 610, 1.06, 26),
			]}
		>
			<Spotlight x={1560} y={640} size={900} color={A} />
			<StepLine
				accent={A}
				left={80}
				top={225}
				width={1050}
				node={84}
				labelSize={30}
				steps={[
					{label: '報告', icon: 'voice', at: bubble},
					{label: '確認', icon: 'search', at: inspect},
					{label: '直す', icon: 'broom', at: b('fix')},
					{label: 'OK', icon: 'check', at: ok},
					{label: '完了', icon: 'people', at: complete},
				]}
			/>

			{/* 生活係（生徒） */}
			<div style={{position: 'absolute', left: studentX, top: 780 + stepBob, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<LineIcon name="person" size={200} color={A} stroke={6} />
				<Eyebrow text="生活係" at={walk} color={A} size={28} />
			</div>

			{frame < ok ? (
				<Bubble at={bubble} accent={A} size={72} style={{left: 360, top: 470}}>
					○○号室、
					<br />
					終わりました！
				</Bubble>
			) : null}

			{/* 先生が確認中 */}
			{frame >= inspect && frame < ok ? (
				<div style={{position: 'absolute', left: 1010, top: 520, opacity: interpolate(frame - inspect, [0, 8], [0, 1], clamp)}}>
					<div style={{transform: `translate(${Math.sin(frame / 6) * 14}px, ${Math.cos(frame / 6) * 8}px)`}}>
						<LineIcon name="search" size={170} color={INK.white} />
					</div>
					<Eyebrow text="CHECKING" at={inspect} color={A} />
				</div>
			) : null}

			{/* OK */}
			{frame >= ok ? (
				<div
					style={{
						position: 'absolute',
						left: 930,
						top: 390,
						width: 440,
						height: 440,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${okS})`,
						opacity: interpolate(frame - ok, [0, 4], [0, 1], clamp),
						background: `radial-gradient(circle, ${A}33 0%, ${A}00 70%)`,
					}}
				>
					<svg width="440" height="440" viewBox="0 0 440 440" style={{position: 'absolute', inset: 0}}>
						<circle cx="220" cy="220" r="200" fill="none" stroke={A} strokeWidth="10" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 220 220)" />
					</svg>
					<div style={{fontFamily: FONT_EN, fontWeight: 800, fontSize: 190, color: INK.white, letterSpacing: -4}}>OK</div>
				</div>
			) : null}

			<PointCallout at={complete} style={{left: 80, top: 480}} size={56}>
				生活係の仕事、完了！
			</PointCallout>

			<TeacherCharacter
				height={720}
				expression="smile"
				cues={[
					{at: walk, pose: 'explain'},
					{at: bubble, pose: 'normal', expression: 'gentle'},
					{at: inspect, pose: 'check', expression: 'serious'},
					{at: b('fix'), pose: 'explain', expression: 'smile'},
					{at: ok, pose: 'thumbsUp', expression: 'happy'},
				]}
				nods={[b('bubble', 1.2), b('fix', 0.6)]}
				style={{right: 130, bottom: -20}}
			/>
			<Sfx name="ok" at={ok} />
		</StylishFrame>
	);
};
