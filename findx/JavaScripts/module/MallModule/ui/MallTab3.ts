import { GameConfig } from "../../../config/GameConfig";
import MallTab3_Generate from "../../../ui-generate/module/MallModule/MallTab3_generate";
import MallModuleC from "../MallModuleC";

export default class MallTab3 extends MallTab3_Generate {
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
		this.mTab3Button.onClicked.add(this.addTab3Button.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectTab3Action.add(this.addSelectTab3Action.bind(this));
	}

	private addTab3Button(): void {
		this.getMallModuleC.onSelectTab3Action.call(this.tab3Id);
	}

	private tab3Id: number = 0;
	public initTab3(tab3Id: number): void {
		this.tab3Id = tab3Id;
		this.mTab3TextBlock.text = GameConfig.Tab3.getElement(this.tab3Id).Text;
	}

	private addSelectTab3Action(tab3Id: number): void {
		this.updateSelectState(this.tab3Id == tab3Id);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean): void {
		if (this.isSelect == isSelect) return;
		this.isSelect = isSelect;
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		if (this.isSelect) {
			this.mTab3TextBlock.setFontColorByHex(`000000E5`);
			this.mTab3TextBlock.glyph = mw.UIFontGlyph.Bold;
		} else {
			this.mTab3TextBlock.setFontColorByHex(`00000099`);
			this.mTab3TextBlock.glyph = mw.UIFontGlyph.Normal;
		}
	}
}
