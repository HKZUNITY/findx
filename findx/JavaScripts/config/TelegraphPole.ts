import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid"],["",""],[1,"025E1C68"],[2,"2291618B"],[3,"33A566AE"],[4,"3BBFCFF0"],[5,"2A550CB9"],[6,"2051E67A"]];
export interface ITelegraphPoleElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器Guid*/
	TriggerGuid:string
 } 
export class TelegraphPoleConfig extends ConfigBase<ITelegraphPoleElement>{
	constructor(){
		super(EXCELDATA);
	}

}