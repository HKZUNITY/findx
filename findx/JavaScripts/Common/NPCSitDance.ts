import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
﻿import Console from "../Tools/Console";
import { Utils } from "../Tools/utils";
import { GameConfig } from "../config/GameConfig";
import { NPCSitDanceConfig } from "../config/NPCSitDance";
import GlobalData from "../const/GlobalData";

@Component
export default class NPCSitDance extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (mw.SystemUtil.isClient()) {
            this.onStartC();
        }
        else if (mw.SystemUtil.isServer()) {
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
        else if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }
    /**----------------------------------------[客户端]---------------------------------------- */
    private nPCSitDance: NPCSitDanceConfig = null;
    private danceGuids: string[] = [];
    private danceGuidLen: number = 0;

    /**客户端的onStart */
    private async onStartC(): Promise<void> {
        this.nPCSitDance = GameConfig.NPCSitDance;
        let danceGuid1 = GlobalData.danceGuid1;
        let danceGuid2 = GlobalData.danceGuid2;
        this.danceGuids = [...danceGuid1.split(','), ...danceGuid2.split(',')];
        this.danceGuidLen = this.danceGuids.length;
        Console.error("danceGuidLen = " + this.danceGuidLen);
        let tmpNpc = await GameObject.asyncFindGameObjectById("379E636C") as mw.Character;
        tmpNpc.displayName = "贵族女";
        let tmpAni = PlayerManagerExtesion.loadAnimationExtesion(tmpNpc, "122454", false)
        tmpAni.loop = 0;
        tmpAni.play();
        TimeUtil.delaySecond(5).then(() => {
            this.findNPCs();
        });
    }

    /**findNPC */
    private findNPCs(): void {
        let length = this.nPCSitDance.getAllElement().length;
        let i = 0;
        let npcInterval = TimeUtil.setInterval(async () => {
            let npcConfig = this.nPCSitDance.getElement(i + 1);
            if (npcConfig.NPCSitGuid != null) {
                let sitNPC = await GameObject.asyncFindGameObjectById(npcConfig.NPCSitGuid) as mw.Character;
                sitNPC.displayName = npcConfig.Annotation;
                PlayerManagerExtesion.changeStanceExtesion(sitNPC,npcConfig.SitStance)
            }
            if (npcConfig.NPCDanceGuid != null) {
                let danceNPC = await GameObject.asyncFindGameObjectById(npcConfig.NPCDanceGuid) as mw.Character;
                danceNPC.displayName = npcConfig.Annotation;
                this.npcPlayAnimation(danceNPC);
            }
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(npcInterval);
            }
        }, 0.3);
    }

    /**跳舞 */
    private npcPlayAnimation(npc: mw.Character): void {
        let ani = PlayerManagerExtesion.loadAnimationExtesion(npc, this.danceGuids[Utils.getRandomInteger(0, this.danceGuidLen - 1)], false);
        ani.loop = 1;
        ani.play();
        ani.onFinish.add(() => {
            ani.onFinish.clear();
            this.npcPlayAnimation(npc);
        });
    }

    /**客户端的onUpdate */
    private onUpdateC(dt: number): void {

    }
    /**----------------------------------------[客户端]---------------------------------------- */

    /**----------------------------------------[服务端]---------------------------------------- */
    /**服务端的onStart */
    private onStartS(): void {

    }
    /**服务端的onUpdate */
    private onUpdateS(dt: number): void {

    }
    /**----------------------------------------[服务端]---------------------------------------- */
}