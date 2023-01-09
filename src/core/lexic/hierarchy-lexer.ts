import { TokenType } from "../tokens/token-type.enum";
import { IToken } from "../tokens/token.interface";
import { BaseLexer } from "./base-lexer.abstract";
import { AlphabeticListItem } from "./structures/alphabetic-list-item";
import { NumericListItem } from "./structures/numeric-list-item";

type NumericHierarchy<T> = NumericListItem<T>[];

type AlphabeticHierarchy<T> = AlphabeticListItem<T>[];

type HierarchySeparatorDetector = (tokens: IToken[], startFrom: number) => IToken[];

type HierarchySeparator = IToken[];

type SplitResult = {
  item: HierarchyItem,
  separator: HierarchySeparator,
}[];

export type HierarchyItem = IToken[];

export type Hierarchy = NumericHierarchy<AlphabeticHierarchy<HierarchyItem>>;

export class HierarchyLexer extends BaseLexer<Hierarchy> {
  protected startParsing(): void {
    const numericList = this.splitTokensSetByNumericIndexes(this.tokens);

    this.result = numericList.map((numericListItem) => {
      const key = numericListItem.getKey();
      const tokens = numericListItem.getValue();
      const alphabeticList = this.splitTokensSetByAlphabeticIndexes(tokens);
      return new NumericListItem(key, alphabeticList);
    });
  }

  private splitTokensSetByNumericIndexes(tokens: IToken[]): NumericHierarchy<HierarchyItem> {
    const splitResult = this.splitTokens(tokens, HierarchyLexer.readNumericSeparator);

    return splitResult.map((value) => {
      const separator = value.separator;
      const key = separator ? parseInt(separator[0].value) : 0;
      return new NumericListItem(key, value.item);
    });
  }

  private splitTokensSetByAlphabeticIndexes(tokens: IToken[]): AlphabeticHierarchy<HierarchyItem> {
    const splitResult = this.splitTokens(tokens, HierarchyLexer.readAlphabeticSeparator);
    return splitResult.map((value) => {
      const separator = value.separator;
      const key = separator ? separator[0].value : "a";
      return new AlphabeticListItem(key, value.item);
    });
  }

  private splitTokens(tokens: IToken[], separatorDetector: HierarchySeparatorDetector): SplitResult {
    const length = tokens.length;
    const result: SplitResult = [];
    let item: HierarchyItem = [];
    let i = 0;
    let separator: HierarchySeparator;

    while (i < length) {
      const detectedSeparator = separatorDetector(tokens, i);

      if (detectedSeparator) {
        if (item.length !== 0) {
          result.push({
            item,
            separator,
          });
          item = [];
        }

        separator = detectedSeparator;
        i += separator.length;
      } else {
        item.push(tokens[i]);
        ++i;
      }
    }

    if (item.length !== 0) {
      result.push({
        item,
        separator,
      });
    }

    return result;
  }

  private static readNumericSeparator(tokens: IToken[], startFrom: number): HierarchySeparator {
    const tokensCount = 2;

    if (startFrom + tokensCount > tokens.length) {
      return null;
    }

    const numberToken = tokens[startFrom];
    const punctuationToken = tokens[startFrom + 1];

    if (
      !BaseLexer.checkTokenType(numberToken, TokenType.Number) ||
      !BaseLexer.checkToken(punctuationToken, TokenType.Punctuation, ".")
    ) {
      return null;
    }

    return [numberToken, punctuationToken];
  }

  private static readAlphabeticSeparator(tokens: IToken[], startFrom: number): HierarchySeparator {
    const tokensCount = 2;

    if (startFrom + tokensCount > tokens.length) {
      return null;
    }

    const alphabeticToken = tokens[startFrom];
    const punctuationToken = tokens[startFrom + 1];

    if (
      !BaseLexer.checkTokenType(alphabeticToken, TokenType.Text) ||
      !BaseLexer.checkToken(punctuationToken, TokenType.Punctuation, ")") ||
      BaseLexer.checkToken(alphabeticToken, TokenType.Text, "X")
    ) {
      return null;
    }

    return [alphabeticToken, punctuationToken];
  }
}
