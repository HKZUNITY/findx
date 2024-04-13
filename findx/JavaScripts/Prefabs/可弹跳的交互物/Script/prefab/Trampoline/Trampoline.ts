import { GeneralManager, } from '../../../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../../../Modified027Editor/ModifiedPlayer';
import Console from "../../../../../Tools/Console";
import { GameConfig } from "../../../../../config/GameConfig";
import { TrampolineConfig } from "../../../../../config/Trampoline";
import { Utils } from '../../../../../Tools/utils';

/*
 * @Author: 侯凯召
 * @QQ邮箱: 3046916186@qq.com
 * @Date: 2023-01-29 16:42:08
 * @LastEditors: 穿迷彩服的鲨鱼
 * @LastEditTime: 2023-02-03 11:50:19
 * @Description: 蹦床
 * @FilePath: \Demo\JavaScripts\prefab\Trampoline\Trampoline.ts
 */
@Component
export default class Trampoline extends mw.Script {
    @mw.Property({ displayName: "基础跳跃冲量", group: "脚本属性" })
    private baseFallMultiplyNum: number = 2000;

    @mw.Property({ displayName: "基础冲击数", group: "脚本属性" })
    private baseMultiplyNum: number = 300;

    @mw.Property({ displayName: "冲击半径", group: "脚本属性" })
    private impactRadius: number = 100;

    private trampoline: TrampolineConfig = null;
    private trampolineLen: number = 0;
    /**冲击时要显示的UI */
    private impactUI: string = "6A16F210463EEA916B51EC9E36852260";

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        // await this.onPreloadAssetsChangedInEditor();
        this.trampoline = GameConfig.Trampoline;
        this.trampolineLen = this.trampoline.getAllElement().length;
        if (mw.SystemUtil.isClient()) {
            this.onStartC();
        }
        if (mw.SystemUtil.isServer()) {
            this.onStartS();
        }
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) {
            this.onUpdateC(dt);
        }
        if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }

    /** 当预加载资源改动的时候自动调用此函数 */
    // public onPreloadAssetsChangedInEditor() {
    //     for (let key in TrampolineRescourse) {
    //         let keyToAny: any = key;
    //         if (isNaN(keyToAny)) {
    //             let trampolineRescourse: any = TrampolineRescourse[key];
    //             let trampolineRescourseEnum: TrampolineRescourse = trampolineRescourse;
    //             Utils.downloadAsset(trampolineRescourseEnum);
    //         }
    //     }
    // }

    /**------------------------------------------- 客户端 ------------------------------------------------ */
    private playerC: mw.Player = null;
    /**需要变化的模型 */
    private trampolineModelsC: mw.GameObject[] = [];
    private ignoreAreaC: OBB[] = [];
    private capsuleRadius = 30;

    /**玩家世界UIMap */
    private playersRadiusUI: Map<number, mw.GameObject> = new Map<number, mw.GameObject>();

    /**客户端的onStart */
    private onStartC(): void {
        this.initDataC();
        this.registerEventsC();
        this.useUpdate = true;
    }

    /**初始化数据（客户端） */
    private async initDataC(): Promise<void> {
        // this.loadRescourseC();
        this.findGameObjectsC();
        this.playerC = await Player.asyncGetLocalPlayer();
        this.playerC.character.driftControl = 0.5;
        Console.error("[更新下落控制成功]");
    }

    /**加载资源（客户端） */
    // private async loadRescourseC(): Promise<void> {
    //     for (let key in TrampolineRescourse) {
    //         let keyToAny: any = key;
    //         if (isNaN(keyToAny)) {
    //             let launcherRescourse: any = TrampolineRescourse[key];
    //             let launcherRescourseEnum: TrampolineRescourse = launcherRescourse;
    //             await this.downloadRes(launcherRescourseEnum);
    //             Console.error("launcherRescourseEnum--" + launcherRescourseEnum);
    //         }
    //     }
    // }

    /**根据object的guid find到它（客户端） */
    private async findGameObjectsC(): Promise<void> {
        if (this.trampolineLen > 0) {
            for (let i = 0; i < this.trampolineLen; ++i) {
                let trampolineModel = await GameObject.asyncFindGameObjectById(this.trampoline.getElement(i + 1).ModelGuid);
                this.trampolineModelsC.push(trampolineModel);
                this.createShakeOBBC(trampolineModel, i);
            }
        }
    }

    /**创建蹦床中间区域判定(客户端) */
    private createShakeOBBC(trampolineModel: mw.GameObject, index: number) {
        let PointX = trampolineModel.worldTransform.scale.x * 100 + this.capsuleRadius;
        let PointY = trampolineModel.worldTransform.scale.y / 1.5 * 100 + this.capsuleRadius;
        let center = new mw.Vector2(trampolineModel.worldTransform.position.x, trampolineModel.worldTransform.position.y);
        this.ignoreAreaC[index] = new OBB(center, trampolineModel.worldTransform.getForwardVector(), trampolineModel.worldTransform.getRightVector(), PointX, PointY);
    }

    /**注册事件&监听事件（客户端） */
    private registerEventsC(): void {
        Event.addServerListener(ListenerEventsType.ServerToAllClient_Shake, this.modelShakeVFXAndSFXC.bind(this));

        Event.addServerListener(ListenerEventsType.ServerToAllClient_ShowRadiusUI, this.showRadiusUIC.bind(this));
        Event.addServerListener(ListenerEventsType.ServerToAllClient_HideRadiusUI, this.hideRadiusUIC.bind(this));
    }

    /**客户端的Update */
    private onUpdateC(dt: number): void {
        try {
            this.playersRadiusUI.forEach((value, key) => {
                let player = Player.getPlayer(key);
                if (!player || !player.character || player.character.velocity.z >= 0) return;
                this.lineTraceCheck(player, value);
            });
        } catch (error) {
        }
    }

    /**射线检测更新世界UI位置(客户端) */
    private lineTraceCheck(player: mw.Player, radiusUI: mw.GameObject): void {
        const downVec = player.character.worldTransform.getUpVector().clone().multiply(-1);
        const loc = player.character.worldTransform.position;
        const goArr = QueryUtil.lineTrace(loc, loc.clone().add(downVec.multiply(500000)), true, false);
        for (let index = 0; index < goArr.length; index++) {
            const element = goArr[index];
            // Console.error("[element]:" + element.gameObject.name);
            if ((PlayerManagerExtesion.isCharacter(element.gameObject))) continue;
            if (element.gameObject.name == "BP_MWSysUIWidget") continue;
            if (element.gameObject.name == "世界UI") continue;
            if (element.gameObject.name == "蹦床") {
                if (radiusUI.getVisibility())
                    radiusUI.setVisibility(mw.PropertyStatus.Off);
                return;
            };
            if (!radiusUI.getVisibility())
                radiusUI.setVisibility(mw.PropertyStatus.On);
            radiusUI.worldTransform.position = element.position.clone().add(mw.Vector.up.multiply(10));
            return;
        }
    }

    /**模型震动时的视觉和听觉效果（客户端） */
    private modelShakeVFXAndSFXC(playerId: number, triggerIndex: number): void {
        this.playSoundAndEffectC(playerId, triggerIndex);
        this.modelShakeC(triggerIndex);
    }

    /**播放音效和特效（客户端） */
    private playSoundAndEffectC(playerId: number, triggerIndex: number): void {
        if (this.playerC.playerId == playerId) {
            mw.SoundService.playSound(TrampolineRescourse.TrampolineSound, 1, 100);
        }
        else {
            mw.SoundService.play3DSound(TrampolineRescourse.TrampolineSound,
                this.trampolineModelsC[triggerIndex].worldTransform.position, 1, 100);
        }
    }

    /**玩家进入触发器震动模型（客户端） */
    private modelShakeC(triggerIndex: number): void {
        let baseScale = this.trampolineModelsC[triggerIndex].worldTransform.scale;
        let curPlayerPos = this.playerC.character.worldTransform.position;
        let playerLoc2 = new mw.Vector2(curPlayerPos.x, curPlayerPos.y);
        if (this.ignoreAreaC[triggerIndex].containsPoint(playerLoc2)) {
            new mw.Tween({ time: 0 })
                .to({ time: 1 }, 1000)
                .onUpdate((obj) => {
                    let z = this.shakeFunc(obj.time, 100, 6, 5) * 8;
                    let worldScale = new mw.Vector(baseScale.x, baseScale.y, baseScale.z + z);
                    this.trampolineModelsC[triggerIndex].worldTransform.scale = worldScale;
                })
                .start();
        } else {
            let curTrampolinePos = this.trampolineModelsC[triggerIndex];
            let modelLoc2 = new mw.Vector2(curTrampolinePos.worldTransform.position.x, curTrampolinePos.worldTransform.position.y);
            let loc = modelLoc2.subtract(playerLoc2);
            loc = loc.normalized;
            let changeRot = new mw.Rotation(new mw.Vector(loc.x, loc.y, 0));
            new mw.Tween({ time: 0 })
                .to({ time: 1 }, 1000)
                .onUpdate((obj) => {
                    let x = this.shakeFunc(obj.time, 100, 6, 5) * 100 * changeRot.y;
                    let y = this.shakeFunc(obj.time, 100, 6, 5) * 100 * changeRot.x;
                    let rot = new mw.Rotation(x, y, changeRot.z);
                    this.trampolineModelsC[triggerIndex].localTransform.rotation = (rot);
                })
                .start();
        }
    }

    /**显示冲击指示范围UI（客户端） */
    private showRadiusUIC(playerId: number, number: number): void {
        if (!this.playersRadiusUI.has(playerId)) this.createRadiusUIC(playerId);
        let radiusUI = this.playersRadiusUI.get(playerId);
        radiusUI.worldTransform.scale = mw.Vector.one.multiply(number * 2 / 100);
        radiusUI.setVisibility(mw.PropertyStatus.Off);
    }

    /**Create世界UI并刷新（客户端） */
    private createRadiusUIC(playerId: number): void {
        let uiWidget = SpawnManager.modifyPoolSpawn("UIWidget") as mw.UIWidget;
        uiWidget.setUIbyID(this.impactUI);
        uiWidget.pivot = mw.Vector2.one.multiply(0.5);
        uiWidget.drawSize = mw.Vector2.one.multiply(100);
        uiWidget.localTransform.rotation = (new mw.Rotation(0, 90, 0));
        uiWidget.widgetSpace = mw.WidgetSpaceMode.World;
        uiWidget.setCollision(mw.PropertyStatus.Off);
        uiWidget.refresh();
        this.playersRadiusUI.set(playerId, uiWidget);
    }

    /**隐藏玩家身上的世界UI（客户端） */
    private hideRadiusUIC(playerId: number): void {
        let radiusUI = this.playersRadiusUI.get(playerId);
        if (!radiusUI) return;
        mwext.GameObjPool.despawn(radiusUI);
        this.playersRadiusUI.delete(playerId);
    }
    /**------------------------------------------- 客户端 ------------------------------------------------ */

    /**------------------------------------------- 服务端 ------------------------------------------------ */
    /**延迟触发（避免重复执行） */
    private cantEnterPlayerIdS: Set<number> = new Set();
    /**触发器 */
    private triggersS: mw.Trigger[] = [];
    /**玩家跳跃时间 */
    private playersJumpTimeS: Map<number, number> = new Map();
    /**计算玩家是否触地面 */
    private playerFlyAndFallMap: Map<number, boolean> = new Map<number, boolean>();
    /**飞行玩家的掉落特效 */
    private playerFallEffects: Map<number, number> = new Map<number, number>();
    /**悬空玩家的拖尾特效 */
    private playerTailEffectMap: Map<number, number[]> = new Map<number, number[]>();
    private playersImpactRadius: Map<number, number> = new Map();
    private ignoreAreaS: OBB[] = [];

    /**服务端的onStart */
    private onStartS(): void {
        this.initDataS();
        this.registerEventsS();
        this.useUpdate = true;
    }

    /**初始化数据（服务端） */
    private async initDataS(): Promise<void> {
        await this.findGameObjectsS();
        this.bindTriggerS();
    }

    /**注册事件&监听事件（服务端） */
    private registerEventsS(): void {
        Player.onPlayerLeave.add((player) => {
            let playerId = player.playerId;
            if (this.playerFlyAndFallMap.has(playerId)) {
                this.playerFlyAndFallMap.delete(playerId);
            }
            if (this.playersJumpTimeS.has(playerId)) {
                this.playersJumpTimeS.delete(playerId);
            }
            if (this.playersImpactRadius.has(playerId)) {
                this.playersImpactRadius.delete(playerId);
            }
        });
    }

    /**根据object的guid find到它（服务端） */
    private async findGameObjectsS(): Promise<void> {
        if (this.trampolineLen == 0) return;
        for (let i = 0; i < this.trampolineLen; ++i) {
            let trigger = (await GameObject.asyncFindGameObjectById(this.trampoline.getElement(i + 1).TriggerGuid)) as mw.Trigger;
            this.triggersS.push(trigger);
            this.createTouchOBBS(trigger, i);
        }
    }

    /**创建蹦床中间区域判定(客户端) */
    private createTouchOBBS(trigger: mw.Trigger, index: number) {
        let PointX = trigger.worldTransform.scale.x * 50 + this.capsuleRadius;
        let PointY = trigger.worldTransform.scale.y * 50 + this.capsuleRadius;
        let center = new mw.Vector2(trigger.worldTransform.position.x, trigger.worldTransform.position.y);
        this.ignoreAreaS[index] = new OBB(center, trigger.worldTransform.getForwardVector(), trigger.worldTransform.getRightVector(), PointX, PointY);
    }

    /**绑定触发器（服务端） */
    private bindTriggerS(): void {
        if (this.triggersS.length == 0) return;
        for (let i = 0; i < this.triggersS.length; ++i) {
            this.triggersS[i].onEnter.add((go) => {
                this.onEnterTriggerS(go, i);
            });
        }
    }

    /**进入触发器(服务端) */
    private onEnterTriggerS(go: mw.GameObject, triggerIndex: number): void {
        if (!(PlayerManagerExtesion.isCharacter(go))) return;
        let player = (go as mw.Character).player;
        if (player.character.movementMode == mw.MovementMode.Fly) return;
        let playerId = player.playerId;

        if (this.cantEnterPlayerIdS.has(playerId)) return;
        this.cantEnterPlayerIdS.add(playerId);
        mw.TimeUtil.delayExecute(() => {
            this.cantEnterPlayerIdS.delete(playerId);
        }, 20)
        Event.dispatchToClient(player, ListenerEventsType.ServerToAllClient_ShowJumpRecordUI, this.triggersS[triggerIndex].worldTransform.position.z);
        this.modelVisualEffectS(playerId, triggerIndex);
        this.playerFlyS(player);
        this.showRadiusUIS(playerId);
    }

    /**广播给房间内得客户端显示正在使用蹦床玩家得落点世界UI（服务端） */
    private showRadiusUIS(playerId: number): void {
        let num = this.impactRadius + 100 * this.playersJumpTimeS.get(playerId)
        this.playersImpactRadius.set(playerId, num);
        Event.dispatchToAllClient(ListenerEventsType.ServerToAllClient_ShowRadiusUI, playerId, num);
    }

    /**模型视觉效果（服务端） */
    private modelVisualEffectS(playerId: number, triggerIndex: number): void {
        Event.dispatchToAllClient(ListenerEventsType.ServerToAllClient_Shake, playerId, triggerIndex);
    }

    /**玩家进入触发器玩家原地起飞（服务端） */
    private playerFlyS(player: mw.Player): void {
        let playerId = player.playerId;
        let value = this.playersJumpTimeS.get(playerId);
        value = value ? value : 0;
        this.addPlayerImpulse(player, value);
        setTimeout(() => {
            this.playerFlyAndFallMap.set(playerId, false);
        }, 500);
        this.playersJumpTimeS.set(playerId, value + 1);
    }

    /**添加向上的冲量（服务端） */
    @RemoteFunction(mw.Client)
    private addPlayerImpulse(player: mw.Player, jumpTime: number) {
        let multiplyNum = this.baseFallMultiplyNum + 400 * jumpTime;
        multiplyNum = Math.min(multiplyNum, 13000);

        let velocityZ = (player.character.velocity.z * 1);
        multiplyNum = multiplyNum - velocityZ;

        player.character.addImpulse(mw.Vector.up.multiply(multiplyNum), true);
        // Console.error("[jumpTime]：" + jumpTime + "\n" + "[velocityZ]：" + velocityZ + "\n" + "[multiplyNum]：" + multiplyNum);
    }

    /**服务端的Update */
    private onUpdateS(dt: number): void {
        if (this.playerFlyAndFallMap.size > 0) {
            this.playerFlyAndFallMap.forEach((isFall, playerId) => {
                let player = Player.getPlayer(playerId);
                this.isTouchDownS(player);
                this.updatePlayerStateS(playerId, isFall);
            });
        }
    }

    /**判断玩家是否落地（服务端） */
    private isTouchDownS(player: mw.Player): void {
        if (player.character.isJumping) return;

        let playerPoint = new mw.Vector2(player.character.worldTransform.position.x, player.character.worldTransform.position.y)
        let isContainsPoint: boolean = false;
        for (let i = 0; i < this.ignoreAreaS.length; ++i) {
            if (this.ignoreAreaS[i].containsPoint(playerPoint)) {
                isContainsPoint = true;
                break;
            }
        }
        if (isContainsPoint) return;

        let playerId = player.playerId;
        this.playTouchDownVFSAndSFXS(playerId);
        this.spreadToOthersS(playerId);
        this.initPlayerDataS(playerId);
        Console.error("[落地]");
    }

    /**更新此时飞行玩家的行为（服务端） */
    private updatePlayerStateS(playerId: number, isFall: boolean): void {
        let player = Player.getPlayer(playerId);
        if (player.character.velocity.z <= 0 && isFall == true) {
            let animation = PlayerManagerExtesion.loadAnimationExtesion(player.character, TrampolineRescourse.Roll, true)
            animation.speed = animation.length / 0.4;
            animation.loop = 0;
            animation.play();
            this.playEffectS(playerId, this.playerFallEffects, TrampolineRescourse.SpinEffect, mw.HumanoidSlotType.Root,
                new mw.Vector(0, 0, 0), mw.Rotation.zero, new mw.Vector(2, 2, 2));
            this.playerFlyAndFallMap.set(playerId, false);
        }
        if (player.character.velocity.z > 0 && isFall == false) {
            let animation = PlayerManagerExtesion.loadAnimationExtesion(player.character, TrampolineRescourse.FlyUp, true)
            animation.speed = animation.length / 0.4;
            animation.loop = 0;
            animation.play();
            this.stopEffectS(playerId, this.playerFallEffects);
            this.playTailEffectS(playerId);
            this.playerFlyAndFallMap.set(playerId, true);
        }
    }

    /**播放触底音效和特效(服务端) */
    private playTouchDownVFSAndSFXS(playerId: number): void {
        let time = this.playersJumpTimeS.get(playerId);
        let effectId = time > 9 ? TrampolineRescourse.TrampolineN_bombFallsEffect : TrampolineRescourse.TrampolineStoneFallsEffect;
        let soundId = time > 9 ? TrampolineRescourse.TrampolineN_bombFallsSound : TrampolineRescourse.TrampolineStoneFallsSound;
        let scaleNum = Math.min(time * 0.2, 4);
        let effectScale = mw.Vector.one.multiply(scaleNum);

        let worldLocation = Player.getPlayer(playerId).character.worldTransform.position;
        GeneralManager.rpcPlayEffectAtLocation(effectId, worldLocation, 1,
            new mw.Rotation(0, 0, 0), effectScale);
        mw.SoundService.play3DSound(soundId, worldLocation, 1, 1000);
    }

    /**玩家触底时波及其他人（服务端） */
    private spreadToOthersS(playerId: number): void {
        let groundPlayer = Player.getPlayer(playerId);
        let time = this.playersJumpTimeS.get(playerId);
        let radius = this.playersImpactRadius.get(playerId);
        for (let player of Player.getAllPlayers()) {
            if (groundPlayer == player) continue;

            let dis = mw.Vector.distance(player.character.worldTransform.position, groundPlayer.character.worldTransform.position)
            if (dis > radius) continue;

            let vec = player.character.worldTransform.position.clone().subtract(groundPlayer.character.worldTransform.position).normalize();
            vec = vec.add(mw.Vector.up).normalize();
            let multiplyNum = (1 - (dis / radius)) * (Math.min(this.baseMultiplyNum + time * 200, 6000));
            player.character.addImpulse(vec.clone().multiply(multiplyNum), true);
        }
    }

    /**初始化数据 */
    private initPlayerDataS(playerId: number): void {
        this.playerFlyAndFallMap.delete(playerId);
        this.playersJumpTimeS.delete(playerId);
        this.playersImpactRadius.delete(playerId);
        this.stopEffectS(playerId, this.playerFallEffects);
        this.stopTailEffectS(playerId);
        let player = Player.getPlayer(playerId);
        PlayerManagerExtesion.rpcStopAnimation(player.character, TrampolineRescourse.Roll)
        Event.dispatchToAllClient(ListenerEventsType.ServerToAllClient_HideRadiusUI, playerId);
        Event.dispatchToClient(Player.getPlayer(playerId), ListenerEventsType.ServerToAllClient_HideJumpRecordUI);
    }

    /**播放特效（服务端） */
    private playEffectS(playerId: number, effectMap: Map<number, number>, effect: TrampolineRescourse, slotType: mw.HumanoidSlotType,
        offset?: mw.Vector, rotation?: mw.Rotation, scale?: mw.Vector): void {
        let player = Player.getPlayer(playerId);
        if (effectMap.has(playerId)) {
            let effectId = effectMap.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
            }
        }
        let playerEffectId = GeneralManager.rpcPlayEffectOnPlayer(effect, player,
            slotType, 0, new mw.Vector(0, 0, -60), new mw.Rotation(new mw.Vector(0, -90, 0)), mw.Vector.one.multiply(3));
        effectMap.set(playerId, playerEffectId);
    }

    /**停止播放特效（服务端） */
    private stopEffectS(playerId: number, effectMap: Map<number, number>): void {
        if (effectMap.has(playerId)) {
            let effectId = effectMap.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
                effectMap.set(playerId, null);
            }
        }
    }

    /**玩家悬空状态播放拖尾特效(服务端) */
    private playTailEffectS(playerId: number): void {
        if (this.playerTailEffectMap.has(playerId)) return;
        let player = Player.getPlayer(playerId);
        let tailEffectLeftFoot = GeneralManager.rpcPlayEffectOnPlayer(
            TrampolineRescourse.TrampolineEffect, player, mw.HumanoidSlotType.LeftFoot, 0);
        let tailEffectRightFoot = GeneralManager.rpcPlayEffectOnPlayer(
            TrampolineRescourse.TrampolineEffect, player, mw.HumanoidSlotType.RightFoot, 0);
        this.playerTailEffectMap.set(playerId, [tailEffectLeftFoot, tailEffectRightFoot]);
    }

    /**玩家触底后停止播放拖尾特效（服务端） */
    private stopTailEffectS(playerId: number): void {
        if (!this.playerTailEffectMap.has(playerId)) return;
        let tailEffect = this.playerTailEffectMap.get(playerId);
        for (let i = 0; i < tailEffect.length; ++i) {
            EffectService.stop(tailEffect[i]);
        }
        this.playerTailEffectMap.delete(playerId);
    }
    /**------------------------------------------- 服务端 ------------------------------------------------ */

    /**------------------------------------------- 通用 ------------------------------------------------ */

    /**
     * 震荡函数
     * @param x 
     * @param speed 震荡衰减/增益的速度
     * @param frequency 震荡的频率
     * @param amplitude 震荡的幅度
     * @returns 
     */
    private shakeFunc(x: number, speed: number, frequency: number, amplitude: number): number {
        return (Math.pow(speed, -x) * Math.sin(2 * frequency * Math.PI * x)) / amplitude;
    }

    /**资源下载 */
    // public async downloadRes(guid: string): Promise<boolean> {
    //     if (mw.AssetUtil.assetLoaded(guid)) {
    //         return true;
    //     }
    //     return await mw.AssetUtil.asyncDownloadAsset(guid);
    // }
}

export class OBB {
    center: mw.Vector2
    nx: mw.Vector2
    ny: mw.Vector2
    extents_x: number
    extents_y: number

    constructor(center: mw.Vector2, axisX: mw.Vector2, axisY: mw.Vector2, extentsX: number, extentsY: number) {
        this.center = center
        this.nx = axisX
        this.ny = axisY
        this.extents_x = extentsX
        this.extents_y = extentsY
    }

    containsPoint(point: mw.Vector2): boolean {
        let c2p = point.clone().subtract(this.center)
        let xBenchmark = Math.abs(this.dotV2(this.nx, this.nx.clone().multiply(this.extents_x)))
        let xTentative = Math.abs(this.dotV2(c2p, this.nx))
        if (xTentative >= xBenchmark) {
            return false
        }
        let yBenchmark = Math.abs(this.dotV2(this.ny, this.ny.clone().multiply(this.extents_y)))
        let yTentative = Math.abs(this.dotV2(c2p, this.ny))
        return yTentative < yBenchmark;
    }

    private dotV2(a: mw.Vector2, b: mw.Vector2) {
        return a.x * b.x + a.y * b.y
    }
}
/**客户端&服务端发送的事件类型 */
export enum ListenerEventsType {
    /**服务端发给所有客户端（模型震动） */
    ServerToAllClient_Shake = "ServerToAllClient_Shake",
    /**服务端发给所有客户端（显示落点UI） */
    ServerToAllClient_ShowRadiusUI = "ServerToAllClient_ShowRadiusUI",
    /**服务端发给所有客户端（隐藏落点UI） */
    ServerToAllClient_HideRadiusUI = "ServerToAllClient_HideRadiusUI",
    /**服务端发给指定客户端（显示JumpRecordUI） */
    ServerToAllClient_ShowJumpRecordUI = "ServerToAllClient_ShowJumpRecordUI",
    /**服务端发给所有客户端（隐藏JumpRecordUI） */
    ServerToAllClient_HideJumpRecordUI = "ServerToAllClient_HideJumpRecordUI",
}

export enum TrampolineRescourse {
    /**蹦床拖尾特效 */
    TrampolineEffect = "27392",
    /**蹦床石头落地特效 */
    TrampolineStoneFallsEffect = "57200",
    /**蹦床核弹落地特效 */
    TrampolineN_bombFallsEffect = "85150",
    /**玩家空中降落漩涡特效 */
    SpinEffect = "197224",
    /**----------------------------------------- */
    /**蹦床音效 */
    TrampolineSound = "14182",
    /**蹦床石头落地音效 */
    TrampolineStoneFallsSound = "27862",
    /**蹦床核弹落地音效 */
    TrampolineN_bombFallsSound = "39343",
    /**----------------------------------------- */
    /**蹦床上升动画 */
    FlyUp = "35401",
    /**翻滚下落动画 */
    Roll = "14736",
}
