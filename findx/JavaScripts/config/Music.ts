import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","Guid","Annotation"],["","",""],[1,"118698","STAY"],[2,"118699","bad guy"],[3,"117222","我会活下去"],[4,"118697","Let Me Love You"],[5,"118700","Running up That Hill"],[6,"118701","Love To Hate Me"],[7,"118702","TOMBOY"],[8,"118703","Shut Down"],[9,"118704","Celestial"],[10,"118712","As It Was"],[11,"118706","Good Morning"],[12,"118707","Alone"],[13,"118709","Chanderiler"],[14,"118711","Don't Wanna Know"],[15,"118716","Mood"],[16,"117220","金轮"],[17,"128884","不知道叫啥"],[18,"128888","也不知道叫啥"]];
export interface IMusicElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**GUID*/
	Guid:string
	/**注释*/
	Annotation:string
 } 
export class MusicConfig extends ConfigBase<IMusicElement>{
	constructor(){
		super(EXCELDATA);
	}

}