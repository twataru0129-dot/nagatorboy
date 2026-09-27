import React, {useState} from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {IMAGES} from '../data/assets';
import {COLORS} from '../theme';
import {useAssets} from './Contexts';
import {CheckMark, PersonIcon} from './Icons';

// =====================================================================
// 説明役の人物（public/assets/teacher.png）
//
// ・人物の絵そのもの（顔・髪型・眼鏡・服装・体格）は一切描き直しません。
//   顔の上に目や口を描き足すと「別人」になってしまうため、
//   表情は「漫符」（キラッ・！・？・汗・♪・眼鏡の光）と体の動きで表現します。
// ・ポーズは、画像を回転・傾け・上下させる動きと、手元の小物（矢印・チェック表など）で表現します。
// ・shot で「全身 → 上半身 → 顔アップ」のように寄りを変えられます（下側を切り取って拡大）。
// ・cues に「何フレーム目から、どの表情・ポーズ・寄りにするか」を並べて使います。
// =====================================================================

export type Expression = 'neutral' | 'smile' | 'happy' | 'serious' | 'thinking' | 'surprised' | 'gentle';
export type Pose = 'normal' | 'wave' | 'point' | 'explain' | 'check' | 'thumbsUp';
export type Shot = 'full' | 'waist' | 'close';

export type TeacherCue = {
	/** このフレームから切り替える（シーン内のフレーム） */
	at: number;
	expression?: Expression;
	pose?: Pose;
	shot?: Shot;
	/** 指差しの向き */
	pointDir?: 'left' | 'right';
};

/** 画像の中の各部位の位置（画像の幅・高さに対する割合） */
const ANCHOR = {
	head: {x: 0.67, y: 0.07},
	headTop: {x: 0.67, y: 0.0},
	headSide: {x: 0.84, y: 0.04},
	glasses: {x: 0.64, y: 0.075},
	fist: {x: 0.15, y: 0.12},
	thumb: {x: 0.88, y: 0.29},
};

/** 各ショットで見せる割合（上から何割を見せるか） */
const SHOT_VISIBLE: Record<Shot, number> = {full: 1, waist: 0.56, close: 0.33};
const DEFAULT_ASPECT = 629 / 1375;

type Segment<T> = {value: T; start: number; end: number};

/** cues から、ある項目の「値と、その区間」の一覧を作る */
const segmentsOf = <K extends 'expression' | 'pose' | 'shot' | 'pointDir'>(
	cues: TeacherCue[],
	key: K,
	initial: NonNullable<TeacherCue[K]>,
): Segment<NonNullable<TeacherCue[K]>>[] => {
	const out: Segment<NonNullable<TeacherCue[K]>>[] = [{value: initial, start: -Infinity, end: Infinity}];
	for (const cue of [...cues].sort((a, b) => a.at - b.at)) {
		const v = cue[key];
		if (v === undefined || v === out[out.length - 1].value) {
			continue;
		}
		out[out.length - 1].end = cue.at;
		out.push({value: v as NonNullable<TeacherCue[K]>, start: cue.at, end: Infinity});
	}
	return out;
};

const current = <T,>(segs: Segment<T>[], frame: number) =>
	segs.find((s) => frame >= s.start && frame < s.end) ?? segs[segs.length - 1];

/** ある値の「入り」と「抜け」をなめらかにした強さ（0〜1） */
const amountOf = <T,>(segs: Segment<T>[], value: T, frame: number, fade = 8) =>
	segs
		.filter((s) => s.value === value)
		.reduce((max, s) => {
			const inP = s.start === -Infinity ? 1 : interpolate(frame, [s.start, s.start + fade], [0, 1], clamp);
			const outP = s.end === Infinity ? 1 : interpolate(frame, [s.end, s.end + fade], [1, 0], clamp);
			return Math.max(max, Math.min(inP, outP));
		}, 0);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

export const TeacherCharacter: React.FC<{
	/** 画面に見える高さ(px) */
	height: number;
	expression?: Expression;
	pose?: Pose;
	shot?: Shot;
	pointDir?: 'left' | 'right';
	/** 時間で切り替える表情・ポーズ・寄り */
	cues?: TeacherCue[];
	/** うなずくフレーム（セリフに合わせて） */
	nods?: number[];
	/** 着地・登場の「ぽよん」（少しだけ squash & stretch） */
	bounceAt?: number;
	/** 文字を読ませる場面などで、待機中の小さな動きを止める */
	calm?: boolean;
	/** 汗マーク（苦笑い） 0〜1 */
	sweat?: number;
	/** 指差しの矢印を手元に出す（別の矢印を使う場面では false） */
	showPointArrow?: boolean;
	style?: React.CSSProperties;
}> = ({
	height,
	expression = 'smile',
	pose = 'normal',
	shot = 'full',
	pointDir = 'left',
	cues = [],
	nods = [],
	bounceAt,
	calm = false,
	sweat = 0,
	showPointArrow = true,
	style,
}) => {
	const frame = useCurrentFrame();
	const assets = useAssets();
	const [failed, setFailed] = useState(false);
	const aspect = assets.teacherAspect ?? DEFAULT_ASPECT;

	const exprSegs = segmentsOf(cues, 'expression', expression);
	const poseSegs = segmentsOf(cues, 'pose', pose);
	const shotSegs = segmentsOf(cues, 'shot', shot);
	const dirSegs = segmentsOf(cues, 'pointDir', pointDir);
	const expr = current(exprSegs, frame);
	const ps = current(poseSegs, frame);
	const dir = current(dirSegs, frame).value;

	// ---- 寄り（ショット）: 前のショットからなめらかに切り替える ----
	const sIdx = shotSegs.findIndex((s) => frame >= s.start && frame < s.end);
	const sNow = shotSegs[Math.max(0, sIdx)];
	const sPrev = shotSegs[Math.max(0, sIdx - 1)];
	const shotP = sNow.start === -Infinity ? 1 : interpolate(frame, [sNow.start, sNow.start + 20], [0, 1], {...clamp, easing: ease});
	const visible = interpolate(shotP, [0, 1], [SHOT_VISIBLE[sPrev.value], SHOT_VISIBLE[sNow.value]]);
	const imgH = height / visible;
	const imgW = imgH * aspect;

	// ---- 体の動き ----
	const idle = calm ? 0 : Math.sin(frame / 14) * 3;
	let rotate = 0;
	let dx = 0;
	let dy = idle;
	let sx = 1;
	let sy = 1;

	// 手を振る：体ごと左右にゆれる
	const waveA = amountOf(poseSegs, 'wave', frame);
	rotate += Math.sin(frame / 4) * 4 * waveA;
	// 指差し：指す方向へ少し傾く
	const pointA = amountOf(poseSegs, 'point', frame, 10);
	const pointSign = dir === 'left' ? -1 : 1;
	rotate += 5 * pointSign * pointA;
	dx += 12 * pointSign * pointA;
	// 説明：ときどき小さく身ぶり
	const explainA = amountOf(poseSegs, 'explain', frame);
	rotate += Math.sin(frame / 9) * 1.8 * explainA;
	// 考え中：少し首をかしげる
	const thinkA = amountOf(exprSegs, 'thinking', frame, 10);
	rotate += -3.5 * thinkA;
	// やさしい：ゆったり
	const gentleA = amountOf(exprSegs, 'gentle', frame, 12);
	rotate += Math.sin(frame / 20) * 1.5 * gentleA;

	// 表情が変わった瞬間の「ぴょこっ」
	const since = frame - expr.start;
	if (expr.start !== -Infinity && since >= 0 && since < 14) {
		const hop = Math.sin((since / 14) * Math.PI);
		if (expr.value === 'surprised') {
			dy -= hop * 26;
		} else if (expr.value === 'happy') {
			dy -= hop * 16;
		}
	}
	// うなずき
	for (const n of nods) {
		const t = frame - n;
		if (t >= 0 && t < 16) {
			dy += Math.sin((t / 16) * Math.PI) * 9;
		}
	}
	// ぽよん（着地）：最大 5% だけ縦につぶれて、少し伸びて戻る
	if (bounceAt !== undefined) {
		const t = frame - bounceAt;
		if (t >= 0 && t < 14) {
			const k = interpolate(t, [0, 4, 9, 14], [0, -0.05, 0.025, 0]);
			sy = 1 + k;
			sx = 1 - k * 0.8;
		}
	}

	const showImage = assets.images.teacher && !failed;
	const fade = visible < 0.98;
	const px = (a: {x: number; y: number}) => ({x: a.x * imgW, y: a.y * imgH});

	return (
		<div
			style={{
				position: 'absolute',
				width: imgW,
				height,
				transformOrigin: '50% 100%',
				transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg) scale(${sx}, ${sy})`,
				...style,
			}}
		>
			{/* 人物（下側を切り取って寄りを作る） */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					overflow: 'hidden',
					WebkitMaskImage: fade ? 'linear-gradient(180deg, #000 82%, transparent 100%)' : undefined,
					maskImage: fade ? 'linear-gradient(180deg, #000 82%, transparent 100%)' : undefined,
				}}
			>
				{showImage ? (
					<Img
						src={staticFile(IMAGES.teacher)}
						onError={() => setFailed(true)}
						maxRetries={0}
						style={{
							width: imgW,
							height: imgH,
							display: 'block',
							filter: 'drop-shadow(0 12px 18px rgba(20,50,100,0.25))',
						}}
					/>
				) : (
					<TeacherPlaceholder height={imgH} width={imgW} />
				)}
			</div>

			{/* ---- ポーズの小物 ---- */}
			{waveA > 0 ? <WaveLines at={px(ANCHOR.fist)} size={imgH * 0.2} opacity={waveA} frame={frame} /> : null}
			{pointA > 0 && showPointArrow ? (
				<PointArrow at={px(dir === 'left' ? ANCHOR.fist : ANCHOR.thumb)} size={imgH * 0.22} dir={dir} amount={pointA} frame={frame} />
			) : null}
			{explainA > 0 ? <EmphasisLines at={px(ANCHOR.fist)} size={imgH * 0.14} amount={explainA} frame={frame} /> : null}
			{ps.value === 'check' ? <Clipboard at={px(ANCHOR.thumb)} size={imgH * 0.16} start={ps.start} frame={frame} /> : null}
			{ps.value === 'thumbsUp' ? <ThumbSparkle at={px(ANCHOR.thumb)} size={imgH * 0.2} start={ps.start} frame={frame} /> : null}

			{/* ---- 表情の漫符 ---- */}
			<ExpressionMarks expr={expr.value} start={expr.start} frame={frame} imgW={imgW} imgH={imgH} />

			{sweat > 0 ? (
				<SweatDrop x={px(ANCHOR.headSide).x} y={px(ANCHOR.headSide).y} size={imgH * 0.07} opacity={sweat} lift={(1 - sweat) * 20} />
			) : null}
		</div>
	);
};

// =====================================================================
// 漫符（表情マーク）
// =====================================================================

const pop = (frame: number, start: number, len = 10) => {
	if (start === -Infinity) {
		return 1;
	}
	const t = frame - start;
	return interpolate(t, [0, len * 0.6, len], [0, 1.2, 1], clamp);
};

const ExpressionMarks: React.FC<{
	expr: Expression;
	start: number;
	frame: number;
	imgW: number;
	imgH: number;
}> = ({expr, start, frame, imgW, imgH}) => {
	const s = pop(frame, start);
	const size = imgH * 0.06;
	const head = {x: ANCHOR.head.x * imgW, y: ANCHOR.head.y * imgH};
	const top = {x: ANCHOR.headTop.x * imgW, y: ANCHOR.headTop.y * imgH};
	const side = {x: ANCHOR.headSide.x * imgW, y: ANCHOR.headSide.y * imgH};
	const t = frame - (start === -Infinity ? 0 : start);

	switch (expr) {
		case 'smile':
			return <Sparkle x={side.x + size * 0.6} y={side.y} size={size} scale={s * twinkle(frame, 0)} />;
		case 'happy':
			return (
				<>
					<Sparkle x={side.x + size * 0.8} y={side.y - size * 0.6} size={size * 1.1} scale={s * twinkle(frame, 0)} />
					<Sparkle x={head.x - size * 2.6} y={top.y - size * 0.2} size={size * 0.8} scale={s * twinkle(frame, 7)} />
					<Sparkle x={side.x + size * 1.8} y={side.y + size * 1.2} size={size * 0.6} scale={s * twinkle(frame, 13)} />
				</>
			);
		case 'serious': {
			// 眼鏡がキラッと光る（数秒ごと）
			const cycle = ((t % 90) + 90) % 90;
			const glint = interpolate(cycle, [0, 5, 12], [0, 1, 0], clamp);
			return (
				<Sparkle
					x={ANCHOR.glasses.x * imgW + size * 0.9}
					y={ANCHOR.glasses.y * imgH - size * 0.3}
					size={size * 0.9}
					scale={glint}
					color="#FFFFFF"
					stroke="#9FC8FF"
				/>
			);
		}
		case 'thinking':
			return <MarkText text="？" x={side.x + size * 0.4} y={top.y - size * 1.3} size={size * 1.6} scale={s} color={COLORS.blue} wobble={Math.sin(frame / 8) * 6} />;
		case 'surprised':
			return <MarkText text="！" x={side.x + size * 0.2} y={top.y - size * 1.4} size={size * 1.8} scale={s} color={COLORS.orange} wobble={0} />;
		case 'gentle':
			return (
				<MarkText
					text="♪"
					x={side.x + size * 0.8}
					y={side.y - size * 0.8 - ((t / 3) % 20)}
					size={size * 1.3}
					scale={s}
					color={COLORS.green}
					wobble={Math.sin(frame / 10) * 10}
				/>
			);
		default:
			return null;
	}
};

const twinkle = (frame: number, offset: number) => 0.75 + 0.25 * Math.sin((frame + offset) / 6);

export const Sparkle: React.FC<{x: number; y: number; size: number; scale: number; color?: string; stroke?: string}> = ({
	x,
	y,
	size,
	scale,
	color = COLORS.yellow,
	stroke = '#F2A900',
}) =>
	scale <= 0.01 ? null : (
		<svg
			width={size * 2}
			height={size * 2}
			viewBox="0 0 100 100"
			style={{position: 'absolute', left: x - size, top: y - size, transform: `scale(${scale})`, overflow: 'visible'}}
		>
			<path d="M50 4 Q56 44 96 50 Q56 56 50 96 Q44 56 4 50 Q44 44 50 4 Z" fill={color} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
		</svg>
	);

const MarkText: React.FC<{text: string; x: number; y: number; size: number; scale: number; color: string; wobble: number}> = ({
	text,
	x,
	y,
	size,
	scale,
	color,
	wobble,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			fontSize: size,
			fontWeight: 700,
			color,
			lineHeight: 1,
			WebkitTextStroke: `${Math.max(4, size * 0.12)}px #fff`,
			paintOrder: 'stroke fill',
			transform: `scale(${scale}) rotate(${wobble}deg)`,
			transformOrigin: '50% 100%',
			filter: `drop-shadow(0 3px 6px ${COLORS.shadow})`,
		}}
	>
		{text}
	</div>
);

const SweatDrop: React.FC<{x: number; y: number; size: number; opacity: number; lift: number}> = ({x, y, size, opacity, lift}) => (
	<svg
		width={size}
		height={size * 1.4}
		viewBox="0 0 40 56"
		style={{position: 'absolute', left: x, top: y - lift, opacity}}
	>
		<path d="M20 4 Q34 30 34 38 A14 14 0 0 1 6 38 Q6 30 20 4 Z" fill="#8CC8FF" stroke={COLORS.blue} strokeWidth="3" />
	</svg>
);

// =====================================================================
// ポーズの小物
// =====================================================================

const WaveLines: React.FC<{at: {x: number; y: number}; size: number; opacity: number; frame: number}> = ({at, size, opacity, frame}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		style={{position: 'absolute', left: at.x - size * 0.95, top: at.y - size * 0.75, opacity: opacity * (0.55 + 0.45 * Math.sin(frame / 3))}}
	>
		<path d="M80 30 Q60 10 40 20" stroke={COLORS.orange} strokeWidth="7" fill="none" strokeLinecap="round" />
		<path d="M70 55 Q40 35 20 45" stroke={COLORS.orange} strokeWidth="7" fill="none" strokeLinecap="round" />
	</svg>
);

/** 指差しの矢印（手元から指す方向へ） */
const PointArrow: React.FC<{at: {x: number; y: number}; size: number; dir: 'left' | 'right'; amount: number; frame: number}> = ({
	at,
	size,
	dir,
	amount,
	frame,
}) => {
	const push = Math.sin(frame / 5) * size * 0.06;
	const flip = dir === 'left' ? -1 : 1;
	return (
		<svg
			width={size * 1.4}
			height={size * 0.8}
			viewBox="0 0 140 80"
			style={{
				position: 'absolute',
				left: dir === 'left' ? at.x - size * 1.5 + push * flip : at.x + size * 0.1 + push * flip,
				top: at.y - size * 0.4,
				opacity: amount,
				transform: `scale(${flip * (0.6 + 0.4 * amount)}, ${0.6 + 0.4 * amount})`,
			}}
		>
			<path d="M6 30 H90 V10 L134 40 L90 70 V50 H6 Z" fill={COLORS.orange} stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
		</svg>
	);
};

/** 説明中の「強調線」 */
const EmphasisLines: React.FC<{at: {x: number; y: number}; size: number; amount: number; frame: number}> = ({at, size, amount, frame}) => {
	const blink = (frame % 24) < 16 ? 1 : 0.3;
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 100 100"
			style={{position: 'absolute', left: at.x - size * 1.0, top: at.y - size * 1.0, opacity: amount * blink}}
		>
			<path d="M60 20 L70 4 M36 30 L20 16 M28 58 L8 58" stroke={COLORS.orange} strokeWidth="9" strokeLinecap="round" />
		</svg>
	);
};

/** 確認中のチェック表 */
const Clipboard: React.FC<{at: {x: number; y: number}; size: number; start: number; frame: number}> = ({at, size, start, frame}) => {
	const s = pop(frame, start, 12);
	const check = start === -Infinity ? 1 : interpolate(frame - start, [10, 20], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: at.x - size * 1.25,
				top: at.y - size * 0.55,
				width: size,
				height: size * 1.25,
				background: '#fff',
				border: `${Math.max(3, size * 0.05)}px solid ${COLORS.blue}`,
				borderRadius: size * 0.1,
				boxShadow: `0 6px 14px ${COLORS.shadow}`,
				transform: `scale(${s}) rotate(8deg)`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<CheckMark size={size * 0.8} progress={check} />
		</div>
	);
};

/** 親指グッドのキラッ */
const ThumbSparkle: React.FC<{at: {x: number; y: number}; size: number; start: number; frame: number}> = ({at, size, start, frame}) => {
	const t = start === -Infinity ? 30 : frame - start;
	const ring = interpolate(t, [0, 14], [0.3, 1.4], clamp);
	const ringO = interpolate(t, [0, 14], [0.9, 0], clamp);
	const s = pop(frame, start, 12);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: at.x - size * 0.5,
					top: at.y - size * 0.5,
					width: size,
					height: size,
					borderRadius: '50%',
					border: `${Math.max(3, size * 0.05)}px solid ${COLORS.yellow}`,
					transform: `scale(${ring})`,
					opacity: ringO,
				}}
			/>
			<Sparkle x={at.x + size * 0.45} y={at.y - size * 0.35} size={size * 0.26} scale={s * twinkle(frame, 3)} />
			<Sparkle x={at.x + size * 0.1} y={at.y - size * 0.7} size={size * 0.16} scale={s * twinkle(frame, 9)} />
			<div
				style={{
					position: 'absolute',
					left: at.x - size * 1.15,
					top: at.y - size * 0.28,
					fontSize: size * 0.3,
					fontWeight: 700,
					color: COLORS.orange,
					WebkitTextStroke: `${Math.max(3, size * 0.05)}px #fff`,
					paintOrder: 'stroke fill',
					transform: `scale(${s}) rotate(-10deg)`,
					whiteSpace: 'nowrap',
				}}
			>
				グッ！
			</div>
		</>
	);
};

/** teacher.png が見つからない時の仮表示（特定の人物は描かない） */
const TeacherPlaceholder: React.FC<{height: number; width: number}> = ({height, width}) => (
	<div
		style={{
			height,
			width,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'flex-start',
		}}
	>
		<div
			style={{
				fontSize: Math.max(16, height * 0.035),
				color: COLORS.subText,
				background: 'rgba(255,255,255,0.85)',
				padding: '4px 10px',
				borderRadius: 8,
				whiteSpace: 'nowrap',
			}}
		>
			teacher.png
		</div>
		<PersonIcon size={width} color="#9FB3D1" style={{width, height: height * 0.9}} />
	</div>
);
