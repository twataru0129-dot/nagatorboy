// 画像・音声ファイルの置き場所と音量の設定
// ファイルがない場合でも動画は止まりません（代わりのイラストや無音になります）。

export const IMAGES = {
	teacher: 'assets/teacher.png',
	plaza: 'assets/nagatoro-genki-plaza.jpg',
	linenRack: 'assets/linen-rack.png',
	returnBags: 'assets/return-bags.png',
	bedMaking: 'assets/bed-making.png',
	bedCleanup: 'assets/bed-cleanup.png',
	checkSheet: 'assets/check-sheet.png',
} as const;

export const SFX = {
	splash: 'sfx/splash.wav',
	whoosh: 'sfx/whoosh.wav',
	land: 'sfx/land.wav',
	jaan: 'sfx/jaan.wav',
	check: 'sfx/check.wav',
	alarm: 'sfx/alarm.wav',
	ok: 'sfx/ok.wav',
} as const;

export const AUDIO = {
	/** 1本にまとめたナレーション（動画の最初から再生） */
	narration: 'audio/narration.wav',
	/** BGM（あとから追加する場合） */
	bgm: 'audio/bgm.mp3',
} as const;

/** シーンごとのナレーション: public/audio/scenes/<シーン名>.wav */
export const sceneNarrationPath = (key: string) => `audio/scenes/${key}.wav`;

export const VOLUME = {
	narration: 1,
	/** 効果音は小さめ（TTS の邪魔をしない） */
	sfx: 0.12,
	/** BGM はさらに小さく */
	bgm: 0.06,
};

export type ImageKey = keyof typeof IMAGES;
export type SfxKey = keyof typeof SFX;

/** どのファイルが存在するか（Root.tsx の calculateMetadata で自動判定） */
export type Availability = {
	images: Record<ImageKey, boolean>;
	sfx: Record<SfxKey, boolean>;
	narration: boolean;
	bgm: boolean;
	sceneNarration: Record<string, boolean>;
};

export const NO_ASSETS: Availability = {
	images: Object.fromEntries(Object.keys(IMAGES).map((k) => [k, false])) as Record<ImageKey, boolean>,
	sfx: Object.fromEntries(Object.keys(SFX).map((k) => [k, false])) as Record<SfxKey, boolean>,
	narration: false,
	bgm: false,
	sceneNarration: {},
};
