import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {overshoot, pop, progress} from '../components/anim';
import {punchIn} from '../components/Camera';
import {useBeats} from '../components/Contexts';
import {StylishFrame} from '../design/StylishFrame';
import {Eyebrow, RevealText} from '../design/Kinetic';
import {INK} from '../design/tokens';
import {Sfx} from '../components/Sfx';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 1 オープニング（ギャグあり）
// 秩父・長瀞の荒川をラフティングボートで下ってきて、ジャンプして着地 → 手を振る

const VP_Y = 455; // 川の奥（消失点）のY座標
const TEACHER_H = 700; // 着地後の人物の高さ
const LAND_X = 1500; // 着地点（人物の中心X）
const LAND_BOTTOM = 1060; // 着地点（足元のY）

export const IntroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const boatStart = b('boatStart');
	const jump = b('jump');
	const land = b('land');

	// ボートの位置（0=奥、1=手前）
	const z = interpolate(frame, [boatStart, jump], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const zEase = z * z * (3 - 2 * z) * 0.5 + z * 0.5;
	const boatScale = 0.12 + zEase * 0.88;
	const boatX = 960 - zEase * 90 + Math.sin(frame / 9) * 14 * zEase;
	const boatY = VP_Y + 40 + zEase * 360 + Math.sin(frame / 6) * 5 * zEase;
	// ジャンプした後のボートは左下へ流れていく
	const after = Math.max(0, frame - jump);
	const boatExitX = boatX - after * 16;
	const boatExitY = boatY + after * 4;
	const boatOpacity = interpolate(after, [0, 35], [1, 0], {extrapolateRight: 'clamp'});

	// ジャンプの軌道
	const jp = interpolate(frame, [jump, land], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const inBoatTeacherH = 640 * boatScale;
	const startBottom = boatY - 30 * boatScale;
	const jumpX = interpolate(jp, [0, 1], [boatX, LAND_X]);
	const jumpBottom = interpolate(jp, [0, 1], [startBottom, LAND_BOTTOM]) - Math.sin(jp * Math.PI) * 380;
	const jumpH = interpolate(jp, [0, 1], [inBoatTeacherH, TEACHER_H]);
	const jumpRot = Math.sin(jp * Math.PI) * -12;
	// 着地のあと、もう一度小さく「ぴょん」とはねる
	const rebound = frame >= land + 8 && frame < land + 24 ? -Math.sin(((frame - land - 8) / 16) * Math.PI) * 26 : 0;

	const titleAt = b('title');
	const point = b('point');
	const jaan = b('jaan');
	const gagIn = overshoot(frame, point + 4, 14, 0.18);
	// ツッコミ感：ふきだしが出た瞬間に小さくブルッとゆれる
	const tsukkomi = frame >= point + 4 && frame < point + 16 ? Math.sin((frame - point) * 2.4) * 3 : 0;
	// ギャグ中はタイトルを左上に小さく
	const titleShrink = progress(frame, point, 14);

	return (
		<StylishFrame
			accent={INK.day1}
			wipe={false}
			whoosh={false}
			background={<RiverBackground frame={frame} />}
			camera={[
				// 「みなさん、こんにちは！」で先生に少し寄る → タイトルで全体に戻る
				{at: b('wave', 0.6), zoom: 1.18, x: 1480, y: 600, ease: 18},
				{at: titleAt, zoom: 1, x: 1480, y: 600, ease: 14},
				// オチ（「生活係の仕事の流れも…」）で一瞬寄る
				...punchIn(jaan, 1300, 520, 1.1, 22),
			]}
		>
			{/* ボート（ジャンプ前は人物が乗っている） */}
			{frame < jump + 40 ? (
				<Raft
					x={frame < jump ? boatX : boatExitX}
					y={frame < jump ? boatY : boatExitY}
					scale={boatScale}
					opacity={frame < jump ? interpolate(frame, [boatStart, boatStart + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : boatOpacity}
					frame={frame}
					rider={frame < jump}
					riderHeight={inBoatTeacherH}
				/>
			) : null}

			{/* ジャンプ中〜着地後の人物 */}
			{frame >= jump ? (
				<div
					style={{
						position: 'absolute',
						left: jumpX,
						top: jumpBottom + rebound,
						transform: `translate(-50%, -100%) rotate(${jumpRot}deg)`,
						transformOrigin: '50% 100%',
					}}
				>
					<div style={{position: 'relative', height: jumpH}}>
						<TeacherCharacter
							height={jumpH}
							expression="happy"
							bounceAt={land}
							showPointArrow={false}
							cues={[
								{at: b('wave'), pose: 'wave'},
								{at: point, pose: 'point', pointDir: 'left', expression: 'surprised'},
								{at: jaan, expression: 'happy'},
							]}
							nods={[b('wave', 1.6)]}
							style={{position: 'relative'}}
						/>
					</div>
				</div>
			) : null}

			{/* 「シュッ！」 */}
			<Onomatopoeia text="シュッ！" at={jump} x={jumpX - 40} y={startBottom - inBoatTeacherH - 80} color={COLORS.blue} />

			{/* タイトル（映画のタイトルのように、文字がせり上がる） */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: 1300,
					height: 520,
					background: 'radial-gradient(ellipse at 0% 0%, rgba(10,19,38,0.75) 0%, rgba(10,19,38,0) 70%)',
					opacity: Math.min(1, Math.max(0, (frame - titleAt) / 12)) * (1 - 0.5 * titleShrink),
				}}
			/>
			{frame >= titleAt ? (
				<div
					style={{
						position: 'absolute',
						left: 100,
						top: 90,
						transformOrigin: 'top left',
						transform: `scale(${1 - 0.45 * titleShrink})`,
						textShadow: '0 6px 30px rgba(0,0,0,0.35)',
					}}
				>
					<Eyebrow text="NAGATORO  ·  宿泊学習" at={titleAt} color="#FFFFFF" size={30} />
					<RevealText
						text="生活係の仕事"
						at={titleAt + 4}
						size={156}
						stagger={2.2}
						style={{marginTop: 12}}
					/>
					<div
						style={{
							height: 10,
							width: 640 * Math.min(1, Math.max(0, (frame - titleAt - 14) / 14)),
							background: INK.day2,
							borderRadius: 5,
							marginTop: 4,
							boxShadow: `0 0 24px ${INK.day2}`,
						}}
					/>
				</div>
			) : null}

			{/* ギャグ：荒川を指差して */}
			{frame >= point ? (
				<>
					<PointingArrow frame={frame - point} />
					<div
						style={{
							position: 'absolute',
							left: 540,
							top: 250,
							transform: `scale(${gagIn}) rotate(${tsukkomi}deg)`,
							transformOrigin: '100% 100%',
						}}
					>
						<div
							style={{
								position: 'relative',
								background: '#fff',
								color: INK.base,
								borderRadius: 28,
								borderLeft: `10px solid ${INK.point}`,
								padding: '26px 44px',
								fontSize: 58,
								fontWeight: 700,
								lineHeight: 1.35,
								boxShadow: '0 24px 50px rgba(0,0,0,0.35)',
							}}
						>
							流れが速いのは
							<br />
							荒川だけじゃない！
							{frame >= jaan ? (
								<div style={{color: '#1C6FD6', marginTop: 10, ...fadeUp(frame, jaan)}}>
									生活係の仕事の<span style={{color: '#E08A00'}}>流れ</span>も
									<br />
									しっかりつかもう！
								</div>
							) : null}
							<div
								style={{
									position: 'absolute',
									right: -26,
									top: '50%',
									marginTop: -20,
									borderTop: '20px solid transparent',
									borderBottom: '20px solid transparent',
									borderLeft: '28px solid #fff',
								}}
							/>
						</div>
					</div>
					<Onomatopoeia text="ジャーン！" at={jaan} x={200} y={620} color={COLORS.orange} big />
				</>
			) : null}

			<Sfx name="splash" at={Math.max(0, boatStart - 10)} volume={0.8} />
			<Sfx name="splash" at={jump - 20} volume={0.6} />
			<Sfx name="whoosh" at={jump} />
			<Sfx name="land" at={land} />
			<Sfx name="jaan" at={jaan} volume={0.9} />
		</StylishFrame>
	);
};

const fadeUp = (frame: number, start: number): React.CSSProperties => {
	const p = progress(frame, start, 12);
	return {opacity: p, transform: `translateY(${(1 - p) * 20}px)`};
};

/** 擬音語（シュッ！・ジャーン！） */
const Onomatopoeia: React.FC<{text: string; at: number; x: number; y: number; color: string; big?: boolean}> = ({
	text,
	at,
	x,
	y,
	color,
	big,
}) => {
	const frame = useCurrentFrame();
	const t = frame - at;
	if (t < 0 || t > (big ? 80 : 26)) {
		return null;
	}
	const s = pop(frame, at, 10);
	const o = big ? 1 : interpolate(t, [16, 26], [1, 0], {extrapolateLeft: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				fontSize: big ? 110 : 90,
				fontWeight: 700,
				color,
				WebkitTextStroke: '10px #fff',
				paintOrder: 'stroke fill',
				transform: `scale(${s}) rotate(-8deg)`,
				opacity: o,
				whiteSpace: 'nowrap',
				textShadow: `0 6px 16px ${COLORS.shadow}`,
			}}
		>
			{text}
		</div>
	);
};

/** 荒川を指す矢印（ギャグ用） */
const PointingArrow: React.FC<{frame: number}> = ({frame}) => {
	const p = progress(frame, 4, 14);
	const nudge = Math.sin(frame / 5) * 10;
	return (
		<svg
			width="420"
			height="220"
			viewBox="0 0 420 220"
			style={{position: 'absolute', left: 820 + nudge, top: 640, opacity: p}}
		>
			<path
				d="M400 40 Q220 10 70 150"
				stroke={COLORS.orange}
				strokeWidth="18"
				fill="none"
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - p}
			/>
			<path d="M40 190 L60 110 L120 160 Z" fill={COLORS.orange} opacity={p} />
		</svg>
	);
};

/** ラフティングボート（人物が乗っている時は上半身が見えるようにする） */
const Raft: React.FC<{
	x: number;
	y: number;
	scale: number;
	opacity: number;
	frame: number;
	rider: boolean;
	riderHeight: number;
}> = ({x, y, scale, opacity, frame, rider, riderHeight}) => {
	const w = 760 * scale;
	const h = 260 * scale;
	const splash = 0.5 + 0.5 * Math.sin(frame / 4);
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, opacity}}>
			{/* 後ろ側の縁 */}
			<svg width={w} height={h} viewBox="0 0 760 260" style={{position: 'absolute', inset: 0}}>
				<ellipse cx="380" cy="130" rx="370" ry="118" fill="#F7B500" stroke="#C47F00" strokeWidth="10" />
				<ellipse cx="380" cy="118" rx="300" ry="78" fill="#2F4A6B" />
			</svg>
			{/* 乗っている人物（下半身はボートの中に隠れる） */}
			{rider ? (
				<div
					style={{
						position: 'absolute',
						left: w / 2,
						bottom: h * 0.22,
						height: riderHeight * 0.47,
						overflow: 'hidden',
						transform: 'translateX(-50%)',
						display: 'flex',
						justifyContent: 'center',
						width: riderHeight,
					}}
				>
					<div style={{position: 'relative', height: riderHeight}}>
						<TeacherCharacter height={riderHeight} expression="neutral" calm style={{position: 'relative'}} />
					</div>
				</div>
			) : null}
			{/* 前側の縁と水しぶき */}
			<svg width={w} height={h} viewBox="0 0 760 260" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path d="M20 140 Q380 330 740 140 Q740 190 380 250 Q20 190 20 140 Z" fill="#FFC928" stroke="#C47F00" strokeWidth="10" />
				<path d="M110 196 Q380 282 650 196" stroke="#fff" strokeWidth="8" fill="none" opacity="0.7" />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<circle
						key={i}
						cx={60 + i * 128 + Math.sin(frame / 3 + i) * 12}
						cy={250 + Math.cos(frame / 4 + i) * 10 - splash * 16}
						r={16 + ((i * 7) % 11) + splash * 8}
						fill="#fff"
						opacity={0.85}
					/>
				))}
			</svg>
		</div>
	);
};

/** 秩父・長瀞の荒川（山・岩畳・川） */
const RiverBackground: React.FC<{frame: number}> = ({frame}) => {
	const riverEdge = (z: number) => ({
		y: VP_Y + z * (1080 - VP_Y),
		l: 880 - z * 1100,
		r: 1040 + z * 1100,
	});
	const waves = Array.from({length: 26}).map((_, i) => {
		const z = ((i * 0.618) % 1 + frame * 0.01) % 1;
		const zz = z * z;
		const e = riverEdge(zz);
		const rx = ((i * 37) % 100) / 100;
		const cx = e.l + (e.r - e.l) * (0.12 + rx * 0.76);
		const len = 30 + 200 * zz;
		return {cx, cy: e.y, len, o: Math.min(1, z * 3) * (1 - z) * 1.4, w: 2 + 8 * zz};
	});

	return (
		<AbsoluteFill>
			<svg width="1920" height="1080" viewBox="0 0 1920 1080">
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#8FD0FF" />
						<stop offset="1" stopColor="#E8F6FF" />
					</linearGradient>
					<linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#6CC3C9" />
						<stop offset="1" stopColor="#1E88B8" />
					</linearGradient>
				</defs>
				<rect width="1920" height="1080" fill="url(#sky)" />
				{/* 雲 */}
				{[0, 1, 2].map((i) => (
					<g key={i} transform={`translate(${((i * 700 + frame * 0.6) % 2300) - 300}, ${90 + i * 60})`} opacity="0.9">
						<ellipse cx="0" cy="0" rx="120" ry="40" fill="#fff" />
						<ellipse cx="70" cy="-20" rx="80" ry="45" fill="#fff" />
						<ellipse cx="-60" cy="-10" rx="70" ry="35" fill="#fff" />
					</g>
				))}
				{/* 遠くの山 */}
				<path d="M0 360 L180 250 L360 330 L560 210 L760 320 L960 230 L1180 330 L1380 220 L1600 320 L1780 240 L1920 300 V520 H0 Z" fill="#9CC9B4" />
				{/* 近くの山 */}
				<path d="M0 420 L220 320 L420 410 L640 300 L860 440 L1080 440 L1300 320 L1520 410 L1740 330 L1920 390 V560 H0 Z" fill="#4FA66E" />
				<path d="M0 470 L300 400 L700 470 L1250 470 L1600 400 L1920 450 V600 H0 Z" fill="#2F8A55" />
				{/* 左岸：長瀞の岩畳 */}
				<path d={`M0 470 L880 ${VP_Y} L-220 1080 L0 1080 Z`} fill="#B9AE9C" />
				{[0.15, 0.3, 0.48, 0.68, 0.9].map((z, i) => {
					const e = riverEdge(z);
					return <path key={i} d={`M0 ${e.y - 20} L${e.l + 40} ${e.y}`} stroke="#978B78" strokeWidth={3 + z * 8} />;
				})}
				{/* 右岸：木々 */}
				<path d={`M1920 460 L1040 ${VP_Y} L2140 1080 L1920 1080 Z`} fill="#3C9A5F" />
				{[0.1, 0.25, 0.42, 0.62].map((z, i) => {
					const e = riverEdge(z);
					const r = 30 + z * 110;
					return <circle key={i} cx={e.r + 80 + z * 260} cy={e.y - r * 0.6} r={r} fill="#2E7D4B" />;
				})}
				{/* 荒川 */}
				<path d={`M880 ${VP_Y} L1040 ${VP_Y} L2140 1080 L-220 1080 Z`} fill="url(#river)" />
				{waves.map((w, i) => (
					<path
						key={i}
						d={`M${w.cx - w.len / 2} ${w.cy} Q${w.cx} ${w.cy - w.len * 0.12} ${w.cx + w.len / 2} ${w.cy}`}
						stroke="#fff"
						strokeWidth={w.w}
						fill="none"
						strokeLinecap="round"
						opacity={Math.max(0, Math.min(0.85, w.o))}
					/>
				))}
				{/* 手前右：着地する岩 */}
				<path d="M1180 1080 Q1210 990 1330 975 L1900 950 L1920 1080 Z" fill="#C9BEAA" stroke="#A89C86" strokeWidth="6" />
				<path d="M1260 1030 L1880 1000" stroke="#A89C86" strokeWidth="5" />
			</svg>
		</AbsoluteFill>
	);
};
