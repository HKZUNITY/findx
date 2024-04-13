import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","modelGuid"],["",""],[1,"038C03CF"],[2,"3EB9B465"],[3,"27072AB7"],[4,"2F6EED42"],[5,"17D1CE09"],[6,"2FD5297C"],[7,"1DDB8C9E"],[8,"341E8667"]];
export interface IFlashlightElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**闪光灯的GUID*/
	modelGuid:string
 } 
export class FlashlightConfig extends ConfigBase<IFlashlightElement>{
	constructor(){
		super(EXCELDATA);
	}

}