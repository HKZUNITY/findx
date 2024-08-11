import { GameConfig } from "../../config/GameConfig";
import { PrefabEvent } from "../../Prefabs/PrefabEvent";
import NPCBar_Generate from "../../ui-generate/module/NPCModule/NPCBar_generate";
import HUDModuleS from "../HUDModule/HUDModuleS";
import RankingModuleS from "../RankingModule/RankingModuleS";

export enum MonsterState {
    Inactivation = 0,
    Activate = 1
}

export class AnimationInfo {
    // @mw.Property({ displayName: "idleAnimation", group: "AnimationInfo", tooltip: "idleAnimation" })
    public idles: string[] = [];
    // @mw.Property({ displayName: "moveAnimation", group: "AnimationInfo", tooltip: "moveAnimation" })
    public moves: string[] = [];
    // @mw.Property({ displayName: "attackAnimation", group: "AnimationInfo", tooltip: "attackAnimation" })
    public attacks: string[] = [];
    // @mw.Property({ displayName: "dieAnimation", group: "AnimationInfo", tooltip: "dieAnimation" })
    public die: string = "";
}

export class AttackInfo {
    // @mw.Property({ displayName: "attackTimePoint", group: "AttackInfo", tooltip: "attackTimePoint" })
    public attackTimePoints: number[] = [];
    // @mw.Property({ displayName: "forwardOffset", group: "AttackInfo", tooltip: "forwardOffset" })
    public attackOffsets: mw.Vector[] = [];
    // @mw.Property({ displayName: "attackRange", group: "AttackInfo", tooltip: "attackRange" })
    public attackLengths: number[] = [];
    // @mw.Property({ displayName: "attackSize", group: "AttackInfo", tooltip: "attackSize" })
    public attackSizes: mw.Vector[] = [];
    // @mw.Property({ displayName: "damage", group: "AttackInfo", tooltip: "damage" })
    public damages: number[] = [];
}

export class AttackEffectInfo {
    // @mw.Property({ displayName: "effectId", group: "AttackEffectInfo", tooltip: "effectId" })
    public effectIds: string[] = [];
    // @mw.Property({ displayName: "effectPos", group: "AttackEffectInfo", tooltip: "effectPos" })
    public posOffsets: mw.Vector[] = [];
    // @mw.Property({ displayName: "effectRot", group: "AttackEffectInfo", tooltip: "effectRot" })
    public rotOffsets: mw.Rotation[] = [];
    // @mw.Property({ displayName: "effectScale", group: "AttackEffectInfo", tooltip: "effectScale" })
    public effectScales: mw.Vector[] = [];
}

export default class Monster extends Script {
    @mw.Property({ displayName: "monsterId", group: "Info", tooltip: "monsterId" })
    private monsterId: number = 0;
    @mw.Property({ displayName: "hp", group: "Info", tooltip: "hp", replicated: true, onChanged: "onHpChanged" })
    private hp: number = 0;
    @mw.Property({ displayName: "maxHp", group: "Info", tooltip: "maxHp", replicated: true, onChanged: "onHpChanged" })
    private maxHp: number = 0;
    // @mw.Property({ displayName: "moveSpeed", group: "Info", tooltip: "moveSpeed" })
    private moveSpeed: number = 450;
    // @mw.Property({ displayName: "pathVectors", group: "Info", tooltip: "pathVectors" })
    private pathVectors: mw.Vector[] = [mw.Vector.zero];
    // @mw.Property({ displayName: "animationInfo", group: "Info", tooltip: "animationInfo" })
    private animationInfo: AnimationInfo = new AnimationInfo();
    // @mw.Property({ displayName: "attackInfo", group: "Info", tooltip: "attackInfo" })
    private attackInfo: AttackInfo = new AttackInfo();
    // @mw.Property({ displayName: "attackEffectInfo", group: "Info", tooltip: "attackEffectInfo" })
    private attackEffectInfo: AttackEffectInfo = new AttackEffectInfo();

    protected onStart(): void {
        this.onStart_CS();
    }

    private monster: mw.Character = null;
    private get getMonster(): mw.Character {
        if (!this.monster) {
            this.monster = this.gameObject as mw.Character;
        }
        return this.monster;
    }

    private monsterState: MonsterState = MonsterState.Inactivation;
    private get getMonsterState(): MonsterState {
        return this.monsterState;
    }
    private set setMonsterState(value: MonsterState) {
        this.monsterState = value;
    }

    private get getMonsterHeight(): number {
        return this.getMonster.collisionExtent.z;
    }

    private monsterWidth: number = 0;
    private get getMonsterWidth(): number {
        if (this.monsterWidth == 0) {
            this.monsterWidth = this.getMonster.collisionExtent.x > this.getMonster.collisionExtent.y ?
                this.getMonster.collisionExtent.x : this.getMonster.collisionExtent.y;
        }
        console.error(`this.monsterWidth:${this.monsterWidth}`);
        return this.monsterWidth + 10;
    }

    private async onStart_CS(): Promise<void> {
        await this.initCharacter();
        await this.initConfig();
        if (mw.SystemUtil.isClient()) {
            this.onStart_C();
        } else if (mw.SystemUtil.isServer()) {
            this.onStart_S();
        }
    }

    private async initCharacter(): Promise<void> {
        await ModuleService.ready();
        this.monster = this.gameObject as mw.Character;
        this.monster.collisionWithOtherCharacterEnabled = false;
    }

    private async initConfig(): Promise<void> {
        let monsterElement = GameConfig.MonsterInfo.getElement(this.monsterId);
        if (!monsterElement) return;
        await this.initPaths(monsterElement?.PathStr);
        this.animationInfo.idles = monsterElement?.Idles;
        this.animationInfo.moves = monsterElement?.Moves;
        this.animationInfo.attacks = monsterElement?.Attacks;
        this.animationInfo.die = monsterElement?.Die;
        this.attackInfo.attackTimePoints = monsterElement?.AttackTimePoints;
        this.attackInfo.attackOffsets = monsterElement?.AttackOffsets;
        this.attackInfo.attackLengths = monsterElement?.AttackLengths;
        this.attackInfo.attackSizes = monsterElement?.AttackSizes;
        this.attackInfo.damages = monsterElement?.Damages;
        this.attackEffectInfo.effectIds = monsterElement?.EffectIds;
        this.attackEffectInfo.posOffsets = monsterElement?.EffectPosOffsets;
        monsterElement?.EffectRotOffsets?.forEach((value: mw.Vector) => {
            this.attackEffectInfo.rotOffsets.push(new mw.Rotation(value));
        });
        this.attackEffectInfo.effectScales = monsterElement?.EffectScales;
        this.moveSpeed = monsterElement?.MoveSpeed;
    }

    private async initPaths(pathStr: string[] = null): Promise<void> {
        if (!pathStr || pathStr.length == 0) pathStr = GameConfig.MonsterInfo.getElement(this.monsterId)?.PathStr;
        let pathParent = await mw.GameObject.asyncFindGameObjectById(pathStr[this.randomInt(0, pathStr.length - 1)]);
        this.pathVectors.length = 0;
        pathParent?.getChildren().forEach((child: mw.GameObject) => {
            this.pathVectors.push(child.worldTransform.position);
        });
    }

    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) {
            this.onUpdate_C(dt);
        } else if (mw.SystemUtil.isServer()) {
            this.onUpdate_S(dt);
        }
    }

    private cubeLifebar: NPCBar_Generate = null;
    private cubeLifebarWidget: mw.UIWidget = null;
    private isInitLifebar = false;
    private async onStart_C(): Promise<void> {
        this.useUpdate = false;
        this.initEvent_C();
        this.preHp = Math.floor(this.maxHp);
        this.initLifebar();
    }

    private initEvent_C(): void {
        Event.addServerListener("DrawDebug", this.bindDrawDebug_C.bind(this));
    }

    private bindDrawDebug_C(start: mw.Vector, end: mw.Vector, halfSize: mw.Vector): void {
        // console.error(`DrawDebug`);
        mw.PhysicsService.boxTraceMulti(start, end, halfSize, mw.Rotation.zero,
            { objectsToIgnore: [this.getMonster] },
            {
                isDrawDebug: mw.SystemUtil.isPIE,
                duration: 1,
                traceColor: mw.LinearColor.red,
                hitColor: mw.LinearColor.green,
                thickness: 3
            });
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

        this.getMonster.attachToSlot(this.cubeLifebarWidget, mw.HumanoidSlotType.Rings);

        this.cubeLifebarWidget.occlusionEnable = false;
        this.cubeLifebarWidget.scaledByDistanceEnable = true;
        this.cubeLifebarWidget.hideByDistanceEnable = true;
        this.cubeLifebarWidget.headUIMaxVisibleDistance = 10000;

        this.isInitLifebar = true;
        this.onHpChanged();
    }

    private preHp: number = 0;
    private onHpChanged(): void {
        if (!this.isInitLifebar) return;

        if (this.preHp <= 0) this.preHp = Math.floor(this.maxHp);

        let damage = this.preHp - this.hp;
        if (damage > 0) this.preHp = this.hp;

        this.cubeLifebar.mProgressBar.percent = this.hp / this.maxHp;
        this.cubeLifebar.mHpTextBlock.text = `${Math.floor(this.hp)}/${Math.floor(this.maxHp)}`;

        if (this.hp <= 0) {
            if (this.cubeLifebarWidget.getVisibility()) {
                this.cubeLifebarWidget.setVisibility(false);
            }
        } else if (this.hp >= this.maxHp) {
            if (!this.cubeLifebarWidget.getVisibility()) {
                this.cubeLifebarWidget.setVisibility(true);
            }
        }
    }

    private onUpdate_C(dt: number): void {

    }

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

    private async onStart_S(): Promise<void> {
        this.useUpdate = false;
        this.initEvent_S();
        await this.activate_S();
    }

    private initEvent_S(): void {
        PrefabEvent.PrefabEvtFight.onHit(this.playerAtkEnemy_S.bind(this));
    }

    private playerAtkEnemy_S(senderGuid: string, targetGuid: string, damage: number, hitPoint: mw.Vector): void {
        // console.error(`this.getMonster.gameObjectId:${this.getMonster.gameObjectId} targetGuid:${targetGuid}`);
        if (this.getMonster.gameObjectId != targetGuid || this.getMonsterState == MonsterState.Inactivation) return;
        if (this.hp <= 0) {
            this.hp = 0;
            return;
        }
        this.updateChasePlayer(senderGuid, damage);
        let tmpHp = this.hp - damage;
        if (tmpHp > 0) {
            this.hp = tmpHp;
        } else {
            this.hp = 0;
            this.die_S();
            if (senderGuid) this.getRankingModuleS.refreshKillCount(this.getHudModuleS.getPlayerbyGameObjectId(senderGuid), 1, this.monsterId);
        }
        SoundService.play3DSound("47414", this.monster, 1, 10000);
        this.getHudModuleS.playerAtkEnemyFlyText(senderGuid, hitPoint, damage);
    }

    private async die_S(): Promise<void> {
        this.dieReset_S();
        //die effect
        let dieAni = await this.playDieAni_S();
        let dieTime: number = 0;
        if (dieAni) {
            dieTime = dieAni.length;
        } else {
            dieTime = 1;
            this.getMonster?.currentAnimation?.stop();
            if (!this.getMonster.ragdollEnabled) this.getMonster.ragdollEnabled = true;
        }
        TimeUtil.delaySecond(dieTime).then(() => { this.rebirth_S(); });
    }

    private dieReset_S(): void {
        this.setMonsterState = MonsterState.Inactivation;
        Navigation.stopNavigateTo(this.getMonster);
        Navigation.stopFollow(this.getMonster);
        this.isFollowing = false;
        this.isNavigateToing = false;
        this.chasePlayerMap.clear();
    }

    private rebirth_S(): void {
        let rebirthEffect = EffectService.playAtPosition(
            "146786", this.getMonster.worldTransform.position,
            { loopCount: 0, scale: mw.Vector.one.multiply(2) }
        );
        // this.initPaths();
        TimeUtil.delaySecond(this.randomInt(5, 10)).then(async () => {
            EffectService.stop(rebirthEffect);
            EffectService.playOnGameObject("142750", this.getMonster, { slotType: mw.HumanoidSlotType.Root });
            this.maxHp = this.maxHp * (this.randomFloat(1.1, 1.5));
            if (this.maxHp > 1000000) this.maxHp = 1000000;
            this.hp = this.maxHp;
            if (this.getMonster.ragdollEnabled) this.getMonster.ragdollEnabled = false;
            this.setMonsterState = MonsterState.Activate;
            await this.playIdleAni_S();
            TimeUtil.delaySecond(this.randomInt(3, 5)).then(() => this.startNavigateTo_S());
        });
    }

    private chasePlayerMap: Map<string, number> = new Map<string, number>();
    private updateChasePlayer(targetGuid: string, damage: number): void {
        // console.error(`targetGuid:${targetGuid} damage:${damage}`);
        let totalDamage: number = 0;
        if (this.chasePlayerMap.has(targetGuid)) {
            totalDamage = this.chasePlayerMap.get(targetGuid);
        }
        totalDamage += damage;
        this.chasePlayerMap.set(targetGuid, totalDamage);
        this.fromNavigateToToFollow();
    }

    private deleteChasePlayer(targetGuid: string): void {
        if (!this.chasePlayerMap.has(targetGuid)) return;
        this.chasePlayerMap.delete(targetGuid);
    }

    private getChasePlayerByMaxDamage(): mw.Player {
        if (!this.chasePlayerMap || this.chasePlayerMap.size == 0) return null;
        let maxDamage: number = 0;
        let targetGuid: string = null;
        this.chasePlayerMap.forEach((value, key) => {
            if (value > maxDamage) {
                maxDamage = value;
                targetGuid = key;
            }
        });
        let targetPlayer: mw.Player = null;
        Player.getAllPlayers().forEach((value: mw.Player) => {
            if (value.character.gameObjectId == targetGuid) {
                targetPlayer = value;
            }
        });
        return targetPlayer;
    }

    private async activate_S(): Promise<void> {
        this.hp = this.maxHp;
        await this.getMonster.asyncReady();
        this.getMonster.maxWalkSpeed = this.moveSpeed;
        this.setMonsterState = MonsterState.Activate;
        this.isFollowing = false;
        this.isNavigateToing = false;
        TimeUtil.delaySecond(this.randomInt(1, 3)).then(() => { this.playIdleAni_S(); });
        TimeUtil.delaySecond(this.randomInt(5, 15)).then(() => this.startNavigateTo_S());
    }

    private async fromNavigateToToFollow(): Promise<void> {
        if (this.isFollowing || !this.isNavigateToing) return;
        Navigation.stopNavigateTo(this.getMonster);
        this.isNavigateToing = false;
        await this.playIdleAni_S();
        TimeUtil.delaySecond(this.randomFloat(0.5, 1)).then(() => this.startNavigateTo_S());
    }

    private isFollowing: boolean = false;
    private isNavigateToing: boolean = false;
    private async startNavigateTo_S(): Promise<void> {
        if (this.getMonsterState != MonsterState.Activate) return;
        await this.playMoveAni_S();
        let targetPlayer = this.getChasePlayerByMaxDamage();
        targetPlayer ? this.chasePlayerNavigateTo_S(targetPlayer) : this.randomNavigateTo_S();
    }

    private randomNavigateTo_S(): void {
        this.isNavigateToing = true;
        Navigation.navigateTo(this.getMonster,
            this.getRandomTargetPoint_S(),
            0, () => {
                // console.error(`随机寻路成功`);
                this.randomNavigateToComplete_S();
            }, () => {
                // console.error(`随机寻路失败`);
                this.randomNavigateToComplete_S();
            });
    }

    private async randomNavigateToComplete_S(): Promise<void> {
        this.isNavigateToing = false;
        await this.playIdleAni_S();
        TimeUtil.delaySecond(this.randomInt(1, 3)).then(() => { this.randomAttack_S() });
    }

    private chasePlayerNavigateTo_S(targetPlayer: mw.Player): void {
        let dis = mw.Vector.distance(this.getMonster.worldTransform.position, targetPlayer.character.worldTransform.position);
        console.error(`dis:${dis}`);
        if (dis > this.getMonsterWidth) {
            this.directChasePlayerNavigateTo_S(targetPlayer);
        } else {
            this.directRandomAttack_S(targetPlayer);
        }
    }

    private directChasePlayerNavigateTo_S(targetPlayer: mw.Player): void {
        let isFollowSuccess = Navigation.follow(this.getMonster,
            targetPlayer.character,
            0, () => {
                // console.error(`追踪寻路成功 dis = ${mw.Vector.distance(this.getMonster.worldTransform.position,
                //     targetPlayer.character.worldTransform.position)}`);
                this.chasePlayerNavigateToComplete_S(targetPlayer);
            }, () => {
                // console.error(`追踪寻路失败`);
                this.deleteChasePlayer(targetPlayer.character.gameObjectId);
                this.chasePlayerNavigateToComplete_S(targetPlayer);
            });
        // console.error(`isFollowSuccess: ${isFollowSuccess}`);
        if (isFollowSuccess) {
            this.isFollowing = true;
            return;
        }
        this.deleteChasePlayer(targetPlayer.character.gameObjectId);
        this.chasePlayerNavigateToComplete_S(targetPlayer);
    }

    private async directRandomAttack_S(targetPlayer: mw.Player): Promise<void> {
        await this.playIdleAni_S();
        this.getMonster.lookAt(targetPlayer.character.worldTransform.position);
        TimeUtil.delaySecond(this.randomFloat(0.5, 1)).then(() => { this.randomAttack_S() });
    }

    private async chasePlayerNavigateToComplete_S(targetPlayer: mw.Player): Promise<void> {
        Navigation.stopFollow(this.getMonster);
        this.isFollowing = false;
        await this.playIdleAni_S();
        this.getMonster.lookAt(targetPlayer.character.worldTransform.position);
        TimeUtil.delaySecond(this.randomFloat(0.5, 1)).then(() => { this.randomAttack_S() });
    }

    private getRandomTargetPoint_S(): mw.Vector {
        let targetVector = this.pathVectors[this.randomInt(0, this.pathVectors.length - 1)];
        let targetPos = Navigation.getRandomReachablePointInRadius(targetVector, 100);
        return (!targetPos) ? targetVector : targetPos;
    }

    private attackIndex: number = 0;
    private async randomAttack_S(): Promise<void> {
        if (this.getMonsterState != MonsterState.Activate) return;
        this.attackIndex = this.randomInt(0, this.animationInfo.attacks.length - 1);
        let attackAni = await this.playAtkAni_S();
        let attackTime = attackAni.length;
        TimeUtil.delaySecond(this.attackInfo.attackTimePoints[this.attackIndex]).then(() => { this.randomAttackCheck_S() });
        TimeUtil.delaySecond(attackTime).then(() => { this.playIdleAni_S() });
        TimeUtil.delaySecond(attackTime + this.randomInt(1, 3)).then(() => this.startNavigateTo_S());
    }

    private randomAttackCheck_S(): void {
        if (this.getMonsterState != MonsterState.Activate) return;
        this.attackEffect_S();
        let monsterPos: mw.Vector = this.getMonster.worldTransform.position;
        let attackOffset = this.attackInfo.attackOffsets[this.attackIndex];
        let startForwardOffset: mw.Vector = this.getMonster.worldTransform.getForwardVector().multiply(attackOffset.y);
        let start: mw.Vector = new mw.Vector(monsterPos.x + startForwardOffset.x + attackOffset.x, monsterPos.y + startForwardOffset.y, monsterPos.z + startForwardOffset.z + attackOffset.z);

        let endForwardOffset: mw.Vector = this.getMonster.worldTransform.getForwardVector().multiply(this.attackInfo.attackLengths[this.attackIndex]);
        let end: mw.Vector = new mw.Vector(monsterPos.x + endForwardOffset.x, monsterPos.y + endForwardOffset.y, monsterPos.z + endForwardOffset.z);

        let hitResults: mw.HitResult[] = mw.PhysicsService.boxTraceMulti(start, end, this.attackInfo.attackSizes[this.attackIndex], mw.Rotation.zero,
            { objectsToIgnore: [this.getMonster] }, {});
        if (mw.SystemUtil.isPIE) Event.dispatchToAllClient("DrawDebug", start, end, this.attackInfo.attackSizes[this.attackIndex]);
        if (!hitResults || hitResults.length == 0) return;
        for (let i = 0; i < hitResults.length; ++i) {
            let hitGo = hitResults[i].gameObject;
            if (hitGo instanceof mw.Character && hitGo?.player) {
                let targetGameObjectId = hitGo?.gameObjectId;
                PrefabEvent.PrefabEvtFight.hit(null, targetGameObjectId, this.attackInfo.damages[this.attackIndex], hitGo.worldTransform.position);
            }
        }
    }

    private attackEffect_S(): void {
        let monsterPos = this.getMonster.worldTransform.position;
        let effectOffset = this.attackEffectInfo.posOffsets[this.attackIndex];
        let monsterRot = this.getMonster.worldTransform.rotation;
        let effectLocalOffset = monsterRot.rotateVector(effectOffset);
        let effectPos = new mw.Vector(monsterPos.x + effectLocalOffset.x, monsterPos.y + effectLocalOffset.y, monsterPos.z + effectLocalOffset.z);

        let rotOffset = this.attackEffectInfo.rotOffsets[this.attackIndex];
        let constructorRot = new mw.Rotation(this.getMonster.worldTransform.getForwardVector(), mw.Vector.up);
        let effectRot = new mw.Rotation(constructorRot.x + rotOffset.x, constructorRot.y + rotOffset.y, constructorRot.z + rotOffset.z);

        EffectService.playAtPosition(this.attackEffectInfo.effectIds[this.attackIndex],
            effectPos,
            {
                loopCount: 1,
                rotation: effectRot,
                scale: this.attackEffectInfo.effectScales[this.attackIndex]
            });
    }

    private onUpdate_S(dt: number): void {

    }

    private async playIdleAni_S(): Promise<void> {
        let idle = this.animationInfo.idles[this.randomInt(0, this.animationInfo.idles.length - 1)];
        await this.asyncDownloadAsset(idle);
        if (this.getMonsterState != MonsterState.Activate) return;
        let idleAni = this.getMonster.loadAnimation(idle);
        idleAni.loop = 0;
        idleAni.play();
    }

    private async playMoveAni_S(): Promise<void> {
        let move = this.animationInfo.moves[this.randomInt(0, this.animationInfo.moves.length - 1)];
        await this.asyncDownloadAsset(move);
        if (this.getMonsterState != MonsterState.Activate) return;
        let moveAni = this.getMonster.loadAnimation(move);
        moveAni.loop = 0;
        moveAni.play();
    }

    private async playAtkAni_S(): Promise<mw.Animation> {
        await this.asyncDownloadAsset(this.animationInfo.attacks[this.attackIndex]);
        if (this.getMonsterState != MonsterState.Activate) return null;
        let attackAni = this.getMonster.loadAnimation(this.animationInfo.attacks[this.attackIndex]);
        attackAni.play();
        return attackAni;
    }

    private async playDieAni_S(): Promise<mw.Animation> {
        let die = this.animationInfo.die;
        if (die != "-1") {
            await this.asyncDownloadAsset(die);
            let dieAni = this.getMonster.loadAnimation(die);
            dieAni.play();
            return dieAni;
        }
        return null;
    }

    public randomInt(min: number, max: number): number {
        if (min > max) {
            let temp = min;
            min = max;
            max = temp;
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public randomFloat(min: number, max: number): number {
        if (min > max) {
            let temp = min;
            min = max;
            max = temp;
        }
        return Number((Math.random() * (max - min) + min).toFixed(1));
    }

    public async asyncDownloadAsset(InAssetId: string): Promise<void> {
        if (!mw.AssetUtil.assetLoaded(InAssetId)) {
            await mw.AssetUtil.asyncDownloadAsset(InAssetId);
        }
    }
}