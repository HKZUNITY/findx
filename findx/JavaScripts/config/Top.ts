import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"弓道服","59536",2],[2,"毛衣外套","59857",2],[3,"拖尾婚纱","60077",2],[4,"蝴蝶结桃心裙","59955",2],[5,"恐龙玩偶服","509868",2],[6,"恐龙玩偶服","509895",1],[7,"礼服","476302",2],[8,"礼服","458752",1],[9,"战损休闲装","458129",1],[10,"披风长袖","455507",1],[11,"紧身衣","64542",1],[12,"长袍上衣","504623",1],[13,"礼服","476242",1],[14,"学士服","264153",1]];
export interface ITopElement extends IElementBase{
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
export class TopConfig extends ConfigBase<ITopElement>{
	constructor(){
		super(EXCELDATA);
	}

}