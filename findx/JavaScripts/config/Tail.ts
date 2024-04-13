import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","IsIAA","TailGuid","TailIcon","TailOffset","TailRotation","TailScale","Speed","Annotation"],["","","","","","","","",""],[1,0,null,"178220",null,null,null,0,null],[2,1,"88822","158616",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"彩虹拖尾"],[3,1,"7982","158613",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"火拖尾"],[4,1,"151527","174364",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"烟雾拖尾"],[5,1,"145511","178010",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"火焰拖尾"],[6,1,"88796","158622",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"流光拖尾"],[7,1,"128516","158621",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"光束拖尾"],[8,1,"24979","174337",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"彩虹星星拖尾"],[9,1,"145502","148824",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"香蕉"],[10,1,"145500","148825",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"骷髅拖尾"],[11,1,"145506","148826",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"星星"],[12,1,"145495","148827",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"糖果拖尾"],[13,1,"7982","148828",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"火拖尾"],[14,1,"145510","148829",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"钞票拖尾"],[15,1,"145498","148830",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"皇冠拖尾"],[16,1,"145504","148831",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"雪花拖尾"],[17,1,"145505","148832",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"2023拖尾"],[18,1,"145493","148833",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"足球拖尾"],[19,1,"145507","148834",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"爆竹拖尾"],[20,1,"145499","148835",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"爱心拖尾"],[21,1,"145508","148836",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"烟花拖尾"],[22,1,"145497","148837",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"奖杯拖尾"],[23,1,"145492","148838",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"螺丝钉拖尾"],[24,1,"88824","148839",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"彩虹拖尾"],[25,1,"158202","148840",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"云拖尾"],[26,1,"145509","148844",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"礼物拖尾"],[27,1,"145503","148845",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),0,"雷电拖尾"]];
export interface ITailElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**0:直接使用
1：看广告使用*/
	IsIAA:number
	/**拖尾的Guid*/
	TailGuid:string
	/**TailIcon*/
	TailIcon:string
	/**偏移*/
	TailOffset:mw.Vector
	/**旋转*/
	TailRotation:mw.Vector
	/**缩放*/
	TailScale:mw.Vector
	/**飞行速度|移动速度*/
	Speed:number
	/**注释*/
	Annotation:string
 } 
export class TailConfig extends ConfigBase<ITailElement>{
	constructor(){
		super(EXCELDATA);
	}

}