import { Config } from "./config";

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0xffffff,
  width: Config.width,
  height: Config.height,
};
