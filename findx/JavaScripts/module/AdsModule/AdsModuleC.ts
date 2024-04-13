import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import Console from "../../Tools/Console";
import AdTips from "../../Common/AdTips";
import P_Tips from '../../Common/P_Tips';
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
        mw.AdsService.isReady(mw.AdsType.Reward, (isReady: boolean) => {
            let isGetReward = false;
            if (isReady) {
                GeneralManager.modifyShowAd(mw.AdsType.Reward, (state: mw.AdsState) => {
                    if (state == AdsState.Fail) {
                        // 展示失败。 展示广告失败的时候回调，一般是网络卡顿。 建议在这里做容错
                        P_Tips.show("网络卡顿、再试一次吧");
                    }
                    if (state == AdsState.Success) {
                        //开始展示。 开始展示广告的时候回调，无论是否完成广告播放。 这里可以用来“保护”玩家，顺利开始播放广告后玩家客户端处在一个“挂起”的状态。 如有需要，可在此处加一些保护逻辑，例如在放广告的时候玩家暂时被传送走，等state==1关闭广告后再切回来。
                    }
                    if (state == AdsState.Close) {
                        mw.TimeUtil.delaySecond(1).then(() => {
                            if (isGetReward) {
                                this.getReward(id, adType);
                                P_Tips.show("成功获得奖励");
                                Console.error("成功获得奖励 id = " + id + " type = " + adType);
                            }
                            else {
                                Console.error("获得奖励失败 id = " + id + " type = " + adType);
                            }
                        });
                    }
                    // 用户播放广告完成了，无论是否点击了关闭广告界面
                    if (state == AdsState.Reward) {
                        isGetReward = true;
                    }
                })
            }
            else {
                // 广告没准备好，或后台还有广告在放(玩家没放完广告就切回游戏)
            }
        });
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