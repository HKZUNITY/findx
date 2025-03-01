import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"497741",2],[2,null,"490925",2],[3,null,"436992",2],[4,null,"358106",2],[5,null,"321373",2],[6,null,"299079",2],[7,null,"218443",2],[8,null,"211008",2],[9,null,"164845",2],[10,null,"141712",2],[11,null,"137428",2],[12,null,"127638",2],[13,null,"67592",2],[14,null,"66562",2],[15,null,"65867",2],[16,null,"64775",2],[17,null,"64712",2],[18,null,"64304",2],[19,null,"64144",2],[20,null,"63870",2],[21,null,"63541",2],[22,null,"62961",2],[23,null,"62960",2],[24,null,"62541",2],[25,null,"62539",2],[26,null,"60984",2],[27,null,"60117",2],[28,null,"60078",2]];
export interface IHighHeelsShoesElement extends IElementBase{
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
export class HighHeelsShoesConfig extends ConfigBase<IHighHeelsShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}