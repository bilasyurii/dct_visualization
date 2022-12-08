import { Wrap } from "../../core/lexic/structures/wrap";
import { WrapView } from "./wrap-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export interface IWrapData {
  id: number;
  wrap: Wrap;
  view: WrapView;
  viewConfig: IWrapViewConfig;
}
