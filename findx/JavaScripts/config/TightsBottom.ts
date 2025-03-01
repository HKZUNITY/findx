import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"497927",2],[2,null,"497783",2],[3,null,"458637",2],[4,null,"437607",2],[5,null,"299081",2],[6,null,"224015",2],[7,null,"221706",2],[8,null,"217271",2],[9,null,"211009",2],[10,null,"141710",2],[11,null,"137517",2],[12,null,"137504",2],[13,null,"137491",2],[14,null,"137382",2],[15,null,"134233",2],[16,null,"127636",2],[17,null,"119743",2],[18,null,"116973",2],[19,null,"67589",2],[20,null,"66576",2],[21,null,"65869",2],[22,null,"65659",2],[23,null,"64776",2],[24,null,"64722",2],[25,null,"64309",2],[26,null,"64153",2],[27,null,"63877",2],[28,null,"63553",2],[29,null,"63312",2],[30,null,"62792",2],[31,null,"62791",2],[32,null,"62549",2],[33,null,"60993",2],[34,null,"64815",1]];
export interface ITightsBottomElement extends IElementBase{
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
export class TightsBottomConfig extends ConfigBase<ITightsBottomElement>{
	constructor(){
		super(EXCELDATA);
	}

}