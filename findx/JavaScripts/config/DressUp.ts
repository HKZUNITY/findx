import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","DressUpType","DressUpGuid","WingOffset","WingRotation","WingScale","Speed","Annotation"],["","","","","","","",""],[1,1,"42804",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[2,1,"42805",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),900,null],[3,0,null,null,null,null,0,null],[4,0,null,null,null,null,0,null],[5,0,null,null,null,null,0,null],[6,2,"4399",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),460,null],[7,2,"151527",new mw.Vector(0,0,0),new mw.Vector(0,0,0),new mw.Vector(1,1,1),470,null]];
export interface IDressUpElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**装扮类型
1：翅膀--飞行
2：拖尾--增加移速*/
	DressUpType:number
	/**装扮的guid*/
	DressUpGuid:string
	/**偏移*/
	WingOffset:mw.Vector
	/**旋转*/
	WingRotation:mw.Vector
	/**缩放*/
	WingScale:mw.Vector
	/**飞行速度|移动速度*/
	Speed:number
	/**注释*/
	Annotation:string
 } 
export class DressUpConfig extends ConfigBase<IDressUpElement>{
	constructor(){
		super(EXCELDATA);
	}

}