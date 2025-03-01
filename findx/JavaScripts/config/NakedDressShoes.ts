import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"124879",2],[2,null,"65712",2],[3,null,"64412",2],[4,null,"64142",2],[5,null,"127349",1],[6,null,"109137",1]];
export interface INakedDressShoesElement extends IElementBase{
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
export class NakedDressShoesConfig extends ConfigBase<INakedDressShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}