import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
export class DanceModuleC extends ModuleC<DanceModuleS, null> {
    private danceID: string = "195754";
    private npcGuids: string[] = [
        "15EB31E9", "2A54C0FB", "1003851A", "280327E3", "17B100DE", "2148FA9D",
        "08F46BFB", "3CDB1A2F", "2C18804D", "0C76E3C8", "2EA57387", "10D02A7D",
        "104C6C3E", "2E526E30", "3D4A5F1F"
    ];
    private npcs: mw.Character[] = [];
    private npcAnimations: mw.Animation[] = [];
    private playerAnimation: mw.Animation = null;
    private playerLocation: mw.Vector = new mw.Vector(1850, 1567, 100);

    protected onStart(): void {
        InputUtil.onKeyDown(mw.Keys.NumPadOne, () => {
            this.startDance();
        });
        InputUtil.onKeyDown(mw.Keys.NumPadTwo, () => {
            this.stopDance();
        });

        this.initNpc();
    }

    private async initNpc(): Promise<void> {
        for (let i = 0; i < this.npcGuids.length; i++) {
            let npc = await GameObject.asyncFindGameObjectById(this.npcGuids[i]) as mw.Character;
            if (npc) {
                npc.displayName = "";
                this.npcs.push(npc);
            }
        }
        await TimeUtil.delaySecond(this.npcGuids.length * 0.5);
        // SoundService.play3DSound("118698", new mw.Vector(100, 0, 100), 0, 1);//TODO:去掉
        for (let i = 0; i < this.npcs.length; i++) {
            let npcAnimation = PlayerManagerExtesion.loadAnimationExtesion(this.npcs[i], this.danceID, false)
            npcAnimation.loop = 0;
            npcAnimation.play();
            this.npcAnimations.push(npcAnimation);
        }
        this.playerAnimation = PlayerManagerExtesion.loadAnimationExtesion(this.localPlayer.character, this.danceID, false)
        this.playerAnimation.loop = 0;
    }

    public startDance(): void {
        this.localPlayer.character.collisionWithOtherCharacterEnabled = false;
        this.server.net_setLocallyVisibility(false);
        this.localPlayer.character.worldTransform.position = (this.playerLocation);
        this.localPlayer.character.worldTransform.rotation = (new mw.Rotation(0, 0, 0));
        this.localPlayer.character.jumpEnabled = false;
        this.localPlayer.character.movementEnabled = false;
        for (let i = 0; i < this.npcAnimations.length; ++i) {
            this.npcAnimations[i].stop();
        }
        for (let i = 0; i < this.npcAnimations.length; ++i) {
            this.npcAnimations[i].play();
        }
        if (this.playerAnimation) {
            this.playerAnimation.play();
        }
    }

    public stopDance(): void {
        if (this.playerAnimation) {
            this.playerAnimation.stop();
        }
        this.localPlayer.character.collisionWithOtherCharacterEnabled = true;
        this.server.net_setLocallyVisibility(true);
        this.localPlayer.character.jumpEnabled = true;
        this.localPlayer.character.movementEnabled = true;
    }

    public net_setLocallyVisibility(playerId: number, isVisible): void {
        if (playerId == this.localPlayerId) return;
        this.setPlayerLocallyVisibility(playerId, isVisible);
    }

    private async setPlayerLocallyVisibility(playerId: number, isVisible: boolean): Promise<void> {
        let player = await Player.asyncGetPlayer(playerId);
        if (player && player.character) {
            player.character.setVisibility(isVisible ? mw.PropertyStatus.On : mw.PropertyStatus.Off);
        }
    }
}

export class DanceModuleS extends ModuleS<DanceModuleC, null> {
    protected onStart(): void {
    }

    public net_setLocallyVisibility(isVisible: boolean): void {
        this.getAllClient().net_setLocallyVisibility(this.currentPlayerId, isVisible);
    }
}