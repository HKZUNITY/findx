import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"531767",0],[2,null,"531766",0],[3,null,"370253",0],[4,null,"370242",0],[5,null,"370241",0],[6,null,"370240",0],[7,null,"370238",0],[8,null,"367137",0],[9,null,"270030",0],[10,null,"267300",0],[11,null,"267297",0],[12,null,"267289",0],[13,null,"267288",0],[14,null,"267286",0],[15,null,"215818",0],[16,null,"215817",0],[17,null,"215816",0],[18,null,"215815",0],[19,null,"215814",0],[20,null,"215813",0],[21,null,"215812",0],[22,null,"215811",0],[23,null,"215810",0],[24,null,"215809",0],[25,null,"215808",0],[26,null,"215807",0],[27,null,"215806",0],[28,null,"215805",0],[29,null,"215804",0],[30,null,"215803",0],[31,null,"215802",0],[32,null,"215800",0],[33,null,"215799",0],[34,null,"215798",0],[35,null,"215797",0],[36,null,"215795",0],[37,null,"215794",0],[38,null,"215793",0],[39,null,"215792",0],[40,null,"215791",0],[41,null,"215790",0],[42,null,"215789",0],[43,null,"215788",0],[44,null,"215787",0],[45,null,"215786",0],[46,null,"215785",0],[47,null,"215784",0],[48,null,"215783",0],[49,null,"215782",0],[50,null,"215781",0],[51,null,"215780",0],[52,null,"215779",0],[53,null,"215778",0],[54,null,"215777",0],[55,null,"215776",0],[56,null,"215775",0],[57,null,"215774",0],[58,null,"215773",0],[59,null,"215772",0],[60,null,"129304",0],[61,null,"112587",0],[62,null,"77603",0],[63,null,"77602",0],[64,null,"77526",0],[65,null,"77525",0],[66,null,"77524",0],[67,null,"77523",0],[68,null,"77522",0],[69,null,"77521",0],[70,null,"77520",0],[71,null,"75947",0],[72,null,"32092",0],[73,null,"32091",0],[74,null,"32090",0],[75,null,"32089",0],[76,null,"32088",0],[77,null,"32080",0]];
export interface ILipMakeupElement extends IElementBase{
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
export class LipMakeupConfig extends ConfigBase<ILipMakeupElement>{
	constructor(){
		super(EXCELDATA);
	}

}