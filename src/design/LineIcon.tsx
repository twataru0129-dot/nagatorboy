import React from 'react';
import {INK} from './tokens';

// 線だけのシンプルなアイコン（色は color で統一）
export type IconName =
	| 'sheet'
	| 'pillow'
	| 'rack'
	| 'door'
	| 'thermo'
	| 'card'
	| 'stack'
	| 'person'
	| 'people'
	| 'bath'
	| 'broom'
	| 'box'
	| 'search'
	| 'bag'
	| 'stairs'
	| 'sun'
	| 'alarm'
	| 'voice'
	| 'futon'
	| 'check'
	| 'moon'
	| 'print'
	| 'ask';

const P: Record<IconName, React.ReactNode> = {
	sheet: (
		<>
			<rect x="16" y="24" width="68" height="52" rx="6" />
			<path d="M16 42 H84 M16 58 H84" />
		</>
	),
	pillow: <path d="M18 34 Q14 24 26 26 H74 Q86 24 82 34 V66 Q86 76 74 74 H26 Q14 76 18 66 Z" />,
	rack: (
		<>
			<rect x="18" y="12" width="64" height="78" rx="4" />
			<path d="M18 38 H82 M18 64 H82 M30 30 H48 M54 30 H70 M30 56 H48 M54 56 H70" />
		</>
	),
	door: (
		<>
			<rect x="28" y="12" width="44" height="78" rx="4" />
			<circle cx="62" cy="54" r="3" />
		</>
	),
	thermo: (
		<>
			<path d="M42 62 V18 A8 8 0 0 1 58 18 V62" />
			<circle cx="50" cy="72" r="14" />
			<path d="M50 72 V36" />
		</>
	),
	card: (
		<>
			<rect x="20" y="14" width="52" height="72" rx="6" />
			<path d="M30 34 H62 M30 48 H62 M30 62 H50 M68 78 L86 40" />
		</>
	),
	stack: (
		<>
			<rect x="34" y="12" width="46" height="60" rx="5" />
			<rect x="22" y="26" width="46" height="62" rx="5" />
		</>
	),
	person: (
		<>
			<circle cx="50" cy="30" r="14" />
			<path d="M22 88 Q22 54 50 54 Q78 54 78 88" />
		</>
	),
	people: (
		<>
			<circle cx="34" cy="36" r="11" />
			<circle cx="66" cy="36" r="11" />
			<path d="M12 84 Q12 58 34 58 Q56 58 56 84 M44 84 Q44 58 66 58 Q88 58 88 84" />
		</>
	),
	bath: (
		<>
			<path d="M12 48 H88 V58 Q88 82 64 82 H36 Q12 82 12 58 Z" />
			<path d="M34 34 Q30 26 36 20 M50 34 Q46 26 52 20 M66 34 Q62 26 68 20" />
		</>
	),
	broom: <path d="M70 10 L48 54 M34 52 L62 64 L54 90 L18 76 Z" />,
	box: <path d="M14 34 L50 18 L86 34 V74 L50 90 L14 74 Z M14 34 L50 50 L86 34 M50 50 V90" />,
	search: (
		<>
			<circle cx="42" cy="42" r="24" />
			<path d="M60 60 L86 86" />
		</>
	),
	bag: (
		<>
			<path d="M36 28 Q36 12 50 12 Q64 12 64 28" />
			<path d="M18 28 H82 L88 90 H12 Z" />
		</>
	),
	stairs: <path d="M12 88 H32 V70 H52 V52 H72 V34 H90" />,
	sun: (
		<>
			<circle cx="50" cy="50" r="18" />
			<path d="M50 10 V20 M50 80 V90 M10 50 H20 M80 50 H90 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22" />
		</>
	),
	alarm: (
		<>
			<circle cx="50" cy="56" r="30" />
			<path d="M50 56 V38 M50 56 L62 64 M18 24 L30 14 M82 24 L70 14" />
		</>
	),
	voice: (
		<>
			<path d="M14 40 H30 L66 18 V82 L30 60 H14 Z" />
			<path d="M78 36 Q86 50 78 64" />
		</>
	),
	futon: (
		<>
			<rect x="14" y="24" width="72" height="16" rx="5" />
			<rect x="14" y="44" width="72" height="16" rx="5" />
			<rect x="14" y="64" width="72" height="16" rx="5" />
		</>
	),
	check: <path d="M18 52 L40 74 L84 26" />,
	moon: <path d="M64 12 A40 40 0 1 0 88 70 A32 32 0 1 1 64 12 Z" />,
	print: (
		<>
			<path d="M24 10 H62 L78 26 V90 H24 Z" />
			<path d="M34 42 H68 M34 56 H68 M34 70 H56" />
		</>
	),
	ask: (
		<>
			<circle cx="40" cy="36" r="13" />
			<path d="M14 88 Q14 60 40 60 Q66 60 66 88" />
			<path d="M70 18 Q70 8 80 8 Q90 8 90 18 Q90 26 80 28 V34 M80 42 V43" />
		</>
	),
};

export const LineIcon: React.FC<{name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({
	name,
	size = 96,
	color = INK.white,
	stroke = 5,
	style,
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={stroke}
		strokeLinecap="round"
		strokeLinejoin="round"
		style={style}
	>
		{P[name]}
	</svg>
);
