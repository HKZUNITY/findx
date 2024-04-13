import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid","ModelGuid"],["","",""],[1,"392B0F44","1CAC76F4"]];
export interface ITrampolineElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器Guid*/
	TriggerGuid:string
	/**蹦床模型Guid*/
	ModelGuid:string
 } 
export class TrampolineConfig extends ConfigBase<ITrampolineElement>{
	constructor(){
		super(EXCELDATA);
	}

}