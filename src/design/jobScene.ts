import {sec} from '../data/scenes';

/** 仕事タイトルが左上の見出しに収まるフレーム（シーン開始から） */
export const SETTLE = sec(2.0);

/** 内容は、タイトルが見出しに収まってから出す */
export const afterSettle = (frame: number, extra = 0) => Math.max(frame, SETTLE + extra);
