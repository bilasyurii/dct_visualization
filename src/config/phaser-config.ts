import { Config } from "./config";

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "red",
  width: Config.width,
  height: Config.height,
};
