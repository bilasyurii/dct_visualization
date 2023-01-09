import { IToken } from "../tokens/token.interface";

export interface ILexer<T> {
  parse(tokens: IToken[]): T;
}
