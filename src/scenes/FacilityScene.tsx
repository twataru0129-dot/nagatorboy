import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {SafeImg} from '../components/SafeImg';
import {Sfx} from '../components/Sfx';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {Spotlight} from '../design/Backdrop';
import {Eyebrow, RevealText, Rise, ramp} from '../design/Kinetic';
import {StylishFrame} from '../design/StylishFrame';
import {FONT_EN, FONT_JP, INK, JOB_LIST, pad2} from '../design/tokens';

// SCENE 2 長瀞げんきプラザ ― 見せ場「生活係の仕事は7つ」
//  1幕：場所と役割（キネティックタイポ）
//  2幕：画面中央に大きな「7」
//  3幕：7つの仕事カードが1枚ずつ画面いっぱいに並ぶ → 約8秒そのまま確認

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const STAGGER = 0.55; // カードの登場間隔（秒）

// 7つのカードの配置（上段：1日目4枚、下段：2日目3枚）
const TILE_W = 419;
const TILE_H = 300;
const GAP = 28;
const tilePos = (i: number) => (i < 4 ? {x: 80 + i * (TILE_W + GAP), y: 250} : {x: 80 + (i - 4) * (TILE_W + GAP), y: 635});

export const FacilityScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const jobsAt = b('jobs');
	const tilesAt = b('tiles');
	const allShown = b('allShown');

	// 1幕 → 2幕への切り替え
	const act1 = interpolate(frame, [jobsAt - 10, jobsAt], [1, 0], clamp);
	// 「7」：ドンと出て → 3幕で左上の見出しへ小さくなる
	const sevenIn = interpolate(frame - jobsAt, [0, 7, 12], [1.35, 0.97, 1], clamp);
	const sevenOpacity = interpolate(frame - jobsAt, [0, 5], [0, 1], clamp);
	const toHeader = interpolate(frame, [tilesAt - 18, tilesAt + 4], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});

	return (
		<StylishFrame accent={INK.day1} variant={1} camera={[{at: jobsAt + 2, zoom: 1.04, ease: 8}, {at: tilesAt - 14, zoom: 1, ease: 16}]}>
			{/* ---------- 1幕：長瀞げんきプラザ ---------- */}
			{frame < jobsAt ? (
				<AbsoluteFill style={{opacity: act1}}>
					<PlazaLayer />
					<Spotlight x={1530} y={620} size={1000} color={INK.day1} />
					<div style={{position: 'absolute', left: 110, top: 190}}>
						<Eyebrow text="NAGATORO GENKI PLAZA" at={b('place')} color={INK.day1} />
						<RevealText text="長瀞げんきプラザ" at={b('place', 0.2)} size={118} style={{marginTop: 18}} />
					</div>
					<div style={{position: 'absolute', left: 110, top: 520}}>
						<Rise at={b('role')}>
							<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 60, color: INK.mute}}>生活係は</div>
						</Rise>
						<RevealText
							text={'みんなが気持ちよく\n過ごせるように動く'}
							at={b('comfort')}
							size={88}
							stagger={1.2}
							highlight={[{text: '気持ちよく', color: INK.day1}]}
							style={{marginTop: 14}}
						/>
					</div>
					<TeacherCharacter
						height={860}
						expression="smile"
						cues={[
							{at: b('place'), pose: 'point', pointDir: 'left'},
							{at: b('role'), pose: 'explain'},
							{at: b('comfort'), expression: 'gentle'},
						]}
						nods={[b('comfort', 0.6)]}
						style={{right: 90, bottom: -20}}
					/>
				</AbsoluteFill>
			) : null}

			{/* ---------- 2幕 → 3幕：「生活係の仕事は 7つ」 ---------- */}
			{frame >= jobsAt ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: 1920,
						height: 1080,
						// 中央（大）→ 左上（小）
						transformOrigin: '0 0',
						transform: `translate(${interpolate(toHeader, [0, 1], [0, 80 - 520 * 0.24])}px, ${interpolate(toHeader, [0, 1], [0, 34 - 170 * 0.24])}px) scale(${interpolate(toHeader, [0, 1], [1, 0.24])})`,
						opacity: sevenOpacity,
					}}
				>
					<div style={{position: 'absolute', left: 520, top: 170}}>
						<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 80, color: INK.mute, marginLeft: 20, opacity: 1 - toHeader}}>生活係の仕事は</div>
						<div style={{display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 10}}>
						<div
							style={{
								fontFamily: FONT_EN,
								fontWeight: 800,
								fontSize: 620,
								lineHeight: 0.8,
								letterSpacing: -20,
								background: `linear-gradient(160deg, #FFFFFF 10%, ${INK.day1} 60%, ${INK.day2} 100%)`,
								WebkitBackgroundClip: 'text',
								color: 'transparent',
								transform: `scale(${sevenIn})`,
								transformOrigin: '50% 80%',
							}}
						>
							7
						</div>
						<div style={{fontFamily: FONT_JP, fontWeight: 700, fontSize: 190, color: INK.white, lineHeight: 1, paddingBottom: 30}}>つ！</div>
						</div>
					</div>
				</div>
			) : null}

			{/* ---------- 3幕：7つの仕事カード ---------- */}
			{frame >= tilesAt - 10 ? (
				<>
					<div style={{position: 'absolute', left: 250, top: 88}}>
						<RevealText text="生活係の仕事" at={tilesAt - 4} size={60} stagger={1} />
					</div>
					<Eyebrow text="DAY 1  |  1日目" at={tilesAt - 6} color={INK.day1} style={{position: 'absolute', left: 80, top: 205}} />
					<Eyebrow
						text="DAY 2  |  2日目"
						at={tilesAt + Math.round(4 * STAGGER * 30) - 6}
						color={INK.day2}
						style={{position: 'absolute', left: 80, top: 590}}
					/>
					{JOB_LIST.map((job, i) => (
						<JobTile key={job.name} i={i} at={tilesAt + Math.round(i * STAGGER * 30)} allShown={allShown} />
					))}
					{JOB_LIST.map((job, i) => (
						<Sfx key={`s${job.name}`} name="check" at={tilesAt + Math.round(i * STAGGER * 30)} volume={0.35} />
					))}
				</>
			) : null}

			{/* 確認の時間：短い見出しだけ（動きは止める） */}
			{frame >= allShown ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 968, display: 'flex', justifyContent: 'center'}}>
					<RevealText text="7つの仕事を確認しよう！" at={allShown} size={54} stagger={1} highlight={[{text: '7つ', color: INK.point}]} />
				</div>
			) : null}

			<Sfx name="land" at={jobsAt} volume={0.6} />
		</StylishFrame>
	);
};

/** 仕事カード1枚 */
const JobTile: React.FC<{i: number; at: number; allShown: number}> = ({i, at, allShown}) => {
	const frame = useCurrentFrame();
	const job = JOB_LIST[i];
	const accent = job.day === 1 ? INK.day1 : INK.day2;
	const {x, y} = tilePos(i);
	const p = ramp(frame, at, 20);
	// 登場直後だけアクセントで光る（確認時間に入ったら全部同じ見た目で静止）
	const glow = frame < allShown ? interpolate(frame - at, [0, 6, 22], [0, 1, 0], clamp) : 0;
	const sweep = interpolate(frame - at, [4, 22], [-40, 140], clamp);
	if (frame < at) {
		return null;
	}
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: TILE_W,
				height: TILE_H,
				boxSizing: 'border-box',
				borderRadius: 26,
				background: `linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))`,
				border: `1.5px solid ${glow > 0.05 ? accent : INK.line}`,
				borderTop: `5px solid ${accent}`,
				boxShadow: `0 30px 60px ${INK.shadow}, 0 0 ${50 * glow}px ${accent}`,
				padding: '26px 26px',
				overflow: 'hidden',
				opacity: p,
				transform: `translateY(${(1 - p) * 70}px) scale(${0.9 + 0.1 * p})`,
			}}
		>
			{/* 光がカードを横切る */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: `${sweep}%`,
					width: '35%',
					background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14), rgba(255,255,255,0))',
					transform: 'skewX(-15deg)',
				}}
			/>
			<div style={{fontFamily: FONT_EN, fontWeight: 800, fontSize: 88, lineHeight: 0.9, color: 'transparent', WebkitTextStroke: `2.5px ${accent}`}}>
				{pad2(i + 1)}
			</div>
			<div style={{marginTop: 30, fontFamily: FONT_JP, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: INK.white, whiteSpace: 'nowrap'}}>
				{job.lines[0]}
				<br />
				{job.lines[1] ?? ''}
			</div>
		</div>
	);
};

/** 長瀞げんきプラザの写真（なければ建物のシルエット）をネイビーで沈めた背景 */
const PlazaLayer: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: 0.55}}>
			<AbsoluteFill style={{transform: `scale(${1.08 - frame * 0.0003})`}}>
				<SafeImg
					name="plaza"
					style={{width: '100%', height: '100%'}}
					fallback={
						<svg width="1920" height="1080" viewBox="0 0 1920 1080">
							<path d="M0 640 L300 470 L620 580 L960 420 L1300 560 L1620 450 L1920 540 V1080 H0 Z" fill="rgba(255,255,255,0.05)" />
							<rect x="620" y="560" width="760" height="300" fill="rgba(255,255,255,0.06)" />
							<path d="M590 570 L1000 480 L1410 570 Z" fill="rgba(255,255,255,0.08)" />
							{Array.from({length: 3}).map((_, r) =>
								Array.from({length: 7}).map((__, c) => (
									<rect key={`${r}-${c}`} x={660 + c * 100} y={600 + r * 80} width="60" height="40" fill="rgba(76,157,255,0.18)" />
								)),
							)}
						</svg>
					}
				/>
			</AbsoluteFill>
			<AbsoluteFill style={{background: `linear-gradient(90deg, ${INK.base} 20%, rgba(10,19,38,0.4) 70%, rgba(10,19,38,0.7) 100%)`}} />
		</AbsoluteFill>
	);
};

/** まとめシーンなどで使う背景（写真をネイビーで沈めたもの） */
export const PlazaBackground = PlazaLayer;
export const JOBS = JOB_LIST.map((j) => ({label: j.name, day: j.day}));
