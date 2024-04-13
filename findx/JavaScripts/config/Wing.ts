import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","IsIAA","WingGuid","WingIcon","WingOffset","WingRotation","WingScale","Speed","Annotation"],["","","","","","","","",""],[1,0,null,"178220",null,null,null,0,null],[2,1,"42814","145165",new mw.Vector(0,0,20),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[3,1,"42823","83140",new mw.Vector(0,0,7),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[4,1,"145902","174366",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[5,1,"145903","174339",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[6,1,"145904","174341",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[7,1,"145907","174342",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[8,1,"145910","174360",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[9,1,"145911","174375",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[10,1,"145913","174353",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[11,1,"145905","174371",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[12,1,"145906","174331",new mw.Vector(0,0,-25),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[13,1,"145908","174327",new mw.Vector(0,0,0),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[14,1,"145912","174379",new mw.Vector(0,0,13),new mw.Vector(0,0,90),new mw.Vector(1,1,1),800,null],[15,1,"136957","174376",new mw.Vector(0,0,-15),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[16,1,"136958","145168",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[17,1,"136959","174338",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[18,1,"136960","174330",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[19,1,"136961","174348",new mw.Vector(0,0,-5),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[20,1,"136962","174382",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[21,1,"136963","174347",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[22,1,"136964","145170",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[23,1,"136965","174373",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null],[24,1,"136966","174380",new mw.Vector(0,0,0),new mw.Vector(0,0,180),new mw.Vector(1,1,1),800,null]];
export interface IWingElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**0:直接使用
1：看广告使用*/
	IsIAA:number
	/**翅膀的Guid*/
	WingGuid:string
	/**WingIcon*/
	WingIcon:string
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
export class WingConfig extends ConfigBase<IWingElement>{
	constructor(){
		super(EXCELDATA);
	}

}