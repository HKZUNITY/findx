import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType","IsTransition"],["","","","",""],[1,"一定过套装","253153",2,0],[2,"一定过套装","263401",1,0],[3,"主打求神套装","264188",2,0],[4,"主打求神套装","264189",1,0],[5,"新年装","297941",2,0],[6,"温柔女孩","303702",2,0],[7,"阳光男","303705",1,0],[8,"叛逆女孩","303706",2,0],[9,"叛逆男孩","303703",1,0],[10,"制服女","367076",2,1],[11,"制服女","435694",2,1],[12,"白人女天使","137837",2,1],[13,"白人举重运动员","141018",1,1],[14,"钢铁侠","357563",1,1],[15,"女仆套装女","350569",2,1],[16,"橘龙","212971",1,1],[17,"华丽海盗服","163624",2,0]];
export interface IOutfitElement extends IElementBase{
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
	/**undefined*/
	IsTransition:number
 } 
export class OutfitConfig extends ConfigBase<IOutfitElement>{
	constructor(){
		super(EXCELDATA);
	}

}