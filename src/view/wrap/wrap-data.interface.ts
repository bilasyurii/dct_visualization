import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { WrapView } from "./wrap-view";
import { IWrapViewConfig } from "./wrap-view-config.interface";

export interface IWrapData {
  id: number;
  superWrap: SuperWrap;
  view: WrapView;
  viewConfig: IWrapViewConfig;
}
