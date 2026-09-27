import React from 'react';
import {useCurrentFrame} from 'remotion';
import {appear, pop} from '../components/anim';
import {ArrowFlow} from '../components/ArrowFlow';
import {Clock} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {DoorIcon, PillowIcon, RackIcon, SheetIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {TeacherCharacter} from '../components/TeacherCharacter';
import {COLORS} from '../theme';

// SCENE 3 1日目 17:00ごろ ①リネンを配る

export const LinenScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const set = b('set');
	const enough = b('enough');

	return (
		<SceneFrame>
			<SceneHeader day={1} number={1} title="リネンを配る" time={<Clock time="17:00" day={1} start={4} />} />

			{/* リネン置き場の写真 */}
			<div
				style={{
					position: 'absolute',
					left: 60,
					top: 240,
					width: 560,
					height: 400,
					borderRadius: 30,
					overflow: 'hidden',
					boxShadow: `0 10px 26px ${COLORS.shadow}`,
					border: '8px solid #fff',
					...appear(frame, b('rack'), 40, 18),
				}}
			>
				<SafeImg
					name="linenRack"
					style={{width: '100%', height: '100%'}}
					fallback={
						<ImagePlaceholder label="linen-rack.png" style={{width: '100%', height: '100%'}}>
							<RackIcon size={220} />
						</ImagePlaceholder>
					}
				/>
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						background: 'rgba(28,111,214,0.9)',
						color: '#fff',
						fontSize: 42,
						fontWeight: 700,
						textAlign: 'center',
						padding: '8px 0',
					}}
				>
					リネン置き場（3階）
				</div>
			</div>

			{/* 1人1セット */}
			<div
				style={{
					position: 'absolute',
					left: 660,
					top: 240,
					width: 830,
					height: 400,
					boxSizing: 'border-box',
					background: '#fff',
					borderRadius: 30,
					border: `8px solid ${COLORS.blue}`,
					boxShadow: `0 10px 26px ${COLORS.shadow}`,
					padding: '22px 36px',
					...appear(frame, set, 40, 18),
				}}
			>
				<div
					style={{
						fontSize: 70,
						fontWeight: 700,
						color: '#fff',
						background: COLORS.blue,
						borderRadius: 20,
						textAlign: 'center',
						padding: '4px 0 8px',
					}}
				>
					1人1セット
				</div>
				<div style={{display: 'flex', justifyContent: 'center', gap: 40, marginTop: 22}}>
					<LinenCount icon={<SheetIcon size={120} />} copies={2} label="シーツ" count="2枚" start={b('sheets')} />
					<LinenCount icon={<PillowIcon size={120} />} copies={1} label="枕カバー" count="1枚" start={b('pillow')} />
				</div>
			</div>

			{/* リネン置き場 → 担当する部屋 */}
			<ArrowFlow
				style={{position: 'absolute', left: 60, top: 700, width: 1430}}
				color={COLORS.blue}
				cardWidth={470}
				cardHeight={230}
				fontSize={52}
				arrowSize={120}
				gap={30}
				steps={[
					{label: 'リネン置き場', icon: <RackIcon size={110} />, at: b('flow', -0.6)},
					{label: '担当する部屋', icon: <DoorIcon size={110} />, at: b('flow')},
				]}
			/>

			{frame >= b('count') ? (
				<div
					style={{
						position: 'absolute',
						left: 700,
						top: 950,
						background: COLORS.orange,
						color: '#fff',
						fontSize: 46,
						fontWeight: 700,
						borderRadius: 999,
						padding: '10px 34px',
						boxShadow: `0 6px 16px ${COLORS.shadow}`,
						transform: `scale(${pop(frame, b('count'))})`,
						whiteSpace: 'nowrap',
					}}
				>
					人数を確認！
				</div>
			) : null}

			{frame >= enough ? (
				<div
					style={{
						position: 'absolute',
						left: 1090,
						top: 950,
						background: COLORS.blue,
						color: '#fff',
						fontSize: 46,
						fontWeight: 700,
						borderRadius: 999,
						padding: '10px 34px',
						boxShadow: `0 6px 16px ${COLORS.shadow}`,
						transform: `scale(${pop(frame, enough)})`,
						whiteSpace: 'nowrap',
					}}
				>
					必要な分だけ配る
				</div>
			) : null}

			<TeacherCharacter height={700} motion="nod" motionStart={b('set')} style={{right: 40, bottom: -20}} />
		</SceneFrame>
	);
};

const LinenCount: React.FC<{icon: React.ReactNode; copies: number; label: string; count: string; start: number}> = ({
	icon,
	copies,
	label,
	count,
	start,
}) => {
	const frame = useCurrentFrame();
	const p = pop(frame, start);
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity: Math.min(1, p * 1.5),
				transform: `scale(${0.7 + 0.3 * p})`,
			}}
		>
			<div style={{display: 'flex', height: 130, alignItems: 'center'}}>
				{Array.from({length: copies}).map((_, i) => (
					<div key={i} style={{marginLeft: i === 0 ? 0 : -14}}>
						{icon}
					</div>
				))}
			</div>
			<div style={{display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap'}}>
				<span style={{fontSize: 50, fontWeight: 700, color: COLORS.text}}>{label}</span>
				<span style={{fontSize: 76, fontWeight: 700, color: COLORS.orange}}>{count}</span>
			</div>
		</div>
	);
};
