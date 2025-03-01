import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"回声战士","141606",2],[2,"福瑞","141617",2],[3,"海绵宝宝装","142135",2],[4,"猫人装","142137",2],[5,"长腿妈妈","143403",2],[6,"猫猫头套服饰","163304",2],[7,"猫咪玩偶服","164422",2],[8,"大头玩偶服","164427",2],[9,"交个朋友鸭","270464",2],[10,"交个朋友鸭","270465",2],[11,"卡通玩偶服饰","162955",1],[12,"玩偶熊服饰","164354",1],[13,"小蓝人服饰","164356",1],[14,"方块玩偶服","164359",1],[15,"兔子玩偶服","164364",1],[16,"玩具鸡服饰","164366",1],[17,"刺猬玩偶服","164367",1],[18,"玩具兔服饰","164368",1],[19,"狗头毛毛虫玩偶服","164377",1],[20,"雪人装","164417",1],[21,"橘龙","212971",1],[22,"跳舞熊","213498",1],[23,"蓝龙","216268",1],[24,"绿龙","216269",1],[25,"黑龙","216270",1],[26,"成都五彩熊","141156",1],[27,"小黑子","141476",1],[28,"鸡人装","142136",1],[29,"兔人装","142138",1],[30,"熊人装","142147",1],[31,"Bunzo bunny","143383",1],[32,"Enderman","143384",1],[33,"Rainbow friends","143385",1],[34,"索尼克","143387",1],[35,"狗头毛毛虫","143390",1]];
export interface IMuppetStylingOutfitElement extends IElementBase{
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
export class MuppetStylingOutfitConfig extends ConfigBase<IMuppetStylingOutfitElement>{
	constructor(){
		super(EXCELDATA);
	}

}