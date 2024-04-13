import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import Console from "../Tools/Console";
import { Utils } from "../Tools/utils";
import { FlyText } from '../Common/FlyText';

export class ExplosiveCoins {
    private static _instance: ExplosiveCoins
    public static get instance() {
        if (ExplosiveCoins._instance == null) {
            ExplosiveCoins._instance = new ExplosiveCoins();
        }
        return ExplosiveCoins._instance;
    }
    private mapId: number = 0;
    private maxMapId: number = 10;
    private particles: Map<number, mw.Effect>[] = [];
    private recycleParticles: Map<number, mw.Effect> = new Map<number, mw.Effect>();
    private player: mw.Player = null;
    /**爆金币 */
    public explosiveCoins(fromVec: mw.Vector, coinCount: number = 1, coinNum: number = 10): void {
        // coinCount = Math.round(coinCount / coinNum);
        if (this.mapId >= this.maxMapId) this.mapId = 0;
        let mapId = this.mapId++;
        this.play3DSound(fromVec);
        for (let i = 0; i < coinNum; ++i) {
            this.startExplosiveCoins(fromVec, mapId);
        }
        TimeUtil.delaySecond(2).then(() => {
            if (this.particles[mapId] == null || this.particles[mapId] == undefined) return;
            this.particles[mapId].forEach((particle: mw.Effect, effectId: number) => {
                let fromVec = particle.worldTransform.position;
                let toVec: mw.Vector = mw.Vector.zero;
                if (this.player == null) this.player = Player.localPlayer;
                toVec = this.player.character.worldTransform.position;
                new mw.Tween({ x: fromVec.x, y: fromVec.y, z: fromVec.z })
                    .to({ x: toVec.x, y: toVec.y, z: toVec.z }, 0.1 * 1000)
                    .onUpdate((pos) => {
                        particle.worldTransform.position = (new mw.Vector(pos.x, pos.y, pos.z));
                    })
                    .start()
                    .onComplete(() => {
                        particle.stop();
                        this.recycleParticles.set(effectId, particle);
                        this.particles[mapId].delete(effectId);
                    });
            });
            TimeUtil.delaySecond(0.1).then(() => {
                Console.error("hkz3");
                let vec = this.player.character.worldTransform.position;
                FlyText.instance.showFlyText("+Exp " + coinCount, new mw.Vector(vec.x, vec.y, vec.z + 30), mw.LinearColor.green, mw.LinearColor.yellow);
            });
            this.play3DSound(this.player.character.worldTransform.position);
            Console.error("hkz4");
        });
    }

    private async startExplosiveCoins(fromVec: mw.Vector, mapId: number): Promise<void> {
        let effectId: number = 0;
        let particle: mw.Effect = null;
        if (this.recycleParticles.size > 0) {
            effectId = this.recycleParticles.keys().next().value;
            particle = this.recycleParticles.get(effectId);
            this.recycleParticles.delete(effectId);
        }
        else {
            effectId = GeneralManager.rpcPlayEffectAtLocation("176198", fromVec, 0);
            particle = await EffectService.getEffectById(effectId);
        }
        particle.loop = true;
        particle.play();
        Console.error("[effectId] = " + effectId);
        Console.error("[particle.guid] = " + particle.gameObjectId);
        if (!particle || !effectId) return;

        let toVec = Utils.circularRandomCoordinates(fromVec, 400, 20);
        let moddleVec = new mw.Vector((fromVec.x + toVec.x) / 2, (fromVec.y + toVec.y) / 2, fromVec.z + Utils.getRandomInteger(150, 250));
        let points: mw.Vector[] = Utils.getCurvePointsInNum([fromVec, moddleVec, toVec], 10);
        for (let j = 0; j < points.length - 1; ++j) {
            await new Promise<void>((resolve: () => void) => {
                new mw.Tween({ x: points[j].x, y: points[j].y, z: points[j].z })
                    .to({ x: points[j + 1].x, y: points[j + 1].y, z: points[j + 1].z }, 0.5 * 1000 / 10)
                    .onUpdate((pos) => {
                        particle.worldTransform.position = (new mw.Vector(pos.x, pos.y, pos.z));
                    })
                    .start();
                setTimeout(() => {
                    return resolve();
                }, 0.5 * 1000 / 10);
            });
        }
        if (this.particles[mapId] == null) this.particles[mapId] = new Map<number, mw.Effect>();
        this.particles[mapId].set(effectId, particle);
    }

    private play3DSound(fromVec: mw.Vector): void {
        let soundId = SoundService.play3DSound("148629", fromVec);
        TimeUtil.delaySecond(0.5).then(() => {
            SoundService.stop3DSound(soundId);
        });
    }
}