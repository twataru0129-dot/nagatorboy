import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useBeats, useSceneDuration} from '../components/Contexts';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {Spotlight} from '../design/Backdrop';
import {Glass} from '../design/Cards';
import {Eyebrow, RevealText, ramp} from '../design/Kinetic';
import {LineIcon} from '../design/LineIcon';
import {StylishFrame} from '../design/StylishFrame';
import {FONT_EN, FONT_JP, INK, JOB_LIST, pad2} from '../design/tokens';
import {PlazaBackground} from './FacilityScene';

// SCENE 11 まとめ
//  A: 生活係は大切な係
//  B: 分からなくなったら → プリントを見る／先生に聞く
//  C: 7つの仕事をもう一度（読み上げに合わせて行が光る）
//  D: みんなで協力して、楽しい宿泊学習にしよう！（先生アップ＋親指グッド）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const win = (frame: number, start: number, end: number, fade = 10) =>
	Math.min(interpolate(frame, [start, start + fade], [0, 1], clamp), interpolate(frame, [end - fade, end], [1, 0], clamp));

export const EndingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const duration = useSceneDuration();
	const askAt = b('ask');
	const reviewAt = b('review');
	const finalAt = b('final');
	const closeUpAt = b('closeUp');
	const jobAt = [b('job1'), b('job2'), b('job3'), b('job4'), b('job5'), b('job6'), b('job7')];
	const activeIdx = jobAt.reduce((a, at, i) => (frame >= at ? i : a), -1);

	return (
		<StylishFrame
			accent={INK.day2}
			variant={1}
			fadeOut={24}
			camera={[{at: closeUpAt + 50, zoom: 1.07, x: 960, y: 560, ease: 70}]}
		>
			{/* A・B：先生は右 */}
			{frame < reviewAt ? (
				<AbsoluteFill style={{opacity: win(frame, 0, reviewAt, 12)}}>
					<PlazaBackground />
					<Spotlight x={1500} y={640} size={1000} color={INK.day2} />
					<TeacherCharacter
						height={780}
						shot="waist"
						expression="smile"
						cues={[
							{at: b('msg1c'), expression: 'happy'},
							{at: askAt, expression: 'gentle', pose: 'explain'},
							{at: b('askTeacher'), pose: 'point', pointDir: 'left'},
						]}
						nods={[b('msg1c', 0.1), b('print', 0.1)]}
						showPointArrow={false}
						style={{right: 80, bottom: -10}}
					/>
				</AbsoluteFill>
			) : null}

			{/* A */}
			{frame < askAt ? (
				<div style={{position: 'absolute', left: 110, top: 250, opacity: win(frame, 0, askAt)}}>
					<Eyebrow text="SUMMARY  /  まとめ" at={b('msg1')} color={INK.day2} />
					<RevealText text="生活係は" at={b('msg1')} size={64} color={INK.mute} style={{marginTop: 24}} />
					<RevealText text="みんなが気持ちよく過ごすための" at={b('msg1b')} size={64} stagger={1} style={{marginTop: 8}} />
					<RevealText text="大切な係" at={b('msg1c')} size={190} color={INK.day2} stagger={2.5} style={{marginTop: 10}} />
				</div>
			) : null}

			{/* B */}
			{frame >= askAt && frame < reviewAt ? (
				<div style={{opacity: win(frame, askAt, reviewAt)}}>
					<div style={{position: 'absolute', left: 110, top: 200}}>
						<Eyebrow text="IF YOU'RE NOT SURE" at={askAt} color={INK.point} />
						<RevealText text="分からなくなったら" at={askAt} size={96} style={{marginTop: 18}} />
					</div>
					<Glass at={b('print')} accent={INK.day1} style={{left: 110, top: 470, width: 520, height: 400, padding: 40}}>
						<LineIcon name="print" size={150} color={INK.day1} />
						<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 64, color: INK.white, marginTop: 30}}>プリントを見る</div>
					</Glass>
					<Glass at={b('askTeacher')} accent={INK.day2} style={{left: 680, top: 470, width: 520, height: 400, padding: 40}}>
						<LineIcon name="ask" size={150} color={INK.day2} />
						<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 64, color: INK.white, marginTop: 30}}>先生に聞く</div>
					</Glass>
				</div>
			) : null}

			{/* C：7つの仕事をもう一度 */}
			{frame >= reviewAt - 6 && frame < finalAt ? (
				<div style={{opacity: win(frame, reviewAt - 6, finalAt, 12)}}>
					<div style={{position: 'absolute', left: 80, top: 60}}>
						<Eyebrow text="REVIEW  /  もう一度確認" at={reviewAt} color={INK.point} />
						<RevealText text="生活係の7つの仕事" at={reviewAt} size={84} stagger={1.2} highlight={[{text: '7つ', color: INK.point}]} style={{marginTop: 12}} />
					</div>
					<DayColumn day={1} left={80} start={b('day1')} jobs={[0, 1, 2, 3]} jobAt={jobAt} activeIdx={activeIdx} lastAt={jobAt[6]} />
					<DayColumn day={2} left={1000} start={b('day2')} jobs={[4, 5, 6]} jobAt={jobAt} activeIdx={activeIdx} lastAt={jobAt[6]} />
				</div>
			) : null}

			{/* D：締め */}
			{frame >= finalAt - 6 ? (
				<AbsoluteFill style={{opacity: interpolate(frame, [finalAt - 6, finalAt + 6], [0, 1], clamp)}}>
					<Spotlight x={960} y={760} size={1300} color={INK.day2} />
					<Particles start={finalAt} />
					<div style={{position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)'}}>
						<div style={{position: 'relative', height: 700}}>
							<TeacherCharacter
								height={700}
								shot="waist"
								expression="happy"
								bounceAt={finalAt}
								cues={[{at: closeUpAt, shot: 'close', pose: 'thumbsUp'}]}
								style={{position: 'relative'}}
							/>
						</div>
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<RevealText text="みんなで協力して" at={finalAt} size={66} color={INK.mute} align="center" />
						<RevealText
							text="楽しい宿泊学習にしよう！"
							at={closeUpAt}
							size={112}
							stagger={2}
							align="center"
							highlight={[{text: '楽しい', color: INK.day2}]}
							style={{marginTop: 6}}
						/>
					</div>
				</AbsoluteFill>
			) : null}
			{/* 最後に余韻の暗転を少し長めに */}
			<AbsoluteFill style={{background: INK.base, opacity: interpolate(frame, [duration - 30, duration], [0, 0.6], clamp)}} />
		</StylishFrame>
	);
};

const DayColumn: React.FC<{day: 1 | 2; left: number; start: number; jobs: number[]; jobAt: number[]; activeIdx: number; lastAt: number}> = ({
	day,
	left,
	start,
	jobs,
	jobAt,
	activeIdx,
	lastAt,
}) => {
	const frame = useCurrentFrame();
	const accent = day === 1 ? INK.day1 : INK.day2;
	return (
		<div style={{position: 'absolute', left, top: 250, width: 840}}>
			<Eyebrow text={`DAY ${day}  |  ${day}日目`} at={start} color={accent} size={30} />
			<div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22}}>
				{jobs.map((i) => {
					const shown = frame >= jobAt[i] - 4;
					const p = ramp(frame, jobAt[i] - 4, 16);
					const active = activeIdx === i && (i < 6 || frame < lastAt + 75);
					return (
						<div
							key={i}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 26,
								padding: '14px 26px',
								borderRadius: 20,
								background: active ? `${accent}26` : 'rgba(255,255,255,0.05)',
								border: `1.5px solid ${active ? accent : INK.line}`,
								boxShadow: active ? `0 0 40px ${accent}55` : 'none',
								opacity: shown ? p : 0,
								transform: `translateX(${(1 - p) * -60}px)`,
							}}
						>
							<div style={{fontFamily: FONT_EN, fontWeight: 800, fontSize: 64, width: 96, color: 'transparent', WebkitTextStroke: `2.5px ${accent}`}}>
								{pad2(i + 1)}
							</div>
							<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 56, color: INK.white, whiteSpace: 'nowrap'}}>{JOB_LIST[i].name}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

/** 光の粒がふわっと昇る（締めの余韻。顔にかからないよう左右だけ） */
const Particles: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const t = frame - start;
	return (
		<>
			{Array.from({length: 26}).map((_, i) => {
				const x = i % 2 ? ((i * 137) % 560) + 40 : 1320 + ((i * 97) % 560);
				const speed = 1.2 + ((i * 7) % 5) * 0.4;
				const y = 1100 - ((t * speed + i * 70) % 1150);
				const size = 4 + (i % 4) * 3;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + Math.sin((t + i * 20) / 30) * 20,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: i % 3 ? INK.day2 : INK.point,
							opacity: 0.55,
							boxShadow: `0 0 12px ${i % 3 ? INK.day2 : INK.point}`,
						}}
					/>
				);
			})}
		</>
	);
};
