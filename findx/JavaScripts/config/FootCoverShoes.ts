import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"224014",2],[2,null,"181359",2],[3,null,"119225",2],[4,null,"75456",2],[5,null,"66300",2],[6,null,"63869",2],[7,null,"63301",2],[8,null,"224163",1],[9,null,"213066",1],[10,null,"213065",1],[11,null,"213064",1],[12,null,"212896",1],[13,null,"200241",1],[14,null,"129276",1],[15,null,"129088",1],[16,null,"126683",1],[17,null,"120573",1],[18,null,"119392",1],[19,null,"117679",1],[20,null,"75459",1],[21,null,"64632",1],[22,null,"64541",1]];
export interface IFootCoverShoesElement extends IElementBase{
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
export class FootCoverShoesConfig extends ConfigBase<IFootCoverShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}