import { GameConfig } from "../../../config/GameConfig";
import { Utils } from "../../../Tools/utils";
import MallTab1_Generate from "../../../ui-generate/module/MallModule/MallTab1_generate";
import MallModuleC from "../MallModuleC";

export default class MallTab1 extends MallTab1_Generate {
	private mallModuleC: MallModuleC = null;
	private get getMallModuleC(): MallModuleC {
		if (!this.mallModuleC) {
			this.mallModuleC = ModuleService.getModule(MallModuleC);
		}
		return this.mallModuleC;
	}

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = UILayerMiddle;
		this.initUI();
		this.bindButton();
		this.bindAction();
	}

	private initUI(): void {
		this.updateSelectStateUI();
	}

	private bindButton(): void {
		this.mTab1Button.onClicked.add(this.addTab1Button.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectTab1Action.add(this.addSelectTab1Action.bind(this));
	}

	private addTab1Button(): void {
		this.getMallModuleC.onSelectTab1Action.call(this.tab1Id);
	}

	private tab1Id: number = 0;
	public initTab1(tab1Id: number): void {
		this.tab1Id = tab1Id;
		this.mTab1TextBlock.text = GameConfig.Tab1.getElement(this.tab1Id).Text;
	}

	private addSelectTab1Action(tab1Id: number): void {
		this.updateSelectState(this.tab1Id == tab1Id);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean): void {
		if (this.isSelect == isSelect) return;
		this.isSelect = isSelect;
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		if (this.isSelect) {
			Utils.setWidgetVisibility(this.mSelectTab1BgImage, mw.SlateVisibility.SelfHitTestInvisible);
			this.mTab1TextBlock.setFontColorByHex(`000000E5`);
			this.mTab1TextBlock.glyph = mw.UIFontGlyph.Bold;
		} else {
			Utils.setWidgetVisibility(this.mSelectTab1BgImage, mw.SlateVisibility.Collapsed);
			this.mTab1TextBlock.setFontColorByHex(`00000099`);
			this.mTab1TextBlock.glyph = mw.UIFontGlyph.Normal;
		}
	}
}
