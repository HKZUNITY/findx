import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Lv","BlockingVolumeGuid","TriggerGuid","WorldUIGuid","Des"],["","","","","",""],[1,0,"3BF5751E","04C75B00","32BAE8AA","1级以及上可进入"],[2,50,"143D30C7","1A891F24","03F22219","50级以及上可进入"],[3,80,"230F37DB","0A3B2669","24DDACDE","80级以及上可进入"],[4,150,"05D43D85","3081D2EF","2BA7A00D","150级以及上可进入"],[5,200,"3FB96E1D","09CE9A28","06F7BEE7","200级以及上可进入"]];
export interface IBlockingVolumeElement extends IElementBase{
 	/**ID*/
	ID:number
	/**可进入的等级*/
	Lv:number
	/**禁行区Guid*/
	BlockingVolumeGuid:string
	/**触发器Guid*/
	TriggerGuid:string
	/**世界UIGuid*/
	WorldUIGuid:string
	/**描述*/
	Des:string
 } 
export class BlockingVolumeConfig extends ConfigBase<IBlockingVolumeElement>{
	constructor(){
		super(EXCELDATA);
	}

}