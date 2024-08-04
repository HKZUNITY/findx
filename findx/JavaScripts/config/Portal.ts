import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid"],["",""],[1,"3B95E285"],[2,"04C75B00"],[3,"1A891F24"],[4,"0A3B2669"],[5,"3081D2EF"],[6,"09CE9A28"]];
export interface IPortalElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器Guid*/
	TriggerGuid:string
 } 
export class PortalConfig extends ConfigBase<IPortalElement>{
	constructor(){
		super(EXCELDATA);
	}

}