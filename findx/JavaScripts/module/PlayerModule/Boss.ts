import { PrefabEvent } from "../../Prefabs/PrefabEvent";
import Console from "../../Tools/Console";
import { Utils } from "../../Tools/utils";
import NPCBar_Generate from "../../ui-generate/module/NPCModule/NPCBar_generate";
import HUDModuleS from "../HUDModule/HUDModuleS";
import RankingModuleS from "../RankingModule/RankingModuleS";

@Component
export default class Boss extends Script {
    @mw.Property({ displayName: "体型大小", group: "设置属性", range: { min: 1, max: 5, showSlider: true } })
    private bossScale: number = 1;

    @mw.Property({ displayName: "血量", group: "设置属性", tooltip: "血量", range: { min: 100, max: 100000, showSlider: true } })
    private maxHp: number = 100;

    @mw.Property({ displayName: "当前剩余血量", group: "设置属性", tooltip: "当前剩余血量", replicated: true, onChanged: "onHpChanged" })
    private curHp: number = 0;

    @mw.Property({ displayName: "是否开启寻路", group: "设置属性", tooltip: "是否开启寻路" })
    private isOpenPath: boolean = false;

    @mw.Property({ displayName: "路径", group: "设置属性", tooltip: "路径" })
    private pathVector: mw.Vector[] = [mw.Vector.zero];

    @mw.Property({ displayName: "移动速度", group: "设置属性", tooltip: "移动速度", range: { min: 100, max: 1000, showSlider: true } })
    private moveSpeed: number = 100;

    @mw.Property({ displayName: "爆炸特效", group: "设置属性", tooltip: "爆炸特效" })
    private explosionEffect: string = "27422";

    @mw.Property({ displayName: "重生时间", group: "设置属性", tooltip: "重生时间", range: { min: 5, max: 60, showSlider: true } })
    private respawnTime: number = 5;

    @mw.Property({ displayName: "重生特效", group: "设置属性", tooltip: "重生特效" })
    private respawnEffect: string = "142750";

    private boss: mw.Character = null;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.onStartCS();
    }

    /**onStart */
    private async onStartCS(): Promise<void> {
        await ModuleService.ready();
        this.boss = this.gameObject as mw.Character;
        await this.boss.asyncReady();
        if (mw.SystemUtil.isClient()) {
            this.onStartC();
        } else if (mw.SystemUtil.isServer()) {
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
        } else if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }
    /**--------------------------------【客户端】-------------------------------- */
    private cubeLifebar: NPCBar_Generate = null;
    private cubeLifebarWidget: mw.UIWidget = null;
    private isInitLifebar = false;

    /**客户端的onStart */
    private onStartC(): void {
        this.useUpdate = false;
        this.initDataC();
    }

    private initDataC(): void {
        this.preHp = Math.floor(this.maxHp);
        this.initLifebar();
        this.initGun();
    }

    private async initLifebar(): Promise<void> {
        this.cubeLifebar = UIService.create(NPCBar_Generate);
        this.cubeLifebarWidget = await mw.GameObject.asyncSpawn<mw.UIWidget>(
            "UIWidget",
            {
                replicates: false
            });
        this.cubeLifebarWidget.setTargetUIWidget(this.cubeLifebar.uiWidgetBase);
        this.cubeLifebarWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI;

        let boss = this.gameObject as mw.Character;
        boss.attachToSlot(this.cubeLifebarWidget, mw.HumanoidSlotType.Rings);

        this.cubeLifebarWidget.occlusionEnable = false;
        this.cubeLifebarWidget.scaledByDistanceEnable = true;
        this.cubeLifebarWidget.hideByDistanceEnable = true;
        this.cubeLifebarWidget.headUIMaxVisibleDistance = 10000;

        this.isInitLifebar = true;
        this.onHpChanged();
    }

    private async initGun(): Promise<void> {
        let bossGun = await mw.GameObject.asyncSpawn(Utils.getWeapon());
        this.boss.attachToSlot(bossGun, mw.HumanoidSlotType.RightHand);
    }

    /**客户端的onUpdate */
    private onUpdateC(dt: number): void {

    }

    private preHp: number = 0;
    /**
     * 血量改变
     */
    private onHpChanged(): void {
        if (!this.isInitLifebar) return;
        Console.error("onHpChanged = " + this.curHp);

        if (this.preHp <= 0) this.preHp = Math.floor(this.maxHp);

        let damage = this.preHp - this.curHp;
        if (damage > 0) this.preHp = this.curHp;

        this.cubeLifebar.mProgressBar.percent = this.curHp / this.maxHp;
        this.cubeLifebar.mHpTextBlock.text = `${Math.floor(this.curHp)}/${Math.floor(this.maxHp)}`;

        if (this.curHp <= 0) {
            if (this.cubeLifebarWidget.getVisibility()) {
                this.cubeLifebarWidget.setVisibility(false);
            }
        } else if (this.curHp >= this.maxHp) {
            if (!this.cubeLifebarWidget.getVisibility()) {
                this.cubeLifebarWidget.setVisibility(true);
            }
        }
    }

    /**--------------------------------【客户端】-------------------------------- */

    /**--------------------------------【服务端】-------------------------------- */
    private rankingModuleS: RankingModuleS = null;
    private get getRankingModuleS(): RankingModuleS {
        if (this.rankingModuleS == null) {
            this.rankingModuleS = ModuleService.getModule(RankingModuleS);
        }
        return this.rankingModuleS;
    }

    private hudModuleS: HUDModuleS = null;
    private get getHudModuleS(): HUDModuleS {
        if (this.hudModuleS == null) {
            this.hudModuleS = ModuleService.getModule(HUDModuleS);
        }
        return this.hudModuleS;
    }

    /**服务端的onStart */
    private onStartS(): void {
        this.useUpdate = true;
        this.initDataS();
        this.initMove();
        this.bindEventS();
    }

    private initDataS(): void {
        this.maxHp = Math.floor(this.maxHp);
        this.curHp = this.maxHp;

        this.boss.displayName = "";
        this.boss.worldTransform.scale = mw.Vector.one.multiply(this.bossScale);
        this.boss.setDescription([Utils.getBoss()]);
    }

    /**
     * 绑定事件
     */
    private bindEventS(): void {
        PrefabEvent.PrefabEvtFight.onHit(this.playerAtkEnemyS.bind(this));
    }

    /**
     * 玩家攻击敌人
     * @param senderGuid
     * @param targetGuid
     * @param damage
     * @param hitPoint
     * @returns
     */
    private playerAtkEnemyS(senderGuid: string, targetGuid: string, damage: number, hitPoint: mw.Vector): void {
        Console.error("Enemy_Cube onHit this.gameObject.gameObjectId = " + this.gameObject.gameObjectId + "。targetGuid = " + targetGuid + "。damage = " + damage + "。");
        if (this.gameObject.gameObjectId != targetGuid) return;
        if (this.curHp <= 0) return;
        let tmpHp = this.curHp - damage;
        if (tmpHp >= 0) {
            this.curHp = tmpHp;
        } else {
            this.curHp = 0;
        }
        if (this.curHp <= 0) {
            this.dieS();
            // if (senderGuid) this.getRankingModuleS.refreshKillCount(this.getHudModuleS.getPlayerbyGameObjectId(senderGuid), 1, true);
            TimeUtil.delaySecond(this.respawnTime).then(() => {
                this.curHp = this.maxHp;
                this.respawnS();
            });
        }
        Console.error("curHp = " + this.curHp);
        SoundService.play3DSound("47414", this.boss, 1, 10000);
        this.getHudModuleS.playerAtkEnemyFlyText(senderGuid, hitPoint, damage);
    }

    private dieS(): void {
        this.setVisibilityS(false);
        EffectService.playAtPosition(
            this.explosionEffect,
            this.gameObject.worldTransform.position,
            {
                scale: mw.Vector.one.multiply(1)
            });
    }

    private respawnS(): void {
        this.boss.setDescription([Utils.getBoss()]);
        this.setVisibilityS(true);
        EffectService.playAtPosition(
            this.respawnEffect,
            this.gameObject.worldTransform.position,
            {
                scale: mw.Vector.one.multiply(1)
            });
    }

    /**
     * 设置物体是否被显示
     * @param isVisibility
     */
    private setVisibilityS(isVisibility: boolean): void {
        // this.gameObject.setVisibility(isVisibility, true);
        // this.gameObject.setCollision(isVisibility ? mw.PropertyStatus.On : mw.PropertyStatus.Off);
        this.boss.ragdollEnabled = !isVisibility;
        this.useUpdate = isVisibility;
    }

    private initMove(): void {
        this.targetPos = this.pathVector[this.index];
        this.boss.maxWalkSpeed = this.moveSpeed;
    }

    private frameCount: number = 0;
    private maxFrameCount: number = 1;
    /**服务端的onUpdate */
    private onUpdateS(dt: number): void {
        this.frameCount++;
        if (this.frameCount < this.maxFrameCount) return;
        this.frameCount = 0;
        this.updateMove();
    }

    private index: number = 0;
    private pathFlag: boolean = true;
    private curBossDir: mw.Vector = mw.Vector.zero;
    private targetPos: mw.Vector = mw.Vector.zero;
    private targetDistance: number = 0;
    private updateMove(): void {
        if (!this.isOpenPath) return;
        if (!this.pathVector || this.pathVector.length == 0) return;

        this.curBossDir = this.targetPos.clone().add(this.targetPos.clone().subtract(this.boss.worldTransform.position.clone()))
        this.boss.lookAt(this.curBossDir);
        this.boss.addMovement(mw.Vector.forward);

        this.targetDistance = Math.sqrt(
            Math.pow(this.boss.worldTransform.position.x - this.pathVector[this.index].x, 2) +
            Math.pow(this.boss.worldTransform.position.y - this.pathVector[this.index].y, 2)
        );

        //到达寻路点
        if (this.targetDistance > 50) return;
        if (this.pathFlag && this.index < this.pathVector.length - 1) {
            this.index++
            if (this.index == this.pathVector.length - 1) this.pathFlag = false;
        } else if (!this.pathFlag && this.index > 0) {
            this.index--
            if (this.index == 0) this.pathFlag = true;
        }
        this.targetPos = this.pathVector[this.index];
    }
    /**--------------------------------【服务端】-------------------------------- */

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}