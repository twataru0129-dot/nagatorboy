import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {appear, bounceIn, emphasize, overshoot, slideIn} from '../components/anim';
import {useBeats, useSceneDuration} from '../components/Contexts';
import {CardIcon, PersonIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {NumberCircle} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS, DAY_COLORS} from '../theme';
import {JOBS, PlazaBackground} from './FacilityScene';

// SCENE 11 まとめ
//  A: 生活係は大切な係！
//  B: 分からなくなったら → プリントを見る／先生に聞く
//  C: 7つの仕事をもう一度（1日目＝青、2日目＝緑）
//  D: みんなで協力して、楽しい宿泊学習にしよう！（先生アップ＋親指グッド）

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** start〜end の間だけ表示（前後を短くフェード） */
const windowOpacity = (frame: number, start: number, end: number, fade = 8) =>
	Math.min(
		interpolate(frame, [start, start + fade], [0, 1], clamp),
		interpolate(frame, [end - fade, end], [1, 0], clamp),
	);

export const EndingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const duration = useSceneDuration();

	const askAt = b('ask');
	const reviewAt = b('review');
	const finalAt = b('final');
	const closeUpAt = b('closeUp');
	const jobAt = [b('job1'), b('job2'), b('job3'), b('job4'), b('job5'), b('job6'), b('job7')];

	// 一覧を読ませる間は背景を白っぽくして、文字を読みやすくする
	const listPanel = windowOpacity(frame, reviewAt - 6, finalAt, 12);

	return (
		<SceneFrame
			background={<PlazaBackground dim={0.5} zoom={interpolate(frame, [0, duration], [1.06, 1])} />}
			fadeOut={20}
			camera={[
				// 最後は先生に少しずつ寄る
				{at: closeUpAt + 40, zoom: 1.08, x: 960, y: 520, ease: 60},
			]}
		>
			<AbsoluteFill style={{background: `rgba(255,255,255,${0.88 * listPanel})`}} />

			{/* ---------- A・B：先生は右側 ---------- */}
			{frame < reviewAt ? (
				<div style={{opacity: windowOpacity(frame, 0, reviewAt, 10)}}>
					<TeacherCharacter
						height={760}
						shot="waist"
						expression="smile"
						cues={[
							{at: b('msg1c'), expression: 'happy'},
							{at: askAt, expression: 'gentle', pose: 'explain'},
							{at: b('askTeacher'), pose: 'point', pointDir: 'left'},
						]}
						nods={[b('msg1c', 0.1), b('print', 0.1)]}
						style={{right: 70, bottom: -10}}
					/>
				</div>
			) : null}

			{/* A: 生活係は大切な係！ */}
			{frame < askAt ? (
				<Card top={120} left={90} width={1180} opacity={windowOpacity(frame, b('msg1'), askAt)} start={b('msg1')} color={COLORS.blue}>
					<div style={{fontSize: 64, color: COLORS.subText}}>生活係は</div>
					<div style={{fontSize: 70, ...appear(frame, b('msg1b'), 20)}}>みんなが気持ちよく過ごすための</div>
					<div
						style={{
							fontSize: 124,
							color: COLORS.blue,
							...bounceIn(frame, b('msg1c')),
						}}
					>
						大切な係！
					</div>
				</Card>
			) : null}

			{/* B: 分からなくなったら → プリント／先生に聞く */}
			{frame >= askAt && frame < reviewAt ? (
				<div style={{opacity: windowOpacity(frame, askAt, reviewAt)}}>
					<div
						style={{
							position: 'absolute',
							left: 90,
							top: 110,
							fontSize: 80,
							fontWeight: 700,
							color: COLORS.text,
							background: '#fff',
							borderRadius: 30,
							padding: '14px 44px',
							boxShadow: `0 10px 26px ${COLORS.shadow}`,
							...slideIn(frame, askAt, 'left'),
						}}
					>
						分からなくなったら…
					</div>
					<div style={{position: 'absolute', left: 90, top: 330, display: 'flex', gap: 44}}>
						<Option
							start={b('print')}
							icon={<CardIcon size={200} />}
							label="プリントを見る"
							color={COLORS.blue}
						/>
						<Option start={b('askTeacher')} icon={<AskIcon />} label="先生に聞く" color={COLORS.green} />
					</div>
					<div
						style={{
							position: 'absolute',
							left: 90,
							top: 800,
							fontSize: 54,
							fontWeight: 700,
							color: COLORS.text,
							...appear(frame, b('askTeacher', 0.8), 20),
						}}
					>
						プリントを見たり、<span style={{color: COLORS.green}}>先生に聞いたり</span>しよう！
					</div>
				</div>
			) : null}

			{/* ---------- C：7つの仕事をもう一度 ---------- */}
			{frame >= reviewAt - 6 && frame < finalAt ? (
				<div style={{opacity: listPanel}}>
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 40,
							textAlign: 'center',
							fontSize: 76,
							fontWeight: 700,
							color: COLORS.text,
							...bounceIn(frame, reviewAt),
						}}
					>
						生活係の仕事を <span style={{color: COLORS.orange}}>もう一度</span> 確認しよう！
					</div>

					<DayColumn day={1} left={60} start={b('day1')} jobs={[0, 1, 2, 3]} jobAt={jobAt} />
					<DayColumn day={2} left={990} start={b('day2')} jobs={[4, 5, 6]} jobAt={jobAt} />

					<div style={{opacity: windowOpacity(frame, reviewAt, finalAt, 10)}}>
						<TeacherCharacter
							height={250}
							shot="close"
							expression="smile"
							pose="check"
							nods={jobAt}
							calm
							style={{right: 60, bottom: 0}}
						/>
					</div>
				</div>
			) : null}

			{/* ---------- D：先生アップ＋親指グッド ---------- */}
			{frame >= finalAt - 4 ? (
				<>
					<div
						style={{
							position: 'absolute',
							left: '50%',
							bottom: 0,
							transform: 'translateX(-50%)',
							opacity: interpolate(frame, [finalAt - 4, finalAt + 6], [0, 1], clamp),
						}}
					>
						<div style={{position: 'relative', height: 780}}>
							<TeacherCharacter
								height={780}
								shot="waist"
								expression="happy"
								bounceAt={finalAt}
								cues={[{at: closeUpAt, shot: 'close', pose: 'thumbsUp'}]}
								style={{position: 'relative'}}
							/>
						</div>
					</div>
					<div
						style={{
							position: 'absolute',
							left: 120,
							right: 120,
							top: 40,
							background: 'rgba(255,255,255,0.97)',
							borderRadius: 40,
							border: `8px solid ${COLORS.green}`,
							boxShadow: `0 14px 40px ${COLORS.shadow}`,
							padding: '20px 0 26px',
							textAlign: 'center',
							fontWeight: 700,
							color: COLORS.text,
							lineHeight: 1.25,
							...bounceIn(frame, finalAt),
						}}
					>
						<div style={{fontSize: 70}}>みんなで協力して</div>
						<div style={{fontSize: 104, color: COLORS.green, transform: `scale(${emphasize(frame, closeUpAt)})`}}>
							楽しい宿泊学習にしよう！
						</div>
					</div>
					<Confetti start={closeUpAt} />
				</>
			) : null}
		</SceneFrame>
	);
};

// ---------------------------------------------------------------------

const Card: React.FC<{
	top: number;
	left: number;
	width: number;
	start: number;
	opacity: number;
	color: string;
	children: React.ReactNode;
}> = ({top, left, width, start, opacity, color, children}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				top,
				left,
				width,
				boxSizing: 'border-box',
				background: 'rgba(255,255,255,0.97)',
				borderRadius: 40,
				border: `8px solid ${color}`,
				boxShadow: `0 14px 40px ${COLORS.shadow}`,
				padding: '36px 50px 44px',
				fontWeight: 700,
				color: COLORS.text,
				lineHeight: 1.3,
				opacity,
				...bounceIn(frame, start),
			}}
		>
			{children}
		</div>
	);
};

const Option: React.FC<{start: number; icon: React.ReactNode; label: string; color: string}> = ({start, icon, label, color}) => {
	const frame = useCurrentFrame();
	const s = overshoot(frame, start, 16, 0.2);
	return (
		<div
			style={{
				width: 560,
				height: 420,
				boxSizing: 'border-box',
				background: '#fff',
				borderRadius: 36,
				border: `8px solid ${color}`,
				boxShadow: `0 12px 30px ${COLORS.shadow}`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 20,
				opacity: Math.min(1, s * 2),
				transform: `scale(${s})`,
			}}
		>
			{icon}
			<div style={{fontSize: 70, fontWeight: 700, color, whiteSpace: 'nowrap'}}>{label}</div>
		</div>
	);
};

/** 先生に聞く（人物のピクトグラム＋「？」のふきだし） */
const AskIcon: React.FC = () => (
	<div style={{position: 'relative', width: 220, height: 200}}>
		<PersonIcon size={200} color={COLORS.green} style={{position: 'absolute', left: 0, top: 0}} />
		<div
			style={{
				position: 'absolute',
				right: -10,
				top: -10,
				width: 90,
				height: 90,
				borderRadius: '50%',
				background: '#fff',
				border: `6px solid ${COLORS.orange}`,
				color: COLORS.orange,
				fontSize: 64,
				fontWeight: 700,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			？
		</div>
	</div>
);

/** 1日目・2日目の列 */
const DayColumn: React.FC<{day: 1 | 2; left: number; start: number; jobs: number[]; jobAt: number[]}> = ({
	day,
	left,
	start,
	jobs,
	jobAt,
}) => {
	const frame = useCurrentFrame();
	const c = DAY_COLORS[day];
	// いま読み上げている仕事（次の仕事が始まるまで）
	const activeIdx = jobAt.reduce((acc, at, i) => (frame >= at ? i : acc), -1);
	const lastJobAt = jobAt[jobAt.length - 1];
	return (
		<div
			style={{
				position: 'absolute',
				left,
				top: 180,
				width: 870,
				boxSizing: 'border-box',
				background: '#fff',
				borderRadius: 34,
				border: `7px solid ${c.main}`,
				boxShadow: `0 10px 26px ${COLORS.shadow}`,
				padding: '0 0 22px',
				overflow: 'hidden',
				...slideIn(frame, start - 6, day === 1 ? 'left' : 'right', 80),
			}}
		>
			<div
				style={{
					background: c.main,
					color: '#fff',
					fontSize: 60,
					fontWeight: 700,
					padding: '10px 36px',
					letterSpacing: 2,
				}}
			>
				{day}日目
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 26px 0'}}>
				{jobs.map((i) => {
					const shown = frame >= jobAt[i] - 4;
					// 読み上げ中の行を強調（7つ目は読み終わるころまで）
					const active = activeIdx === i && (i < 6 || frame < lastJobAt + 75);
					const s = overshoot(frame, jobAt[i] - 4, 14, 0.12);
					return (
						<div
							key={i}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 20,
								borderRadius: 22,
								padding: '12px 20px',
								background: active ? c.light : '#F7FAFF',
								border: `5px solid ${active ? COLORS.orange : 'transparent'}`,
								opacity: shown ? Math.min(1, s * 2) : 0,
								transform: `translateX(${(1 - Math.min(1, s)) * -40}px) scale(${active ? emphasize(frame, jobAt[i]) : 1})`,
								transformOrigin: 'left center',
							}}
						>
							<NumberCircle n={i + 1} color={c.main} size={84} />
							<div style={{fontSize: 58, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>{JOBS[i].label}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

/** 控えめな紙吹雪（最後の締めだけ） */
const Confetti: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const t = frame - start;
	if (t < 0) {
		return null;
	}
	const colors = [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.orange];
	return (
		<>
			{Array.from({length: 22}).map((_, i) => {
				// 顔にかからないよう、画面の左右だけに降らせる
				const x = i % 2 ? ((i * 211) % 520) + 40 : 1360 + ((i * 173) % 520);
				const speed = 5 + ((i * 7) % 5);
				const y = -40 + t * speed - ((i * 53) % 300);
				const rot = t * (4 + (i % 5)) * (i % 2 ? 1 : -1);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + Math.sin((t + i * 10) / 12) * 30,
							top: y,
							width: 18,
							height: 28,
							borderRadius: 4,
							background: colors[i % colors.length],
							opacity: y > 1080 ? 0 : 0.85,
							transform: `rotate(${rot}deg)`,
						}}
					/>
				);
			})}
		</>
	);
};
