import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Day} from '../data/scenes';
import {COLORS, DAY_COLORS} from '../theme';
import {pop} from './anim';

/**
 * 時計表示（アナログ時計＋デジタル表示）
 * time: "17:00" のような形式。suffix: "ごろ" など
 */
export const Clock: React.FC<{
	time: string;
	suffix?: string;
	day?: Day;
	start?: number;
	size?: number;
}> = ({time, suffix = 'ごろ', day = 1, start = 0, size = 108}) => {
	const frame = useCurrentFrame();
	const color = DAY_COLORS[day].main;
	const [h, m] = time.split(':').map(Number);
	// 針が 12:00 からくるっと回って目的の時刻を指す
	const p = interpolate(frame, [start + 4, start + 26], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const eased = 1 - (1 - p) ** 3;
	const minuteDeg = (m / 60) * 360 * eased;
	const hourDeg = (((h % 12) + m / 60) / 12) * 360 * eased;
	const s = pop(frame, start);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 20,
				background: '#fff',
				borderRadius: 28,
				padding: '12px 30px 12px 14px',
				boxShadow: `0 6px 18px ${COLORS.shadow}`,
				border: `5px solid ${color}`,
				transform: `scale(${s})`,
				transformOrigin: 'left center',
			}}
		>
			<svg width={size} height={size} viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="45" fill="#fff" stroke={color} strokeWidth="7" />
				{Array.from({length: 12}).map((_, i) => {
					const a = (i * Math.PI) / 6;
					return (
						<line
							key={i}
							x1={50 + Math.sin(a) * 34}
							y1={50 - Math.cos(a) * 34}
							x2={50 + Math.sin(a) * 39}
							y2={50 - Math.cos(a) * 39}
							stroke={COLORS.text}
							strokeWidth={i % 3 === 0 ? 5 : 3}
							strokeLinecap="round"
						/>
					);
				})}
				<line
					x1="50"
					y1="50"
					x2="50"
					y2="26"
					stroke={COLORS.text}
					strokeWidth="7"
					strokeLinecap="round"
					transform={`rotate(${hourDeg} 50 50)`}
				/>
				<line
					x1="50"
					y1="50"
					x2="50"
					y2="16"
					stroke={color}
					strokeWidth="5"
					strokeLinecap="round"
					transform={`rotate(${minuteDeg} 50 50)`}
				/>
				<circle cx="50" cy="50" r="5" fill={COLORS.text} />
			</svg>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap'}}>
				<span style={{fontSize: size * 0.62, fontWeight: 700, color: COLORS.text, letterSpacing: 2}}>{time}</span>
				{suffix ? <span style={{fontSize: size * 0.32, fontWeight: 700, color: COLORS.subText}}>{suffix}</span> : null}
			</div>
		</div>
	);
};

/** 時計の代わりに「入浴後」などの言葉を大きく出す */
export const TimeLabel: React.FC<{text: string; day?: Day; start?: number; icon?: React.ReactNode}> = ({
	text,
	day = 1,
	start = 0,
	icon,
}) => {
	const frame = useCurrentFrame();
	const color = DAY_COLORS[day].main;
	const s = pop(frame, start);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 16,
				background: '#fff',
				borderRadius: 28,
				padding: '12px 36px 12px 18px',
				boxShadow: `0 6px 18px ${COLORS.shadow}`,
				border: `5px solid ${color}`,
				transform: `scale(${s})`,
				transformOrigin: 'left center',
				whiteSpace: 'nowrap',
			}}
		>
			{icon}
			<span style={{fontSize: 80, fontWeight: 700, color: COLORS.text}}>{text}</span>
		</div>
	);
};
