import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Day} from '../data/scenes';
import {COLORS, DAY_COLORS} from '../theme';
import {appear, pop} from './anim';

/** 「1日目」「2日目」バッジ（1日目＝青、2日目＝緑） */
export const DayBadge: React.FC<{day: Day; start?: number}> = ({day, start = 0}) => {
	const frame = useCurrentFrame();
	const c = DAY_COLORS[day];
	const s = pop(frame, start);
	return (
		<div
			style={{
				background: c.main,
				color: '#fff',
				fontSize: 64,
				fontWeight: 700,
				padding: '14px 34px',
				borderRadius: 24,
				boxShadow: `0 6px 18px ${COLORS.shadow}`,
				transform: `scale(${s})`,
				transformOrigin: 'left center',
				whiteSpace: 'nowrap',
				letterSpacing: 2,
			}}
		>
			{day}日目
		</div>
	);
};

/** 仕事番号（丸数字） */
export const NumberCircle: React.FC<{n: number | string; color: string; size?: number}> = ({n, color, size = 96}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			background: color,
			color: '#fff',
			fontSize: size * 0.62,
			fontWeight: 700,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
			boxShadow: `0 4px 12px ${COLORS.shadow}`,
		}}
	>
		{n}
	</div>
);

/**
 * 画面上部の見出し
 * 左上：日にち＋時計、右：仕事のタイトル
 */
export const SceneHeader: React.FC<{
	day?: Day;
	number?: number | string;
	title: string;
	time?: React.ReactNode;
	start?: number;
}> = ({day, number, title, time, start = 0}) => {
	const frame = useCurrentFrame();
	const color = day ? DAY_COLORS[day].main : COLORS.blue;
	return (
		<div
			style={{
				position: 'absolute',
				top: 36,
				left: 48,
				right: 48,
				display: 'flex',
				alignItems: 'center',
				gap: 28,
			}}
		>
			{day ? <DayBadge day={day} start={start} /> : null}
			{time}
			<div
				style={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					background: '#fff',
					borderRadius: 30,
					padding: '16px 36px',
					boxShadow: `0 6px 18px ${COLORS.shadow}`,
					borderBottom: `8px solid ${color}`,
					minWidth: 0,
					...appear(frame, start + 6, 30),
				}}
			>
				{number !== undefined ? <NumberCircle n={number} color={color} /> : null}
				<div
					style={{
						fontSize: 72,
						fontWeight: 700,
						color: COLORS.text,
						whiteSpace: 'nowrap',
						letterSpacing: 1,
					}}
				>
					{title}
				</div>
			</div>
		</div>
	);
};
