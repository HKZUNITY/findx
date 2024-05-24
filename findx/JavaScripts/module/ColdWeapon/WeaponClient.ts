import { PlayerManagerExtesion } from "../../Modified027Editor/ModifiedPlayer";
import Console from "../../Tools/Console";
import { SkillRectCheck } from "./SkillRectCheck";
import { WeaponData, NodeInfo, AnimationInfo, NodeType } from "./WeaponDef";

/** 冷兵器客户端处理器 */
export abstract class WeaponClient extends WeaponData {
    // private allAniGuid: string[] = [];
    /** 当前动画索引 */
    private curAnimationIndex: number = 0;
    /** 当前动作索引 */
    private curActionIndex: number = 0;

    /** 是否可以连击 */
    private canCombo: boolean = false;

    /** 是否可以操作 */
    private canOper: boolean = true;

    /** 最后一次的播放动作信息 */
    private lastPlayInfo: NodeInfo = null;
    /** 最后一次播放的guid */
    private lastPlayGuid: string = "";

    /** 当前右手穿戴的装备 */
    @mw.Property({ replicated: true, onChanged: "client_OnChangeEquipWeaponRight" })
    protected equipRightWeaponGuid: string = "";

    /** 当前左手穿戴的装备 */
    @mw.Property({ replicated: true, onChanged: "client_OnChangeEquipWeaponLeft" })
    protected equipLeftWeaponGuid: string = "";

    /** 客户端右手穿戴的装备 */
    private clientEquipGo_Right: mw.GameObject = null;
    /** 客户端左手穿戴的装备 */
    private clientEquipGo_Left: mw.GameObject = null;

    /** 当前正在循环播放的特效 */
    private curPlayEffs: mw.Effect[] = [];

    private fightIdelAniGuid: string = "";
    private constFightingSec: number = 3;
    private fightingSec: number = 0;

    /**
     * 重新写入动画数据
     * @param jsonList 动画数据数组 每个json为一个动画
     */
    public async reWriteAnimationJson(jsonList: string[]) {
        this.animationJsons = [];
        this.animationJsons = jsonList;
        this.animationInfo = [];

        this.animationJsons.forEach(e => {

            let info = JSON.parse(e) as AnimationInfo;
            let newInfo = new AnimationInfo();

            if (info) {

                Object.keys(info).forEach(e => {

                    if (info[e] instanceof Object) {
                        return;
                    }
                    newInfo[e] = info[e];

                })

                info.infos.forEach(e => {
                    let nodeInfo = new NodeInfo();
                    Object.keys(e).forEach(k => {
                        nodeInfo[k] = e[k]
                    })
                    newInfo.infos.push(nodeInfo);
                })
                this.animationInfo.push(newInfo);
            } else {
                Console.error("解析json错误 : " + e);
            }
        })

        if (this.animationInfo.length != this.animationJsons.length) {
            Console.error("解析json错误 : 动画数量和解析数量不一致 : " + this.animationInfo.length + " = " + this.animationJsons.length);
        } else {
            for (let i = 0; i < this.animationInfo.length; i++) {
                let aniInfo = this.animationInfo[i];
                for (let j = 0; j < aniInfo.infos.length; j++) {
                    let info = aniInfo.infos[j];
                    if (info.guid == "") {
                        continue;
                    }
                    // if (mw.AssetUtil.assetLoaded(info.guid)) continue;
                    if (!mw.AssetUtil.assetLoaded(info.guid)) {
                        let res = await mw.AssetUtil.asyncDownloadAsset(info.guid);
                        // if (res) mw.AssetUtil.asyncDownloadAsset(info.guid);
                    }
                }
                if (aniInfo.charFightIdelAniId == "") {
                    continue;
                }
                // if (mw.AssetUtil.assetLoaded(aniInfo.charFightIdelAniId)) continue;
                if (!mw.AssetUtil.assetLoaded(aniInfo.charFightIdelAniId)) {
                    let res = await mw.AssetUtil.asyncDownloadAsset(aniInfo.charFightIdelAniId);
                    // if (res) mw.AssetUtil.assetLoaded(aniInfo.charFightIdelAniId);
                }
            }
        }

    }

    /**
     * 播放动画
     * @param index 动画索引
     * @param onComplate 动画播放完成回调,actionIndex:当前index,maxIndex:最大索引
     * @param onHit 打击点回调,actionIndex:当前动作索引,maxIndex:最大动作索引,hitObjs:受击对象列表(过滤自身)
     * @param onStartCombo 开始连击回调,milSec:可以连击的时间(毫秒)
     * @param onStartCharge 开始蓄力回调,actionIndex:当前动作索引,maxIndex:最大动作索引,endCharge:开发者主动触发,结束蓄力，参数是否蓄力成功
     * @returns 
     */
    public async playAnimation(index: number,
        onComplate: (actionIndex: number, maxIndex: number) => void,
        onHit: (actionIndex: number, maxIndex: number, hitObjs: mw.GameObject[]) => void,
        onStartCombo: (milSec: number) => void,
        onStartCharge: (actionIndex: number, maxIndex: number, endCharge: (isJoinNext: boolean) => void) => void
    ): Promise<boolean> {

        if (!this.canOper) {
            // Console.error("当前不能操作");
            return false;
        }

        if (!this.checkIndex(index)) {
            Console.error("索引出错 : " + index);
            return false;
        }

        this.stopAllTimer();
        this.allTimer = [];
        if (this.curAnimationIndex != index) {
            this.curActionIndex = 0;
            this.canOper = false;
            this.canCombo = false;
        } else if (this.canCombo) {
            //计算下一个动作索引
            let maxIndex = this.getActionLengthByAnimation(this.curAnimationIndex) - 1;
            let curIndex = this.curActionIndex;
            this.curActionIndex++;

            if (this.curActionIndex >= this.getActionLengthByAnimation(this.curAnimationIndex)) {
                this.curActionIndex = 0;
            }
            //回调当前执行动作完成
            if (onComplate) {
                onComplate(curIndex, maxIndex);
            }

            if (this.lastPlayInfo != null) {
                PlayerManagerExtesion.rpcStopAnimation(this.char, this.lastPlayInfo.guid)
            }
        }
        //设置不能动画也不能连击了
        this.canOper = false;
        this.canCombo = false;

        this.fightIdelAniGuid = this.getCharFightIdelGuid(index);
        Console.error("this.fightIdelAniGuid : " + this.fightIdelAniGuid);

        //设置当前要播放的动画索引
        this.curAnimationIndex = index;
        let info = this.getCurPlayActionInfo();
        if (!info) {
            this.canOper = true;
            Console.error("获取不到当前动作 : " + index);
            return false;
        }
        this.lastPlayInfo = info;
        this.lastPlayGuid = info.guid;

        //持续时间
        let durMilSec = parseInt(info.duration);
        //击打时间
        let hitMilSec = parseInt(info.hitLength);

        let playCount = 1;
        if (info.isCharge != "0") playCount = 0;

        // if (!this.allAniGuid.includes(info.guid)) {
        //     this.allAniGuid.push(info.guid);
        //     Console.error("ALL 动画 : " + this.allAniGuid);
        // }
        Console.error("播放动画 : " + info.guid);
        PlayerManagerExtesion.rpcPlayAnimation(this.char, info.guid, playCount, 1)

        //设置前摇时间，丢失控制
        let rock = parseInt(info.frontRockLength);
        if (rock > 0) {
            this.char.movementEnabled = false;
            this.char.jumpEnabled = false;
        }

        /** 播放特效 */
        let effs = this.getCurPlayInfoAtType(NodeType.Eff);
        this.playAnimationEff(effs);

        /** 播放音效 */
        let audios = this.getCurPlayInfoAtType(NodeType.Audio);
        this.playAudio(audios);

        /** 移动处理 */
        let moves = this.getCurPlayInfoAtType(NodeType.Move);
        this.moveHandle(moves);

        /** 处理战斗待机 */
        this.fightingSec = 0;

        /** 获取技能检测类 */
        let skillRectNodes = this.getCurPlayInfoAtType(NodeType.SkillRect);

        /** 计算最终前摇时间 会决定禁止操作的时间 */
        let logicFrontTime = rock;
        moves.forEach(e => {
            if (e.isToPos == "1") return;
            let moveTime = parseInt(e.delayPlayTime) + parseInt(e.duration);
            if (moveTime > logicFrontTime) {
                logicFrontTime = moveTime;
            }
        })

        if (logicFrontTime > durMilSec) durMilSec = logicFrontTime;

        let maxIndex = this.getActionLengthByAnimation(this.curAnimationIndex) - 1;
        let curIndex = this.curActionIndex;

        if (info.isCharge != "0") {
            new Promise((resolve: (isNext: boolean) => void, reject: (reason?: any) => void) => {
                if (onStartCharge)
                    onStartCharge(this.curActionIndex, this.getActionLengthByAnimation(this.curAnimationIndex) - 1, resolve);
            }).then((res) => {
                this.char.movementEnabled = true;
                this.char.jumpEnabled = true;
                this.canOper = true;
                this.canCombo = true;
                curIndex += 1;
                if (curIndex > maxIndex || !res) {
                    this.canCombo = false;
                    this.curActionIndex = 0;
                    this.server_StopAllEffectProxy();
                    if (this.lastPlayInfo != null) {
                        PlayerManagerExtesion.rpcStopAnimation(this.char, this.lastPlayInfo.guid)
                    }
                    return;
                }
                this.server_StopAllEffectProxy();
                this.playAnimation(index, onComplate, onHit, onStartCombo, onStartCharge);
            });
            return;
        }

        /** 前摇结束 */
        this.startTimeOut(() => {
            this.char.movementEnabled = true;
            this.char.jumpEnabled = true;
            this.canOper = true;

            this.canCombo = true;

            if (onStartCombo) {
                onStartCombo(durMilSec - hitMilSec);
            }

        }, logicFrontTime);

        if (logicFrontTime > hitMilSec) {
            Console.error("前摇最终时间 : " + logicFrontTime + " 大于 击打时间 : " + hitMilSec);
        }


        /** 击打点回调 */
        this.startTimeOut(() => {
            if (onHit) {
                onHit(this.curActionIndex, maxIndex, SkillRectCheck.checkNodes(this.char, skillRectNodes));
            }

            if (info.isAutoPlay != "0") {
                Console.error("自动连击");
                Console.error(info);
                this.playAnimation(index, onComplate, onHit, onStartCombo, onStartCharge);
                return;
            }

        }, hitMilSec);

        /** 完成回调 */
        this.startTimeOut(() => {
            this.canCombo = false;
            this.canOper = true;
            this.curActionIndex = 0;

            if (onComplate) {
                onComplate(curIndex, maxIndex);
                // Console.error("技能使用完成");
                this.fightingSec = this.constFightingSec;
            }
        }, durMilSec);

        return true;

    }

    /** 获取动画总数 */
    public getAnimationCount(): number {
        return this.animationInfo.length;
    }

    /**
     * 停止播放
     */
    public stopPlay() {

        this.canCombo = false;
        this.canOper = true;
        this.curActionIndex = 0;
        this.stopAllTimer();
        this.server_StopAllEffectProxy();
        PlayerManagerExtesion.rpcStopAnimation(this.char, this.lastPlayGuid)
        this.lastPlayGuid = "";

    }

    /**
     * 获取动画中动作的总数
     * @param animationIndex 动画索引
     * @returns -1为传入参数有误
     */
    public getActionLengthByAnimation(animationIndex: number): number {
        if (!this.checkIndex(animationIndex)) {
            return -1;
        }

        let res = 0;
        let aniInfo = this.animationInfo[animationIndex];
        aniInfo.infos.forEach(e => {
            if (e.type == NodeType.Animation.toString()) res++;
        })

        return res;
    }

    /**
     * 穿戴手部武器装备
     * @param equipGuid 装备guid
     * @param isRight 是否右手(默认:是)
     */
    public equipWeapon_Hand(equipGuid: string, isRight: boolean = true) {
        this.server_EquipWeapon(equipGuid, isRight);
    }

    /**
     * 取消手部武器穿戴
     * @param isRight 是否右手(默认:是)
     */
    public unequipWeapon_Hand(isRight: boolean = true) {
        this.server_EquipWeapon("", isRight);
    }

    /**
     * 设置从战斗待机切换到待机需要等待的时间
     * @param sec 
     */
    public setFightIdelChangeIdelWaitSec(sec: number) {
        this.constFightingSec = sec;
    }

    /**
     * 获取战斗待机动画guid
     * @param aniamtionIndex 
     */
    private getCharFightIdelGuid(animationIndex: number): string {
        if (!this.checkIndex(animationIndex)) {
            return "";
        }
        let aniInfo = this.animationInfo[animationIndex];
        return aniInfo.charFightIdelAniId;
    }

    /** 客户端绑定角色id改变 */
    private client_OnChangeCharGuid() {
        let handle = setInterval(async () => {
            let char = await GameObject.asyncFindGameObjectById(this.charGuid);
            if (char) {
                await char.asyncReady();
                clearInterval(handle);
                if (PlayerManagerExtesion.isCharacter(char)) {
                    this.char = char as mw.Character;
                } else {
                    this.char = char as mw.Character;
                }

            }
        }, 100);
    }

    /** 服务器通知客户端更换装备 */
    private client_OnChangeEquipWeaponRight() {

        if (this.clientEquipGo_Right != null) {
            this.clientEquipGo_Right.parent = null;
            GameObjPool.despawn(this.clientEquipGo_Right);
            this.clientEquipGo_Right = null;
        }

        if (this.equipRightWeaponGuid != "") {

            const handle = setInterval(async () => {
                if (this.char != null) {
                    await this.char.asyncReady();
                    clearInterval(handle);
                    this.clientEquipGo_Right = await GameObjPool.asyncSpawn(this.equipRightWeaponGuid, mwext.GameObjPoolSourceType.Asset);
                    this.char.attachToSlot(this.clientEquipGo_Right, mw.HumanoidSlotType.RightHand);
                    this.clientEquipGo_Right.localTransform.position = mw.Vector.zero;
                    this.clientEquipGo_Right.localTransform.rotation = mw.Rotation.zero;
                }

            }, 100)

        }

    }

    /** 服务器通知客户端更换装备 */
    private client_OnChangeEquipWeaponLeft() {
        if (this.clientEquipGo_Left != null) {
            this.clientEquipGo_Left.parent = null;
            GameObjPool.despawn(this.clientEquipGo_Left);
            this.clientEquipGo_Left = null;
        }
        if (this.equipLeftWeaponGuid != "") {

            const handle = setInterval(async () => {

                if (this.char != null) {
                    clearInterval(handle);
                    this.clientEquipGo_Left = await GameObjPool.asyncSpawn(this.equipLeftWeaponGuid, mwext.GameObjPoolSourceType.Asset);
                    this.char.attachToSlot(this.clientEquipGo_Left, mw.HumanoidSlotType.LeftHand);
                    this.clientEquipGo_Left.localTransform.position = mw.Vector.zero;
                    this.clientEquipGo_Left.localTransform.rotation = mw.Rotation.zero;
                }

            }, 100)

        }

    }

    /**
     * 客户端停止所有特效
     */
    @RemoteFunction(mw.Client, mw.Multicast)
    protected async client_StopAllEffect() {
        this.curPlayEffs.forEach(e => {
            e.stop();
            e.destroy();
        })
        this.curPlayEffs = [];
    }

    /**
    * 播放特效
    * @param guid 特效id
    * @param slotIndex 插槽位置 -1 则在角色原地播放
    * @param offsetPos 偏移坐标
    * @param offsetRotate 偏移旋转
    * @param offsetScale 偏移缩放
    */
    @RemoteFunction(mw.Client, mw.Multicast)
    protected async client_PlayEffect(guid: string, stopTime: number, slotIndex: number,
        offsetPos: mw.Vector, offsetRotate: mw.Rotation, offsetScale: mw.Vector, colorHex: string) {
        let eff = (await GameObjPool.asyncSpawn<mw.Effect>(guid)) as mw.Effect;
        if (slotIndex == -1) {
            eff.worldTransform.position = new mw.Vector(offsetPos.x, offsetPos.y, offsetPos.z);
            eff.worldTransform.rotation = new mw.Rotation(offsetRotate.x, offsetRotate.y, offsetRotate.z);
            eff.worldTransform.scale = new mw.Vector(offsetScale.x, offsetScale.y, offsetScale.z);
            eff.loop = (stopTime == 0);
            eff.maskcolor = (mw.LinearColor.colorHexToLinearColor("FFFFFFFF"));
            if (colorHex && colorHex != "") {
                eff.maskcolor = (mw.LinearColor.colorHexToLinearColor(colorHex));
            }
            eff.play();
            if (stopTime == 0) {
                this.curPlayEffs.push(eff);
            } else {
                setTimeout(() => {
                    GameObjPool.despawn(eff);
                }, stopTime);
            }
        } else {
            eff.worldTransform.position = new mw.Vector(offsetPos.x, offsetPos.y, offsetPos.z);
            eff.worldTransform.rotation = new mw.Rotation(offsetRotate.x, offsetRotate.y, offsetRotate.z);
            eff.worldTransform.scale = new mw.Vector(offsetScale.x, offsetScale.y, offsetScale.z);
            eff.loop = (stopTime == 0);
            eff.maskcolor = (mw.LinearColor.colorHexToLinearColor("FFFFFFFF"));
            if (colorHex && colorHex != "") {
                eff.maskcolor = (mw.LinearColor.colorHexToLinearColor(colorHex));
            }
            eff.play();
            if (stopTime == 0) {
                this.curPlayEffs.push(eff);
            } else {
                setTimeout(() => {
                    GameObjPool.despawn(eff);
                }, stopTime);
            }
        }

    }

    /** 移动处理 */
    private moveHandle(moveInfo: NodeInfo[]) {

        moveInfo.forEach(e => {

            /** 移动时间 */
            let dur = parseInt(e.duration);
            /** 移动距离 */
            let moveDis = parseInt(e.moveDistance);
            /** 移动类型 */
            let moveType = parseInt(e.isToPos);
            /** 移动方向 */
            let moveDir = parseInt(e.moveDir);
            if (moveDir != -1) moveDir = 1;
            /** 移动延迟 */
            let moveDelay = parseInt(e.delayPlayTime);

            if (moveDelay <= 0) moveDelay = 1;

            this.startTimeOut(() => {

                /** 处理瞬移 */
                if (moveType == 1) {

                    let charPos = this.char.worldTransform.position.clone();
                    let toPos = charPos;
                    let curMoveDis = this.char.worldTransform.getForwardVector().clone().multiply(moveDis).multiply(moveDir);
                    toPos = toPos.clone().add(curMoveDis);
                    let rate = 1;

                    /** 碰撞检测 因为瞬移长度不定，所以需要多条射线进行检测 最多5条 */
                    while (true) {
                        if (rate <= 0) {
                            return;
                        }
                        let res = QueryUtil.lineTrace(charPos, toPos, true, true);
                        res = res.filter(e => { return e.gameObject.gameObjectId != this.char.gameObjectId });
                        if (res.length > 0) {
                            rate -= 0.2;
                            toPos = charPos.clone().add(curMoveDis.clone().multiply(rate));
                        } else {
                            break;
                        }
                    }

                    this.char.worldTransform.position = toPos.clone();
                    this.server_setCharPos(this.char.gameObjectId, toPos)
                    return;
                }

                //服务器位移
                let charPos = this.char.worldTransform.position.clone();
                let toPos = charPos.clone();
                let curMoveDis = this.char.worldTransform.getForwardVector().multiply(moveDis).multiply(moveDir);
                toPos = toPos.clone().add(curMoveDis);
                this.server_setCharToPos(this.char.gameObjectId, charPos, toPos, dur);

            }, moveDelay);

        })

    }

    /**
     * 播放音效
     * @param audios 
     * @returns 
     */
    private playAudio(audios: NodeInfo[]) {

        if (mw.SystemUtil.isServer()) return;

        audios.forEach((e) => {
            this.startTimeOut(async () => {
                SoundService.playSound(e.guid);
            }, parseInt(e.delayPlayTime));

        })

    }

    /** 播放特效 */
    private playAnimationEff(effs: NodeInfo[]) {

        if (mw.SystemUtil.isServer()) return;

        effs.forEach(e => {
            setTimeout(async () => {

                let offsetPos = new mw.Vector(parseFloat(e.offsetPos[0]), parseFloat(e.offsetPos[1]),
                    parseFloat(e.offsetPos[2]));
                let offsetRotate = new mw.Rotation(parseFloat(e.offsetRotation[0]), parseFloat(e.offsetRotation[1]),
                    parseFloat(e.offsetRotation[2]));
                let offsetScale = new mw.Vector(parseFloat(e.offsetScale[0]), parseFloat(e.offsetScale[1]),
                    parseFloat(e.offsetScale[2]));

                let slotIndex = parseInt(e.slotIndex);
                if (slotIndex <= -1) {

                    offsetRotate = this.char.worldTransform.getForwardVector().toRotation().clone().add(new mw.Rotation(offsetRotate.x,
                        offsetRotate.y, offsetRotate.z));
                    let forward = this.char.worldTransform.getForwardVector().normalized;
                    let right = this.char.worldTransform.getRightVector().normalized;

                    offsetPos = this.char.worldTransform.position.clone().add(
                        forward.clone().multiply(offsetPos.x).add(
                            right.clone().multiply(offsetPos.y)
                        ).add(
                            mw.Vector.up.multiply(offsetPos.z)
                        )
                    );

                    if (slotIndex == -2) {
                        offsetPos = offsetPos.clone().subtract(mw.Vector.up.multiply(this.char.collisionExtent.z / 2));
                    }

                    this.server_playEffectProxy(e.guid, parseInt(e.stopTime), slotIndex, offsetPos, offsetRotate, offsetScale, e.colorHex);
                } else {
                    if (this.char.player == null) return;
                    this.server_playEffectProxy(e.guid, parseInt(e.stopTime), slotIndex, offsetPos, offsetRotate, offsetScale, e.colorHex);
                }

            }, parseInt(e.delayPlayTime));
        })
    }

    /**
     * 启动一个定时器
     * @param callback 回调
     * @param milSec 延迟毫秒
     */
    private startTimeOut(callback: () => void, milSec: number) {
        this.allTimer.push(setTimeout(callback, milSec));
    }

    /**
     * 启动一个定时器
     * @param callback 回调
     * @param milSec 间隔毫秒
     */
    private startTimeInterval(callback: (timerHandle: any) => void, milSec: number) {
        let index = this.allTimer.length;
        this.allTimer.push(setInterval(() => {
            callback(this.allTimer[index])
        }, milSec));
    }

    /** 获取当前播放的action */
    private getCurPlayActionInfo(): NodeInfo {
        let info = this.animationInfo[this.curAnimationIndex];
        Console.error(this.animationInfo);
        let animationIndex = 0;
        for (let i = 0; i < info.infos.length; i++) {

            let e = info.infos[i];
            if (e.type == NodeType.Animation.toString()) {
                if (animationIndex == this.curActionIndex) {
                    return e;
                }
                animationIndex++;
            }

        }

        return null;
    }

    /**
     * 获取当前要播放的特效
     * @returns 
     */
    private getCurPlayInfoAtType(type: NodeType): NodeInfo[] {

        let res = [];

        let info = this.animationInfo[this.curAnimationIndex];
        let animationIndex = -1;

        for (let i = 0; i < info.infos.length; i++) {

            let e = info.infos[i];


            if (e.type == NodeType.Animation.toString()) {
                animationIndex++;
            }

            if (this.curActionIndex == animationIndex) {
                if (e.type == type.toString()) {
                    res.push(e);
                }
            }

            if (this.curActionIndex < animationIndex) {
                break;
            }

        }

        return res;
    }

    /** 检查动画索引 */
    private checkIndex(index: number): boolean {
        if (index < 0 || index >= this.animationInfo.length) {
            return false;
        }
        return true;
    }

    onStart() {

        super.onStart();

        if (mw.SystemUtil.isClient()) {

        }
    }

    onUpdate(dt: number) {

        super.onUpdate(dt);

        if (mw.SystemUtil.isClient()) {

            if (this.fightingSec > 0)
                this.fightingSec -= dt;

            if (this.canOper && this.canCombo) {

                /** 角色在移动 */
                if (this.char.movementMode == mw.MovementMode.Walk && this.lastPlayGuid != "" &&
                    mw.Vector.distance(this.char.velocity, mw.Vector.zero) > 1) {
                    Console.error("停止动画")
                    PlayerManagerExtesion.rpcStopAnimation(this.char, this.lastPlayGuid)
                    this.lastPlayGuid = "";
                }

            }
            else if (this.char != null && this.fightIdelAniGuid != "") {

                if (this.fightingSec <= 0 || mw.Vector.distance(this.char.velocity, mw.Vector.zero) > 1) {
                    if (this.lastPlayGuid == this.fightIdelAniGuid) {
                        Console.error("开始移动 停止战斗动画")
                        PlayerManagerExtesion.rpcStopAnimation(this.char, this.fightIdelAniGuid)
                        this.lastPlayGuid = "";
                    }
                    //Console.error("当前状态在walk : " + mw.Vector.distance(this.char.velocity, mw.Vector.zero));
                    return;
                }

                if (this.fightingSec > 0) {
                    if (this.lastPlayGuid != this.fightIdelAniGuid) {
                        Console.error("播放战斗动画")
                        PlayerManagerExtesion.rpcPlayAnimation(this.char, this.fightIdelAniGuid, 0, 0)
                        this.lastPlayGuid = this.fightIdelAniGuid;
                    }
                } else if (this.lastPlayGuid == this.fightIdelAniGuid) {
                    PlayerManagerExtesion.rpcStopAnimation(this.char, this.fightIdelAniGuid)
                    this.lastPlayGuid = "";
                    Console.error("时间到达 退出战斗待机");
                }

            }

        }

    }

}