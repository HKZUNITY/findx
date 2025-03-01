import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Text","Tab3"],["","","Language",""],[101,"体型","Text_Tab2_101",null],[102,"肤色","Text_Tab2_102",null],[103,"脸型","Text_Tab2_103",null],[104,"眼睛","Text_Tab2_104",[1001,1002,1003,1004,1005]],[105,"眉毛","Text_Tab2_105",null],[106,"妆容","Text_Tab2_106",[1006,1007,1008,1009]],[107,"表情","Text_Tab2_107",null],[108,"套装","Text_Tab2_108",[1022,1047,1023,1024,1025,1026,1027,1028]],[109,"头发","Text_Tab2_109",[1010,1011,1012]],[110,"上衣","Text_Tab2_110",[1029,1030,1031,1032,1033]],[111,"下衣","Text_Tab2_111",[1034,1035,1036,1037,1038]],[112,"鞋子","Text_Tab2_112",[1041,1042,1043,1044,1045,1046]],[113,"手套","Text_Tab2_113",[1039,1040]],[114,"宠物","Text_Tab2_114",null],[115,"饰品","Text_Tab2_115",[1020,1015,1014,1018,1016,1017,1019,1021]],[501,"体型_收藏","Text_Tab2_501",null],[502,"肤色_收藏","Text_Tab2_502",null],[503,"脸型_收藏","Text_Tab2_503",null],[504,"眼睛_收藏","Text_Tab2_504",[2001,2002,2003,2004,2005]],[505,"眉毛_收藏","Text_Tab2_505",null],[506,"妆容_收藏","Text_Tab2_506",[2006,2007,2008,2009]],[507,"表情_收藏","Text_Tab2_507",null],[508,"套装_收藏","Text_Tab2_508",null],[509,"头发_收藏","Text_Tab2_509",[2010,2011,2012]],[510,"上衣_收藏","Text_Tab2_510",null],[511,"下衣_收藏","Text_Tab2_511",null],[512,"鞋子_收藏","Text_Tab2_512",null],[513,"手套_收藏","Text_Tab2_513",null],[514,"宠物_收藏","Text_Tab2_514",null],[515,"饰品_收藏","Text_Tab2_515",[2013,2014,2015,2016,2017,2018,2019,2020,2021]]];
export interface ITab2Element extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	Text:string
	/**undefined*/
	Tab3:Array<number>
 } 
export class Tab2Config extends ConfigBase<ITab2Element>{
	constructor(){
		super(EXCELDATA);
	}

}