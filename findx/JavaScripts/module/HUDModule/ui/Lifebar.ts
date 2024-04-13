import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import Console from "../../../Tools/Console";
import Lifebar_Generate from "../../../ui-generate/module/HUDUI/Lifebar_generate";

@Component
export default class Lifebar extends mw.Script {
    @mw.Property({ replicated: true, onChanged: "onHpChange" })
    public maxHp: number = 0;
    @mw.Property({ replicated: true, onChanged: "onHpChange" })
    public hp: number = 0;
    @mw.Property({ replicated: true, onChanged: "onNameChange" })
    public playerName: string = "";
    @mw.Property({ replicated: true, onChanged: "onLevelChange" })
    public playerLevel: number = -1;
    private _hpBarUI: Lifebar_Generate;
    private _hpBarWidget: mw.UIWidget;
    private _isInit = false;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient()) {
            Console.log("初始化血条UI");
            this.init();
        }
    }

    private async init() {
        this._hpBarUI = mw.UIService.create(Lifebar_Generate);
        this._hpBarWidget = await SpawnManager.asyncSpawn<mw.UIWidget>({ guid: "UIWidget", replicates: false });
        this._hpBarWidget.setTargetUIWidget(this._hpBarUI.uiWidgetBase);
        this._hpBarWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI;
        let character = this.gameObject as mw.Character;
        this._hpBarWidget.parent = (character.overheadUI);
        this._hpBarWidget.localTransform.position = Vector.up.multiply(0);
        this._isInit = true;
        this.onHpChange();
    }

    private onHpChange() {
        if (!this._isInit) {
            return;
        }
        this._hpBarUI.mLifebar.percent = this.hp / this.maxHp;
        this._hpBarUI.mLifeText.text = `${this.hp}/${this.maxHp}`;
    }

    private onNameChange() {
        if (!this._isInit) {
            return;
        }
        this._hpBarUI.mNameText.text = this.playerName;
    }

    private onLevelChange() {
        if (!this._isInit) {
            return;
        }
        if (this.playerLevel == 0) {
            this._hpBarUI.mLevelText.text = "普通人(0 级)";
            return;
        }
        let starLevel = this.playerLevel % 10;
        let level = Math.floor(this.playerLevel / 10);
        Console.error("操蛋#" + starLevel + "#" + level);
        let playerLevelTxt = "";
        switch (level) {
            case 0:
                playerLevelTxt = "斗之气 " + starLevel + " 段(" + this.playerLevel + "级)";
                break;
            case 1:
                playerLevelTxt = "斗者 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 2:
                playerLevelTxt = "斗师 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 3:
                playerLevelTxt = "大斗师 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 4:
                playerLevelTxt = "斗灵 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 5:
                playerLevelTxt = "斗王 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 6:
                playerLevelTxt = "斗皇 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 7:
                playerLevelTxt = "斗宗 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 8:
                playerLevelTxt = "斗尊 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            case 9:
                playerLevelTxt = "斗圣 " + starLevel + " 星(" + this.playerLevel + "级)";
                break;
            default:
                playerLevelTxt = "斗帝 " + (this.playerLevel - 100) + " 星(" + this.playerLevel + "级)";
                break;
        }
        this._hpBarUI.mLevelText.text = playerLevelTxt;
    }

    protected onDestroy(): void {
        this._hpBarUI?.destroy();
        this._hpBarWidget?.destroy();
    }
}