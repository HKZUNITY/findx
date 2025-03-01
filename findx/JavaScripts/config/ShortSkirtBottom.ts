import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,null,"468349",2],[2,null,"440230",2],[3,null,"412115",2],[4,null,"390433",2],[5,null,"383391",2],[6,null,"370794",2],[7,null,"356246",2],[8,null,"314286",2],[9,null,"297931",2],[10,null,"292002",2],[11,null,"240937",2],[12,null,"174757",2],[13,null,"138032",2],[14,null,"127523",2],[15,null,"126616",2],[16,null,"122101",2],[17,null,"121947",2],[18,null,"119227",2],[19,null,"116967",2],[20,null,"116956",2],[21,null,"116955",2],[22,null,"66356",2],[23,null,"65665",2],[24,null,"64334",2],[25,null,"64333",2],[26,null,"63650",2],[27,null,"62970",2],[28,null,"62790",2],[29,null,"60994",2],[30,null,"60113",2],[31,null,"57736",2]];
export interface IShortSkirtBottomElement extends IElementBase{
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
export class ShortSkirtBottomConfig extends ConfigBase<IShortSkirtBottomElement>{
	constructor(){
		super(EXCELDATA);
	}

}