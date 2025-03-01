import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"翻毛黄金首饰","137386",1],[2,"清洁手套","119254",2]];
export interface IGlovesElement extends IElementBase{
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
export class GlovesConfig extends ConfigBase<IGlovesElement>{
	constructor(){
		super(EXCELDATA);
	}

}