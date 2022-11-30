export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: "preload",
    });
  }

  public preload(): void {
    // const load = this.load;
    // load.on(Phaser.Loader.Events.COMPLETE, this.onAssetsLoaded, this);
    this.onAssetsLoaded();
  }

  private onAssetsLoaded(): void {
    this.scene.start("main");
  }
}
