import { Lexer } from "../core/lexic/lexer";
import { Tokenizer } from "../core/tokens/tokenizer";
import { WrapView } from "../view/wrap-view";
import { IWrapViewConfig } from "../view/wrap-view-config.interface";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "main",
    });
  }

  public create(): void {
    // const data = "+1 { 1,  0} -1 { 1,  8}   ->  ( +1  +3  +9  -5  -15  +13  -7  +11) (X) { +(x(0), x(1), x(4), x(13), x(8), x(6), x(12), x(5)) -(x(15), x(14), x(11), x(2), x(7), x(9), x(3), x(10)) }";
    // const data = "+2 {17,  0} -2 {17,  4} +2 {17,  8} -2 {17, 12}   ->  ( +2  +6  -14  +10) (X) { +(x(0), x(1), x(4), x(13)) -(x(8), x(6), x(12), x(5)) +(x(15), x(14), x(11), x(2)) -(x(7), x(9), x(3), x(10)) }";
    const data = "+4 {25,  0} -4 {25,  2} +4 {25,  4} -4 {25,  6} +4 {25,  8} -4 {25, 10} +4 {25, 12} -4 {25, 14}   ->  ( +4  +12) (X) { +(x(0), x(1)) -(x(4), x(13)) +(x(8), x(6)) -(x(12), x(5)) +(x(15), x(14)) -(x(11), x(2)) +(x(7), x(9)) -(x(3), x(10)) }";
    const tokens = new Tokenizer().tokenize(data);
    const wrap = new Lexer().parse(tokens);
    const config: IWrapViewConfig = {
      xInputValueOffset: 20,
      xOutputValue: 1,
    };
    const view = new WrapView(this, wrap, config)
    this.add.existing(view);
  }
}
