import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","PetGuid","PetIcon","Annotation"],["","","",""],[1,"147010","181992","破壳绿鸡仔"],[2,"151159","181984","粉色木乃伊蛋仔"],[3,"151184","181990","粉色婴儿"],[4,"151465","181993","红西红柿"],[5,"151795","181982","蓝狗狗"],[6,"151812","181979","蓝衣国王"],[7,"151835","181994","恶魔蛋仔"],[8,"151837","181995","绿熊猫蛋仔"],[9,"151886","181981","黄南瓜头"],[10,"151887","181980","粉兔子"],[11,"152166","181983","棕猫咪"],[12,"152186","181986","蓝裙公主"],[13,"153511","181996","巧克力冰"],[14,"153514","181985","天使"],[15,"153512","181989","紫斑马"],[16,"156363","181987","方仔"],[17,"156952","181988","高级岛小矮怪"],[18,"176737","181991","花嫁新娘 "]];
export interface IPetElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**宠物的GUID*/
	PetGuid:string
	/**宠物Icon*/
	PetIcon:string
	/**注释*/
	Annotation:string
 } 
export class PetConfig extends ConfigBase<IPetElement>{
	constructor(){
		super(EXCELDATA);
	}

}