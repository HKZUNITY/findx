import {ConfigBase, IElementBase} from "./ConfigBase";
import {AchievementsConfig} from "./Achievements";
import {AssetsConfig} from "./Assets";
import {BlockingVolumeConfig} from "./BlockingVolume";
import {ClothesConfig} from "./Clothes";
import {ColdWeaponConfig} from "./ColdWeapon";
import {CollectionConfig} from "./Collection";
import {DanceConfig} from "./Dance";
import {FlashlightConfig} from "./Flashlight";
import {MonsterInfoConfig} from "./MonsterInfo";
import {MusicConfig} from "./Music";
import {NPCSitDanceConfig} from "./NPCSitDance";
import {PetConfig} from "./Pet";
import {PlayerLauncherConfig} from "./PlayerLauncher";
import {PortalConfig} from "./Portal";
import {RotaryKnifeTriggerConfig} from "./RotaryKnifeTrigger";
import {ShakeConfig} from "./Shake";
import {SitConfig} from "./Sit";
import {TailConfig} from "./Tail";
import {TelegraphPoleConfig} from "./TelegraphPole";
import {TrampolineConfig} from "./Trampoline";
import {WingConfig} from "./Wing";

export class GameConfig{
	private static configMap:Map<string, ConfigBase<IElementBase>> = new Map();
	/**
	* 多语言设置
	* @param languageIndex 语言索引(-1为系统默认语言)
	* @param getLanguageFun 根据key获取语言内容的方法
	*/
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.initLanguage(languageIndex, getLanguageFun);
		this.configMap.clear();
	}
	public static getConfig<T extends ConfigBase<IElementBase>>(ConfigClass: { new(): T }): T {
		if (!this.configMap.has(ConfigClass.name)) {
			this.configMap.set(ConfigClass.name, new ConfigClass());
		}
		return this.configMap.get(ConfigClass.name) as T;
	}
	public static get Achievements():AchievementsConfig{ return this.getConfig(AchievementsConfig) };
	public static get Assets():AssetsConfig{ return this.getConfig(AssetsConfig) };
	public static get BlockingVolume():BlockingVolumeConfig{ return this.getConfig(BlockingVolumeConfig) };
	public static get Clothes():ClothesConfig{ return this.getConfig(ClothesConfig) };
	public static get ColdWeapon():ColdWeaponConfig{ return this.getConfig(ColdWeaponConfig) };
	public static get Collection():CollectionConfig{ return this.getConfig(CollectionConfig) };
	public static get Dance():DanceConfig{ return this.getConfig(DanceConfig) };
	public static get Flashlight():FlashlightConfig{ return this.getConfig(FlashlightConfig) };
	public static get MonsterInfo():MonsterInfoConfig{ return this.getConfig(MonsterInfoConfig) };
	public static get Music():MusicConfig{ return this.getConfig(MusicConfig) };
	public static get NPCSitDance():NPCSitDanceConfig{ return this.getConfig(NPCSitDanceConfig) };
	public static get Pet():PetConfig{ return this.getConfig(PetConfig) };
	public static get PlayerLauncher():PlayerLauncherConfig{ return this.getConfig(PlayerLauncherConfig) };
	public static get Portal():PortalConfig{ return this.getConfig(PortalConfig) };
	public static get RotaryKnifeTrigger():RotaryKnifeTriggerConfig{ return this.getConfig(RotaryKnifeTriggerConfig) };
	public static get Shake():ShakeConfig{ return this.getConfig(ShakeConfig) };
	public static get Sit():SitConfig{ return this.getConfig(SitConfig) };
	public static get Tail():TailConfig{ return this.getConfig(TailConfig) };
	public static get TelegraphPole():TelegraphPoleConfig{ return this.getConfig(TelegraphPoleConfig) };
	public static get Trampoline():TrampolineConfig{ return this.getConfig(TrampolineConfig) };
	public static get Wing():WingConfig{ return this.getConfig(WingConfig) };
}