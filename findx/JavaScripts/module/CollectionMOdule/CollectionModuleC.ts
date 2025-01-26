import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import Console from "../../Tools/Console";
import { Utils } from "../../Tools/utils";
import AdTips from "../../Common/AdTips";
import GlobalData from "../../const/GlobalData";
import AchievementModuleC from "../AchievementModule/AchievementModuleC";
import { AdType } from "../AdsModule/AdsModuleC";
import HUDModuleC from "../HUDModule/HUDModuleC";
import ShopModuleC from "../ShopModule/ShopModuleC";
import CollectionData from "./CollectionData";
import CollectionModuleS from "./CollectionModuleS";
import CollectionPanel from "./ui/CollectionPanel";
import { Notice } from '../../Common/notice/Notice';

export default class CollectionModuleC extends ModuleC<CollectionModuleS, CollectionData> {
    private hudModuleC: HUDModuleC = null;
    private shopModuleC: ShopModuleC = null;
    private achievementModuleC: AchievementModuleC = null;
    private collectionPanel: CollectionPanel = null;
    private itemVector3Map: Map<number, mw.Vector> = new Map<number, mw.Vector>();
    private adTips: AdTips = null;


    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initDatas();
        this.registerActions();
    }

    /**初始化数据 */
    private initDatas(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.shopModuleC = ModuleService.getModule(ShopModuleC);
        this.achievementModuleC = ModuleService.getModule(AchievementModuleC);
        this.collectionPanel = mw.UIService.getUI(CollectionPanel);
        this.adTips = mw.UIService.getUI(AdTips);
    }

    /**注册事件 */
    private registerActions(): void {
        this.hudModuleC.onOpenAndCloseCollectionPanelAction.add((isOpen: boolean) => {
            isOpen ? this.collectionPanel.show() : this.collectionPanel.hide();
        });

        this.collectionPanel.onFindTipsAction.add(this.findItemTips.bind(this));
    }

    protected onEnterScene(sceneType: number): void {

    }

    /**找Item的提示 */
    private findItemTips(id: number): void {
        if (GlobalData.isOpenIAA) {
            this.adTips.showAdTips(id, AdType.Tips);
        }
        else {
            this.startGuide(id);
        }
    }

    /**保存每个Item的位置 */
    public setItemVector3(id: number, value: mw.Vector): void {
        Console.error("[id] = " + id);
        this.itemVector3Map.set(id, value);
    }

    /**得到某个Item在场景的位置 */
    public getItemLoc(id: number): mw.Vector {
        if (!this.itemVector3Map.has(id)) {
            Notice.showDownNotice("游戏出Bug啦~");
            return mw.Vector.zero;
        }
        return this.itemVector3Map.get(id);
    }

    public randomGetId(): void {
        if (!this.itemVector3Map || this.itemVector3Map.size == 0) {
            Notice.showDownNotice("你已经获得所有皮肤~");
            return;
        }
        let randomList: number[] = [];
        this.itemVector3Map.forEach((value: mw.Vector, key: number) => {
            randomList.push(key);
        });
        let randomId = randomList[Utils.getRandomInteger(0, randomList.length - 1)];
        this.startGuide(randomId);
    }

    /**引导目标点特效ID */
    private targetGuideEffectId: number = null;
    /**引导间隔标识 */
    private guideIntervalId: number = null;
    /**引导线特效ID */
    private guideEffectIds: number[] = [];
    /**记录上一次玩家的坐标 */
    private prePlayerLoc: mw.Vector = mw.Vector.zero;

    /**开始引导 */
    public startGuide(id: number): void {
        this.collectionPanel.hide();

        let targetLoc = this.getItemLoc(id);
        if (targetLoc.x == 0 && targetLoc.y == 0 && targetLoc.z == 0) return;

        if (this.targetGuideEffectId) {
            EffectService.stop(this.targetGuideEffectId);
            this.targetGuideEffectId = null;
        }

        this.targetGuideEffectId = GeneralManager.rpcPlayEffectAtLocation(GlobalData.targetEffectGuid,
            targetLoc, 0, mw.Rotation.zero, mw.Vector.one.multiply(0.5));

        if (this.guideIntervalId) {
            TimeUtil.clearInterval(this.guideIntervalId);
            this.guideIntervalId = null;
        }

        this.guideIntervalId = TimeUtil.setInterval(() => {
            let playerLoc = this.localPlayer.character.worldTransform.position;
            if (Math.abs(playerLoc.x - this.prePlayerLoc.x) < 0.1 && Math.abs(playerLoc.y - this.prePlayerLoc.y) < 0.1 && Math.abs(playerLoc.z - this.prePlayerLoc.z) < 0.1) return;
            this.prePlayerLoc = playerLoc;

            let distance = mw.Vector.distance(playerLoc, targetLoc);
            if (distance <= 100) {
                TimeUtil.clearInterval(this.guideIntervalId);
                this.guideIntervalId = null;
                if (this.targetGuideEffectId) {
                    EffectService.stop(this.targetGuideEffectId);
                    this.targetGuideEffectId = null;
                }
                if (this.guideEffectIds.length != 0) {
                    this.guideEffectIds.forEach((effectId: number) => {
                        EffectService.stop(effectId);
                    });
                    this.guideEffectIds.length = 0;
                }
                Notice.showDownNotice("已到达目标点附近");
                return;
            }

            let pointNum = Math.floor(distance / 100);
            let locs = Utils.getCurvePointsInNum([playerLoc, targetLoc], pointNum);
            if (pointNum > 35) {
                pointNum = 35;
            }

            if (this.guideEffectIds.length == 0) {
                for (let i = 1; i < pointNum; ++i) {
                    let effectId = GeneralManager.rpcPlayEffectAtLocation(
                        GlobalData.guideEffectGuid,
                        new mw.Vector(locs[i].x, locs[i].y, locs[i].z - 85),
                        0,
                        mw.Rotation.zero,
                        mw.Vector.one.multiply(2));
                    this.guideEffectIds.push(effectId);
                }
            }
            else {
                if (this.guideEffectIds.length == pointNum) {
                    for (let i = 1; i < pointNum; ++i) {
                        EffectService.getEffectById(this.guideEffectIds[i - 1]).then((effect) => {
                            if (effect) effect.worldTransform.position = (new mw.Vector(locs[i].x, locs[i].y, locs[i].z - 85));
                        });
                    }
                    EffectService.stop(this.guideEffectIds[pointNum - 1]);
                    this.guideEffectIds.length = pointNum - 1;
                }
                else if (this.guideEffectIds.length < pointNum) {
                    for (let i = 0; i < this.guideEffectIds.length; ++i) {
                        EffectService.getEffectById(this.guideEffectIds[i]).then((effect) => {
                            if (effect) effect.worldTransform.position = (new mw.Vector(locs[i + 1].x, locs[i + 1].y, locs[i + 1].z - 85));
                        });
                    }
                    for (let i = this.guideEffectIds.length; i < pointNum - 1; ++i) {
                        let effectId = GeneralManager.rpcPlayEffectAtLocation(
                            GlobalData.guideEffectGuid,
                            new mw.Vector(locs[i + 1].x, locs[i + 1].y, locs[i + 1].z - 85),
                            0,
                            mw.Rotation.zero,
                            mw.Vector.one.multiply(2));
                        this.guideEffectIds.push(effectId);
                    }
                }
                else if (this.guideEffectIds.length > pointNum) {
                    for (let i = 0; i < pointNum; ++i) {
                        EffectService.getEffectById(this.guideEffectIds[i]).then((effect) => {
                            if (!locs[i + 1]) return;
                            if (effect) effect.worldTransform.position = (new mw.Vector(locs[i + 1].x, locs[i + 1].y, locs[i + 1].z - 85));
                        });
                    }
                    for (let i = pointNum; i < this.guideEffectIds.length; ++i) {
                        EffectService.stop(this.guideEffectIds[i]);
                    }
                    this.guideEffectIds.length = pointNum;
                }
            }
        }, 0.1);
    }

    /**是否已拥有这个Item */
    public isOwnItem(id: number): boolean {
        let itemList = this.data.itemList;
        if (itemList.length == 0) return false;
        if (!itemList.includes(id)) return false;
        return true;
    }

    /**得到当前已拥有的Item个数 */
    public getItemListCount(): number {
        return this.data.itemList.length;
    }

    /**保存获得的Item */
    public saveAcquiredItem(id: number): void {
        this.shopModuleC.playEffectAndSoundToPlayer(1);
        this.achievementModuleC.onExecuteAchievementAction.call(1, 1);
        this.achievementModuleC.ach(1);
        this.server.net_saveAcquiredItem(id);
        if (this.itemVector3Map.has(id)) this.itemVector3Map.delete(id);
    }
}