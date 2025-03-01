import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"32098",0],[2,null,"48017",0],[3,null,"48018",0],[4,null,"48019",0],[5,null,"48020",0],[6,null,"48021",0],[7,null,"48022",0],[8,null,"48023",0],[9,null,"48024",0],[10,null,"48025",0],[11,null,"48026",0],[12,null,"48027",0],[13,null,"48028",0],[14,null,"48029",0],[15,null,"48035",0]];
export interface ILowerHighlightElement extends IElementBase{
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
export class LowerHighlightConfig extends ConfigBase<ILowerHighlightElement>{
	constructor(){
		super(EXCELDATA);
	}

}