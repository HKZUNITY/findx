import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Text"],["","","Language"],[1001,"瞳孔样式","Text_Tab3_1001"],[1002,"瞳孔贴画","Text_Tab3_1002"],[1003,"上高光","Text_Tab3_1003"],[1004,"下高光","Text_Tab3_1004"],[1005,"睫毛","Text_Tab3_1005"],[1006,"眼影","Text_Tab3_1006"],[1007,"腮红","Text_Tab3_1007"],[1008,"口红","Text_Tab3_1008"],[1009,"面部彩绘","Text_Tab3_1009"],[1010,"整体发型","Text_Tab3_1010"],[1011,"前发","Text_Tab3_1011"],[1012,"后发","Text_Tab3_1012"],[1013,"左手","Text_Tab3_1013"],[1014,"右手","Text_Tab3_1014"],[1015,"背饰","Text_Tab3_1015"],[1016,"耳饰","Text_Tab3_1016"],[1017,"面饰","Text_Tab3_1017"],[1018,"臀部","Text_Tab3_1018"],[1019,"肩部","Text_Tab3_1019"],[1020,"特效","Text_Tab3_1020"],[1021,"拖尾","Text_Tab3_1021"],[1022,"日常造型1","Text_Tab3_1022"],[1023,"布偶造型","Text_Tab3_1023"],[1024,"英雄造型","Text_Tab3_1024"],[1025,"幻想造型","Text_Tab3_1025"],[1026,"节日造型","Text_Tab3_1026"],[1027,"科幻造型","Text_Tab3_1027"],[1028,"古代造型","Text_Tab3_1028"],[1029,"长单件","Text_Tab3_1029"],[1030,"短外套","Text_Tab3_1030"],[1031,"短单件","Text_Tab3_1031"],[1032,"套装","Text_Tab3_1032"],[1033,"长外套","Text_Tab3_1033"],[1034,"短裙","Text_Tab3_1034"],[1035,"长裤","Text_Tab3_1035"],[1036,"短裤","Text_Tab3_1036"],[1037,"长裙","Text_Tab3_1037"],[1038,"裤袜","Text_Tab3_1038"],[1039,"手套","Text_Tab3_1039"],[1040,"手套饰品","Text_Tab3_1040"],[1041,"日常鞋","Text_Tab3_1041"],[1042,"靴子","Text_Tab3_1042"],[1043,"足套","Text_Tab3_1043"],[1044,"裸饰","Text_Tab3_1044"],[1045,"高跟鞋","Text_Tab3_1045"],[1046,"运动鞋","Text_Tab3_1046"],[1047,"日常造型2","Text_Tab3_1047"],[2001,"瞳孔样式_收藏","Text_Tab3_2001"],[2002,"瞳孔贴花_收藏","Text_Tab3_2002"],[2003,"上高光_收藏","Text_Tab3_2003"],[2004,"下高光_收藏","Text_Tab3_2004"],[2005,"睫毛_收藏","Text_Tab3_2005"],[2006,"眼影_收藏","Text_Tab3_2006"],[2007,"腮红_收藏","Text_Tab3_2007"],[2008,"口红_收藏","Text_Tab3_2008"],[2009,"面部彩绘_收藏","Text_Tab3_2009"],[2010,"整体发型_收藏","Text_Tab3_2010"],[2011,"前发_收藏","Text_Tab3_2011"],[2012,"后发_收藏","Text_Tab3_2012"],[2013,"左手_收藏","Text_Tab3_2013"],[2014,"右手_收藏","Text_Tab3_2014"],[2015,"背饰_收藏","Text_Tab3_2015"],[2016,"耳饰_收藏","Text_Tab3_2016"],[2017,"面饰_收藏","Text_Tab3_2017"],[2018,"臀部_收藏","Text_Tab3_2018"],[2019,"肩部_收藏","Text_Tab3_2019"],[2020,"特效_收藏","Text_Tab3_2020"],[2021,"拖尾_收藏","Text_Tab3_1021"]];
export interface ITab3Element extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	Text:string
 } 
export class Tab3Config extends ConfigBase<ITab3Element>{
	constructor(){
		super(EXCELDATA);
	}

}