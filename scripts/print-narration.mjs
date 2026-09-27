// ナレーション原稿を、シーンの開始時間つきで表示します（TTS 作成用）
// 実行: npm run narration
// ファイルに保存: npm run narration > narration.txt
import {SCENES, SCENE_ORDER} from '../src/data/scenes.ts';

let t = 0;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
for (const key of SCENE_ORDER) {
	const scene = SCENES[key];
	console.log(`【${scene.label}】 ${fmt(t)}〜${fmt(t + scene.duration)}（${scene.duration}秒） → audio/scenes/${key}.wav`);
	for (const line of scene.narration) {
		console.log(`  ${line}`);
	}
	console.log('');
	t += scene.duration;
}
console.log(`合計: ${fmt(t)}（${t.toFixed(1)}秒）`);
