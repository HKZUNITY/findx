import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"502238",2],[2,null,"497919",2],[3,null,"497780",2],[4,null,"497738",2],[5,null,"495176",2],[6,null,"490926",2],[7,null,"468350",2],[8,null,"457968",2],[9,null,"457815",2],[10,null,"457732",2],[11,null,"455507",2],[12,null,"440246",2],[13,null,"437604",2],[14,null,"437075",2],[15,null,"412080",2],[16,null,"390746",2],[17,null,"390457",2],[18,null,"390445",2],[19,null,"390420",2],[20,null,"390417",2],[21,null,"390415",2],[22,null,"383397",2],[23,null,"383392",2],[24,null,"358152",2],[25,null,"340074",2],[26,null,"325905",2],[27,null,"323597",2],[28,null,"313726",2],[29,null,"299082",2],[30,null,"298037",2],[31,null,"269653",2],[32,null,"269652",2],[33,null,"224242",2],[34,null,"224241",2],[35,null,"224240",2],[36,null,"224239",2],[37,null,"224238",2],[38,null,"192850",2],[39,null,"171802",2],[40,null,"171092",2],[41,null,"171091",2],[42,null,"140483",2],[43,null,"137385",2],[44,null,"125737",2],[45,null,"121055",2],[46,null,"117491",2],[47,null,"111205",2],[48,null,"64774",2],[49,null,"64140",2],[50,null,"63295",2],[51,null,"62537",2],[52,null,"62536",2],[53,null,"60982",2],[54,null,"60114",2],[55,null,"504623",1],[56,null,"502263",1],[57,null,"494891",1],[58,null,"477531",1],[59,null,"192842",1],[60,null,"181113",1],[61,null,"140280",1],[62,null,"127800",1],[63,null,"126679",1],[64,null,"122919",1],[65,null,"122779",1],[66,null,"119483",1],[67,null,"119338",1],[68,null,"112568",1],[69,null,"109058",1],[70,null,"96576",1],[71,null,"66726",1],[72,null,"65973",1],[73,null,"63710",1]];
export interface ILongSinglePieceTopElement extends IElementBase{
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
export class LongSinglePieceTopConfig extends ConfigBase<ILongSinglePieceTopElement>{
	constructor(){
		super(EXCELDATA);
	}

}