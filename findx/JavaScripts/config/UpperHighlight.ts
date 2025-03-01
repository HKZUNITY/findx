import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"152735",0],[2,null,"77447",0],[3,null,"48629",0],[4,null,"48041",0],[5,null,"48040",0],[6,null,"48039",0],[7,null,"48038",0],[8,null,"48037",0],[9,null,"48036",0],[10,null,"48034",0],[11,null,"48033",0],[12,null,"48032",0],[13,null,"48031",0],[14,null,"48030",0],[15,null,"32112",0],[16,null,"22660",0],[17,null,"22616",0]];
export interface IUpperHighlightElement extends IElementBase{
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
export class UpperHighlightConfig extends ConfigBase<IUpperHighlightElement>{
	constructor(){
		super(EXCELDATA);
	}

}