export enum StructureType {
  NumericListItem = "NumericListItem", // 1.
  AlphabeticListItem = "AlphabeticListItem", // a)
  SignedNumber = "SignedNumber", // +1
  Point = "Point", // {25, 4}
  ScaledPoint = "ScaledPoint", // +1 {25, 4}
  ScaledPointSet = "ScaledPointSet", // +1 {25, 4} -2 {0, 6}
  SumSet = "SumSet", // (+1 +3 -7 +8)
  SummationOperand = "SummationOperand", // x(14)
  SummationOperandSet = "SummationOperandSet", // +(x(14), x(3)) or +x(14)
  SummationSet = "SummationSet", // {+(x(14), x(3)) -(x(2), x(7))}
  Wrap = "Wrap", // everything together
  SuperWrap = "SuperWrap", // a set of wraps
  LexicalTree = "LexicalTree", // a collection of superwraps
}
