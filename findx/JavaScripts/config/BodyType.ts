import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Scale","SexType","Icon"],["","","","",""],[1,"0.7倍",0.7,0,"119160"],[2,"0.8倍",0.8,0,"119155"],[3,"0.9倍",0.9,0,"119155"],[4,"正常",1,0,"119156"],[5,"1.1倍",1.1,0,"119157"],[6,"1.2倍",1.2,0,"119157"],[7,"1.3倍",1.3,0,"119152"]];
export interface IBodyTypeElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	Scale:number
	/**0-Common
1-Male
2-FeMale*/
	SexType:number
	/**undefined*/
	Icon:string
 } 
export class BodyTypeConfig extends ConfigBase<IBodyTypeElement>{
	constructor(){
		super(EXCELDATA);
	}

}