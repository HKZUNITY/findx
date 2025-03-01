import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"套靴长裤","60386",1],[2,"制服短裙","57736",2]];
export interface IFaceTattooElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	AssetId:string
	/**0-Common
1-Male
2-FeMale*/
	SexType:number
 } 
export class FaceTattooConfig extends ConfigBase<IFaceTattooElement>{
	constructor(){
		super(EXCELDATA);
	}

}