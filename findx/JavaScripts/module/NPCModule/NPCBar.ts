import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import Console from "../../Tools/Console";
import NPCBar_Generate from "../../ui-generate/module/NPCModule/NPCBar_generate";

@Component
export default class NPCBar extends mw.Script {
    @mw.Property({ replicated: true, onChanged: "onHpChange" })
    public maxHp: number = 0;
    @mw.Property({ replicated: true, onChanged: "onHpChange" })
    public hp: number = 0;
    @mw.Property({ replicated: true, onChanged: "onNameChange" })
    private _hpBarUI: NPCBar_Generate;
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
        this._hpBarUI = mw.UIService.create(NPCBar_Generate);
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
        this._hpBarUI.mProgressBar.percent = this.hp / this.maxHp;
        this._hpBarUI.mHpTextBlock.text = `${this.hp}/${this.maxHp}`;
    }

    protected onDestroy(): void {
        this._hpBarUI?.destroy();
        this._hpBarWidget?.destroy();
    }
}