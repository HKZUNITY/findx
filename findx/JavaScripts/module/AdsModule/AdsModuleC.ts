import AdTips from "../../Common/AdTips";
import CollectionModuleC from "../CollectionMOdule/CollectionModuleC";
import CollectionItemPanel from "../CollectionMOdule/ui/CollectionItemPanel";
import HUDModuleC from "../HUDModule/HUDModuleC";
import PetRafflePanel from "../PetModule/ui/PetRafflePanel";
import ShopModuleC from "../ShopModule/ShopModuleC";
import SignInModuleC from "../SignInModule/SignInModuleC";
import AdsModuleS from "./AdsModuleS";

export default class AdsModuleC extends ModuleC<AdsModuleS, null> {
    /**商店模块 */
    private shopModuleC: ShopModuleC = null;
    private hudModuleC: HUDModuleC = null;
    private collectionModuleC: CollectionModuleC = null;
    private signInModuleC: SignInModuleC = null;
    private petRafflePanel: PetRafflePanel = null;
    /**广告面板 */
    private adTips: AdTips = null;
    private collectionItemPanel: CollectionItemPanel = null;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initData();
        this.registerActions();
    }

    /**初始化数据 */
    private initData(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.shopModuleC = ModuleService.getModule(ShopModuleC);
        this.collectionModuleC = ModuleService.getModule(CollectionModuleC);
        this.signInModuleC = ModuleService.getModule(SignInModuleC);
        this.adTips = mw.UIService.getUI(AdTips);
        this.petRafflePanel = mw.UIService.getUI(PetRafflePanel);
        this.collectionItemPanel = mw.UIService.getUI(CollectionItemPanel);
    }

    /**注册事件 */
    private registerActions(): void {
        this.adTips.onWatchAdsAction.add(this.playAds.bind(this));
    }

    /**播放广告 */
    private playAds(id: number, adType: number): void {
        this.getReward(id, adType);
    }

    /**获得奖励 */
    private getReward(id: number, adType: number): void {
        switch (adType) {
            case AdType.ChangeCloth:
                this.shopModuleC.onSaveClothAction.call();
                this.shopModuleC.adsOnCompleteCloth();
                break;
            case AdType.Weapon:
                this.hudModuleC.pickUpWeapon(id);
                this.shopModuleC.adsOnCompleteWeapon();
                break;
            case AdType.Wing:
                this.hudModuleC.pickUpWing(id);
                this.shopModuleC.adsOnCompleteWing();
                break;
            case AdType.Tail:
                this.hudModuleC.pickUptailEffect(id);
                this.shopModuleC.adsOnCompleteTail();
                break;
            case AdType.Tips:
                this.collectionModuleC.startGuide(id);
                break;
            case AdType.AddCount:
                this.collectionItemPanel.getReward();
                break;
            case AdType.AdsReward:
                this.hudModuleC.adsReward();;
                break;
            case AdType.SignIn:
                this.signInModuleC.saveIsSignIns(id);;
                break;
            case AdType.Raffle:
                this.petRafflePanel.getRaffle();
                break;
            case AdType.RandomGetId:
                this.collectionModuleC.randomGetId();
                break;
            default:
                break;
        }
    }
}

export enum AdType {
    /**换装 */
    ChangeCloth = 1,
    /**武器 */
    Weapon = 2,
    /**翅膀 */
    Wing = 3,
    /**拖尾 */
    Tail = 4,
    /**提示 */
    Tips = 5,
    /**增加使用次数 */
    AddCount = 6,
    /**AdsReward */
    AdsReward = 7,
    /**SignIn */
    SignIn = 8,
    /**Raffle */
    Raffle = 9,
    RandomGetId = 10,
}