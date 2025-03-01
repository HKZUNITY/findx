import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"短发女","351026",2],[2,"短发女","411825",2],[3,"机械女","163329",2],[4,"赛博套装","163330",2],[5,"机甲套装","163553",2],[6,"机器人","162950",1],[7,"赛博服饰","162971",1],[8,"机甲套装","164428",1],[9,"刺猬小子","351402",1],[10,"魔法男孩","361919",1]];
export interface IScienceFictionStylingOutfitElement extends IElementBase{
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
export class ScienceFictionStylingOutfitConfig extends ConfigBase<IScienceFictionStylingOutfitElement>{
	constructor(){
		super(EXCELDATA);
	}

}