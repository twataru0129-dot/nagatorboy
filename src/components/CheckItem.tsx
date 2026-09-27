import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {appear, pop, progress} from './anim';
import {CheckMark} from './Icons';
import {Sfx} from './Sfx';

/**
 * チェック項目（□ → ✓）
 * appearAt: 項目が出るフレーム / checkAt: チェックが付くフレーム
 */
export const CheckItem: React.FC<{
	label: string;
	appearAt: number;
	checkAt?: number;
	fontSize?: number;
	sound?: boolean;
	icon?: React.ReactNode;
	style?: React.CSSProperties;
}> = ({label, appearAt, checkAt, fontSize = 64, sound = true, icon, style}) => {
	const frame = useCurrentFrame();
	const checked = checkAt !== undefined && frame >= checkAt;
	const draw = checkAt === undefined ? 0 : progress(frame, checkAt, 10);
	const bump = checkAt === undefined ? 0 : pop(frame, checkAt, 9);
	const box = fontSize * 1.15;

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: fontSize * 0.4,
				background: checked ? COLORS.greenLight : '#fff',
				borderRadius: 22,
				padding: `${fontSize * 0.18}px ${fontSize * 0.5}px ${fontSize * 0.18}px ${fontSize * 0.25}px`,
				boxShadow: `0 4px 14px ${COLORS.shadow}`,
				border: `4px solid ${checked ? COLORS.green : '#DCE6F5'}`,
				...appear(frame, appearAt, 30),
				...style,
			}}
		>
			<div
				style={{
					width: box,
					height: box,
					flexShrink: 0,
					borderRadius: 14,
					border: `6px solid ${checked ? COLORS.green : COLORS.gray}`,
					background: '#fff',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${1 + 0.15 * Math.sin(Math.min(1, bump) * Math.PI)})`,
				}}
			>
				<CheckMark size={box * 0.95} progress={draw} />
			</div>
			{icon}
			<div style={{fontSize, fontWeight: 700, color: COLORS.text, whiteSpace: 'nowrap'}}>{label}</div>
			{sound && checkAt !== undefined ? <Sfx name="check" at={checkAt} /> : null}
		</div>
	);
};
