import { Utils } from "../../../Tools/utils";
import ColorPickTab2_Generate from "../../../ui-generate/module/MallModule/ColorPickTab2_generate";
import { ColorPickTab2Data } from "../MallData";
import MallModuleC from "../MallModuleC";

export default class ColorPickTab2 extends ColorPickTab2_Generate {
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
		this.getMallModuleC.onSelectColorPickTab2Action.add(this.addSelectColorPickTab2Action.bind(this));
	}

	private addTab2Button(): void {
		this.getMallModuleC.onSelectColorPickTab2Action.call(this.index);
	}

	private index: number = -1;
	private colorPickTab2Data: ColorPickTab2Data = null;
	public initTab2(index: number, colorPickTab2Data: ColorPickTab2Data): void {
		this.index = index;
		this.colorPickTab2Data = colorPickTab2Data;
		this.mTab2TextBlock.text = colorPickTab2Data.text;
		this.mColorImage.imageColor = colorPickTab2Data.color;
		this.updateSelectState(false);
	}

	public refreshColorImage(color: mw.LinearColor): void {
		this.mColorImage.imageColor = color;
	}

	private addSelectColorPickTab2Action(index: number): void {
		this.updateSelectState(this.index == index);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean): void {
		if (this.isSelect == isSelect) return;
		this.isSelect = isSelect;
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		if (this.isSelect) {
			Utils.setWidgetVisibility(this.mSelectTab2BgImage, mw.SlateVisibility.SelfHitTestInvisible);
			this.mTab2TextBlock.setFontColorByHex(`000000E5`);
			this.mTab2TextBlock.glyph = mw.UIFontGlyph.Bold;
		} else {
			Utils.setWidgetVisibility(this.mSelectTab2BgImage, mw.SlateVisibility.Collapsed);
			this.mTab2TextBlock.setFontColorByHex(`00000099`);
			this.mTab2TextBlock.glyph = mw.UIFontGlyph.Normal;
		}
	}
}
