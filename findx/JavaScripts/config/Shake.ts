import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","ModelGuid","TriggerGuid"],["","",""],[1,"16A6C06D",null],[2,"239D12BA",null]];
export interface IShakeElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**模型Guid*/
	ModelGuid:string
	/**触发器Guid*/
	TriggerGuid:string
 } 
export class ShakeConfig extends ConfigBase<IShakeElement>{
	constructor(){
		super(EXCELDATA);
	}

}