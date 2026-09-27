import React, {useState} from 'react';
import {Img, staticFile} from 'remotion';
import {IMAGES, ImageKey} from '../data/assets';
import {COLORS} from '../theme';
import {useAssets} from './Contexts';

/**
 * 画像がない・読み込めない場合は fallback を表示する安全な画像コンポーネント
 */
export const SafeImg: React.FC<{
	name: ImageKey;
	style?: React.CSSProperties;
	fallback?: React.ReactNode;
	fit?: 'cover' | 'contain';
}> = ({name, style, fallback, fit = 'cover'}) => {
	const assets = useAssets();
	const [failed, setFailed] = useState(false);
	if (!assets.images[name] || failed) {
		return <>{fallback ?? <ImagePlaceholder label={IMAGES[name]} style={style} />}</>;
	}
	return (
		<Img
			src={staticFile(IMAGES[name])}
			onError={() => setFailed(true)}
			maxRetries={0}
			style={{objectFit: fit, ...style}}
		/>
	);
};

/** 画像がない時の、あっさりした代わりの枠 */
export const ImagePlaceholder: React.FC<{
	label: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}> = ({label, style, children}) => (
	<div
		style={{
			background: COLORS.blueLight,
			border: `4px dashed ${COLORS.gray}`,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			gap: 16,
			color: COLORS.subText,
			boxSizing: 'border-box',
			...style,
		}}
	>
		{children}
		<div style={{fontSize: 22, opacity: 0.6}}>{label}</div>
	</div>
);
