import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"531764",0],[2,null,"370252",0],[3,null,"370251",0],[4,null,"370250",0],[5,null,"370249",0],[6,null,"370246",0],[7,null,"370245",0],[8,null,"370239",0],[9,null,"215936",0],[10,null,"215935",0],[11,null,"215934",0],[12,null,"215933",0],[13,null,"215932",0],[14,null,"215930",0],[15,null,"215929",0],[16,null,"215928",0],[17,null,"215927",0],[18,null,"215926",0],[19,null,"215925",0],[20,null,"215924",0],[21,null,"215923",0],[22,null,"215922",0],[23,null,"215921",0],[24,null,"215920",0],[25,null,"215919",0],[26,null,"215918",0],[27,null,"215917",0],[28,null,"215916",0],[29,null,"215915",0],[30,null,"215914",0],[31,null,"215913",0],[32,null,"215911",0],[33,null,"215910",0],[34,null,"215909",0],[35,null,"215908",0],[36,null,"215907",0],[37,null,"215906",0],[38,null,"215905",0],[39,null,"215904",0],[40,null,"215903",0],[41,null,"215902",0],[42,null,"215901",0],[43,null,"215900",0],[44,null,"215899",0],[45,null,"215898",0],[46,null,"215897",0],[47,null,"215896",0],[48,null,"215895",0],[49,null,"164837",0],[50,null,"129303",0],[51,null,"121548",0],[52,null,"112597",0],[53,null,"112596",0],[54,null,"112595",0],[55,null,"112594",0],[56,null,"112593",0],[57,null,"112591",0],[58,null,"112590",0],[59,null,"112589",0],[60,null,"112588",0],[61,null,"112586",0],[62,null,"107625",0],[63,null,"77490",0],[64,null,"77489",0],[65,null,"77488",0],[66,null,"77487",0],[67,null,"77442",0],[68,null,"77441",0],[69,null,"77440",0],[70,null,"77439",0],[71,null,"77438",0],[72,null,"77437",0],[73,null,"75674",0],[74,null,"75673",0],[75,null,"32114",0],[76,null,"32103",0]];
export interface IBlushElement extends IElementBase{
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
export class BlushConfig extends ConfigBase<IBlushElement>{
	constructor(){
		super(EXCELDATA);
	}

}