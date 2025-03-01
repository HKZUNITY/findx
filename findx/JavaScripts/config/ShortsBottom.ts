import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"497740",2],[2,null,"457813",2],[3,null,"457730",2],[4,null,"390740",2],[5,null,"390416",2],[6,null,"383395",2],[7,null,"344230",2],[8,null,"344064",2],[9,null,"321371",2],[10,null,"294324",2],[11,null,"241190",2],[12,null,"218442",2],[13,null,"210327",2],[14,null,"181361",2],[15,null,"144575",2],[16,null,"140329",2],[17,null,"125734",2],[18,null,"122110",2],[19,null,"111722",2],[20,null,"66424",2],[21,null,"66302",2],[22,null,"64457",2],[23,null,"63552",2],[24,null,"63315",2],[25,null,"59855",2],[26,null,"383411",1],[27,null,"382168",1],[28,null,"266167",1],[29,null,"250471",1],[30,null,"241332",1],[31,null,"145069",1],[32,null,"111510",1],[33,null,"75460",1],[34,null,"66110",1],[35,null,"65616",1],[36,null,"64783",1],[37,null,"64553",1],[38,null,"64187",1],[39,null,"63915",1],[40,null,"63688",1]];
export interface IShortsBottomElement extends IElementBase{
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
export class ShortsBottomConfig extends ConfigBase<IShortsBottomElement>{
	constructor(){
		super(EXCELDATA);
	}

}