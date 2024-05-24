import { PlayerManagerExtesion } from "../../Modified027Editor/ModifiedPlayer";
import Console from "../../Tools/Console";
import { WeaponClient } from "./WeaponClient";

/** 冷兵器服务器处理器 */
export class WeaponServer extends WeaponClient {

    onStart() {

        super.onStart();

    }

    onUpdate(dt: number) {

        super.onUpdate(dt);

    }

    @RemoteFunction(mw.Server)
    protected server_StopAllTimer() {
        this.allTimer.forEach(e => {
            clearTimeout(e);
            clearInterval(e);
        })
        this.allTimer = [];
        this.allUpdateCallback = [];
    }

    /**
     * 播放特效
     * @param guid 特效id
     * @param slotIndex 插槽位置 -1 则在角色原地播放
     * @param offsetPos 偏移坐标
     * @param offsetRotate 偏移旋转
     * @param offsetScale 偏移缩放
     */
    @RemoteFunction(mw.Server)
    protected async server_playEffectProxy(guid: string, stopTime: number, slotIndex: number,
        offsetPos: mw.Vector, offsetRotate: mw.Rotation, offsetScale: mw.Vector, colorHex: string) {
        this.client_PlayEffect(guid, stopTime, slotIndex, offsetPos, offsetRotate, offsetScale, colorHex);
    }

    /** 服务器停止所有特效 */
    @RemoteFunction(mw.Server)
    protected server_StopAllEffectProxy() {
        this.client_StopAllEffect();
    }

    /**
     * 设置指定对象坐标
     * @param guid 
     * @param pos 
     */
    @RemoteFunction(mw.Server)
    protected async server_setCharPos(guid: string, pos: mw.Vector) {

        let go = await GameObject.asyncFindGameObjectById(guid);
        if (PlayerManagerExtesion.isCharacter(go)) {
            let char = go as mw.Character | mw.Character;
            char.worldTransform.position = new mw.Vector(pos.x, pos.y, pos.z);
        }

    }

    @RemoteFunction(mw.Server)
    private async server_addImp(guid: string, moveDis: number, moveDir: number) {

        let go = await GameObject.asyncFindGameObjectById(guid);
        if (PlayerManagerExtesion.isCharacter(go)) {
            let char = go as mw.Character | mw.Character;
            char.addImpulse(char.worldTransform.getForwardVector().multiply(moveDis).multiply(moveDir), true);
        }

    }

    /**
     * 设置指定对象坐标
     * @param guid 
     * @param pos 
     */
    @RemoteFunction(mw.Server)
    protected async server_setCharToPos(guid: string, startPos: mw.Vector, pos: mw.Vector, time: number) {

        let go = await GameObject.asyncFindGameObjectById(guid);
        if (PlayerManagerExtesion.isCharacter(go)) {
            let char = go as mw.Character | mw.Character;
            let curDur = 0;
            let posVec = new mw.Vector(pos.x, pos.y, pos.z);
            let startPosVec = new mw.Vector(startPos.x, startPos.y, startPos.z);
            let subDis = posVec.clone().subtract(startPosVec);
            let lastVec = new mw.Vector(char.worldTransform.position.x, char.worldTransform.position.y, char.worldTransform.position.z);


            Console.error("start Set char To Pos : " + Date.now());
            this.startUpdateInterval((dt: number): boolean => {

                curDur += (dt * 1000);
                if (curDur >= time) {
                    Console.error("end Set char To Pos : " + Date.now());
                    return false;
                }

                let curProgress = parseFloat((curDur / time).toFixed(2));
                let curPos = new mw.Vector(
                    parseFloat((subDis.x * curProgress).toFixed(2)),
                    parseFloat((subDis.y * curProgress).toFixed(2)),
                    parseFloat((subDis.z * curProgress).toFixed(2))
                );

                let curVec = curPos.clone().add(startPosVec);

                let res = QueryUtil.lineTrace(char.worldTransform.position, curVec, true, true);
                res = res.filter(e => { return e.gameObject.gameObjectId != this.char.gameObjectId })
                if (res.length > 0) {
                    curVec = this.char.worldTransform.position.clone();
                }

                let sub = curVec.clone().subtract(lastVec);
                lastVec = curVec.clone();
                char.worldTransform.position = char.worldTransform.position.add(sub);

                return true;

            })
        }

    }

    /** 服务器 设置玩家装备 */
    @RemoteFunction(mw.Server)
    protected server_EquipWeapon(guid: string, isRight: boolean) {
        if (isRight) this.equipRightWeaponGuid = guid;
        else this.equipLeftWeaponGuid = guid;
    }

    /** 服务器 设置玩家guid */
    @RemoteFunction(mw.Server)
    protected server_setChar(guid: string) {
        this.charGuid = guid;
    }

}