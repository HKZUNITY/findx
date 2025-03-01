import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"509868",2],[2,null,"478218",2],[3,null,"383390",2],[4,null,"370735",2],[5,null,"356245",2],[6,null,"344228",2],[7,null,"321370",2],[8,null,"313079",2],[9,null,"297929",2],[10,null,"296023",2],[11,null,"292004",2],[12,null,"171377",2],[13,null,"171301",2],[14,null,"137425",2],[15,null,"121948",2],[16,null,"119366",2],[17,null,"119350",2],[18,null,"115922",2],[19,null,"111253",2],[20,null,"111241",2],[21,null,"109839",2],[22,null,"65656",2],[23,null,"63648",2],[24,null,"63539",2],[25,null,"63300",2],[26,null,"62958",2],[27,null,"62777",2],[28,null,"59857",2],[29,null,"509895",1],[30,null,"479087",1],[31,null,"383409",1],[32,null,"356544",1],[33,null,"336269",1],[34,null,"300136",1],[35,null,"291009",1],[36,null,"266166",1],[37,null,"171318",1],[38,null,"171118",1],[39,null,"140934",1],[40,null,"137437",1],[41,null,"127499",1],[42,null,"122089",1],[43,null,"120060",1],[44,null,"120059",1],[45,null,"120058",1],[46,null,"120056",1],[47,null,"119893",1],[48,null,"118079",1],[49,null,"116791",1],[50,null,"115938",1],[51,null,"112202",1],[52,null,"112201",1],[53,null,"111573",1],[54,null,"111518",1],[55,null,"111161",1],[56,null,"98550",1],[57,null,"74113",1],[58,null,"66414",1],[59,null,"66160",1],[60,null,"65006",1],[61,null,"64995",1],[62,null,"64803",1],[63,null,"64544",1],[64,null,"63883",1],[65,null,"63674",1],[66,null,"63671",1]];
export interface IShortJacketTopElement extends IElementBase{
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
export class ShortJacketTopConfig extends ConfigBase<IShortJacketTopElement>{
	constructor(){
		super(EXCELDATA);
	}

}