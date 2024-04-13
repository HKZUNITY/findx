import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","NPCSitGuid","NPCDanceGuid","SitStance","Annotation"],["","","","",""],[1,"0F9D7025",null,"122230","鸣人"],[2,"18F424B3",null,"122227","雏田"],[3,"3AD865B6",null,"126331","女魔法师"],[4,null,"0026F981",null,"赛博女孩"],[5,null,"1F5985F5",null,"舞女"],[6,null,"0069B9BD",null,"妮可罗宾"],[7,null,"294C8EC1",null,"贵族少女"],[8,null,"224C7FFF",null,"海洋王后"],[9,null,"3FDFC3E3",null,"酒吧女DJ"]];
export interface INPCSitDanceElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**NPCSitGuid*/
	NPCSitGuid:string
	/**NPCDanceGuid*/
	NPCDanceGuid:string
	/**姿态*/
	SitStance:string
	/**注释*/
	Annotation:string
 } 
export class NPCSitDanceConfig extends ConfigBase<INPCSitDanceElement>{
	constructor(){
		super(EXCELDATA);
	}

}