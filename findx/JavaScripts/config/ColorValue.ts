import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","SkinToneColor","PupilColor","HairColor","TopColor","BottomColor","ShoeColor","GloveColor","EyebrowsColor","EyeLashColor","EyeShadow","BlushColor","LipstickColor","PupilStyleColor"],["","","","","","","","","","","","","",""],[1,"FEF9F6FF","F76964FF","D5C7D4FF","A086DEFF","A086DEFF","316459FF","316459FF","312E2CFF","312E2CFF","FFEEE7FF","FFD6E6FF","B56B63FF","F76964FF"],[2,"F7DACCFF","FEC574FF","A77FB8FF","D95F5DFF","D95F5DFF","68605BFF","68605BFF","4A2B25FF","4A2B25FF","946A7BFF","FE77B3FF","F87874FF","FEC574FF"],[3,"ECC8AEFF","AD82F7FF","FBD97FFF","AED85BFF","AED85BFF","F8AC35FF","F8AC35FF","7A3730FF","7A3730FF","A59273FF","C14C71FF","E78863FF","AD82F7FF"],[4,"805F4CFF","1F2329FF","B1AE7BFF","FCC86DFF","FCC86DFF","0C81B4FF","0C81B4FF","863F30FF","863F30FF","E7B6A5FF","FDAEB9FF","F2AEB2FF","1F2329FF"],[5,"341C10FF","8EE085FF","7A92B4FF","BABEBDFF","BABEBDFF","026B47FF","026B47FF","B26949FF","B26949FF","5A5D5AFF","FED2D7FF","FFDAD6FF","8EE085FF"],[6,"F9E175FF","47B7F6FF","2F2629FF","2E5A8FFF","2E5A8FFF","BABEBDFF","BABEBDFF","E9A37BFF","E9A37BFF","312E2CFF","F9E2DFFF","BC6A65FF","47B7F6FF"]];
export interface IColorValueElement extends IElementBase{
 	/**id*/
	ID:number
	/**肤色颜色*/
	SkinToneColor:string
	/**眼睛颜色*/
	PupilColor:string
	/**头发颜色*/
	HairColor:string
	/**上衣颜色*/
	TopColor:string
	/**裤子颜色*/
	BottomColor:string
	/**鞋子颜色*/
	ShoeColor:string
	/**手套颜色*/
	GloveColor:string
	/**眉毛颜色*/
	EyebrowsColor:string
	/**睫毛颜色*/
	EyeLashColor:string
	/**眼影颜色*/
	EyeShadow:string
	/**腮红颜色*/
	BlushColor:string
	/**唇膏颜色*/
	LipstickColor:string
	/**瞳孔颜色*/
	PupilStyleColor:string
 } 
export class ColorValueConfig extends ConfigBase<IColorValueElement>{
	constructor(){
		super(EXCELDATA);
	}

}