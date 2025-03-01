import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"长袜制服鞋","57729",2],[2,"细跟尖头鞋","60078",1],[3,"猫猫鞋套","63301",0],[4,"皮鞋","383403",2],[5,"小熊鞋","362125",2]];
export interface IShoesElement extends IElementBase{
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
export class ShoesConfig extends ConfigBase<IShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}