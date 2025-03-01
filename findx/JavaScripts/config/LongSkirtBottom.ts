import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"313993",2],[2,null,"296021",2],[3,null,"128837",2],[4,null,"127279",2],[5,null,"121054",2],[6,null,"64418",2],[7,null,"62971",2],[8,null,"193166",1],[9,null,"127801",1],[10,null,"127348",1]];
export interface ILongSkirtBottomElement extends IElementBase{
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
export class LongSkirtBottomConfig extends ConfigBase<ILongSkirtBottomElement>{
	constructor(){
		super(EXCELDATA);
	}

}