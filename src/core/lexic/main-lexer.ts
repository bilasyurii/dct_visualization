import { IToken } from "../tokens/token.interface";
import { Hierarchy, HierarchyItem } from "./hierarchy-lexer";
import { ILexer } from "./lexer.interface";
import { LexicalTree } from "./structures/lexical-tree";
import { Wrap } from "./structures/wrap";
import { SuperWrap } from "./structures/super-wrap";
import { AlphabeticListItem } from "./structures/alphabetic-list-item";

export class MainLexer implements ILexer<LexicalTree> {
  private wrapLexer: ILexer<Wrap>;
  private hierarchyLexer: ILexer<Hierarchy>;

  constructor(wrapLexer: ILexer<Wrap>, hierarchyLexer: ILexer<Hierarchy>) {
    this.wrapLexer = wrapLexer;
    this.hierarchyLexer = hierarchyLexer;
  }

  public parse(tokens: IToken[]): LexicalTree {
    const lexicalTree = new LexicalTree();

    const hierarchy = this.hierarchyLexer.parse(tokens);
    hierarchy.forEach((numericListItem) => this.parseNumericListItem(numericListItem, lexicalTree));

    return lexicalTree;
  }

  private parseNumericListItem(numericListItem: Hierarchy[0], lexicalTree: LexicalTree): void {
    const superWrap = new SuperWrap();
    lexicalTree.addSuperWrap(superWrap);

    const alphabeticList = numericListItem.getValue();
    alphabeticList.forEach((alphabeticListItem) => this.parseAlphabeticListItem(alphabeticListItem, superWrap));
  }

  private parseAlphabeticListItem(alphabeticListItem: AlphabeticListItem<HierarchyItem>, superWrap: SuperWrap): void {
    const wrapTokens = alphabeticListItem.getValue();
    const wrap = this.wrapLexer.parse(wrapTokens);
    superWrap.addWrap(wrap);
  }
}
