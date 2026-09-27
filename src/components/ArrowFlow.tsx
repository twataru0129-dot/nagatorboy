import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {pop, progress} from './anim';

export type FlowStep = {
	label: React.ReactNode;
	icon?: React.ReactNode;
	/** 表示が始まるフレーム */
	at: number;
};

/** 矢印（→ または ↓）。lit=1 で光る */
export const Arrow: React.FC<{
	direction?: 'right' | 'down';
	size?: number;
	appear?: number;
	lit?: number;
	color?: string;
}> = ({direction = 'right', size = 90, appear = 1, lit = 0, color = COLORS.orange}) => {
	const frame = useCurrentFrame();
	const glow = lit > 0 ? 0.6 + 0.4 * Math.sin(frame / 5) : 0;
	const fill = lit > 0 ? color : COLORS.gray;
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 100 100"
			style={{
				flexShrink: 0,
				opacity: appear,
				transform: `rotate(${direction === 'down' ? 90 : 0}deg) translateX(${(1 - appear) * -20}px)`,
				filter: lit > 0 ? `drop-shadow(0 0 ${10 + glow * 12}px ${color})` : undefined,
			}}
		>
			<path d="M8 38 H56 V16 L94 50 L56 84 V62 H8 Z" fill={fill} stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
		</svg>
	);
};

/**
 * 「A → B → C」の流れ図
 * 矢印は、次のステップが出る時に順番に光る
 */
export const ArrowFlow: React.FC<{
	steps: FlowStep[];
	direction?: 'row' | 'column';
	color?: string;
	cardWidth?: number;
	cardHeight?: number;
	fontSize?: number;
	arrowSize?: number;
	gap?: number;
	style?: React.CSSProperties;
}> = ({
	steps,
	direction = 'row',
	color = COLORS.blue,
	cardWidth = 360,
	cardHeight = 300,
	fontSize = 44,
	arrowSize = 90,
	gap = 16,
	style,
}) => {
	const frame = useCurrentFrame();
	const activeIndex = steps.reduce((acc, s, i) => (frame >= s.at ? i : acc), -1);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: direction,
				alignItems: 'center',
				justifyContent: 'center',
				gap,
				...style,
			}}
		>
			{steps.map((step, i) => {
				const p = pop(frame, step.at);
				const active = i === activeIndex;
				const done = i < activeIndex;
				return (
					<React.Fragment key={i}>
						{i > 0 ? (
							<Arrow
								direction={direction === 'row' ? 'right' : 'down'}
								size={arrowSize}
								appear={progress(frame, step.at - 8, 10)}
								lit={active ? 1 : 0}
							/>
						) : null}
						<div
							style={{
								width: cardWidth,
								height: cardHeight,
								boxSizing: 'border-box',
								background: '#fff',
								borderRadius: 28,
								border: `6px solid ${active ? COLORS.orange : done ? color : '#DCE6F5'}`,
								boxShadow: active ? `0 10px 30px rgba(255,138,31,0.35)` : `0 6px 16px ${COLORS.shadow}`,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
								padding: 16,
								opacity: Math.min(1, p * 1.4),
								transform: `scale(${(0.7 + 0.3 * p) * (active ? 1.04 : 1)})`,
								textAlign: 'center',
							}}
						>
							{step.icon}
							<div style={{fontSize, fontWeight: 700, color: COLORS.text, lineHeight: 1.3}}>{step.label}</div>
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};
