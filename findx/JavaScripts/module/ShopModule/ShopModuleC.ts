import AdTips from "../../Common/AdTips";
import { Notice } from "../../Common/notice/Notice";
import { IClothesElement } from "../../config/Clothes";
import { ITailElement } from "../../config/Tail";
import { IWeaponElement } from "../../config/Weapon";
import { IWingElement } from "../../config/Wing";
import GlobalData from "../../const/GlobalData";
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { SpawnManager } from '../../Modified027Editor/ModifiedSpawn';
import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import Console from "../../Tools/Console";
import { InputManagers, TouchData } from "../../Tools/InputManager";
import AchievementModuleC from "../AchievementModule/AchievementModuleC";
import { AdType } from "../AdsModule/AdsModuleC";
import HUDModuleC from "../HUDModule/HUDModuleC";
import ShopData from "./ShopData";
import ShopModuleS from "./ShopModuleS";
import ShopPanel from "./ui/ShopPanel";

export default class ShopModuleC extends ModuleC<ShopModuleS, ShopData> {
    /**HUD模块 */
    private hudModuleC: HUDModuleC = null;
    private achievementModuleC: AchievementModuleC = null;
    /**商店面板 */
    private shopPanel: ShopPanel = null;
    private adsTips: AdTips = null;


    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initData();
        this.registerActions();
    }

    protected onEnterScene(sceneType: number): void {
        this.initShopNPCData();
    }

    /**初始化数据 */
    private initData(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.achievementModuleC = ModuleService.getModule(AchievementModuleC);
        this.shopPanel = mw.UIService.getUI(ShopPanel);
        this.adsTips = mw.UIService.getUI(AdTips);

        let rootCanvaSize = mw.getViewportSize();
        this.limitedTouchXY = new mw.Vector2(800 * rootCanvaSize.x / 1920, 880 * rootCanvaSize.y / 1080);
        Console.error(this.limitedTouchXY);
    }

    /**注册事件 */
    private registerActions(): void {
        this.hudModuleC.onSkinShopAction.add(() => {
            this.shopPanel.show();
            this.onSwitchCameraAction.call(true);
        });

        this.onSwitchCameraAction.add((isOpenSkinShop: boolean) => {
            isOpenSkinShop ? this.openSkinShop() : this.closeSkinShop();
        });

        this.shopPanel.onChangeClothToNPCAnction.add(this.updateClothItemData.bind(this));
        this.shopPanel.onChangeWeaponToNPCAnction.add(this.updateWeaponItemData.bind(this));
        this.shopPanel.onChangeWingToNPCAnction.add(this.updateWingItemData.bind(this));
        this.shopPanel.onChangeTailToNPCAnction.add(this.updateTailItemData.bind(this));
        this.onSaveClothAction.add(this.changeClothesToPlayer.bind(this));

        // InputUtil.onKeyDown(mw.Keys.G, () => {
        //     let rootCanvaSize = mw.getViewportSize();
        //     this.limitedTouchXY = new mw.Vector2(800 * rootCanvaSize.x / 1920, 880 * rootCanvaSize.y / 1080);
        //     Console.error(this.limitedTouchXY);
        //     mw.UIService.getUI(HUDPanel).hide();
        // });
    }

    //#region 商店NPC
    /**--------------------------------[商店NPC]-------------------------------- */
    /**玩家和皮肤商店之间的相机转化 */
    public onSwitchCameraAction: Action1<boolean> = new Action1<boolean>();
    /**记录当前滑动屏幕的X轴正负值 */
    private x: number = 0;
    /**旋转速度 */
    private slideSpeedX: number = 1;
    /**当前Npc的旋转Z轴值 */
    private currentNpcRotZ: number = 0;

    /**玩家身上的相机 */
    private camera: Camera = null;
    /**拿到相机 */
    private get getCamera(): Camera {
        if (this.camera == null) {
            this.camera = Camera.currentCamera;
        }
        return this.camera;
    }

    /**相机固定的锚点 */
    private cameraAnchor: mw.GameObject = null;
    /**相机固定的锚点 */
    private get getCameraAnchor(): mw.GameObject {
        if (this.cameraAnchor == null) {
            this.cameraAnchor = GameObject.findGameObjectById("13B27D87");
        }
        return this.cameraAnchor;
    }

    private shopCamera: Camera = null;

    /**打开商店 */
    private openSkinShop(): void {
        // this.getCamera.parent = (this.getCameraAnchor);

        // this.getCamera.rotationMode = mw.CameraRotationMode.RotationFixed;
        // this.getCamera.positionMode = mw.CameraPositionMode.PositionFixed;
        // let transform = new mw.Transform();
        // transform.position = new mw.Vector(-940, -554.5, 168);
        // transform.rotation = new mw.Rotation(-9, -4.5, 29);
        // this.getCamera.localTransform = transform;

        // SoundService.playSound(GlobalData.openShopSoundId);
        // Camera.switch(this.shopCamera, 5, mw.CameraSwitchBlendFunction.Linear);
        this.onSwitchCamera.call(1);

        InputManagers.getInstance.onPressTouch.add((data: TouchData) => {
            this.onPressTouch(data);
        });
        InputManagers.getInstance.onReleaseTouch.add((data: TouchData) => {
            this.onReleaseTouch(data);
        });
    }

    /**关闭商店 */
    private closeSkinShop(): void {
        // this.getCamera.parent = (this.currentPlayer.character);

        // this.getCamera.rotationMode = mw.CameraRotationMode.RotationControl;
        // this.getCamera.positionMode = mw.CameraPositionMode.PositionFollow;
        // let transform = new mw.Transform();
        // transform.position = new mw.Vector(0, 0, 85);
        // transform.rotation = new mw.Rotation(0, 0, 0);
        // this.getCamera.localTransform = transform;
        // this.localPlayer.character.addMovement(this.localPlayer.character.worldTransform.getForwardVector());

        // SoundService.playSound(GlobalData.closeShopSoundId);
        // Camera.switch(this.getCamera);
        this.onSwitchCamera.call(0);

        InputManagers.getInstance.onPressTouch.clear();
        InputManagers.getInstance.onReleaseTouch.clear();
    }

    /**皮肤商店要展示的NPC */
    private shopNpc: mw.Character = null;
    /**得到商店的NPC */
    private get getShopNpc(): mw.Character {
        if (this.shopNpc == null) {
            this.shopNpc = GameObject.findGameObjectById("3BA2AFEA") as mw.Character;
        }
        return this.shopNpc;
    }

    private tailGo: mw.GameObject = null;

    private onSwitchCamera: Action1<number> = new Action1<number>();

    /**初始化商店NPC数据 */
    private async initShopNPCData(): Promise<void> {
        this.shopNpc = await GameObject.asyncFindGameObjectById("3BA2AFEA") as mw.Character;
        this.getShopNpc.complexMovementEnabled = false;
        AccountService.downloadData(this.getShopNpc);

        this.cameraAnchor = await GameObject.asyncFindGameObjectById("0DA0D78F");
        let nickName = AccountService.getNickName();
        nickName = (nickName) ? nickName : "playerId:" + this.localPlayerId;
        this.getShopNpc.displayName = nickName;
        this.currentNpcRotZ = this.getShopNpc.localTransform.rotation.z;

        this.tailGo = await GameObject.asyncFindGameObjectById("20024AE7");

        let myCamera = Camera.currentCamera;
        this.shopCamera = await GameObject.asyncSpawn<mw.Camera>(
            "Camera",
            {
                replicates: false,
                transform: new mw.Transform(
                    this.getCameraAnchor.worldTransform.position,
                    mw.Rotation.zero,
                    mw.Vector.one
                )
            });
        this.onSwitchCamera.add((a: number) => {
            if (a == 1) {
                Camera.switch(this.shopCamera, 0, mw.CameraSwitchBlendFunction.Linear);
            } else {
                Camera.switch(myCamera);
            }
        });
    }

    private npcAnimation: mw.Animation = null;
    private clothGuids: string[] = ["", "", "", "", "", "", ""];
    private clothIAA: number[] = [0, 0, 0, 0, 0, 0, 0];
    private currentClothGuids: string[] = ["", "", "", "", "", "", ""];

    /**更新服装数据 */
    private updateClothItemData(id: number, cloth: IClothesElement): void {
        let clothGuid = cloth.ClothGuid;
        let clothType = cloth.ClothType;
        if (clothType == 1) {
            let hairGuids = clothGuid.split(',');
            if (this.clothGuids[0] == hairGuids[0] && this.clothGuids[1] == hairGuids[1]) {
                Notice.showDownNotice("已佩戴");
                return;
            }
            this.clothGuids[0] = hairGuids[0];
            this.clothGuids[1] = hairGuids[1];
            this.clothIAA[0] = cloth.IsIAA;
            this.clothIAA[1] = cloth.IsIAA;
        }
        else {
            if (this.clothGuids[clothType] == clothGuid) {
                Notice.showDownNotice("已佩戴");
                return;
            }
            this.clothGuids[clothType] = clothGuid;
            this.clothIAA[clothType] = cloth.IsIAA;
            if (clothType == ClothType.body) {
                for (let i = 0; i <= 5; ++i) {
                    this.clothGuids[i] = "";
                    this.clothIAA[i] = 0;
                }
            }
        }
        this.shopPanel.updateClothItemState(id);
        this.changeClothesToNpc(clothGuid, cloth.Animation, clothType);
    }

    /**给NPC换装 */
    public changeClothesToNpc(clothGuid: string, animation: string, clothType: ClothType): void {
        switch (clothType) {
            case ClothType.hair:
                let hairGuids = clothGuid.split(',');
                this.getShopNpc.description.advance.hair.frontHair.style = hairGuids[0];
                this.getShopNpc.description.advance.hair.backHair.style = hairGuids[1];
                break;
            case ClothType.upperCloth:
                this.getShopNpc.description.advance.clothing.upperCloth.style = clothGuid;
                break;
            case ClothType.lowerCloth:
                this.getShopNpc.description.advance.clothing.lowerCloth.style = clothGuid;
                break;
            case ClothType.gloves:
                this.getShopNpc.description.advance.clothing.gloves.style = clothGuid;
                break;
            case ClothType.shoe:
                this.getShopNpc.description.advance.clothing.shoes.style = clothGuid;
                break;
            case ClothType.body:
                this.getShopNpc.setDescription([clothGuid]);
                break;
            default:
                break;
        }
        if (this.npcAnimation) {
            this.npcAnimation.stop();
            this.npcAnimation = null;
        }
        this.npcAnimation = PlayerManagerExtesion.loadAnimationExtesion(this.getShopNpc, animation, false)
        this.npcAnimation.play();
    }

    /**保存服装 */
    public onSaveClothAction: Action = new Action();

    private changeClothesToPlayer(): void {
        this.achievementModuleC.onExecuteAchievementAction.call(13, 1);
        if (this.clothGuids[6] == "") {
            this.changeClothToPlayer();
        }
        else {
            let isAll: boolean = true;
            for (let i = 0; i <= 5; ++i) {
                if (this.clothGuids[i] == "") {
                    isAll = false;
                    break;
                }
            }
            if (isAll) {
                this.changeClothToPlayer();
            }
            else {
                if (this.clothGuids[6] != this.currentClothGuids[6]) {
                    this.localPlayer.character.setDescription([this.clothGuids[6]]);
                    this.localPlayer.character.syncDescription();
                    this.currentClothGuids[6] = this.clothGuids[6];
                }
                TimeUtil.delaySecond(1).then(() => {
                    this.changeClothToPlayer();
                });
            }
        }
    }

    /**给角色换装 */
    private changeClothToPlayer(): void {
        this.playEffectAndSoundToPlayer(0);
        if (this.clothGuids[0] != "" && this.clothGuids[0] != this.currentClothGuids[0]) {
            this.localPlayer.character.description.advance.hair.frontHair.style = this.clothGuids[0];
            this.currentClothGuids[0] = this.clothGuids[0];
        }
        TimeUtil.delaySecond(0.2).then(() => {
            if (this.clothGuids[1] != "" && this.clothGuids[1] != this.currentClothGuids[1]) {
                this.localPlayer.character.description.advance.hair.backHair.style = this.clothGuids[1];
                this.currentClothGuids[1] = this.clothGuids[1];
            }
            TimeUtil.delaySecond(0.2).then(() => {
                if (this.clothGuids[2] != "" && this.clothGuids[2] != this.currentClothGuids[2]) {
                    this.localPlayer.character.description.advance.clothing.upperCloth.style = this.clothGuids[2];
                    this.currentClothGuids[2] = this.clothGuids[2];
                }
                TimeUtil.delaySecond(0.2).then(() => {
                    if (this.clothGuids[3] != "" && this.clothGuids[3] != this.currentClothGuids[3]) {
                        this.localPlayer.character.description.advance.clothing.lowerCloth.style = this.clothGuids[3];
                        this.currentClothGuids[3] = this.clothGuids[3];
                    }
                    TimeUtil.delaySecond(0.2).then(() => {
                        if (this.clothGuids[4] != "" && this.clothGuids[4] != this.currentClothGuids[4]) {
                            this.localPlayer.character.description.advance.clothing.gloves.style = this.clothGuids[4];
                            this.currentClothGuids[4] = this.clothGuids[4];
                        }
                        TimeUtil.delaySecond(0.2).then(() => {
                            if (this.clothGuids[5] != "" && this.clothGuids[5] != this.currentClothGuids[5]) {
                                this.localPlayer.character.description.advance.clothing.shoes.style = this.clothGuids[5];
                                this.currentClothGuids[5] = this.clothGuids[5];
                            }
                        });
                    });
                });
            });
        });
        TimeUtil.delaySecond(2).then(() => {
            this.localPlayer.character.syncDescription();
        });
    }

    /**已经看完广告CLoth */
    public adsOnCompleteCloth(): void {
        for (let i = 0; i <= 6; ++i) {
            this.clothIAA[i] = 0;
        }
        this.shopPanel.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
        this.shopPanel.closeShop();
    }
    /**Cloth是否需要ads */
    public clothIsNeedAds(): boolean {
        let isNeed: boolean = false;
        for (let i = 0; i <= 6; ++i) {
            if (this.clothIAA[i] == 1) {
                isNeed = true;
                break;
            }
        }
        return isNeed;
    }

    private limitedTouchXY: mw.Vector2 = new mw.Vector2(800, 880);
    /**按下 */
    private onPressTouch(data: TouchData): void {
        // Console.error("[onPressTouch-data] " + data.x + "/" + data.y);
        if (data.x >= this.limitedTouchXY.x || data.y >= this.limitedTouchXY.y) return;
        if (this.x != 0) {
            let x = (data.x - this.x) * this.slideSpeedX;
            // Console.error("x = " + x);
            this.currentNpcRotZ -= x;
            this.getShopNpc.localTransform.rotation = (new mw.Rotation(0, 0, this.currentNpcRotZ));
        }
        this.x = data.x;
    }

    /**释放 */
    private onReleaseTouch(data: TouchData): void {
        // Console.error("[onReleaseTouch-data] " + data.x + "/" + data.y);
        this.x = 0;
    }
    /**--------------------------------[商店NPC]-------------------------------- */
    //#endregion

    //#region 武器
    /**--------------------------------[商店武器]-------------------------------- */
    /**使用武器 */
    public useWeapon(): void {
        if (this.weapon == null) {
            Notice.showDownNotice("请选择武器~");
            return;
        }
        if (GlobalData.isOpenIAA) {
            if (this.weaponIsNeedAds()) {
                this.adsTips.showAdTips(this.weapon.id, AdType.Weapon);
            }
            else {
                this.hudModuleC.pickUpWeapon(this.weapon.id);
            }
        }
        else {
            this.hudModuleC.pickUpWeapon(this.weapon.id);
        }
    }
    /**使用武器关闭商店 */
    public useWeaponCloseShopPanel(): void {
        this.shopPanel.closeShop();
    }
    private weapon: IWeaponElement = null;
    private weaponIsIAA: number = 0;
    /**更新Weapon数据 */
    private updateWeaponItemData(id: number, weapon: IWeaponElement): void {
        if (this.weapon != null && this.weapon.id == weapon.id) {
            Notice.showDownNotice("已使用~");
            return;
        }
        this.weapon = weapon;
        this.weaponIsIAA = weapon.IsIAA;
        this.shopPanel.updateWeaponItemState(id);
        this.changeWeaponToNPC();
    }

    private npcWeaponModel: mw.GameObject = null;
    /**给NPC换武器 */
    private changeWeaponToNPC(): void {
        if (this.npcWeaponModel != null) {
            mwext.GameObjPool.despawn(this.npcWeaponModel);
            this.npcWeaponModel = null;
        }
        let modelGuid = this.weapon.WeaponGuid;
        if (!modelGuid) return;
        let weaponModel = SpawnManager.modifyPoolSpawn(modelGuid);
        weaponModel.asyncReady().then(() => {
            this.getShopNpc.attachToSlot(weaponModel, mw.HumanoidSlotType.RightHand);
            weaponModel.localTransform.position = (mw.Vector.zero);
            weaponModel.localTransform.rotation = (mw.Rotation.zero);
            weaponModel.worldTransform.scale = (mw.Vector.one);
            this.npcWeaponModel = weaponModel;
            if (this.npcAnimation) {
                this.npcAnimation.stop();
                this.npcAnimation = null;
            }
            this.npcAnimation = PlayerManagerExtesion.loadAnimationExtesion(this.getShopNpc, this.weapon.AttackAnimationId, false)
            this.npcAnimation.play();
        });
    }

    /**Weapon是否需要ads */
    public weaponIsNeedAds(): boolean {
        return (this.weaponIsIAA == 0) ? false : true;
    }

    /**已经看完广告Weapon */
    public adsOnCompleteWeapon(): void {
        this.weaponIsIAA = 0;
        this.shopPanel.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
    }
    /**--------------------------------[商店武器]-------------------------------- */
    //#endregion

    //#region 翅膀
    /**--------------------------------[商店翅膀]-------------------------------- */
    /**使用翅膀 */
    public useWing(): void {
        if (this.wing == null) return;
        if (GlobalData.isOpenIAA) {
            if (this.wingIsNeedAds()) {
                this.adsTips.showAdTips(this.wing.id, AdType.Wing);
            }
            else {
                this.hudModuleC.pickUpWing(this.wing.id);
            }
        }
        else {
            this.hudModuleC.pickUpWing(this.wing.id);
        }
    }
    /**使用翅膀关闭商店 */
    public useWingCloseShopPanel(): void {
        this.shopPanel.closeShop();
    }
    private wing: IWingElement = null;
    private wingIsIAA: number = 0;
    /**更新Wing数据 */
    private updateWingItemData(id: number, wing: IWingElement): void {
        if (this.wing != null && this.wing.id == wing.id) {
            Notice.showDownNotice("已使用~");
            return;
        }
        this.wing = wing;
        this.wingIsIAA = wing.IsIAA;
        this.shopPanel.updateWingItemState(id);
        this.changeWingToNPC();
    }

    private npcWingEffectId: number = null;
    /**给NPC换翅膀 */
    private changeWingToNPC(): void {
        if (this.npcWingEffectId != null) {
            EffectService.stop(this.npcWingEffectId);
        }
        if (!this.wing.WingGuid) return;
        this.npcWingEffectId = GeneralManager.rpcPlayEffectOnPlayer(
            this.wing.WingGuid,
            this.getShopNpc,
            mw.HumanoidSlotType.BackOrnamental,
            0,
            this.wing.WingOffset,
            new mw.Rotation(this.wing.WingRotation),
            this.wing.WingScale);
    }

    /**Wing是否需要ads */
    public wingIsNeedAds(): boolean {
        return (this.wingIsIAA == 0) ? false : true;
    }

    /**已经看完广告Wing */
    public adsOnCompleteWing(): void {
        this.wingIsIAA = 0;
        this.shopPanel.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
    }
    /**--------------------------------[商店武器]-------------------------------- */
    //#endregion

    //#region 拖尾
    /**--------------------------------[商店拖尾]-------------------------------- */
    /**使用拖尾 */
    public useTail(): void {
        if (this.tail == null) return;
        if (GlobalData.isOpenIAA) {
            if (this.tailIsNeedAds()) {
                this.adsTips.showAdTips(this.tail.id, AdType.Tail);
            }
            else {
                this.hudModuleC.pickUptailEffect(this.tail.id);
            }
        }
        else {
            this.hudModuleC.pickUptailEffect(this.tail.id);
        }
    }
    /**使用拖尾关闭商店 */
    public useTailCloseShopPanel(): void {
        this.shopPanel.closeShop();
    }
    private tail: ITailElement = null;
    private tailIsIAA: number = 0;
    /**更新Tail数据 */
    private updateTailItemData(id: number, tail: ITailElement): void {
        if (this.tail != null && this.tail.id == tail.id) {
            Notice.showDownNotice("已使用~");
            return;
        }
        this.tail = tail;
        this.tailIsIAA = tail.IsIAA;
        this.shopPanel.updateTailItemState(id);
        this.changeTailToNPC();
    }

    private npcTailEffectId: number = null;
    /**给NPC换拖尾 */
    private changeTailToNPC(): void {
        if (this.npcTailEffectId != null) {
            EffectService.stop(this.npcTailEffectId);
        }
        if (!this.tail.TailGuid) return;
        this.npcTailEffectId = GeneralManager.rpcPlayEffectOnGameObject(
            this.tail.TailGuid,
            this.tailGo,
            0,
            this.tail.TailOffset,
            new mw.Rotation(this.tail.TailRotation),
            this.tail.TailScale);
    }

    /**Tail是否需要ads */
    public tailIsNeedAds(): boolean {
        return (this.tailIsIAA == 0) ? false : true;
    }

    /**已经看完广告tail */
    public adsOnCompleteTail(): void {
        this.tailIsIAA = 0;
        this.shopPanel.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
    }
    /**--------------------------------[商店武器]-------------------------------- */
    //#endregion
    /**得到当前最大高度 */
    public getMaxHeight(): number {
        return this.data.maxHeight;
    }

    /**得到当前玩家等级 */
    public getLevel(): number {
        return this.data.level;
    }

    /**得到当前玩家击杀人数 */
    public getKillCount(): number {
        return this.data.killCount;
    }

    /**得到是否第一次游戏 */
    public getIsFirstGame(): boolean {
        return this.data.isFirstGame;
    }

    /**保存完成游戏引导 */
    public completeGameGuide(): void {
        this.server.net_completeGameGuide();
    }

    /**升级&换装特效音效播放 */
    public playEffectAndSoundToPlayer(playType: number): void {
        SoundService.playSound(GlobalData.upgradeSoundGuid, 1);
        this.server.net_playEffectAndSoundToPlayer(playType);
    }

    public onPlayerLevelAction: Action1<number> = new Action1<number>();
    public playerLevel(lv: number): void {
        this.onPlayerLevelAction.call(lv);
    }
}

export enum ClothType {
    /**后发 108424--前发 108424*/
    hair = 1,
    /**上衣 46293-29756*/
    upperCloth = 2,
    /**下衣 108421*/
    lowerCloth = 3,
    /**手套 116994--53004*/
    gloves = 4,
    /**鞋 108421*/
    shoe = 5,
    /**整身 52965*/
    body = 6,
}