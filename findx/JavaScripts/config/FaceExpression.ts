import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Name","ExpressionType","SexType","Icon"],["","","Language","","",""],[1,"默认表情","Text_Expression_Default",0,0,"306265"],[2,"微笑","Text_Expression_Smile",1,0,"306265"],[3,"开心","Text_Expression_HaveFun",2,0,"306265"],[4,"伤心","Text_Expression_Sad",3,0,"306265"],[5,"生气","Text_Expression_GetAngry",4,0,"306265"],[6,"尴尬","Text_Expression_Embarrassment",5,0,"306265"],[7,"笑","Text_Expression_Laugh",6,0,"306265"],[8,"调皮","Text_Expression_BeNaughty",7,0,"306265"],[9,"可爱","Text_Expression_Cute",8,0,"306265"],[10,"疑惑","Text_Expression_Doubt",9,0,"306265"]];
export interface IFaceExpressionElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	Name:string
	/**undefined*/
	ExpressionType:number
	/**0-Common
1-Male
2-FeMale*/
	SexType:number
	/**undefined*/
	Icon:string
 } 
export class FaceExpressionConfig extends ConfigBase<IFaceExpressionElement>{
	constructor(){
		super(EXCELDATA);
	}

}