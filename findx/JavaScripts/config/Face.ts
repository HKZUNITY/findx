import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"标准脸型-男","161675",1],[2,"标准脸型-女","161676",2]];
export interface IFaceElement extends IElementBase{
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
export class FaceConfig extends ConfigBase<IFaceElement>{
	constructor(){
		super(EXCELDATA);
	}

}