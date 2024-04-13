import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid","DanceGuid","OffsetPos","OffsetRot","Annotation"],["","","","","",""],[1,"2082749D",["14692","35388","29715","132787"],new mw.Vector(0,0,0),new mw.Vector(0,0,0),"弹钢琴"],[2,"20F1666C",["14692","35388","29715","132787"],new mw.Vector(0,0,0),new mw.Vector(0,0,0),"弹钢琴"],[3,"27A8BE09",["122458"],new mw.Vector(0,0,0),new mw.Vector(0,0,0),"唱歌"],[4,"1B7FF724",["88544"],new mw.Vector(-100,100,-1),new mw.Vector(0,0,0),"舞蹈动画09"],[5,"0DE44E94",["122453","122454"],new mw.Vector(-200,200,-1),new mw.Vector(0,0,0),"扭胯"],[6,"3C8304A2",["126045"],new mw.Vector(-50,50,-1),new mw.Vector(0,0,0),"拉丁舞"],[7,"266F032F",["195754"],new mw.Vector(-200,200,-1),new mw.Vector(0,0,0),"海草舞"],[8,"239A77EE",["14701","29733"],new mw.Vector(0,0,0),new mw.Vector(0,0,0),"旋转跳舞"],[9,"0C126488",["29725","29748","88448","88449","88450","88541","88544","122676","122677","122678","122679","122680","122681","122682","122683","122684","122745","122746",""],new mw.Vector(-200,200,-1),new mw.Vector(0,0,0),"Dance"],[10,"1F0FB515",["14701","29733"],new mw.Vector(0,0,0),new mw.Vector(0,0,0),"旋转跳舞"]];
export interface IDanceElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器*/
	TriggerGuid:string
	/**跳舞动画Guid*/
	DanceGuid:Array<string>
	/**跳舞位置偏移*/
	OffsetPos:mw.Vector
	/**跳舞旋转偏移*/
	OffsetRot:mw.Vector
	/**注释*/
	Annotation:string
 } 
export class DanceConfig extends ConfigBase<IDanceElement>{
	constructor(){
		super(EXCELDATA);
	}

}