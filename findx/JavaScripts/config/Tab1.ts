import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Text","Tab2"],["","","Language",""],[1,"捏脸","Text_Tab1_1",[101,102,103,104,105,106,107]],[2,"换装","Text_Tab1_2",[108,109,110,111,112,113,115,114]],[3,"收藏","Text_Tab1_3",null]];
export interface ITab1Element extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	Text:string
	/**undefined*/
	Tab2:Array<number>
 } 
export class Tab1Config extends ConfigBase<ITab1Element>{
	constructor(){
		super(EXCELDATA);
	}

}