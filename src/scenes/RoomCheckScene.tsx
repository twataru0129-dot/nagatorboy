import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop} from '../components/anim';
import {CheckItem} from '../components/CheckItem';
import {useBeats} from '../components/Contexts';
import {CheckMark, CardIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {Sfx} from '../components/Sfx';
import {COLORS} from '../theme';

// SCENE 9 2日目 ⑦部屋の自主点検

const ITEMS = ['布団・毛布', 'ゴミ', '忘れ物', 'スリッパ', '電気', 'エアコン', '荷物'];

export const RoomCheckScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();

	// ナレーションで読む順（ゴミ → 忘れ物 → 布団・毛布）に先にチェック、残りはあとで順番に
	const checkAt: number[] = [
		b('futon'),
		b('gomi'),
		b('wasuremono'),
		b('rest', 0),
		b('rest', 0.45),
		b('rest', 0.9),
		b('rest', 1.35),
	];
	const all = b('allDone');
	const allIn = pop(frame, all, 11);

	return (
		<SceneFrame>
			<SceneHeader day={2} number={7} title="部屋の自主点検" />

			<div style={{position: 'absolute', left: 90, top: 225, display: 'flex', flexDirection: 'column', gap: 12}}>
				{ITEMS.map((label, i) => (
					<CheckItem key={label} label={label} appearAt={b('list', i * 0.45)} checkAt={checkAt[i]} fontSize={58} />
				))}
			</div>

			{/* 点検表 */}
			<div
				style={{
					position: 'absolute',
					left: 860,
					top: 235,
					width: 980,
					height: 700,
					borderRadius: 30,
					overflow: 'hidden',
					border: '8px solid #fff',
					boxShadow: `0 12px 30px ${COLORS.shadow}`,
					background: '#fff',
					opacity: Math.min(1, pop(frame, b('list')) * 1.5),
				}}
			>
				<SafeImg
					name="checkSheet"
					fit="contain"
					style={{width: '100%', height: '100%'}}
					fallback={
						<ImagePlaceholder label="check-sheet.png" style={{width: '100%', height: '100%'}}>
							<CardIcon size={280} />
							<div style={{fontSize: 56, fontWeight: 700, color: COLORS.text}}>部屋の点検表</div>
						</ImagePlaceholder>
					}
				/>
			</div>

			{/* 全部OK */}
			{frame >= all ? (
				<div
					style={{
						position: 'absolute',
						left: 1130,
						top: 800,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						background: COLORS.green,
						color: '#fff',
						fontSize: 80,
						fontWeight: 700,
						borderRadius: 999,
						padding: '14px 50px 14px 24px',
						boxShadow: `0 12px 30px rgba(23,163,90,0.4)`,
						transform: `scale(${allIn})`,
						whiteSpace: 'nowrap',
					}}
				>
					<CheckMark size={100} color="#fff" />
					全部チェック！
				</div>
			) : null}
			<Sfx name="check" at={all} />
		</SceneFrame>
	);
};
