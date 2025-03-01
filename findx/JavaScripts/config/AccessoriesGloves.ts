import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"292307",2],[2,null,"240931",2],[3,null,"144441",2],[4,null,"137386",2],[5,null,"117489",2],[6,null,"115847",2],[7,null,"67591",2],[8,null,"66710",2],[9,null,"64416",2],[10,null,"60991",2],[11,null,"140281",1],[12,null,"123710",1],[13,null,"119111",1],[14,null,"117051",1],[15,null,"109070",1]];
export interface IAccessoriesGlovesElement extends IElementBase{
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
export class AccessoriesGlovesConfig extends ConfigBase<IAccessoriesGlovesElement>{
	constructor(){
		super(EXCELDATA);
	}

}