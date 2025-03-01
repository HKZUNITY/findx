import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","AssetId","SexType"],["","","",""],[1,"紫袍皇妃","361904",2],[2,"黄袍皇妃","361909",2],[3,"柔弱少女","361917",2],[4,"旗袍","163277",2],[5,"冰雪少女服饰","163281",2],[6,"短款汉服襦裙","163285",2],[7,"西域舞蹈服饰","163289",2],[8,"对襟襦裙","163295",2],[9,"汉服襦裙","163314",2],[10,"民族服饰","163711",2],[11,"古风大唐袖衫","270466",2],[12,"古装潮流女","299952",2],[13,"汉服男套装","162928",1],[14,"作战服","162951",1],[15,"汉服长袍","162965",1],[16,"清代官服","164358",1],[17,"刺绣古装男","300154",1],[18,"古风长发书生","351095",1],[19,"盔甲套装男","351111",1],[20,"富家子弟","361912",1],[21,"黑衣侠客","361918",1],[22,"古代将军","362520",1],[23,"白衣军师","362525",1],[24,"古代诗人","362539",1]];
export interface IAncientMoldingOutfitElement extends IElementBase{
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
 } 
export class AncientMoldingOutfitConfig extends ConfigBase<IAncientMoldingOutfitElement>{
	constructor(){
		super(EXCELDATA);
	}

}