import { Config } from "./config";

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // backgroundColor: 0xdddddd,
  transparent: true,
  width: Config.width,
  height: Config.wrapHeight,
  parent: Config.canvasParentId,
};
