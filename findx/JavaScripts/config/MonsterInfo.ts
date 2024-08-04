import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Des","PathStr","Idles","Moves","MoveSpeed","Die","Attacks","AttackTimePoints","AttackOffsets","AttackLengths","AttackSizes","Damages","EffectIds","EffectPosOffsets","EffectRotOffsets","EffectScales"],["","","","","","","","","","","","","","","","",""],[1,"蛇女",["3CA1D3DF"],["318618"],["318617"],300,"318619",["318616"],[0.35],[new mw.Vector(0,50,0)],[300],[new mw.Vector(50,50,100)],[100],["125704"],[new mw.Vector(60,0,0)],[new mw.Vector(0,0,-90)],[new mw.Vector(1,0.8,1)]],[2,"蜘蛛",["3CA1D3DF"],["336664","336668"],["336669"],250,"336816",["336673","336670","336672"],[1,0.95,1.2],[new mw.Vector(0,50,0),new mw.Vector(0,50,0),new mw.Vector(0,50,0)],[300,300,300],[new mw.Vector(50,50,100),new mw.Vector(50,50,100),new mw.Vector(50,50,100)],[100,100,100],["384353","101411","297932"],[new mw.Vector(170,0,-50),new mw.Vector(200,0,-120),new mw.Vector(100,0,-125)],[new mw.Vector(0,-60,0),new mw.Vector(0,30,10),new mw.Vector(0,0,0)],[new mw.Vector(0.5,0.5,0.5),new mw.Vector(1,1,1),new mw.Vector(0.55,1,1)]],[3,"蜘蛛精",["3CA1D3DF"],["336664","336668"],["338467"],250,"338468",["338464","338466"],[0.8,0.8],[new mw.Vector(0,50,0),new mw.Vector(0,50,0)],[300,300],[new mw.Vector(50,50,100),new mw.Vector(50,50,100)],[100,100],["297932","101407"],[new mw.Vector(100,0,-125),new mw.Vector(100,0,-125)],[new mw.Vector(0,0,0),new mw.Vector(0,0,0)],[new mw.Vector(0.55,1,1),new mw.Vector(1,1,1)]],[4,"龙",["3CA1D3DF"],["160627","250400","250399","160627"],["160628"],250,"-1",["250094","250095"],[1.6,1.3],[new mw.Vector(0,50,0),new mw.Vector(0,50,0)],[300,300],[new mw.Vector(50,50,100),new mw.Vector(50,50,100)],[100,100],["168947","92843"],[new mw.Vector(0,0,0),new mw.Vector(0,0,0)],[new mw.Vector(0,0,0),new mw.Vector(0,0,0)],[new mw.Vector(1,1,1),new mw.Vector(1,1,1)]],[5,"丧尸",["3CA1D3DF"],["284991","268599"],["285740","269161","285826"],150,"-1",["285210"],[0.55],[new mw.Vector(0,50,0)],[300],[new mw.Vector(50,50,100)],[100],["31260"],[new mw.Vector(5,0,0)],[new mw.Vector(0,-30,180)],[new mw.Vector(1,1,1)]],[6,"角色",["3CA1D3DF"],["285445"],["285336","285372","280652","280671","280723","284685","280699","280780"],150,"-1",["219129","280914","280916"],[0.2,0.4,0.3],[new mw.Vector(0,50,0),new mw.Vector(0,50,0),new mw.Vector(0,50,0)],[300,300,300],[new mw.Vector(50,50,100),new mw.Vector(50,50,100),new mw.Vector(50,50,100)],[100,100,100],["92838","135894","125704"],[new mw.Vector(250,0,0),new mw.Vector(140,0,0),new mw.Vector(0,0,0)],[new mw.Vector(0,0,0),new mw.Vector(0,0,-90),new mw.Vector(0,0,-90)],[new mw.Vector(0.5,0.5,0.5),new mw.Vector(0.5,0.5,0.5),new mw.Vector(1,1,1)]]];
export interface IMonsterInfoElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**undefined*/
	Des:string
	/**undefined*/
	PathStr:Array<string>
	/**undefined*/
	Idles:Array<string>
	/**undefined*/
	Moves:Array<string>
	/**undefined*/
	MoveSpeed:number
	/**undefined*/
	Die:string
	/**undefined*/
	Attacks:Array<string>
	/**undefined*/
	AttackTimePoints:Array<number>
	/**undefined*/
	AttackOffsets:mw.Vector[]
	/**undefined*/
	AttackLengths:Array<number>
	/**undefined*/
	AttackSizes:mw.Vector[]
	/**undefined*/
	Damages:Array<number>
	/**undefined*/
	EffectIds:Array<string>
	/**undefined*/
	EffectPosOffsets:mw.Vector[]
	/**undefined*/
	EffectRotOffsets:mw.Vector[]
	/**undefined*/
	EffectScales:mw.Vector[]
 } 
export class MonsterInfoConfig extends ConfigBase<IMonsterInfoElement>{
	constructor(){
		super(EXCELDATA);
	}

}