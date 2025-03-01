import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"241445",2],[2,null,"221704",2],[3,null,"211010",2],[4,null,"210328",2],[5,null,"181365",2],[6,null,"171774",2],[7,null,"142608",2],[8,null,"141708",2],[9,null,"134234",2],[10,null,"131789",2],[11,null,"127639",2],[12,null,"124880",2],[13,null,"119745",2],[14,null,"86088",2],[15,null,"71960",2],[16,null,"67583",2],[17,null,"67582",2],[18,null,"67541",2],[19,null,"66712",2],[20,null,"66572",2],[21,null,"65870",2],[22,null,"65710",2],[23,null,"65655",2],[24,null,"65654",2],[25,null,"64710",2],[26,null,"64709",2],[27,null,"64627",2],[28,null,"64559",2],[29,null,"64305",2],[30,null,"64141",2],[31,null,"64138",2],[32,null,"63954",2],[33,null,"63871",2],[34,null,"63868",2],[35,null,"63538",2],[36,null,"63536",2],[37,null,"63292",2],[38,null,"63291",2],[39,null,"63290",2],[40,null,"62778",2],[41,null,"62776",2],[42,null,"62535",2],[43,null,"60981",2],[44,null,"60077",2],[45,null,"59955",2],[46,null,"59536",2],[47,null,"320844",1],[48,null,"212895",1],[49,null,"200242",1],[50,null,"186268",1],[51,null,"131747",1],[52,null,"129936",1],[53,null,"119773",1],[54,null,"119669",1],[55,null,"119393",1],[56,null,"111612",1],[57,null,"109144",1],[58,null,"92015",1],[59,null,"75457",1],[60,null,"66615",1],[61,null,"66554",1],[62,null,"64813",1],[63,null,"63711",1],[64,null,"60381",1]];
export interface ISuitTopElement extends IElementBase{
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
export class SuitTopConfig extends ConfigBase<ISuitTopElement>{
	constructor(){
		super(EXCELDATA);
	}

}