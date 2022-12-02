import { Lexer } from "../core/lexic/lexer";
import { Tokenizer } from "../core/tokens/tokenizer";
import { WrapView } from "../view/wrap-view";

export class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "main",
    });
  }

  public create(): void {
    this.add.existing(new WrapView(this, new Lexer().parse(new Tokenizer().tokenize("+1 { 1,  0} -1 { 1,  8}   ->  ( +1  +3  +9  -5  -15  +13  -7  +11) (X) { +(x(0), x(1), x(4), x(13), x(8), x(6), x(12), x(5)) -(x(15), x(14), x(11), x(2), x(7), x(9), x(3), x(10)) }"))));
  }
}
