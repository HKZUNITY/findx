import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"502241",2],[2,null,"497874",2],[3,null,"497782",2],[4,null,"458636",2],[5,null,"457812",2],[6,null,"440206",2],[7,null,"437606",2],[8,null,"412090",2],[9,null,"298038",2],[10,null,"264185",2],[11,null,"240934",2],[12,null,"240050",2],[13,null,"221708",2],[14,null,"218866",2],[15,null,"140484",2],[16,null,"137490",2],[17,null,"137383",2],[18,null,"134232",2],[19,null,"131788",2],[20,null,"128835",2],[21,null,"125735",2],[22,null,"115850",2],[23,null,"111252",2],[24,null,"111082",2],[25,null,"74458",2],[26,null,"66709",2],[27,null,"64456",2],[28,null,"64209",2],[29,null,"63297",2],[30,null,"63296",2],[31,null,"62780",2],[32,null,"59427",2],[33,null,"502159",1],[34,null,"494889",1],[35,null,"479088",1],[36,null,"218865",1],[37,null,"218832",1],[38,null,"181111",1],[39,null,"140279",1],[40,null,"134565",1],[41,null,"134558",1],[42,null,"131749",1],[43,null,"129937",1],[44,null,"129248",1],[45,null,"129178",1],[46,null,"127715",1],[47,null,"127498",1],[48,null,"125687",1],[49,null,"122088",1],[50,null,"119774",1],[51,null,"119340",1],[52,null,"119255",1],[53,null,"112569",1],[54,null,"111769",1],[55,null,"111618",1],[56,null,"111393",1],[57,null,"111354",1],[58,null,"111287",1],[59,null,"111160",1],[60,null,"94773",1],[61,null,"92016",1],[62,null,"74116",1],[63,null,"66555",1],[64,null,"65779",1],[65,null,"60385",1]];
export interface IBootsShoesElement extends IElementBase{
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
export class BootsShoesConfig extends ConfigBase<IBootsShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}