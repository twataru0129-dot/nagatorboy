import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {appear, pop} from '../components/anim';
import {CheckItem} from '../components/CheckItem';
import {useBeats} from '../components/Contexts';
import {CheckMark, CardIcon} from '../components/Icons';
import {ImagePlaceholder, SafeImg} from '../components/SafeImg';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {Sfx} from '../components/Sfx';
import {COLORS} from '../theme';

// SCENE 9 2日目 ⑦部屋の自主点検

// ナレーションで読む順に、1つずつ出してチェックする
const ITEMS = ['ゴミ', '忘れ物', '布団・毛布', 'スリッパ', '電気', 'エアコン', '荷物'];

export const RoomCheckScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();

	const appearAt: number[] = [
		b('gomi', -0.2),
		b('wasuremono', -0.2),
		b('futon', -0.2),
		b('rest', 0),
		b('rest', 0.35),
		b('rest', 0.7),
		b('rest', 1.05),
	];
	const checkAt: number[] = [
		b('gomi', 0.8), // 「ゴミはないか。」の言い終わり
		b('wasuremono', 1.0), // 「忘れ物はないか。」の言い終わり
		b('futonCheck', 0.6), // 「決められた通りに片付いているか」
		b('rest', 0.25),
		b('rest', 0.6),
		b('rest', 0.95),
		b('rest', 1.3),
	];
	const all = b('allDone');
	const allIn = pop(frame, all, 11);
	const listStart = appearAt[0];

	return (
		<SceneFrame>
			<SceneHeader day={2} number={7} title="部屋の自主点検" />

			{/* 「部屋の片付けが終わったら、生活係が最後の確認をします」 */}
			{frame < listStart ? (
				<div
					style={{
						position: 'absolute',
						left: 90,
						top: 330,
						width: 700,
						boxSizing: 'border-box',
						background: '#fff',
						borderRadius: 36,
						padding: '36px 44px',
						border: `6px solid ${COLORS.green}`,
						boxShadow: `0 10px 30px ${COLORS.shadow}`,
						lineHeight: 1.35,
						opacity: interpolate(frame, [listStart - 9, listStart], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
						...appear(frame, b('sheet'), 40, 18),
					}}
				>
					<div style={{fontSize: 60, fontWeight: 700, color: COLORS.subText}}>片付けが終わったら</div>
					{frame >= b('last') ? (
						<div style={{fontSize: 76, fontWeight: 700, color: COLORS.text, ...appear(frame, b('last'), 20)}}>
							<span style={{color: COLORS.green}}>生活係</span>が
							<br />
							最後の確認！
						</div>
					) : null}
				</div>
			) : null}

			<div style={{position: 'absolute', left: 90, top: 225, display: 'flex', flexDirection: 'column', gap: 12}}>
				{ITEMS.map((label, i) =>
					frame >= appearAt[i] ? (
						<CheckItem key={label} label={label} appearAt={appearAt[i]} checkAt={checkAt[i]} fontSize={58} />
					) : null,
				)}
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
					opacity: Math.min(1, pop(frame, b('sheet')) * 1.5),
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
					最終確認 OK！
				</div>
			) : null}
			<Sfx name="check" at={all} />
		</SceneFrame>
	);
};
