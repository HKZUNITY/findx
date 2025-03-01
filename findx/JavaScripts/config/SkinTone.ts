import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","SkinTone","SexType"],["","","",""],[1,null,"ColorPick",0],[2,null,"FDF4EFFF",0],[3,null,"FAEDE5FF",0],[4,null,"F8E7E0FF",0],[5,null,"F5E2D4FF",0],[6,null,"F3D8C7FF",0],[7,null,"EACCC1FF",0],[8,null,"F6E6D6FF",0],[9,null,"F0DEC8FF",0],[10,null,"EDD9BEFF",0],[11,null,"E8D0B4FF",0],[12,null,"E7CAA2FF",0],[13,null,"DCBB8EFF",0],[14,null,"DCC2A7FF",0],[15,null,"C7A58CFF",0],[16,null,"AB8874FF",0],[17,null,"96735FFF",0],[18,null,"805F4CFF",0],[19,null,"5B4337FF",0],[20,null,"D0B9ABFF",0],[21,null,"C1ABA0FF",0],[22,null,"A38881FF",0],[23,null,"806B68FF",0],[24,null,"64504FFF",0],[25,null,"423431FF",0],[26,null,"E4C3A0FF",0],[27,null,"E3BA8CFF",0],[28,null,"D1A173FF",0],[29,null,"B37D51FF",0],[30,null,"976238FF",0],[31,null,"6D3F25FF",0],[32,null,"7D553CFF",0],[33,null,"794F37FF",0],[34,null,"5F3C26FF",0],[35,null,"5B3822FF",0],[36,null,"3D2314FF",0],[37,null,"341C10FF",0],[38,null,"F9E175FF",0],[39,null,"B0C87EFF",0],[40,null,"8AB8DCFF",0],[41,null,"FBF5F5FF",0]];
export interface ISkinToneElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Describe:string
	/**undefined*/
	SkinTone:string
	/**0-Common
1-Male
2-FeMale*/
	SexType:number
 } 
export class SkinToneConfig extends ConfigBase<ISkinToneElement>{
	constructor(){
		super(EXCELDATA);
	}

}