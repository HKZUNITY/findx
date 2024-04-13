import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid"],["",""],[1,"2A9514EB"],[2,"039018FC"],[3,"1A3077C7"]];
export interface IRotaryKnifeTriggerElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器Guid*/
	TriggerGuid:string
 } 
export class RotaryKnifeTriggerConfig extends ConfigBase<IRotaryKnifeTriggerElement>{
	constructor(){
		super(EXCELDATA);
	}

}