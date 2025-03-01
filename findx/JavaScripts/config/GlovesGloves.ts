import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"502239",2],[2,null,"497737",2],[3,null,"476303",2],[4,null,"458634",2],[5,null,"457816",2],[6,null,"457731",2],[7,null,"440212",2],[8,null,"412073",2],[9,null,"390741",2],[10,null,"390739",2],[11,null,"390343",2],[12,null,"344061",2],[13,null,"322893",2],[14,null,"321369",2],[15,null,"314289",2],[16,null,"300485",2],[17,null,"299083",2],[18,null,"292847",2],[19,null,"269618",2],[20,null,"241439",2],[21,null,"240051",2],[22,null,"224012",2],[23,null,"218567",2],[24,null,"213470",2],[25,null,"213469",2],[26,null,"213468",2],[27,null,"131791",2],[28,null,"121945",2],[29,null,"119226",2],[30,null,"111259",2],[31,null,"111087",2],[32,null,"75663",2],[33,null,"66574",2],[34,null,"66423",2],[35,null,"66299",2],[36,null,"65658",2],[37,null,"64721",2],[38,null,"64720",2],[39,null,"63875",2],[40,null,"63308",2],[41,null,"63307",2],[42,null,"62547",2],[43,null,"60992",2],[44,null,"60081",2],[45,null,"507471",1],[46,null,"502262",1],[47,null,"336268",1],[48,null,"320848",1],[49,null,"313978",1],[50,null,"313678",1],[51,null,"299158",1],[52,null,"293136",1],[53,null,"247534",1],[54,null,"224167",1],[55,null,"218834",1],[56,null,"213090",1],[57,null,"213089",1],[58,null,"213088",1],[59,null,"212894",1],[60,null,"200235",1],[61,null,"150735",1],[62,null,"134566",1],[63,null,"131746",1],[64,null,"129935",1],[65,null,"129274",1],[66,null,"129090",1],[67,null,"127718",1],[68,null,"127496",1],[69,null,"126680",1],[70,null,"122780",1],[71,null,"120574",1],[72,null,"119892",1],[73,null,"119663",1],[74,null,"119391",1],[75,null,"119254",1],[76,null,"118078",1],[77,null,"117683",1],[78,null,"115939",1],[79,null,"112037",1],[80,null,"111576",1],[81,null,"111390",1],[82,null,"111285",1],[83,null,"109141",1],[84,null,"94783",1],[85,null,"75664",1],[86,null,"65778",1],[87,null,"65730",1],[88,null,"64631",1],[89,null,"64551",1],[90,null,"63890",1],[91,null,"60384",1]];
export interface IGlovesGlovesElement extends IElementBase{
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
export class GlovesGlovesConfig extends ConfigBase<IGlovesGlovesElement>{
	constructor(){
		super(EXCELDATA);
	}

}