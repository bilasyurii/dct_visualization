import 'phaser';
import { PhaserConfig } from './config/phaser-config';
import { MainScene } from './scenes/main-scene';
import { PreloadScene } from './scenes/preload-scene';
import { launchFPSMeter } from './utils/fps-meter';

const game = new Phaser.Game(PhaserConfig);

game.scene.add('preload', PreloadScene, true);
game.scene.add('game', MainScene, false);

launchFPSMeter();
