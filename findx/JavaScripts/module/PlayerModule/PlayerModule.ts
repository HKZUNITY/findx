import Console from "../../Tools/Console";
import { FlyText } from "../../Common/FlyText";
import { IBlockingVolumeElement } from "../../config/BlockingVolume";
import { GameConfig } from "../../config/GameConfig";
import LevelPanel_Generate from "../../ui-generate/module/PlayerModule/LevelPanel_generate";
import ShopModuleC from "../ShopModule/ShopModuleC";

export class PlayerLevelData extends Subdata {
    @Decorator.persistence()
    public cleareds: number[] = [];

    protected initDefaultData(): void {
        this.cleareds = [];
    }

    public saveCleared(cleared: number): void {
        if (this.cleareds.includes(cleared)) return;
        this.cleareds.push(cleared);
    }
}

export class PlayerModuleC extends ModuleC<PlayerModuleS, PlayerLevelData> {
    private shopModuleC: ShopModuleC = null;
    private blockingVolumeElements: IBlockingVolumeElement[] = [];
    protected onStart(): void {
        this.shopModuleC = ModuleService.getModule(ShopModuleC);
        this.shopModuleC.onPlayerLevelAction.add((lv: number) => {
            this.currentLv = lv;
            this.updateBlockingVolume();
        });
    }

    private currentLv: number = 0;
    protected onEnterScene(sceneType: number): void {
        if (!this.shopModuleC) {
            this.shopModuleC = ModuleService.getModule(ShopModuleC);
        }
        this.currentLv = this.shopModuleC.getLevel();
        this.initDatas();
    }

    private allTriggers: mw.Trigger[] = [];
    private allBlockingVolumes: mw.BlockingVolume[] = [];
    private allLevelPanels: LevelPanel_Generate[] = [];
    private async initDatas(): Promise<void> {
        this.blockingVolumeElements = GameConfig.BlockingVolume.getAllElement();
        for (let i = 0; i < this.blockingVolumeElements.length; ++i) {
            let blockingVolumeElement = this.blockingVolumeElements[i];
            this.allLv.push(blockingVolumeElement.Lv);
            if (!blockingVolumeElement.TriggerGuid) continue;
            let trigger = await GameObject.asyncFindGameObjectById(blockingVolumeElement.TriggerGuid) as mw.Trigger;
            if (trigger) {
                this.allTriggers.push(trigger);
                // if (this.currentLv < blockingVolumeElement.Lv) {
                trigger.onEnter.add(this.onEnterTrigger.bind(this, blockingVolumeElement.Lv, i));
                // } else {
                //     trigger.destroy();
                //     this.allTriggers[i] = null;
                // }
            }
            let blockingVolume = await GameObject.asyncFindGameObjectById(blockingVolumeElement.BlockingVolumeGuid) as mw.BlockingVolume;
            if (blockingVolume) {
                this.allBlockingVolumes.push(blockingVolume);
                if (this.currentLv >= blockingVolumeElement.Lv) {
                    blockingVolume.addPassableTarget(this.localPlayer.character);
                    // blockingVolume.destroy();
                    this.allBlockingVolumes[i] = null;
                } else {
                    blockingVolume.removePassableTarget(this.localPlayer.character);
                }
            }
            let levelPanel = mw.UIService.create(LevelPanel_Generate);
            let levelPanelWidget = await GameObject.asyncFindGameObjectById(blockingVolumeElement.WorldUIGuid) as mw.UIWidget;
            if (levelPanelWidget) {
                levelPanelWidget.setTargetUIWidget(levelPanel.uiWidgetBase);
                levelPanelWidget.widgetSpace = mw.WidgetSpaceMode.World;
                this.allLevelPanels.push(levelPanel);
                if (this.data.cleareds.includes(blockingVolumeElement.ID)) {
                    levelPanel.mTextBlock.text = "第" + (i + 1) + "已通关";
                } else {
                    if (this.currentLv >= blockingVolumeElement.Lv) {
                        levelPanel.mTextBlock.text = "第" + (i + 1) + "关已解锁";
                    } else {
                        levelPanel.mTextBlock.text = blockingVolumeElement.Lv + "级解锁";
                    }
                }
            }
            Console.error("[hkz] - i = " + i);
        }
    }
    private levelLoc: mw.Vector[] = [
        new mw.Vector(198139, 37965, 64390),
        new mw.Vector(198139, -10699, 64390),
        new mw.Vector(198139, 3315, 64390),
        new mw.Vector(198139, 14030, 64390),
        new mw.Vector(198139, 23845, 64390)
    ];
    private onEnterTrigger(lv: number, i: number, character: mw.Character): void {
        if (character != Player.localPlayer.character) return;
        if (this.currentLv >= lv) {
            this.localPlayer.character.worldTransform.position = (this.levelLoc[i]);
        } else {
            FlyText.instance.showFlyText("等级不足", this.localPlayer.character.worldTransform.position);
        }
    }

    private allLv: number[] = [];
    private updateBlockingVolume(): void {
        for (let i = 0; i < this.allLv.length; ++i) {
            if (!this.allBlockingVolumes[i]) continue;
            if (this.currentLv >= this.allLv[i]) {
                this.allBlockingVolumes[i].addPassableTarget(this.localPlayer.character);
                // this.allBlockingVolumes[i].destroy();
                this.allBlockingVolumes[i] = null;
                // this.allTriggers[i].onEnter.remove(this.onEnterTrigger.bind(this));
                // this.allTriggers[i].destroy();
                // this.allTriggers[i] = null;
                this.allLevelPanels[i].mTextBlock.text = "第" + (i + 1) + "关已解锁";
            }
        }
    }

    private updateLevelPanel(id: number): void {
        if (this.data.cleareds.includes(id)) return;
        this.allLevelPanels[id - 1].mTextBlock.text = "第" + id + "关已通关";
        this.saveCleared(id);
    }

    public saveCleared(cleared: number): void {
        this.server.net_saveCleared(cleared);
    }
}

export class PlayerModuleS extends ModuleS<PlayerModuleC, PlayerLevelData> {

    protected onStart(): void {

    }

    @Decorator.noReply()
    public net_saveCleared(cleared: number): void {
        this.currentData.saveCleared(cleared);
    }
}