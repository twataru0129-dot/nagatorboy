import React from 'react';
import {COLORS} from '../theme';

// シンプルなアイコン（SVG）。絵文字はパソコンによって見え方が変わるため使わない。

type IconProps = {size?: number; color?: string; style?: React.CSSProperties};

const Svg: React.FC<IconProps & {children: React.ReactNode; viewBox?: string}> = ({
	size = 120,
	style,
	children,
	viewBox = '0 0 100 100',
}) => (
	<svg width={size} height={size} viewBox={viewBox} style={style}>
		{children}
	</svg>
);

export const CheckMark: React.FC<IconProps & {progress?: number; strokeWidth?: number}> = ({
	progress = 1,
	color = COLORS.green,
	strokeWidth = 14,
	...rest
}) => (
	<Svg {...rest}>
		<path
			d="M18 54 L42 76 L84 26"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			pathLength={1}
			strokeDasharray={1}
			strokeDashoffset={1 - progress}
		/>
	</Svg>
);

export const SheetIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<rect x="12" y="22" width="76" height="60" rx="6" fill="#fff" stroke={color} strokeWidth="5" />
		<rect x="12" y="38" width="76" height="8" fill={color} opacity="0.35" />
		<rect x="12" y="56" width="76" height="8" fill={color} opacity="0.35" />
	</Svg>
);

export const PillowIcon: React.FC<IconProps> = ({color = COLORS.green, ...rest}) => (
	<Svg {...rest}>
		<path
			d="M14 34 Q10 22 24 24 L76 24 Q90 22 86 34 L86 66 Q90 78 76 76 L24 76 Q10 78 14 66 Z"
			fill="#fff"
			stroke={color}
			strokeWidth="5"
		/>
		<path d="M26 40 L74 40 M26 60 L74 60" stroke={color} strokeWidth="4" opacity="0.4" />
	</Svg>
);

export const RackIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<rect x="14" y="10" width="72" height="82" rx="4" fill="none" stroke={color} strokeWidth="5" />
		{[28, 50, 72].map((y) => (
			<g key={y}>
				<line x1="14" y1={y + 10} x2="86" y2={y + 10} stroke={color} strokeWidth="5" />
				<rect x="22" y={y - 6} width="24" height="14" rx="3" fill={COLORS.blueLight} stroke={color} strokeWidth="3" />
				<rect x="52" y={y - 6} width="24" height="14" rx="3" fill={COLORS.greenLight} stroke={COLORS.green} strokeWidth="3" />
			</g>
		))}
	</Svg>
);

export const DoorIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<rect x="24" y="10" width="52" height="82" rx="4" fill={COLORS.blueLight} stroke={color} strokeWidth="5" />
		<rect x="36" y="20" width="28" height="14" rx="3" fill="#fff" stroke={color} strokeWidth="3" />
		<circle cx="66" cy="56" r="5" fill={color} />
	</Svg>
);

export const ThermometerIcon: React.FC<IconProps> = ({color = COLORS.red, ...rest}) => (
	<Svg {...rest}>
		<rect x="40" y="8" width="20" height="60" rx="10" fill="#fff" stroke={COLORS.text} strokeWidth="5" />
		<rect x="46" y="30" width="8" height="40" fill={color} />
		<circle cx="50" cy="76" r="15" fill={color} stroke={COLORS.text} strokeWidth="5" />
	</Svg>
);

export const CardIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<rect x="14" y="14" width="60" height="76" rx="6" fill="#fff" stroke={color} strokeWidth="5" />
		<path d="M24 34 H62 M24 50 H62 M24 66 H50" stroke={color} strokeWidth="5" strokeLinecap="round" />
		<path d="M70 72 L88 34 L94 38 L76 76 L68 80 Z" fill={COLORS.orange} stroke={COLORS.text} strokeWidth="3" />
	</Svg>
);

export const CardsStackIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<rect x="30" y="10" width="50" height="64" rx="6" fill="#fff" stroke={color} strokeWidth="4" />
		<rect x="22" y="18" width="50" height="64" rx="6" fill="#fff" stroke={color} strokeWidth="4" />
		<rect x="14" y="26" width="50" height="64" rx="6" fill="#fff" stroke={color} strokeWidth="5" />
		<path d="M24 44 H54 M24 58 H54 M24 72 H44" stroke={color} strokeWidth="4" strokeLinecap="round" />
	</Svg>
);

/** 人のピクトグラム（生活係の生徒・先生など。特定の人物は描かない） */
export const PersonIcon: React.FC<IconProps & {bodyColor?: string}> = ({
	color = COLORS.blue,
	bodyColor,
	...rest
}) => (
	<Svg {...rest}>
		<circle cx="50" cy="26" r="16" fill={color} />
		<path d="M20 94 Q20 50 50 50 Q80 50 80 94 Z" fill={bodyColor ?? color} />
	</Svg>
);

export const BathIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<path d="M30 30 Q26 22 32 16 M46 30 Q42 22 48 16 M62 30 Q58 22 64 16" stroke={COLORS.gray} strokeWidth="4" fill="none" strokeLinecap="round" />
		<path d="M8 44 H92 V58 Q92 84 66 84 H34 Q8 84 8 58 Z" fill={COLORS.blueLight} stroke={color} strokeWidth="5" />
		<path d="M8 52 Q30 46 50 52 T92 52" stroke={color} strokeWidth="4" fill="none" />
		<path d="M24 84 L20 94 M76 84 L80 94" stroke={color} strokeWidth="5" strokeLinecap="round" />
	</Svg>
);

export const SunIcon: React.FC<IconProps> = ({color = '#FFB300', ...rest}) => (
	<Svg {...rest}>
		<circle cx="50" cy="50" r="22" fill={COLORS.yellow} stroke={color} strokeWidth="4" />
		{Array.from({length: 8}).map((_, i) => {
			const a = (i * Math.PI) / 4;
			return (
				<line
					key={i}
					x1={50 + Math.cos(a) * 30}
					y1={50 + Math.sin(a) * 30}
					x2={50 + Math.cos(a) * 44}
					y2={50 + Math.sin(a) * 44}
					stroke={color}
					strokeWidth="6"
					strokeLinecap="round"
				/>
			);
		})}
	</Svg>
);

export const AlarmIcon: React.FC<IconProps> = ({color = COLORS.red, ...rest}) => (
	<Svg {...rest}>
		<circle cx="24" cy="22" r="12" fill={color} />
		<circle cx="76" cy="22" r="12" fill={color} />
		<circle cx="50" cy="56" r="34" fill="#fff" stroke={color} strokeWidth="7" />
		<path d="M50 56 V36 M50 56 L64 64" stroke={COLORS.text} strokeWidth="6" strokeLinecap="round" />
		<path d="M26 88 L20 96 M74 88 L80 96" stroke={color} strokeWidth="6" strokeLinecap="round" />
	</Svg>
);

export const BagIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<path d="M36 26 Q36 10 50 10 Q64 10 64 26" stroke={COLORS.blueDark} strokeWidth="5" fill="none" />
		<path d="M18 26 H82 L88 92 H12 Z" fill={color} stroke={COLORS.blueDark} strokeWidth="4" strokeLinejoin="round" />
		<rect x="34" y="48" width="32" height="18" rx="4" fill="#fff" opacity="0.9" />
	</Svg>
);

export const StairsIcon: React.FC<IconProps> = ({color = COLORS.green, ...rest}) => (
	<Svg {...rest}>
		<path d="M10 90 H30 V72 H50 V54 H70 V36 H90 V90 Z" fill={COLORS.greenLight} stroke={color} strokeWidth="5" strokeLinejoin="round" />
		<text x="30" y="36" fontSize="30" fontWeight="700" fill={color} fontFamily="sans-serif">
			3F
		</text>
	</Svg>
);

export const MegaphoneIcon: React.FC<IconProps> = ({color = COLORS.orange, ...rest}) => (
	<Svg {...rest}>
		<path d="M14 40 H30 L70 18 V82 L30 60 H14 Z" fill="#fff" stroke={color} strokeWidth="6" strokeLinejoin="round" />
		<path d="M30 60 L36 84 H46 L42 64" fill={color} />
		<path d="M80 36 Q88 50 80 64 M86 26 Q100 50 86 74" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
	</Svg>
);

export const FutonIcon: React.FC<IconProps> = ({color = COLORS.green, ...rest}) => (
	<Svg {...rest}>
		<rect x="14" y="62" width="72" height="16" rx="5" fill={COLORS.greenLight} stroke={color} strokeWidth="5" />
		<rect x="14" y="44" width="72" height="16" rx="5" fill="#fff" stroke={color} strokeWidth="5" />
		<rect x="14" y="26" width="72" height="16" rx="5" fill={COLORS.blueLight} stroke={COLORS.blue} strokeWidth="5" />
	</Svg>
);

export const SearchIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<circle cx="42" cy="42" r="26" fill={COLORS.blueLight} stroke={color} strokeWidth="8" />
		<path d="M62 62 L88 88" stroke={color} strokeWidth="12" strokeLinecap="round" />
	</Svg>
);

export const ThumbsUpIcon: React.FC<IconProps> = ({color = COLORS.orange, ...rest}) => (
	<Svg {...rest}>
		<rect x="10" y="44" width="18" height="44" rx="4" fill={color} />
		<path
			d="M32 46 L50 14 Q58 8 62 18 L58 38 H84 Q94 40 90 52 L82 82 Q80 88 72 88 H32 Z"
			fill="#FFE0B8"
			stroke={color}
			strokeWidth="5"
			strokeLinejoin="round"
		/>
	</Svg>
);

/** 布団で眠っている人（ピクトグラム） */
export const SleepyPersonIcon: React.FC<IconProps & {zzz?: number}> = ({color = COLORS.subText, zzz = 0, ...rest}) => (
	<Svg {...rest} viewBox="0 0 140 100">
		<circle cx="30" cy="50" r="16" fill={color} />
		<rect x="44" y="44" width="86" height="34" rx="12" fill={COLORS.blueLight} stroke={COLORS.blue} strokeWidth="5" />
		<rect x="6" y="66" width="36" height="12" rx="5" fill="#fff" stroke={COLORS.gray} strokeWidth="3" />
		<text
			x="52"
			y={34 - (zzz % 1) * 10}
			fontSize="24"
			fontWeight="700"
			fill={COLORS.blue}
			opacity={0.5 + 0.5 * Math.abs(Math.sin(zzz * Math.PI))}
			fontFamily="sans-serif"
		>
			Z z z
		</text>
	</Svg>
);

export const BroomIcon: React.FC<IconProps> = ({color = COLORS.green, ...rest}) => (
	<Svg {...rest}>
		<path d="M70 8 L46 56" stroke="#A0703C" strokeWidth="7" strokeLinecap="round" />
		<path d="M34 52 L60 64 L52 92 L14 76 Z" fill={COLORS.yellow} stroke={color} strokeWidth="5" strokeLinejoin="round" />
		<path d="M26 78 L32 66 M36 82 L42 68 M46 86 L50 72" stroke={color} strokeWidth="3" />
	</Svg>
);

export const BoxIcon: React.FC<IconProps> = ({color = COLORS.blue, ...rest}) => (
	<Svg {...rest}>
		<path d="M14 34 L50 18 L86 34 L86 76 L50 92 L14 76 Z" fill={COLORS.blueLight} stroke={color} strokeWidth="5" strokeLinejoin="round" />
		<path d="M14 34 L50 50 L86 34 M50 50 V92" stroke={color} strokeWidth="5" fill="none" />
	</Svg>
);
