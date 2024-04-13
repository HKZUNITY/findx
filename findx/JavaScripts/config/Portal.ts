import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid"],["",""],[1,"3B95E285"]];
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