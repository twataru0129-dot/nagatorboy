import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Eyebrow, RevealText, ramp} from './Kinetic';
import {FONT_EN, INK, pad2} from './tokens';

/**
 * 各仕事のタイトル
 * 最初は画面の中央に大きく（番号＋仕事名）→ settleAt で左上の見出しへ小さく移動する。
 * 「仕事名 → 内容 → ポイント」の最初の「仕事名」を大きく見せるための部品。
 */
export const JobHeader: React.FC<{
	/** 仕事の番号（1〜7）。番号なしの見出しは undefined */
	n?: number;
	title: string;
	/** 上に出す小さなラベル（例: "DAY 1 · 17:00ごろ"） */
	eyebrow: string;
	accent: string;
	/** 左上へ移動し終わるフレーム */
	settleAt: number;
	/** 右上の「JOB 01 / 07」表示 */
	showProgress?: boolean;
}> = ({n, title, eyebrow, accent, settleAt, showProgress = true}) => {
	const frame = useCurrentFrame();
	// 大きな状態 → 見出しへ（最後の 22 フレームで移動）
	const move = interpolate(frame, [settleAt - 22, settleAt], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});
	// 大きな状態の倍率は、仕事名の長さに合わせて画面からはみ出さないように決める
	const width = (n !== undefined ? 150 : 0) + Array.from(title).length * 72;
	const big = Math.min(1.9, 1640 / width);
	const scale = interpolate(move, [0, 1], [big, 1]);
	const tx = interpolate(move, [0, 1], [(1920 - width * big) / 2 - 80, 0]);
	const ty = interpolate(move, [0, 1], [400 - 65 * big, 0]);
	const numP = ramp(frame, 2, 20);

	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 52,
					display: 'flex',
					alignItems: 'center',
					gap: 30,
					transformOrigin: '0 0',
					transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
				}}
			>
				{n !== undefined ? (
					<div
						style={{
							fontFamily: FONT_EN,
							fontWeight: 800,
							fontSize: 120,
							lineHeight: 0.9,
							color: 'transparent',
							WebkitTextStroke: `3px ${accent}`,
							opacity: numP,
							transform: `translateY(${(1 - numP) * 30}px)`,
							letterSpacing: -4,
						}}
					>
						{pad2(n)}
					</div>
				) : null}
				<div>
					<Eyebrow text={eyebrow} at={4} color={accent} size={24} />
					<RevealText text={title} at={8} size={72} stagger={1.4} style={{marginTop: 6, whiteSpace: 'nowrap'}} />
				</div>
			</div>

			{/* 右上：いま何番目の仕事か（7つの目盛り） */}
			{showProgress && n !== undefined ? (
				<div
					style={{
						position: 'absolute',
						right: 80,
						top: 72,
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						opacity: ramp(frame, settleAt - 6, 16),
					}}
				>
					<div style={{fontFamily: FONT_EN, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: INK.mute}}>
						JOB {pad2(n)} / 07
					</div>
					<div style={{display: 'flex', gap: 6}}>
						{Array.from({length: 7}).map((_, i) => (
							<div
								key={i}
								style={{
									width: i + 1 === n ? 34 : 14,
									height: 6,
									borderRadius: 3,
									background: i + 1 === n ? accent : i < 4 ? 'rgba(76,157,255,0.35)' : 'rgba(53,213,162,0.35)',
								}}
							/>
						))}
					</div>
				</div>
			) : null}
		</>
	);
};
