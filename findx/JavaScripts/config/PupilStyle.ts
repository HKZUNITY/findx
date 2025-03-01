import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"美瞳","531757",0],[2,"美瞳","531159",0],[3,"美瞳","461646",0],[4,null,"458422",0],[5,null,"398609",0],[6,null,"267296",0],[7,null,"267295",0],[8,null,"267294",0],[9,null,"267291",0],[10,null,"267285",0],[11,null,"266476",0],[12,null,"266475",0],[13,null,"266474",0],[14,null,"266473",0],[15,null,"266472",0],[16,null,"266372",0],[17,null,"266371",0],[18,null,"266363",0],[19,null,"266362",0],[20,null,"266361",0],[21,null,"266360",0],[22,null,"266359",0],[23,null,"266358",0],[24,null,"215181",0],[25,null,"215180",0],[26,null,"215179",0],[27,null,"215178",0],[28,null,"215177",0],[29,null,"215176",0],[30,null,"215175",0],[31,null,"215174",0],[32,null,"215173",0],[33,null,"215172",0],[34,null,"215171",0],[35,null,"215170",0],[36,null,"215169",0],[37,null,"215168",0],[38,null,"215167",0],[39,null,"215166",0],[40,null,"215165",0],[41,null,"215164",0],[42,null,"215163",0],[43,null,"215162",0],[44,null,"185330",0],[45,null,"121577",0],[46,null,"117054",0],[47,null,"77770",0],[48,null,"77769",0],[49,null,"77598",0],[50,null,"77597",0],[51,null,"77596",0],[52,null,"77518",0],[53,null,"77517",0],[54,null,"77485",0],[55,null,"77484",0],[56,null,"70244",0],[57,null,"70243",0],[58,null,"70242",0],[59,null,"70241",0],[60,null,"47973",0],[61,null,"47972",0],[62,null,"47971",0],[63,null,"47970",0],[64,null,"47969",0],[65,null,"47968",0],[66,null,"47967",0],[67,null,"47966",0],[68,null,"47965",0],[69,null,"47964",0],[70,null,"47963",0],[71,null,"47962",0],[72,null,"47961",0],[73,null,"47960",0],[74,null,"47959",0],[75,null,"47958",0],[76,null,"47957",0],[77,null,"47956",0],[78,null,"32093",0],[79,null,"30422",0],[80,null,"25891",0],[81,null,"22599",0]];
export interface IPupilStyleElement extends IElementBase{
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
export class PupilStyleConfig extends ConfigBase<IPupilStyleElement>{
	constructor(){
		super(EXCELDATA);
	}

}