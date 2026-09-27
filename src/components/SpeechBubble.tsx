import React from 'react';
import {COLORS} from '../theme';

/** 吹き出し。tail で「しっぽ」の向きを指定 */
export const SpeechBubble: React.FC<{
	children: React.ReactNode;
	tail?: 'left' | 'right' | 'bottom' | 'none';
	color?: string;
	fontSize?: number;
	style?: React.CSSProperties;
}> = ({children, tail = 'left', color = COLORS.blue, fontSize = 60, style}) => (
	<div
		style={{
			position: 'relative',
			background: '#fff',
			border: `6px solid ${color}`,
			borderRadius: 36,
			padding: '28px 44px',
			fontSize,
			fontWeight: 700,
			color: COLORS.text,
			lineHeight: 1.35,
			boxShadow: `0 10px 26px ${COLORS.shadow}`,
			...style,
		}}
	>
		{children}
		{tail !== 'none' ? (
			<svg
				width="60"
				height="60"
				viewBox="0 0 60 60"
				style={{
					position: 'absolute',
					...(tail === 'left'
						? {left: -48, top: '50%', marginTop: -30}
						: tail === 'right'
							? {right: -48, top: '50%', marginTop: -30, transform: 'scaleX(-1)'}
							: {bottom: -50, left: '50%', marginLeft: -30, transform: 'rotate(-90deg)'}),
				}}
			>
				<path d="M58 14 L4 30 L58 46" fill="#fff" stroke={color} strokeWidth="6" strokeLinejoin="round" />
				<rect x="54" y="17" width="8" height="26" fill="#fff" />
			</svg>
		) : null}
	</div>
);
