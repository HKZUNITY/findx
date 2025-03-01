import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"121946",2],[2,null,"115634",2],[3,null,"111207",2],[4,null,"111206",2],[5,null,"64727",2],[6,null,"64711",2],[7,null,"64147",2],[8,null,"59854",2],[9,null,"458132",1],[10,null,"356543",1],[11,null,"266168",1],[12,null,"250456",1],[13,null,"240887",1],[14,null,"129210",1],[15,null,"119890",1],[16,null,"115937",1],[17,null,"66416",1],[18,null,"66163",1],[19,null,"65009",1],[20,null,"64792",1],[21,null,"63687",1],[22,null,"63596",1]];
export interface ISportsShoesShoesElement extends IElementBase{
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
export class SportsShoesShoesConfig extends ConfigBase<ISportsShoesShoesElement>{
	constructor(){
		super(EXCELDATA);
	}

}