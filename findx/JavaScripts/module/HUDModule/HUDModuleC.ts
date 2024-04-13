import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import Console from "../../Tools/Console";
import { Utils } from "../../Tools/utils";
import AdTips from "../../Common/AdTips";
import { ExplosiveCoins } from "../../Common/ExplosiveCoins";
import { FlyText } from "../../Common/FlyText";
import P_Tips from "../../Common/P_Tips";
import Test from "../../Common/Test";
import { GameConfig } from "../../config/GameConfig";
import { IMusicElement } from "../../config/Music";
import { IWeaponElement } from "../../config/Weapon";
import GlobalData from "../../const/GlobalData";
import AchievementModuleC from "../AchievementModule/AchievementModuleC";
import { AdType } from "../AdsModule/AdsModuleC";
import PetPanel from "../PetModule/ui/PetPanel";
import ShopModuleC from "../ShopModule/ShopModuleC";
import HUDDate from "./HUDDate";
import HUDModuleS from "./HUDModuleS";
import GuidePanel from "./ui/GuidePanel";
import HUDPanel from "./ui/HUDPanel";
import CollectionModuleC from '../CollectionMOdule/CollectionModuleC';
import { PrefabEvent } from '../../Prefabs/PrefabEvent';

export default class HUDModuleC extends ModuleC<HUDModuleS, HUDDate> {
    private hudPanel: HUDPanel = null;
    /**皮肤商店模块 */
    private shopModuleC: ShopModuleC = null;
    private achievementModuleC: AchievementModuleC = null;
    private guidePanel: GuidePanel = null;
    private adTips: AdTips = null;
    private petPanel: PetPanel = null;
    /**跳跃事件 */
    public onJumpAction: Action = new Action();
    /**背景音乐事件 */
    public onMusicAction: Action = new Action();
    /**打开排行榜的事件 */
    public onOpenRankingAction: Action = new Action();
    /**打开皮肤商店 */
    public onSkinShopAction: Action = new Action();
    /**打开关闭收集Panel */
    public onOpenAndCloseCollectionPanelAction: Action1<boolean> = new Action1<boolean>();
    /**打开签到界面 */
    public onOpenSignInAction: Action = new Action();
    public onOpenSignInAction1: Action = new Action();
    /**打开抽奖界面 */
    public onOpenAdsAction: Action = new Action();
    /**打开成就界面 */
    public onOpenAchAction: Action = new Action();
    /**打开宠物界面界面 */
    public onOpenPetAction: Action = new Action();
    /**打开宠物抽奖界面界面 */
    public onOpenRaffleAction: Action = new Action();

    /**当前播放的背景音乐 */
    private currentBgmIndex: number = 1;
    /**背景音乐 */
    private bgmMusics: IMusicElement[] = [];

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initData();
        this.registerActions();
        this.registerEvents();
    }

    /**初始化数据 */
    private initData(): void {
        this.hudPanel = mw.UIService.getUI(HUDPanel);
        this.shopModuleC = ModuleService.getModule(ShopModuleC);
        this.achievementModuleC = ModuleService.getModule(AchievementModuleC);
        this.adTips = mw.UIService.getUI(AdTips);
        this.petPanel = mw.UIService.getUI(PetPanel);
        this.bgmMusics = GameConfig.Music.getAllElement();
    }


    /**注册事件 */
    private registerActions(): void {
        this.onJumpAction.add(this.playerJump.bind(this));

        this.hudPanel.onBgmAction.add((isOpenBGM: boolean) => {
            if (isOpenBGM) {
                this.playBGM(0);
            }
            else {
                SoundService.stopBGM();
            }
        });

        this.hudPanel.onSwitchBgmAction.add(this.playBGM.bind(this));

        this.onMusicAction.add(() => {
            if (this.hudPanel.mMusicCanvas.visibility == mw.SlateVisibility.SelfHitTestInvisible) return;
            this.hudPanel.mMusicCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        });

        this.hudPanel.onRebirthAction.add(this.rebirthHome.bind(this));

        this.shopModuleC.onSwitchCameraAction.add((isOpenSkinShop: boolean) => {
            this.hudPanel.mJoystick.resetJoyStick();
            isOpenSkinShop ? this.hudPanel.hide() : this.hudPanel.show();
        });
        this.onAttackAction.add(this.attack.bind(this));
        this.onFlyOrWalkAction.add(() => {
            this.switchToFlyingOrWalking();
        });

        this.onOpenAdsAction.add(this.ads.bind(this));
    }

    /**注册事件 */
    private registerEvents(): void {
        Event.addLocalListener("IsCanFly", this.wingIsCanFly.bind(this));
    }

    protected onEnterScene(sceneType: number): void {
        this.hudPanel.show();
        // this.hudPanel.mAttackMaskBtn.visibility = mw.SlateVisibility.Collapsed;
        this.registerGlobalClickSound();
        this.delayedOperation();
        this.initWeaponData();
        this.initPlayerData();
        TimeUtil.delaySecond(10).then(() => {
            this.initGameGuide();
        });
    }

    protected onUpdate(dt: number): void {
        this.updateJumpTime(dt);
    }

    /**延迟执行的测试用例 */
    private delayedOperation(): void {
        TimeUtil.delaySecond(10).then(() => {
            this.playWaterSound();
            this.playBGM(0);
            if (GlobalData.isHideHeadUI) {
                this.localPlayer.character.displayName = "";
            }
            if (GlobalData.isOpenTest) {
                mw.UIService.getUI(Test).show();
            }
        });
    }

    /**全局UI点击音效唯一标识 */
    private uiClickSoundId: string = null;
    /**注册全局点击音效 */
    private registerGlobalClickSound(): void {
        /**全局UI点击音效 */
        Event.addLocalListener("PlayButtonClick", () => {
            if (this.uiClickSoundId) {
                // Console.error("[停止上一次的点击音效]");
                SoundService.stopSound(this.uiClickSoundId);
                this.uiClickSoundId = null;
            }
            this.uiClickSoundId = SoundService.playSound(GlobalData.uiClickSoundGuid);
        });
    }

    /**播放水声 */
    private playWaterSound(): void {
        let worldPos: mw.Vector[] =
            [
                new mw.Vector(1000, -1435, 50),
                new mw.Vector(1000, -685, 50),
                new mw.Vector(600, -1060, 50),
                new mw.Vector(1360, -1060, 50)
            ];
        for (let i = 0; i < worldPos.length; ++i) {
            SoundService.play3DSound(
                GlobalData.waterSoundGuid, worldPos[i], 0, 1);
        }
    }

    /**播放背景音乐 */
    private playBGM(bgmIndex: number): void {
        this.currentBgmIndex = this.currentBgmIndex + bgmIndex;
        if (this.currentBgmIndex > this.bgmMusics.length) {
            this.currentBgmIndex = 1;
        }
        else if (this.currentBgmIndex < 1) {
            this.currentBgmIndex = this.bgmMusics.length;
        }
        let bgmId = this.bgmMusics[this.currentBgmIndex - 1].Guid;
        SoundService.playBGM(bgmId);
        this.hudPanel.mMusicText.text = this.bgmMusics[this.currentBgmIndex - 1].Annotation;
        this.achievementModuleC.onExecuteAchievementAction.call(16, 1);
    }

    /**显示时间 */
    public showTime(time: string): void {
        if (!this.hudPanel || !this.hudPanel.mTimeText) return;
        this.hudPanel.mTimeText.text = time;
    }

    public net_rebirthHome(): void {
        this.rebirthHome();
        P_Tips.show("获得5秒无敌防御");
    }

    /**回家 */
    private rebirthHome(): void {
        let index = Utils.getRandomInteger(0, 3);
        this.localPlayer.character.worldTransform.position = GlobalData.homeLocs[index];
        this.localPlayer.character.worldTransform.rotation = GlobalData.homeRots[index];
        Camera.currentCamera.worldTransform.clone().rotation = GlobalData.homeRots[index];
        this.shopModuleC.playEffectAndSoundToPlayer(2);
        // this.hudPanel.mAttackMaskBtn.visibility = mw.SlateVisibility.Collapsed;
    }

    /**随机传送 */
    public randomPortal(): void {
        let index = Utils.getRandomInteger(0, 3);
        this.localPlayer.character.worldTransform.position = GlobalData.portalLocs[index];
        this.shopModuleC.playEffectAndSoundToPlayer(2);
        // this.hudPanel.mAttackMaskBtn.visibility = mw.SlateVisibility.Visible;
    }
    private cameraAnchorLen: number = 0;
    private curCameraAnchorLen: number = 0;
    /**初始化游戏引导 */
    private async initGameGuide(): Promise<void> {
        if (this.shopModuleC == null) {
            this.shopModuleC = ModuleService.getModule(ShopModuleC);
        }
        if (this.shopModuleC.getIsFirstGame()) {
            // this.cameraAnchorLen = this.locs.length;
            // this.guidePanel = mw.UIService.getUI(GuidePanel);
            // this.guidePanel.show();

            // let myCamera = Camera.currentCamera;
            // let cameraArray = new Array<Camera>();
            // for (let i = 0; i < this.cameraAnchorLen; ++i) {
            //     let camera = await GameObject.asyncSpawn("Camera") as Camera;
            //     camera.worldTransform.position = this.locs[i];
            //     cameraArray.push(camera);
            //     camera.onSwitchComplete.add(() => {
            //         Console.log("当前摄像机序号 " + i);
            //         this.curCameraAnchorLen = i;
            //     });
            // }

            // this.guidePanel.onNextAction.add(() => {
            //     if (this.curCameraAnchorLen > this.cameraAnchorLen) return;
            //     // this.nextCamerTransform();
            //     if (this.curCameraAnchorLen >= this.cameraAnchorLen) {
            //         Camera.switch(myCamera);
            //         this.shopModuleC.completeGameGuide();
            //         this.curCameraAnchorLen++;
            //         return;
            //     }
            //     Camera.switch(cameraArray[this.curCameraAnchorLen++], 1, mw.CameraSwitchBlendFunction.Linear);
            // });
            this.onOpenPetAction.call();
            this.onOpenSignInAction1.call();
            ModuleService.getModule(CollectionModuleC).startGuide(2);
            this.firstGame();
            this.setCurAttackValue(500);
            this.setMaxHp(10000);
            TimeUtil.delaySecond(1).then(() => {
                this.shopModuleC.completeGameGuide();
            });
        }
        else {
            this.onOpenAchAction.call();
            this.onOpenPetAction.call();
            this.onOpenSignInAction1.call();
        }
    }
    private locs: mw.Vector[] = [
        new mw.Vector(2430, 1560, 300),
        new mw.Vector(-1000, 1560, 300),
        new mw.Vector(-1926, 2580, 300),
        new mw.Vector(-2000, -570, 330),
        new mw.Vector(2400, 210, 300),
        new mw.Vector(-135, -1930, 280),
        new mw.Vector(-2500, 500, 400),
        new mw.Vector(-2500, -3000, 400),
        new mw.Vector(-15000, 15000, 2000),
        new mw.Vector(-3400, -600, 450),
        new mw.Vector(-9000, 15000, 2500),
        new mw.Vector(-11000, 14000, 500),
    ];
    private rots: mw.Rotation[] = [
        new mw.Rotation(0, -10, 180),
        new mw.Rotation(0, -10, 0),
        new mw.Rotation(0, -10, 10),
        new mw.Rotation(0, -25, 25.5),
        new mw.Rotation(0, 30, 0),
        new mw.Rotation(0, 0, -90),
        new mw.Rotation(0, -45, 180),
        new mw.Rotation(0, -40, 180),
        new mw.Rotation(0, -20, 170),
        new mw.Rotation(0, -10, 180),
        new mw.Rotation(0, -26, 180),
        new mw.Rotation(0, -30, 150),
    ];
    /**玩家身上的相机 */
    private camera: Camera = null;
    /**拿到相机 */
    private get getCamera(): Camera {
        if (this.camera == null) {
            this.camera = Camera.currentCamera;
        }
        return this.camera;
    }
    /**下一个游戏视角 */
    private nextCamerTransform(): void {
        if (this.curCameraAnchorLen >= this.cameraAnchorLen) {
            // this.getCamera.parent = (this.currentPlayer.character);
            this.getCamera.rotationMode = mw.CameraRotationMode.RotationControl;
            this.getCamera.positionMode = mw.CameraPositionMode.PositionFollow;
            let transform = new mw.Transform();
            transform.position = new mw.Vector(0, 0, 85);
            transform.rotation = new mw.Rotation(0, 0, 0);
            this.getCamera.localTransform = transform;
            this.localPlayer.character.addMovement(this.localPlayer.character.worldTransform.getForwardVector());
            this.shopModuleC.completeGameGuide();
            this.curCameraAnchorLen++;
            return;
        }
        if (this.curCameraAnchorLen == 0) {
            this.getCamera.rotationMode = mw.CameraRotationMode.RotationFixed;
            this.getCamera.positionMode = mw.CameraPositionMode.PositionFixed;
        }
        let transform = new mw.Transform();
        transform.position = this.locs[this.curCameraAnchorLen];
        transform.rotation = this.rots[this.curCameraAnchorLen++];
        this.getCamera.localTransform = transform;
    }

    /**本客户端进入游戏同步其他客户端数据 */
    public net_enterGameSnycData(
        wingPlayerIds: number[], wingIds: number[],
        tailEffectplayerIds: number[], tailEffectIds: number[],
        weaponPlayerIds: number[], weaponIds: number[]): void {
        if (wingPlayerIds.length > 0) {
            this.syncWing(wingPlayerIds, wingIds);
        }
        if (tailEffectplayerIds.length > 0) {
            this.snycTailEffect(tailEffectplayerIds, tailEffectIds);
        }
        if (weaponPlayerIds.length < 0) {
            this.syncWeaponData(weaponPlayerIds, weaponIds);
        }
    }

    /**某个客户端玩家离开游戏同步给其他客户端 */
    public net_exitGameSyncData(playerId: number): void {
        this.exitGameDeleteWing(playerId);
        this.exitGameDeletetailEffect(playerId);
        this.exitGameDeleteWeapon(playerId);
    }

    //#region  翅膀
    /**---------------------------------【翅膀】--------------------------------- */
    /**储存所有所有客户端的翅膀 */
    private wingMap: Map<number, number> = new Map<number, number>();
    /**飞行OR行走状态切换的事件 */
    public onFlyOrWalkAction: Action = new Action();

    /**拾取翅膀 */
    public pickUpWing(id: number): void {
        this.achievementModuleC.onExecuteAchievementAction.call(14, 1);
        this.server.net_pickWing(id);
        this.shopModuleC.useWingCloseShopPanel();
        if (this.hudPanel.mFlyCanvas.visibility == mw.SlateVisibility.Collapsed && id > 1) {
            this.onFlyOrWalkAction.call();
            this.hudPanel.mFlyCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        }
        else if (this.hudPanel.mFlyCanvas.visibility == mw.SlateVisibility.SelfHitTestInvisible && id == 1) {
            this.hudPanel.mFlyCanvas.visibility = mw.SlateVisibility.Collapsed;
        }
    }

    /**拾取翅膀（所有客户端） */
    public net_pickUpWing(playerId: number, id: number): void {
        this.equipWing(playerId, id);
    }

    /**玩家离开游戏删除翅膀 */
    private exitGameDeleteWing(playerId: number): void {
        if (this.wingMap.has(playerId)) {
            EffectService.stop(this.wingMap.get(playerId));
            this.wingMap.delete(playerId);
        }
    }

    /**装备翅膀 */
    private async equipWing(playerId: number, id: number): Promise<void> {
        let effectId: number = null;
        if (this.wingMap.has(playerId)) {
            effectId = this.wingMap.get(playerId);
            EffectService.stop(effectId);
        }
        let wing = GameConfig.Wing.getElement(id);
        if (wing.WingGuid == null) return;
        let player = await Player.asyncGetPlayer(playerId);
        effectId = GeneralManager.rpcPlayEffectOnPlayer(wing.WingGuid, player, mw.HumanoidSlotType.BackOrnamental,
            0, wing.WingOffset, new mw.Rotation(wing.WingRotation), wing.WingScale);
        this.wingMap.set(playerId, effectId);
    }

    /**本客户端同步其他客户端的翅膀数据 */
    private syncWing(wingPlayerIds: number[], wingIds: number[]): void {
        let playerCount = wingPlayerIds.length;
        --playerCount;
        this.equipWing(wingPlayerIds[playerCount], wingIds[playerCount]);
        let intervalId = TimeUtil.setInterval(() => {
            --playerCount;
            if (playerCount < 0) {
                TimeUtil.clearInterval(intervalId);
                return;
            }
            this.equipWing(wingPlayerIds[playerCount], wingIds[playerCount]);
            Console.error("[我看看你执行几次]");
        }, 0.1);
    }

    /**是否可以飞 */
    private isCanFly: boolean = true;
    /**是否可以飞 */
    public get IsCanFly(): boolean {
        return this.isCanFly;
    }
    /**是否可以飞 */
    public set IsCanFly(isCanFly: boolean) {
        this.isCanFly = isCanFly;
    }

    /**是否正在飞行 */
    private isFlying: boolean = false
    /**是否正在飞行 */
    public get IsFlying(): boolean {
        return this.isFlying;
    }
    /**是否正在飞行 */
    public set IsFlying(isFlying: boolean) {
        this.isFlying = isFlying;
    }

    /**切换飞行或行走状态 */
    private switchToFlyingOrWalking(): void {
        this.localPlayer.character.switchToFlying();
        this.hudPanel.updateFlyCD();
        TimeUtil.delaySecond(GlobalData.wingFlyTime).then(() => {
            this.localPlayer.character.switchToWalking();
            this.hudPanel.updateFlyButtonCD();
        });
    }

    /**翅膀是否可以使用 */
    private wingIsCanFly(isCanFly: boolean): void {
        this.IsCanFly = isCanFly;
    }
    /**---------------------------------【翅膀】--------------------------------- */
    //#endregion

    //#region 拖尾特效
    /**------------------------------【拖尾特效】------------------------------*/
    /**储存所有所有客户端的拖尾特效 */
    private tailEffectMap: Map<number, number> = new Map<number, number>();

    /**拾取拖尾特效 */
    public pickUptailEffect(id: number): void {
        this.achievementModuleC.onExecuteAchievementAction.call(15, 1);
        this.shopModuleC.useTailCloseShopPanel();
        this.server.net_pickTailEffect(id);
    }

    /**拾取拖尾特效（所有客户端） */
    public net_pickUpTailEffect(playerId: number, id: number): void {
        this.equiptailEffect(playerId, id);
    }

    /**玩家进入游戏同步其他玩家身上的拖尾特效 */
    private snycTailEffect(tailEffectplayerIds: number[], tailEffectIds: number[]): void {
        let playerCount = tailEffectplayerIds.length;
        --playerCount;
        this.equiptailEffect(tailEffectplayerIds[playerCount], tailEffectIds[playerCount]);
        let intervalId = TimeUtil.setInterval(() => {
            --playerCount;
            if (playerCount < 0) {
                TimeUtil.clearInterval(intervalId);
                return;
            }
            this.equiptailEffect(tailEffectplayerIds[playerCount], tailEffectIds[playerCount]);
            Console.error("[我看看你执行几次]");
        }, 0.1);
    }

    /**玩家离开游戏删除拖尾特效 */
    private exitGameDeletetailEffect(playerId: number): void {
        if (this.tailEffectMap.has(playerId)) {
            EffectService.stop(this.tailEffectMap.get(playerId));
            this.tailEffectMap.delete(playerId);
        }
    }

    /**装备拖尾特效 */
    private async equiptailEffect(playerId: number, id: number): Promise<void> {
        let effectId: number = null;
        if (this.tailEffectMap.has(playerId)) {
            effectId = this.tailEffectMap.get(playerId);
            EffectService.stop(effectId);
        }
        let tail = GameConfig.Tail.getElement(id);
        if (tail.TailGuid == null) return;
        let player = await Player.asyncGetPlayer(playerId);
        effectId = GeneralManager.rpcPlayEffectOnPlayer(tail.TailGuid, player, mw.HumanoidSlotType.BackOrnamental,
            0, tail.TailOffset, new mw.Rotation(tail.TailRotation), tail.TailScale);
        this.tailEffectMap.set(playerId, effectId);
    }
    /**------------------------------【拖尾特效】------------------------------*/
    //#endregion

    //#region 攻击
    /**------------------------------【武器-攻击】------------------------------*/
    /**当前客户端所持有的武器ID */
    private weaponId: number = 1;
    /**攻击事件 */
    public onAttackAction: Action = new Action();
    /**更新当前武器CD */
    public onUpdateAttackCD: Action1<number> = new Action1<number>();

    /**初始化武器数据 */
    private initWeaponData(): void {
        let weapon = GameConfig.Weapon.getElement(this.weaponId);
        this.onUpdateAttackCD.call(Number(weapon.WeaponCD));
        this.baseAttackValue = weapon.HurtValue;
    }

    /**攻击 */
    private attack(): void {
        this.server.net_playAniEffSound(this.weaponId);
        let weapons = GameConfig.Weapon.getElement(this.weaponId);
        let attackDelayTime = weapons.AttackDelayTime;
        TimeUtil.delaySecond(Number(attackDelayTime)).then(() => {
            this.attackDetection(weapons);
        });

        this.localPlayer.character.movementEnabled = false;
        TimeUtil.delaySecond(Number(weapons.AttackTime)).then(() => {
            this.localPlayer.character.movementEnabled = true;
        });
    }

    /**攻击检测 */
    private attackDetection(weapons: IWeaponElement): void {
        let goList: mw.GameObject[] = [];
        let attackType = weapons.AttackType;
        switch (attackType) {
            case AttackType.RectangleDetection:
                goList = this.rectangleDetection(weapons);
                break;
            case AttackType.CircularDetection:
                goList = this.circularDetection(weapons);
                break;
            case AttackType.CylindricalDetection:
                goList = this.cylindricalDetection(weapons);
                break;
            default:
                Console.error("attackType = " + attackType + "|[检测类型数据出错了]");
                break;
        }
        Console.error("[len]:" + goList.length);
        if (goList.length == 0) return;
        let playerIds: number[] = [];
        let aiIds: string[] = [];
        for (const go of goList) {
            if (PlayerManagerExtesion.isCharacter(go)) {
                let char = go as mw.Character;
                let playerId = char.player.playerId;
                if (char.player.playerId == this.localPlayerId) continue;
                playerIds.push(playerId);
                this.flyText(weapons.HurtValue + this.curAttackValue, char.worldTransform.position, true);
            }
            if (!go || !go.gameObjectId) continue;
            if (go.tag == "Boss" && go instanceof mw.Character) {
                this.flyText(weapons.HurtValue + this.curAttackValue, go.worldTransform.position, true);
                PrefabEvent.PrefabEvtFight.hurt(this.localPlayer.userId, go.gameObjectId, weapons.HurtValue + this.curAttackValue);
            }
        }
        Console.error("[playerIds.Length] " + playerIds.length);
        if (playerIds.length == 0 && aiIds.length == 0) return;
        this.server.net_attackPlayer(playerIds, aiIds, weapons.ImpulseValue, weapons.HurtValue + this.curAttackValue, this.weaponId);
    }
    private exp: number = 0;
    private flyText(damage: number, hitPoint: mw.Vector, isSelf: boolean = false): void {
        let fontColor: mw.LinearColor[] = Utils.randomColor();
        FlyText.instance.showFlyText("-" + damage, hitPoint, fontColor[0], fontColor[1]);
        if (!isSelf) return;
        ExplosiveCoins.instance.explosiveCoins(new mw.Vector(hitPoint.x, hitPoint.y, hitPoint.z / 2), damage, Utils.getRandomInteger(5, 10));
        this.exp++;
        this.hudPanel.mExpProgressBar.currentValue = this.exp / 50;
        if (this.exp >= 50) {
            this.exp = 0;
            this.server.net_addLevel();
            this.setCurAttackValue(50);
            this.setMaxHp(500);
            this.shopModuleC.playEffectAndSoundToPlayer(1);
        }
    }

    public net_FlyText(hp: number): void {
        this.flyText(hp, this.localPlayer.character.worldTransform.position);
    }

    /**矩形检测 */
    private rectangleDetection(weapons: IWeaponElement): mw.GameObject[] {
        let startLocation = this.localPlayer.character.worldTransform.position;
        let forwardVector = this.localPlayer.character.worldTransform.getForwardVector();
        let forwardMultiply = forwardVector.multiply(weapons.AttackRange[0]);
        let endLocation = new mw.Vector(startLocation.x + forwardMultiply.x, startLocation.y + forwardMultiply.y, startLocation.z + forwardMultiply.z);
        let goList = GeneralManager.modiftboxOverlap(startLocation, endLocation, weapons.AttackRange[1], weapons.AttackRange[2], mw.SystemUtil.isPIE);
        return goList;
    }

    /**圆形检测 */
    private circularDetection(weapons: IWeaponElement): mw.GameObject[] {
        let playerLoc = this.localPlayer.character.worldTransform.position;
        let forwardVector = this.localPlayer.character.worldTransform.getForwardVector();
        let forwardMultiply = forwardVector.multiply(weapons.AttackRange[0]);
        let startLocation = new mw.Vector(playerLoc.x + forwardMultiply.x, playerLoc.y + forwardMultiply.y, playerLoc.z + forwardMultiply.z + weapons.AttackRange[1]);
        let goList = QueryUtil.sphereOverlap(startLocation, weapons.AttackRange[2], mw.SystemUtil.isPIE);
        return goList;
    }

    /**圆柱形检测 */
    private cylindricalDetection(weapons: IWeaponElement): mw.GameObject[] {
        let playerLoc = this.localPlayer.character.worldTransform.position;
        let forwardVector = this.localPlayer.character.worldTransform.getForwardVector();
        let forwardMultiply = forwardVector.multiply(weapons.AttackRange[0]);
        let startLocation = new mw.Vector(playerLoc.x + forwardMultiply.x, playerLoc.y + forwardMultiply.y, playerLoc.z + forwardMultiply.z);
        let goList = QueryUtil.capsuleOverlap(startLocation, weapons.AttackRange[1], weapons.AttackRange[2], mw.SystemUtil.isPIE);
        return goList;
    }

    /**播放攻击动画、特效、音效（服务端同步给所有客户端执行某个客户端的攻击表现） */
    public net_playAniEffSound(playerId: number, weaponId: number): void {
        this.playAniEffSound_StoC(playerId, weaponId);
    }

    /**播放攻击动画、特效、音效（服务端同步给所有客户端执行某个客户端的攻击表现） */
    private async playAniEffSound_StoC(playerId: number, weaponId: number): Promise<void> {
        let player = await Player.asyncGetPlayer(playerId);
        let weapons = GameConfig.Weapon.getElement(weaponId);

        if (!weapons.AttackAnimationId) return;

        if (player && player.character) player.character.loadAnimation(weapons.AttackAnimationId).play();
        let startLocation = player.character.worldTransform.position;
        let forwardVector = player.character.worldTransform.getForwardVector();
        let forwardMultiply = forwardVector.multiply(weapons.EffectOffset);
        let offset = new mw.Vector(startLocation.x + forwardMultiply.x, startLocation.y + forwardMultiply.y, startLocation.z + forwardMultiply.z);
        let tmpRot = new mw.Rotation(forwardVector, mw.Vector.zero);
        let rot = new mw.Rotation(tmpRot.x + weapons.EffectRot.x, tmpRot.y + weapons.EffectRot.y, tmpRot.z + weapons.EffectRot.z);
        TimeUtil.delaySecond(Number(weapons.AttackDelayTime)).then(async () => {
            GeneralManager.rpcPlayEffectAtLocation(
                weapons.AttackEffectId,
                offset,
                1,
                rot,
                weapons.EffectScale
            );
            SoundService.play3DSound(weapons.AttackSound, player.character);
        });
    }

    /**播放受击特效 */
    public net_playHitEffect(playerIds: number[], weaponId: number): void {
        this.playHitEffect_StoC(playerIds, weaponId);
    }

    /**播放受击特效 */
    public async playHitEffect_StoC(playerIds: number[], weaponId: number): Promise<void> {
        let weapon = GameConfig.Weapon.getElement(weaponId);
        for (const playerId of playerIds) {
            let player = await Player.asyncGetPlayer(playerId);
            GeneralManager.rpcPlayEffectOnPlayer(
                weapon.HitEffect,
                player,
                mw.HumanoidSlotType.Root,
                1,
                weapon.HitEffectOffset,
                new mw.Rotation(weapon.HitEffectRot),
                weapon.HitEffectScale
            );
            if (weapon.HitSound == null ||
                player == undefined || player == null ||
                player.character == undefined || player.character == null) continue;
            SoundService.play3DSound(
                weapon.HitSound,
                player.character,
                1,
                10000
            );
        }
    }
    //#endregion

    //#region 武器拾取
    /**每个客户端都存储所有玩家的武器 */
    private weaponModelMap: Map<number, mw.GameObject> = new Map<number, mw.GameObject>();

    /**拾取武器 */
    public pickUpWeapon(id: number): void {
        if (this.weaponId == id) return;
        this.weaponId = id;
        let weapon = GameConfig.Weapon.getElement(id);
        this.onUpdateAttackCD.call(Number(weapon.WeaponCD));
        this.baseAttackValue = weapon.HurtValue;
        this.hudPanel.mAttackText.text = "攻击力：" + (this.baseAttackValue + this.curAttackValue);
        this.achievementModuleC.onExecuteAchievementAction.call(12, 1);
        this.shopModuleC.useWeaponCloseShopPanel();
        this.server.net_pickUpWeapon(id);
    }

    /**拾取武器（服务端通知所有客户端） */
    public net_pickUpWeapon(playerId: number, id: number): void {
        this.destoryWeapon(playerId);
        this.spawnWeapon(playerId, id);
    }

    /**进入房间的玩家同步其他玩家所持有武器数据(服务端通知本客户端) */
    private syncWeaponData(weaponPlayerIds: number[], weaponIds: number[]): void {
        if (weaponPlayerIds.length == 0) return;
        for (let i = 0; i < weaponPlayerIds.length; ++i) {
            let player = Player.getPlayer(weaponPlayerIds[i]);
            let playerId = player.playerId;
            this.spawnWeapon(playerId, weaponIds[i]);
        }
    }

    /**离开房间的玩家同步其他玩家所持有武器数据(服务端通知所有客户端) */
    private exitGameDeleteWeapon(playerId: number): void {
        this.destoryWeapon(playerId);
    }

    /**销毁武器 */
    private destoryWeapon(playerId: number): void {
        if (this.weaponModelMap.has(playerId)) {
            mwext.GameObjPool.despawn(this.weaponModelMap.get(playerId));
            this.weaponModelMap.delete(playerId);
        }
    }

    /**生成武器 */
    private spawnWeapon(playerId: number, id: number): void {
        let modelGuid = GameConfig.Weapon.getElement(id).WeaponGuid;
        if (!modelGuid) return;
        let weaponModel = SpawnManager.modifyPoolSpawn(modelGuid);
        weaponModel.asyncReady().then(async () => {
            let player = await Player.asyncGetPlayer(playerId);
            if (!player.character) return;
            player.character.attachToSlot(weaponModel, mw.HumanoidSlotType.RightHand);
            weaponModel.localTransform.position = (mw.Vector.zero);
            weaponModel.localTransform.rotation = (mw.Rotation.zero);
            weaponModel.worldTransform.scale = (mw.Vector.one);
            this.weaponModelMap.set(playerId, weaponModel);
            Console.error("playerId = " + playerId + " 的玩家已使用guid = " + modelGuid + " 的武器");
        });
    }
    /**------------------------------【武器】------------------------------*/
    //#endregion

    //#region 属性
    private ads(): void {
        if (GlobalData.isOpenIAA) {
            this.adTips.showAdTips(1, AdType.AdsReward);
        }
        else {
            this.adsReward();
        }
    }
    public adsReward(): void {
        let index = Utils.getRandomInteger(0, 4);
        switch (index) {
            case 0:
                this.setCurAttackValue(100);
                break;
            case 1:
                this.setMaxHp(500);
                break;
            case 2:
                this.setMaxMoveSpeed(25);
                break;
            case 3:
                this.setMaxFlySpeed(25);
                break;
            case 4:
                this.setMaxJumpHeight(25);
                break;
            default:
                break;
        }
        this.achievementModuleC.ach(1);
        this.server.net_addLevel();
        this.shopModuleC.playEffectAndSoundToPlayer(1);
    }
    public firstGame(): void {
        this.server.net_addLevel1();
        this.shopModuleC.playEffectAndSoundToPlayer(1);
    }
    public firstGame2(): void {
        this.server.net_addLevel2();
        this.shopModuleC.playEffectAndSoundToPlayer(1);
    }
    public addLv(lv: number): void {
        this.server.net_addLevel3(lv);
        this.shopModuleC.playEffectAndSoundToPlayer(1);
    }
    public net_killAch(): void {
        this.achievementModuleC.onExecuteAchievementAction.call(5, 1);
    }
    private maxHp: number = 100;
    private baseAttackValue: number = 0;
    private curAttackValue: number = 0;
    private curMaxMoveSpeed: number = 0;//450
    private curMaxFlySpeed: number = 0;//800
    private curMaxJumpHeight: number = 0;//100
    /**初始化玩家数据 */
    private initPlayerData(): void {
        this.curMaxMoveSpeed = this.localPlayer.character.maxWalkSpeed;
        this.curMaxFlySpeed = this.localPlayer.character.maxFlySpeed;
        this.curMaxJumpHeight = this.localPlayer.character.maxJumpHeight;
        this.maxHp = this.data.maxHp;
        this.curAttackValue = this.data.hurt;
        this.initPlayerHUDPanel();
    }

    /**初始化HUDPanel */
    private initPlayerHUDPanel(): void {
        this.hudPanel.mHpText.text = "最大生命值：" + this.maxHp;
        this.hudPanel.mAttackText.text = "攻击力：" + (this.baseAttackValue + this.curAttackValue);
        this.hudPanel.mMoveSpeedText.text = "移动速度：" + this.curMaxMoveSpeed;
        this.hudPanel.mFlySpeedText.text = "飞行速度：" + this.curMaxFlySpeed;
        this.hudPanel.mJumpHeightText.text = "跳跃高度：" + this.curMaxJumpHeight;
    }

    /**设置最大血量 */
    public setMaxHp(hpValue: number): void {
        // if (this.maxHp >= 999) return;
        this.maxHp += hpValue;
        this.hudPanel.mHpText.text = "最大生命值：" + this.maxHp;
        this.shopModuleC.playEffectAndSoundToPlayer(3);
        this.server.net_setMaxHp(this.maxHp);
    }

    /**设置当前血量 */
    public setCurHp(curHp: number): void {
        this.shopModuleC.playEffectAndSoundToPlayer(3);
        this.server.net_setCurHp(curHp);
    }

    /**设置当前攻击力 */
    public setCurAttackValue(curAttackValue: number): void {
        // if (this.curAttackValue >= 999) return;
        this.curAttackValue += curAttackValue;
        this.hudPanel.mAttackText.text = "攻击力：" + (this.baseAttackValue + this.curAttackValue);
        this.shopModuleC.playEffectAndSoundToPlayer(3);
        this.server.net_setCurAttackValue(this.curAttackValue);
    }

    /**设置最大移动速度 */
    public setMaxMoveSpeed(addMoveSpeed: number): void {
        if (this.curMaxMoveSpeed >= 999) return;
        this.curMaxMoveSpeed += addMoveSpeed;
        this.hudPanel.mMoveSpeedText.text = "移动速度：" + this.curMaxMoveSpeed;
        this.localPlayer.character.maxWalkSpeed = this.curMaxMoveSpeed;
        this.shopModuleC.playEffectAndSoundToPlayer(3);
    }

    /**设置最大飞行速度 */
    public setMaxFlySpeed(addFlySpeed: number): void {
        if (this.curMaxFlySpeed >= 1500) return;
        this.curMaxFlySpeed += addFlySpeed;
        this.hudPanel.mFlySpeedText.text = "飞行速度：" + this.curMaxFlySpeed;
        this.localPlayer.character.maxFlySpeed = this.curMaxFlySpeed;
        this.shopModuleC.playEffectAndSoundToPlayer(3);
    }

    /**设置最大跳跃高度 */
    public setMaxJumpHeight(addJumpHeight: number): void {
        if (this.curMaxJumpHeight >= 999) return;
        this.curMaxJumpHeight += addJumpHeight;
        this.hudPanel.mJumpHeightText.text = "跳跃高度：" + this.curMaxJumpHeight;
        this.localPlayer.character.maxJumpHeight = this.curMaxJumpHeight;
        this.shopModuleC.playEffectAndSoundToPlayer(3);
    }
    //#endregion

    //#region jump
    private currentJumpTime: number = 0;
    private secondJumpAniID: string = "150691";
    private grilStompingEffect: string = "132627";
    private boyStompingEffect: string = "130743";
    private landingEffects: string[] = ["89128", "89129", "89130"];
    private landingEffectId: string = "89089";
    private landingSoundId: string = "122568";
    private girlJumpSoundId: string = "101208";
    private boyJumpSoundId: string = "121734";
    private isStartTime: boolean = false;
    private playerScale: number = 1;
    /**
     * 更新跳跃状态
     * @param dt 
     * @returns 
     */
    private updateJumpTime(dt: number): void {
        if (!this.isStartTime) return;
        if (!this.localPlayer.character.isJumping) {
            this.currentJumpTime = 0;
            this.isStartTime = false;

            let effectId = this.landingEffects[Utils.getRandomInteger(0, 2)];
            let startLoc = this.localPlayer.character.worldTransform.position;
            let capsuleHalfHeight = this.localPlayer.character.collisionExtent.z / 2;
            let effectOffset = new mw.Vector(startLoc.x, startLoc.y, startLoc.z - capsuleHalfHeight * this.playerScale);
            this.server.net_playLandEffectAndSound([effectId, this.landingEffectId], effectOffset, this.landingSoundId, this.playerScale);
        }
    }

    /**
     * JUmp
     * @returns 
     */
    private playerJump(): void {
        if (this.localPlayer.character.isJumping && this.currentJumpTime >= 2) return;
        this.currentJumpTime++;
        if (this.currentJumpTime == 2) {
            PlayerManagerExtesion.rpcPlayAnimation(this.localPlayer.character, this.secondJumpAniID, 1)
            let stompingEffectId: string = "";
            let soundId: string = ""
            if (this.IsGirl()) {
                soundId = this.girlJumpSoundId;
                stompingEffectId = this.grilStompingEffect;
            } else {
                soundId = this.boyJumpSoundId;
                stompingEffectId = this.boyStompingEffect;
            }
            this.server.net_playStompingEffectAndSound(stompingEffectId, soundId, this.playerScale);
        }
        this.localPlayer.character.jump();
        this.isStartTime = true;
    }

    /**
     * 判断是否是女    
     * @returns 
     */
    private IsGirl(): boolean {
        let somatotype = Player.localPlayer.character.description.advance.base.characterSetting.somatotype;
        if (somatotype == mw.SomatotypeV2.AnimeFemale
            || somatotype == mw.SomatotypeV2.LowpolyAdultFemale
            || somatotype == mw.SomatotypeV2.RealisticAdultFemale
            || somatotype == mw.SomatotypeV2.CartoonyFemale) return true;
        return false;
    }
    //#endregion
}

enum AttackType {
    /**矩形检测 */
    RectangleDetection = 1,
    /**圆形检测 */
    CircularDetection = 2,
    /**圆柱形检测 */
    CylindricalDetection = 3,
}