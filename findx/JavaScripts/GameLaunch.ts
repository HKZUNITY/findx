import { update } from "./Common/notice/Tween";
import { GameConfig } from "./config/GameConfig";
import GlobalData from "./const/GlobalData";
import AchievementData from "./module/AchievementModule/AchievementData";
import AchievementModuleC from "./module/AchievementModule/AchievementModuleC";
import AchievementModuleS from "./module/AchievementModule/AchievementModuleS";
import AdsModuleC from "./module/AdsModule/AdsModuleC";
import AdsModuleS from "./module/AdsModule/AdsModuleS";
import CollectionData from "./module/CollectionMOdule/CollectionData";
import CollectionModuleC from "./module/CollectionMOdule/CollectionModuleC";
import CollectionModuleS from "./module/CollectionMOdule/CollectionModuleS";
import HUDDate from "./module/HUDModule/HUDDate";
import HUDModuleC from "./module/HUDModule/HUDModuleC";
import HUDModuleS from "./module/HUDModule/HUDModuleS";
import MallData from "./module/MallModule/MallData";
import MallModuleC from "./module/MallModule/MallModuleC";
import MallModuleS from "./module/MallModule/MallModuleS";
import { PetData, PetModuleC, PetModuleS } from "./module/PetModule/PetModule";
import { PlayerLevelData, PlayerModuleC, PlayerModuleS } from "./module/PlayerModule/PlayerModule";
import RankingModuleC from "./module/RankingModule/RankingModuleC";
import RankingModuleS from "./module/RankingModule/RankingModuleS";
import ShopData from "./module/ShopModule/ShopData";
import ShopModuleC from "./module/ShopModule/ShopModuleC";
import ShopModuleS from "./module/ShopModule/ShopModuleS";
import SignInData from "./module/SignInModule/SignInData";
import SignInModuleC from "./module/SignInModule/SignInModuleC";
import SignInModuleS from "./module/SignInModule/SignInModuleS";

@Component
export default class GameLaunch extends mw.Script {
    @mw.Property({ displayName: "是否隐藏头顶UI", group: "脚本设置" })
    private isHideHeadUI: boolean = true;

    @mw.Property({ displayName: "是否开启IAA", group: "脚本设置" })
    private isOpenIAA: boolean = true;

    @mw.Property({ displayName: "是否开启测试UI", group: "脚本设置" })
    private isOpenTest: boolean = false;

    @mw.Property({ displayName: "Log级别", group: "脚本设置", selectOptions: { "None": "0", "Log": "1", "Warn": "2", "Error": "3" } })
    private logLevel: string = "0";

    @mw.Property({ displayName: "多语言", group: "脚本设置", enumType: { "系统默认": -1, "英语": 0, "简体中文": 1, "繁体中文": 2, "日语": 3, "韩语": 4 } })
    private languageId: number = -1;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.onStartCS();
        if (mw.SystemUtil.isClient()) {
            this.onStartC();
        }
        else if (mw.SystemUtil.isServer()) {
            this.onStartS();
        }
    }

    /**客户端服务端的onStart */
    private async onStartCS(): Promise<void> {
        this.useUpdate = true;
        this.onRegisterModule();
        GlobalData.logLevel = Number(this.logLevel);
        GlobalData.isHideHeadUI = this.isHideHeadUI;
        GlobalData.isOpenIAA = !mw.SystemUtil.isPIE || this.isOpenIAA;
        GlobalData.isOpenTest = this.isOpenTest;
        // await this.downloadAsset();
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        mw.TweenUtil.TWEEN.update();
        if (mw.SystemUtil.isClient()) {
            update();
            this.onUpdateC(dt);
        }
        else if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }

    /**注册模块 */
    private onRegisterModule(): void {
        ModuleService.registerModule(HUDModuleS, HUDModuleC, HUDDate);
        ModuleService.registerModule(RankingModuleS, RankingModuleC, null);
        ModuleService.registerModule(ShopModuleS, ShopModuleC, ShopData);
        ModuleService.registerModule(CollectionModuleS, CollectionModuleC, CollectionData);
        ModuleService.registerModule(SignInModuleS, SignInModuleC, SignInData);
        ModuleService.registerModule(AdsModuleS, AdsModuleC, null);
        ModuleService.registerModule(PetModuleS, PetModuleC, PetData);
        ModuleService.registerModule(AchievementModuleS, AchievementModuleC, AchievementData);
        ModuleService.registerModule(MallModuleS, MallModuleC, MallData);
        // ModuleService.registerModule(PlayerModuleS, PlayerModuleC, PlayerLevelData);
    }

    /**预加载 */
    // private async downloadAsset(): Promise<void> {
    //     let clothesElement: IClothesElement[] = GameConfig.Clothes.getAllElement();
    //     for (let i = 0; i < clothesElement.length; ++i) {
    //         if (!clothesElement[i].ClothGuid) continue;
    //         await Utils.downloadAsset(clothesElement[i].ClothGuid);
    //         await Utils.downloadAsset(clothesElement[i].Icon);
    //     }
    //     let assetsElement: IAssetsElement[] = GameConfig.Assets.getAllElement();
    //     for (let i = 0; i < assetsElement.length; ++i) {
    //         if (!assetsElement[i].Guid) continue;
    //         await Utils.downloadAsset(assetsElement[i].Guid);
    //     }
    // }

    /**------------------------------------------- 客户端 ------------------------------------------------ */
    /**客户端的OnStart */
    private onStartC(): void {
        this.initLanguage();
    }

    private initLanguage(): void {
        let language = LocaleUtil.getDefaultLocale().toString().toLowerCase();
        console.error(`wfz - language:${language}`);

        let languageId: number = -1;
        if (mw.SystemUtil.isPIE && this.languageId >= 0) {
            languageId = this.languageId;
        } else {
            if (!!language.match("en")) {
                languageId = 0;
            } else if (!!language.match("zh")) {//简体
                languageId = 1;
            } else if (!!language.match("ja")) {
                languageId = 3;
            } else if (!!language.match("ko")) {
                languageId = 4;
            } else {//繁体
                languageId = 2;
            }
        }
        GlobalData.languageId = languageId;
        console.error(`wfz - languageId:${languageId}`);

        GameConfig.initLanguage(languageId, (key) => {
            let ele = GameConfig.Language.getElement(key);
            if (ele == null) return "unknow_" + key;
            return ele.Value;
        });

        mw.UIScript.addBehavior("lan", (ui: mw.StaleButton | mw.TextBlock) => {
            let key: string = ui.text;
            if (key) {
                let lan = GameConfig.Language.getElement(key);
                if (lan) ui.text = (lan.Value);
            }
        });
    }

    /**客户端的update */
    private onUpdateC(dt: number): void {

    }

    /**------------------------------------------- 客户端 ------------------------------------------------ */

    /**------------------------------------------- 服务端 ------------------------------------------------ */
    /**服务端的OnStart */
    private onStartS(): void {
        DataStorage.setTemporaryStorage(SystemUtil.isPIE);
    }

    /**服务端的update */
    private onUpdateS(dt: number): void {

    }
    /**------------------------------------------- 服务端 ------------------------------------------------ */
}