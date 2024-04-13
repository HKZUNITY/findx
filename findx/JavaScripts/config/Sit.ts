import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","TriggerGuid","InteractivityGuid","SitStance"],["","","",""],[1,"207424AD","2C8D3594","122227"],[2,"1F538DB4","2CEFC488","122230"],[3,"0EC2B980","0C07734D","122230"],[4,"1AB51812","0F472A3C","122227"],[5,"1EE7717B","0A8FFEA7","122227"],[6,"0801FCED","1D677AD6","122230"],[7,"125D076B","15AF4932","122227"],[8,"189E55D7","014E6796","126331"],[9,"058BADF7","168F6398","126331"],[10,"04D570D4","35B27400","126331"],[11,"01B1DDB4","3AE7E5D2","126331"],[12,"1C34D059","340E0039","122227"],[13,"1A8E9C59","0960E03B","122227"],[14,"14A69349","3BCD303B","122230"],[15,"0113DD37","267131D4","86983"],[16,"0810F7FB","019ED9F7","86983"],[17,"1FA69438","1DAAB884","86983"],[18,"2037E3BF","15627078","86983"],[19,"24C63293","295E6051","86983"],[20,"1C589471","12664641","122230"],[21,"179DBBC3","3588A9BF","122230"]];
export interface ISitElement extends IElementBase{
 	/**唯一ID*/
	id:number
	/**触发器*/
	TriggerGuid:string
	/**交互物*/
	InteractivityGuid:string
	/**姿态*/
	SitStance:string
 } 
export class SitConfig extends ConfigBase<ISitElement>{
	constructor(){
		super(EXCELDATA);
	}

}