import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import Console from "../../Tools/Console";
import { Utils } from "../../Tools/utils";
import HUDModuleC from "../HUDModule/HUDModuleC";
import SignInModuleC from "../SignInModule/SignInModuleC";
import PetPanel from "./ui/PetPanel";
import PetRafflePanel from "./ui/PetRafflePanel";

export class PetData extends Subdata {
    /**宠物集合 */
    @Decorator.persistence()
    public petList: number[] = [];
    /**上次登录时间 */
    @Decorator.persistence()
    public lastPetDay: string = "";
    /**是否拥有免费次数 */
    @Decorator.persistence()
    public isFreeCount: boolean = true;
    /**抽奖宠物集合 */
    @Decorator.persistence()
    public petRaffleList: number[] = [];

    protected initDefaultData(): void {
        this.petList = [];
        this.petRaffleList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.lastPetDay = "";
        this.isFreeCount = true;
    }

    /**保存宠物 */
    public savePetList(value: number): void {
        this.petList.push(value);
        this.save(true);
    }

    public saveIsFreeCount(value: boolean): void {
        this.isFreeCount = value;
        this.save(true);
    }

    /**
     * 记录今天是那一天
     * @param whatDay 那一天
     */
    public saveLastPetDayAndRandomIds(whatDay: string, value: number[]): void {
        this.lastPetDay = whatDay;
        this.petRaffleList = value;
        this.save(true);
    }
}

export class PetModuleC extends ModuleC<PetModuleS, PetData> {
    private hudModuleC: HUDModuleC = null;
    private petPanel: PetPanel = null;
    private petRafflePanel: PetRafflePanel = null;

    protected onStart(): void {
        this.initData();
        this.registerAction();
    }

    private initData(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.petPanel = mw.UIService.getUI(PetPanel);
        this.petRafflePanel = mw.UIService.getUI(PetRafflePanel);
    }

    private registerAction(): void {
        this.hudModuleC.onOpenPetAction.add(() => {
            this.petPanel.show();
        });
        this.hudModuleC.onOpenRaffleAction.add(() => {
            this.petRafflePanel.show();
        });

        InputUtil.onKeyDown(mw.Keys.H, () => {
            this.savePetList(Utils.getRandomInteger(1, 18));
        });
    }

    private followASpeed: number = 0.01;
    // private followBSpeed: number = 0.02;
    private pet: mw.Character = null;
    private prePlayerLoc: mw.Vector = null;
    private petGuid: string = null;
    private petTween: mw.Tween<any> = null;

    protected onEnterScene(sceneType: number): void {
        this.initPetData();
        TimeUtil.setInterval(() => {
            this.petMoveToPlayer();
        }, this.followASpeed);

        TimeUtil.delaySecond(3).then(() => {
            let curWhatDay = Utils.getDay();
            let ids: number[] = [];
            if (this.data.lastPetDay != curWhatDay) {
                ids = Utils.getRandomArr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 12);
                this.saveLastPetDayAndRandomIds(curWhatDay, ids);
                this.saveIsFreeCount(true);
            }
            else {
                ids = this.data.petRaffleList;
            }
            this.petRafflePanel.updateIcons(ids);
        });
    }

    private async initPetData(): Promise<void> {
        this.pet = await GameObject.asyncFindGameObjectById("33B99E35") as mw.Character;
        this.pet.worldTransform.scale = (mw.Vector.one.multiply(0.5));
        PlayerManagerExtesion.rpcPlayAnimation(this.pet, "46298", 0)
        this.pet.collisionWithOtherCharacterEnabled = false;
        this.pet.displayName = "";
        this.prePlayerLoc = this.pet.worldTransform.position;
    }

    public changePet(petGuid: string): void {
        this.petGuid = petGuid;
        this.localPlayer.character.addMovement(this.localPlayer.character.worldTransform.getForwardVector());
        this.pet.description.base.wholeBody = this.petGuid;
    }

    private petMoveToPlayer(): void {
        if (this.petGuid != null) {
            Console.log("[hkz]");

            let playerLoc = this.localPlayer.character.worldTransform.position;
            if (Math.abs(playerLoc.x - this.prePlayerLoc.x) < 0.1
                && Math.abs(playerLoc.y - this.prePlayerLoc.y) < 0.1
                && Math.abs(playerLoc.z - this.prePlayerLoc.z) < 0.1) return;

            this.prePlayerLoc = playerLoc;

            let playerForward = this.localPlayer.character.worldTransform.getForwardVector();
            let offsetLocRight = this.localPlayer.character.worldTransform.getRightVector();

            let offsetLoc = new mw.Vector((playerForward.x * -50) + (offsetLocRight.x * 50), (playerForward.y * -50) + (offsetLocRight.y * 50), 50);
            let toLoc = new mw.Vector(playerLoc.x + offsetLoc.x, playerLoc.y + offsetLoc.y, playerLoc.z + offsetLoc.z);

            this.pet.worldTransform.rotation = (new mw.Rotation(playerForward, mw.Vector.zero));
            this.pet.worldTransform.position = (toLoc);
            Console.error("toLoc = " + toLoc);
        }
    }

    public savePetList(pet: number): void {
        if (this.data.petList.includes(pet)) return;
        this.petPanel.getPetItem(pet);
        this.server.net_savePetList(pet);
    }

    public saveLastPetDayAndRandomIds(petLastDay: string, value: number[]): void {
        this.server.net_saveLastPetDayAndRandomIds(petLastDay, value);
    }

    public saveIsFreeCount(value: boolean): void {
        this.server.net_saveIsFreeCount(value);
    }

    public getIsFreeCount(): boolean {
        return this.data.isFreeCount;
    }

    public isOwn(id: number): boolean {
        return this.data.petList.includes(id);
    }
}

export class PetModuleS extends ModuleS<PetModuleC, PetData> {

    protected onStart(): void {
    }

    protected onPlayerEnterGame(player: mw.Player): void {

    }
    protected onPlayerLeft(player: mw.Player): void {

    }

    public net_savePetList(pet: number): void {
        this.currentData.savePetList(pet);
    }

    public net_saveLastPetDayAndRandomIds(petLastDay: string, value: number[]): void {
        this.currentData.saveLastPetDayAndRandomIds(petLastDay, value);
    }

    public net_saveIsFreeCount(value: boolean): void {
        this.currentData.saveIsFreeCount(value);
    }
}