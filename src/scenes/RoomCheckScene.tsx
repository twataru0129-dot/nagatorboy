import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {Sfx} from '../components/Sfx';
import {CheckRow, PointCallout} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {Eyebrow, RevealText} from '../design/Kinetic';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {FONT_EN, INK} from '../design/tokens';

// SCENE 9 ⑦部屋の自主点検
// 仕事名 → 内容（読み上げ順に1つずつチェック。右に「いくつ済んだか」の大きな数字） → ポイント（最終確認）

const A = INK.day2;
const ITEMS = ['ゴミ', '忘れ物', '布団・毛布', 'スリッパ', '電気', 'エアコン', '荷物'];

export const RoomCheckScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const appearAt = [b('gomi', -0.2), b('wasuremono', -0.2), b('futon', -0.2), b('rest', 0), b('rest', 0.35), b('rest', 0.7), b('rest', 1.05)];
	const checkAt = [b('gomi', 0.8), b('wasuremono', 1.0), b('futonCheck', 0.6), b('rest', 0.25), b('rest', 0.6), b('rest', 0.95), b('rest', 1.3)];
	const listStart = appearAt[0];
	const done = checkAt.filter((c) => frame >= c).length;
	const all = b('allDone');

	return (
		<StylishFrame
			accent={A}
			watermark="07"
			variant={1}
			hud={<JobHeader n={7} title="部屋の自主点検" eyebrow="DAY 2  ·  退室前" accent={A} settleAt={SETTLE} />}
			camera={[{at: all + 4, zoom: 1.05, x: 1300, y: 600, ease: 14}]}
		>
			{/* 「部屋の片付けが終わったら、生活係が最後の確認をします」 */}
			{frame < listStart ? (
				<div
					style={{
						position: 'absolute',
						left: 80,
						top: 330,
						opacity: interpolate(frame, [listStart - 10, listStart], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<RevealText text="片付けが終わったら" at={afterSettle(b('sheet'))} size={60} color={INK.mute} />
					{frame >= b('last') ? (
						<RevealText text={'生活係が\n最後の確認'} at={b('last')} size={130} highlight={[{text: '最後の確認', color: A}]} style={{marginTop: 10}} />
					) : null}
				</div>
			) : null}

			<div style={{position: 'absolute', left: 80, top: 240, display: 'flex', flexDirection: 'column', gap: 12}}>
				{ITEMS.map((label, i) =>
					frame >= appearAt[i] ? <CheckRow key={label} label={label} appearAt={appearAt[i]} checkAt={checkAt[i]} accent={A} size={50} /> : null,
				)}
			</div>

			{/* 右：済んだ数（大きな数字） */}
			{frame >= listStart ? (
				<div style={{position: 'absolute', left: 1000, top: 260}}>
					<Eyebrow text="CHECKED  /  確認できた数" at={listStart} color={A} />
					<div style={{display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 10}}>
						<div
							style={{
								fontFamily: FONT_EN,
								fontWeight: 800,
								fontSize: 360,
								lineHeight: 0.9,
								color: done === 7 ? A : INK.white,
								letterSpacing: -12,
							}}
						>
							{done}
						</div>
						<div style={{fontFamily: FONT_EN, fontWeight: 600, fontSize: 120, color: INK.mute, paddingBottom: 30}}>/ 7</div>
					</div>
				</div>
			) : null}

			<PointCallout at={all} style={{left: 1000, top: 800}} size={64}>
				最終確認 OK！
			</PointCallout>
			<Sfx name="check" at={all} volume={0.8} />
		</StylishFrame>
	);
};
