import { SuperWrap } from "../../core/lexic/structures/super-wrap";
import { SuperWrapView } from "./super-wrap-view";
import { ISuperWrapViewConfig } from "./super-wrap-view-config.interface";

export interface ISuperWrapData {
  id: number;
  superWrap: SuperWrap;
  view: SuperWrapView;
  viewConfig: ISuperWrapViewConfig;
}
