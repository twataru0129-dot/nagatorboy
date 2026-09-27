import React from 'react';
import {ArrowFlow} from '../components/ArrowFlow';
import {Clock} from '../components/Clock';
import {useBeats} from '../components/Contexts';
import {CardIcon, CardsStackIcon, PersonIcon, ThermometerIcon} from '../components/Icons';
import {SceneFrame} from '../components/SceneFrame';
import {SceneHeader} from '../components/SceneHeader';
import {COLORS} from '../theme';

// SCENE 6 21:50ごろ ④健康チェックカード（4ステップ）

const Em: React.FC<{children: React.ReactNode}> = ({children}) => (
	<span style={{color: COLORS.blue}}>{children}</span>
);

export const HealthScene: React.FC = () => {
	const b = useBeats();

	return (
		<SceneFrame>
			<SceneHeader day={1} number={4} title="健康チェックカード" time={<Clock time="21:50" day={1} start={4} />} />

			<ArrowFlow
				style={{position: 'absolute', left: 30, right: 30, top: 330}}
				color={COLORS.blue}
				cardWidth={390}
				cardHeight={520}
				fontSize={46}
				arrowSize={80}
				gap={8}
				steps={[
					{label: <StepLabel n={1}>体温を測る</StepLabel>, icon: <ThermometerIcon size={170} />, at: b('step1')},
					{label: <StepLabel n={2}>カードに書く</StepLabel>, icon: <CardIcon size={170} />, at: b('step2')},
					{
						label: (
							<StepLabel n={3}>
								<Em>生活係</Em>が
								<br />
								担当する部屋
								<br />
								から集める
							</StepLabel>
						),
						icon: <CardsStackIcon size={150} />,
						at: b('step3'),
					},
					{
						label: (
							<StepLabel n={4}>
								クラス分を
								<br />
								まとめて
								<br />
								<Em>担任</Em>へ渡す
							</StepLabel>
						),
						icon: <PersonIcon size={150} color={COLORS.green} />,
						at: b('step4'),
					},
				]}
			/>
		</SceneFrame>
	);
};

const StepLabel: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div
			style={{
				width: 64,
				height: 64,
				borderRadius: '50%',
				background: COLORS.blue,
				color: '#fff',
				fontSize: 42,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{n}
		</div>
		<div>{children}</div>
	</div>
);
