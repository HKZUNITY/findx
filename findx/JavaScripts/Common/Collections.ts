import { SpawnManager } from "../Modified027Editor/ModifiedSpawn";
import { CollectionConfig } from "../config/Collection";
import { GameConfig } from "../config/GameConfig";
import CollectionModuleC from "../module/CollectionMOdule/CollectionModuleC";
import { CollectionType } from "../module/CollectionMOdule/ui/CollectionPanel";
import CollectionTipPanel from "../module/CollectionMOdule/ui/CollectionTipPanel";
import P_Tips from "../Common/P_Tips";

@Component
export default class Collections extends mw.Script {

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
    private collectionTipPanel: CollectionTipPanel = null;
    private get getCollectionTipPanel(): CollectionTipPanel {
        if (this.collectionTipPanel == null) {
            this.collectionTipPanel = mw.UIService.getUI(CollectionTipPanel);
        }
        return this.collectionTipPanel;
    }
    private collectionModuleC: CollectionModuleC = null;
    private get getCollectionModuleC(): CollectionModuleC {
        if (this.collectionModuleC == null) {
            this.collectionModuleC = ModuleService.getModule(CollectionModuleC);
        }
        return this.collectionModuleC;
    }
    /**宝箱Guid */
    private treasureBoxGuids: string[] = ["20910", "20915", "20959", "21008", "21013", "21006", "141901", "141896"];
    private collections: CollectionConfig = null;
    private treasureBoxGos: mw.GameObject[] = [];

    /**客户端的onStart */
    private async onStartC(): Promise<void> {
        await ModuleService.ready();
        this.collections = GameConfig.Collection;
        TimeUtil.delaySecond(5).then(() => {
            this.findGameObject();
        });
    }

    /**find GameObject */
    private findGameObject(): void {
        let length = this.collections.getAllElement().length;
        let i = 0;
        let interval = TimeUtil.setInterval(async () => {
            let collection = this.collections.getElement(i + 1);
            let triggerGuid = collection.TriggerGuid;
            let trigger: mw.Trigger = null;
            if (triggerGuid) {
                trigger = await GameObject.asyncFindGameObjectById(triggerGuid) as mw.Trigger;
                trigger.asyncReady().then(() => {
                    trigger.onEnter.add((char: mw.Character) => {
                        this.onEnterTrigger(char, collection.id, collection.CollectionIcon, collection.Annotation, collection.CollectionType);
                    });
                    // Console.error("id = " + id);
                });
            }
            let id = collection.id;
            let treasureBoxGuid = "";
            switch (collection.CollectionType) {
                case CollectionType.FightingSkill:
                    treasureBoxGuid = this.getCollectionModuleC.isOwnItem(id) ? this.treasureBoxGuids[1] : this.treasureBoxGuids[0];
                    break;
                case CollectionType.Gong:
                    treasureBoxGuid = this.getCollectionModuleC.isOwnItem(id) ? this.treasureBoxGuids[3] : this.treasureBoxGuids[2];
                    break;
                case CollectionType.Elixir:
                    treasureBoxGuid = this.getCollectionModuleC.isOwnItem(id) ? this.treasureBoxGuids[5] : this.treasureBoxGuids[4];
                    break;
                case CollectionType.AnomalousFire:
                    treasureBoxGuid = this.getCollectionModuleC.isOwnItem(id) ? this.treasureBoxGuids[7] : this.treasureBoxGuids[6];
                    break;
                default:
                    break;
            }
            let pos = trigger.worldTransform.position;
            this.getCollectionModuleC.setItemVector3(id, pos);
            let treasureBoxGo = await SpawnManager.asyncSpawn<mw.GameObject>({
                guid: treasureBoxGuid,
                replicates: false,
                transform: new mw.Transform(new mw.Vector(pos.x, pos.y, pos.z - 50), trigger.worldTransform.rotation, mw.Vector.one)
            });
            this.treasureBoxGos.push(treasureBoxGo);
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(interval);
            }
        }, 0.2);
    }

    /**玩家进入触发器 */
    private onEnterTrigger(char: mw.Character, id: number, icon: string, name: string, collectionType: CollectionType): void {
        if (char != Player.localPlayer.character) return;
        if (this.getCollectionModuleC.isOwnItem(id)) {
            P_Tips.show("宝箱是空的哎~");
            return;
        }
        this.getCollectionModuleC.saveAcquiredItem(id);
        this.getCollectionTipPanel.showCollectionTip(icon, name);
        this.changeTreasureBox(id, collectionType);
    }

    /**更换宝箱 */
    private async changeTreasureBox(id: number, collectionType: CollectionType): Promise<void> {
        let treasureBoxGuid = "";
        switch (collectionType) {
            case CollectionType.FightingSkill:
                treasureBoxGuid = this.treasureBoxGuids[1];
                break;
            case CollectionType.Gong:
                treasureBoxGuid = this.treasureBoxGuids[3];
                break;
            case CollectionType.Elixir:
                treasureBoxGuid = this.treasureBoxGuids[5];
                break;
            case CollectionType.AnomalousFire:
                treasureBoxGuid = this.treasureBoxGuids[7];
                break;
            default:
                break;
        }
        let tmpATreasureBox = this.treasureBoxGos[id - 1];
        let treasureBoxGo = await SpawnManager.asyncSpawn<mw.GameObject>({
            guid: treasureBoxGuid,
            replicates: false,
            transform: tmpATreasureBox.worldTransform
        });
        tmpATreasureBox.destroy();
        this.treasureBoxGos[id - 1] = treasureBoxGo;
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