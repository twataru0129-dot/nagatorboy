import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT_EN, FONT_JP, INK} from './tokens';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0→1（なめらかに減速） */
export const ramp = (frame: number, start: number, len = 18) =>
	interpolate(frame, [start, start + len], [0, 1], {...clamp, easing: easeOut});

/**
 * キネティックタイポグラフィ：1文字ずつ下から「すっ」とせり上がる
 * text の "\n" で改行。highlight に含まれる文字列はアクセント色にする。
 */
export const RevealText: React.FC<{
	text: string;
	at: number;
	size: number;
	color?: string;
	weight?: number;
	stagger?: number;
	lineHeight?: number;
	highlight?: {text: string; color: string}[];
	font?: 'jp' | 'en';
	letterSpacing?: number;
	align?: 'left' | 'center';
	style?: React.CSSProperties;
}> = ({
	text,
	at,
	size,
	color = INK.white,
	weight = 700,
	stagger = 1.6,
	lineHeight = 1.25,
	highlight = [],
	font = 'jp',
	letterSpacing = 0,
	align = 'left',
	style,
}) => {
	const frame = useCurrentFrame();
	// どの文字をアクセント色にするか
	const colorAt: (string | undefined)[] = [];
	for (const h of highlight) {
		let i = text.indexOf(h.text);
		while (i >= 0) {
			for (let k = 0; k < h.text.length; k++) {
				colorAt[i + k] = h.color;
			}
			i = text.indexOf(h.text, i + 1);
		}
	}
	const lines = text.split('\n');
	let pos = 0; // text の中の位置（色分け用）
	let idx = 0; // 出てくる順番（ずらし用）
	return (
		<div
			style={{
				fontFamily: font === 'jp' ? FONT_JP : FONT_EN,
				fontSize: size,
				fontWeight: weight,
				lineHeight,
				color,
				letterSpacing,
				textAlign: align,
				...style,
			}}
		>
			{lines.map((line, li) => {
				const start = pos;
				pos += line.length + 1;
				return (
					<div key={li} style={{overflow: 'hidden', paddingBottom: size * 0.1, marginBottom: -size * 0.1}}>
						{Array.from(line).map((ch, ci) => {
							const order = idx++;
							const p = ramp(frame, at + order * stagger, 16);
							return (
								<span
									key={ci}
									style={{
										display: 'inline-block',
										transform: `translateY(${(1 - p) * 105}%)`,
										opacity: Math.min(1, p * 1.6),
										color: colorAt[start + ci],
										whiteSpace: 'pre',
									}}
								>
									{ch}
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

/** まとまりごと下からせり上がる（文字数が多い文章用） */
export const Rise: React.FC<{at: number; children: React.ReactNode; distance?: number; style?: React.CSSProperties}> = ({
	at,
	children,
	distance = 40,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, at, 20);
	return <div style={{opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style}}>{children}</div>;
};

/** 小さな英字＋日本語のラベル（先頭の線が伸びる） */
export const Eyebrow: React.FC<{text: string; at: number; color?: string; size?: number; style?: React.CSSProperties}> = ({
	text,
	at,
	color = INK.day1,
	size = 26,
	style,
}) => {
	const frame = useCurrentFrame();
	const line = ramp(frame, at, 16);
	const p = ramp(frame, at + 4, 18);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, ...style}}>
			<div style={{width: 56 * line, height: 3, background: color, borderRadius: 2}} />
			<div
				style={{
					fontFamily: `${FONT_EN}, ${FONT_JP}`,
					fontWeight: 600,
					fontSize: size,
					letterSpacing: 4,
					color,
					opacity: p,
					transform: `translateX(${(1 - p) * -16}px)`,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
		</div>
	);
};

/** 文字の下に、アクセント色のラインがすっと引かれる */
export const Underline: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({at, color = INK.point, children}) => {
	const frame = useCurrentFrame();
	const p = ramp(frame, at, 16);
	return (
		<span style={{position: 'relative', display: 'inline-block'}}>
			{children}
			<span
				style={{
					position: 'absolute',
					left: 0,
					bottom: '-0.08em',
					height: '0.12em',
					width: `${p * 100}%`,
					background: color,
					borderRadius: 4,
				}}
			/>
		</span>
	);
};
