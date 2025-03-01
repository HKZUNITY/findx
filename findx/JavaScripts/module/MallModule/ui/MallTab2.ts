import { GameConfig } from "../../../config/GameConfig";
import MallTab2_Generate from "../../../ui-generate/module/MallModule/MallTab2_generate";
import MallModuleC from "../MallModuleC";

export default class MallTab2 extends MallTab2_Generate {
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
		this.mTab2Button.onClicked.add(this.addTab2Button.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectTab2Action.add(this.addSelectTab2Action.bind(this));
	}

	private addTab2Button(): void {
		this.getMallModuleC.onSelectTab2Action.call(this.tab2Id);
	}

	private tab2Id: number = 0;
	public initTab2(tab2Id: number): void {
		this.tab2Id = tab2Id;
		this.mTab2TextBlock.text = GameConfig.Tab2.getElement(this.tab2Id).Text;
	}

	private addSelectTab2Action(tab2Id: number): void {
		this.updateSelectState(this.tab2Id == tab2Id);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean): void {
		if (this.isSelect == isSelect) return;
		this.isSelect = isSelect;
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		if (this.isSelect) {
			this.mTab2TextBlock.setFontColorByHex(`000000E5`);
			this.mTab2TextBlock.glyph = mw.UIFontGlyph.Bold;
		} else {
			this.mTab2TextBlock.setFontColorByHex(`00000099`);
			this.mTab2TextBlock.glyph = mw.UIFontGlyph.Normal;
		}
	}
}
