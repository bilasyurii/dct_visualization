import { ViewConfig } from "../../config/view-config";
import { Arrow } from "./arrow";

export class CrossedArrow extends Arrow {
  public setDimensions(x: number, y: number): void {
    super.setDimensions(x, y);

    const graphics = this.graphics;

    const angle = Math.atan2(y, x);
    const size = ViewConfig.arrows.crossSize;
    const crossAngle = Math.PI * 0.25;
    const crossCenterX = x * 0.5;
    const crossCenterY = y * 0.5;
    graphics.beginPath();
    graphics.moveTo(crossCenterX - size * Math.cos(angle - crossAngle), crossCenterY - size * Math.sin(angle - crossAngle));
    graphics.lineTo(crossCenterX + size * Math.cos(angle + crossAngle), crossCenterY - size * Math.sin(angle + crossAngle));
    graphics.closePath();
    graphics.stroke();
  }
}
