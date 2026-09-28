import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useBeats} from '../components/Contexts';
import {PhotoCard, PointCallout, StepLine} from '../design/Cards';
import {JobHeader} from '../design/JobHeader';
import {RevealText} from '../design/Kinetic';
import {StylishFrame} from '../design/StylishFrame';
import {afterSettle, SETTLE} from '../design/jobScene';
import {INK} from '../design/tokens';

// SCENE 8 ⑥リネンを回収して返す
// 仕事名 → 内容（部屋 → 回収 → 3階 → 青い返却袋） → ポイント（取り忘れがないか確認）

const A = INK.day2;

export const LinenReturnScene: React.FC = () => {
	const frame = useCurrentFrame();
	const b = useBeats();
	const step1 = b('step1');
	return (
		<StylishFrame
			accent={A}
			watermark="06"
			hud={<JobHeader n={6} title="リネンを回収して返す" eyebrow="DAY 2  ·  朝" accent={A} settleAt={SETTLE} />}
		>
			{/* 「使ったリネンを回収します」 */}
			{frame < step1 ? (
				<div
					style={{
						position: 'absolute',
						left: 80,
						top: 380,
						opacity: interpolate(frame, [step1 - 10, step1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<RevealText text={'使ったリネンを\n回収する'} at={afterSettle(b('used'))} size={130} highlight={[{text: '回収', color: A}]} />
				</div>
			) : null}

			<StepLine
				accent={A}
				left={80}
				top={250}
				width={1760}
				node={140}
				labelSize={40}
				steps={[
					{label: '担当する部屋', icon: 'door', at: step1},
					{label: <>シーツ・枕カバー<br />を回収</>, icon: 'sheet', at: b('step2')},
					{label: '3階へ', icon: 'stairs', at: b('step3')},
					{label: <span style={{color: '#7DB6FF'}}>青い返却袋</span>, icon: 'bag', at: b('step4')},
				]}
			/>

			{frame >= b('bags') - 2 ? (
				<PhotoCard
					name="returnBags"
					at={b('bags')}
					caption="RETURN BAGS  ·  3階"
					accent={A}
					fallbackIcon="bag"
					position="50% 100%"
					style={{left: 80, top: 600, width: 540, height: 420}}
				/>
			) : null}

			<PointCallout at={b('forget')} style={{left: 700, top: 780}} size={62}>
				取り忘れがないか、確認！
			</PointCallout>
		</StylishFrame>
	);
};
