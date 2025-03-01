import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"399525",2],[2,null,"264186",2],[3,null,"248351",2],[4,null,"221716",2],[5,null,"221709",2],[6,null,"218570",2],[7,null,"142606",2],[8,null,"137492",2],[9,null,"134959",2],[10,null,"66353",2],[11,null,"64458",2],[12,null,"451380",1],[13,null,"264153",1],[14,null,"218835",1],[15,null,"134561",1],[16,null,"134559",1],[17,null,"74680",1],[18,null,"66593",1],[19,null,"66553",1],[20,null,"66220",1],[21,null,"66149",1],[22,null,"65725",1],[23,null,"64951",1]];
export interface IALongCoatTopElement extends IElementBase{
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
export class ALongCoatTopConfig extends ConfigBase<IALongCoatTopElement>{
	constructor(){
		super(EXCELDATA);
	}

}