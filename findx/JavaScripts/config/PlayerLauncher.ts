import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid","ModelGuid","InteractivityGuid"],["","","",""],[1,"36261CB3","3EE381F1","1EA2CBEE"],[2,"39C1B46E","0744517E","1B8B401A"],[3,"09976D98","161388BE","249A3E82"]];
export interface IPlayerLauncherElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器Guid*/
	TriggerGuid:string
	/**蹦床模型Guid*/
	ModelGuid:string
	/**交互物Guid*/
	InteractivityGuid:string
 } 
export class PlayerLauncherConfig extends ConfigBase<IPlayerLauncherElement>{
	constructor(){
		super(EXCELDATA);
	}

}