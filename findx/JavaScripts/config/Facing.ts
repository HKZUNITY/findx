import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","Transform","SexType"],["","","","",""],[1,"眼镜","324491",["-13","0","-6","0","0","-90","1","1","1"],0],[2,"眼镜","225166",["-10","0","-5","0","0","-90","1","1","1"],0],[3,"眼镜","366489",["-11","0","-7","0","0","-90","1","1","1"],0],[4,"眼镜","225171",["-4","0","0","0","0","-90","1","1","1"],0],[5,"眼罩","278280",["-13","0","-5","0","0","-90","1","1","1"],0],[6,"面纱","269783",["0","0","-23","0","0","-90","1","1","1"],0],[7,"面具","470153",["-4","0","-12","0","0","-90","1","1","1"],0],[8,"面具","121405",["-9.5","0","-5","0","0","-90","1","1","1"],0],[9,"面具","470154",["-4","0","-11","0","0","-90","1","1","1"],0],[10,"面具","455257",["-4","0","-11","0","0","-90","1","1","1"],0],[11,"面具","455263",["-4","0","-11","0","0","-90","1","1","1"],0],[12,"面具","455274",["-4","0","-11","0","0","-90","1","1","1"],0],[13,"面具","455275",["-4","0","-11","0","0","-90","1","1","1"],0],[14,"狐狸面具","405768",["-5","0","-5","0","0","-90","1","1","1"],0],[15,"眼饰面具","229148",["-14","0","-151.5","0","0","-90","1","1","1"],0],[16,"南瓜","442771",["-15","0","-14","0","0","-90","0.6","0.6","0.6"],0],[17,"恶魔头","136506",["-5","0","-13.5","0","0","-90","1","1","1"],0],[18,"头套","234390",["-14","0","-15","0","0","-90","1","1","1"],0],[19,"头套","292089",["-14","0","-15","0","0","-90","1","1","1"],0]];
export interface IFacingElement extends IElementBase{
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
export class FacingConfig extends ConfigBase<IFacingElement>{
	constructor(){
		super(EXCELDATA);
	}

}