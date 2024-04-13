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
        ModuleService.registerModule(PlayerModuleS, PlayerModuleC, PlayerLevelData);
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