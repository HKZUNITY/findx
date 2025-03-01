import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","Transform","SexType"],["","","","",""],[1,"单手刀","334208",["0","0","0","0","0","0","1","1","1"],0],[2,"星月魔杖","291285",["0","0","0","0","0","0","1","1","1"],0],[3,"散弹喷枪","155702",["0","0","0","0","0","0","1","1","1"],0],[4,"紫光剑","304952",["0","0","0","0","0","0","1","1","1"],0],[5,"弓箭","304643",["0","0","0","0","0","0","1","1","1"],0],[6,"星月魔杖","304949",["0","0","0","0","0","0","1","1","1"],0],[7,"法杖","304953",["0","0","0","0","0","0","1","1","1"],0]];
export interface ILeftHandElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	AssetId:string
	/**undefined*/
	Transform:Array<string>
	/**0-Common
1-Male
2-FeMale*/
	SexType:number
 } 
export class LeftHandConfig extends ConfigBase<ILeftHandElement>{
	constructor(){
		super(EXCELDATA);
	}

}