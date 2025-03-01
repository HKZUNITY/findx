import { GameConfig } from "../../../config/GameConfig";
import { Utils } from "../../../Tools/utils";
import ColorPickPanel_Generate from "../../../ui-generate/module/MallModule/ColorPickPanel_generate";
import { ColorPickTab2Data } from "../MallData";
import MallModuleC from "../MallModuleC";
import ColorPickTab1 from "./ColorPickTab1";
import ColorPickTab2 from "./ColorPickTab2";
import ColorPickTab3 from "./ColorPickTab3";
import MallPanel from "./MallPanel";

export default class ColorPickPanel extends ColorPickPanel_Generate {
	private mallModuleC: MallModuleC = null;
	private get getMallModuleC(): MallModuleC {
		if (!this.mallModuleC) {
			this.mallModuleC = ModuleService.getModule(MallModuleC);
		}
		return this.mallModuleC;
	}

	private mallPanel: MallPanel = null;
	private get getMallPanel(): MallPanel {
		if (!this.mallPanel) {
			this.mallPanel = UIService.getUI(MallPanel);
		}
		return this.mallPanel;
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
		this.mSaveTextBlock.text = StringUtil.format(GameConfig.Language.Text_SaveColor.Value, ``);
	}

	private bindButton(): void {
		this.mCloseButton.onClicked.add(this.addCloseButton.bind(this));
		this.mSaveButton.onClicked.add(this.addSaveButton.bind(this));
	}

	private addCloseButton(): void {
		this.hide();
		this.getMallModuleC.onCloseColorPickPanelAction.call();
	}

	private addSaveButton(): void {
		this.hide();
		this.getMallModuleC.onSaveColorPickPanelAction.call();
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectColorPickTab2Action.add(this.addSelectColorPickTab2Action.bind(this));
		this.mColorPick.onColorChanged.add(this.addColorChanged.bind(this));
	}

	public showColorPickPanel(tab1Text: string, name: string, colorPickTab2Datas: ColorPickTab2Data[], colorPickTab3Colors: string[]): void {
		this.colorPickText = tab1Text;
		this.mSaveTextBlock.text = StringUtil.format(GameConfig.Language.Text_SaveColor.Value, name);
		this.refreshColorPickTab1();
		this.colorPickTab2Datas = colorPickTab2Datas;
		this.refreshColorPickTab2();
		this.colorPickTab3Colors = colorPickTab3Colors;
		this.refreshColorPickTab3();
		this.refreshColorPick();
		this.show();
		this.getMallPanel.onOffLeftCanvas(false);
	}

	private colorPickText: string = null;
	private colorPickTab1: ColorPickTab1 = null;
	private refreshColorPickTab1(): void {
		if (!this.colorPickTab1) {
			this.colorPickTab1 = mw.UIService.getUI(ColorPickTab1);
			this.mTab1ContentCanvas.addChild(this.colorPickTab1.uiObject);
		}
		this.colorPickTab1.refreshColorPickTab1(this.colorPickText);
	}

	private currenrColorPickTab2Index: number = 0;
	private colorPickTab2Datas: ColorPickTab2Data[] = [];
	private colorPickTab2s: ColorPickTab2[] = [];
	private refreshColorPickTab2(): void {
		this.currenrColorPickTab2Index = 0;
		if (this.colorPickTab2Datas.length > this.colorPickTab2s.length) {
			for (let i = 0; i < this.colorPickTab2s.length; ++i) {
				this.colorPickTab2s[i].initTab2(i, this.colorPickTab2Datas[i]);
				Utils.setWidgetVisibility(this.colorPickTab2s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.colorPickTab2s.length; i < this.colorPickTab2Datas.length; ++i) {
				let colorPickTab2 = mw.UIService.create(ColorPickTab2);
				this.mTab2ContentCanvas.addChild(colorPickTab2.uiObject);
				colorPickTab2.initTab2(i, this.colorPickTab2Datas[i]);
				this.colorPickTab2s.push(colorPickTab2);
			}
		} else {
			for (let i = 0; i < this.colorPickTab2Datas.length; ++i) {
				this.colorPickTab2s[i].initTab2(i, this.colorPickTab2Datas[i]);
				Utils.setWidgetVisibility(this.colorPickTab2s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.colorPickTab2Datas.length; i < this.colorPickTab2s.length; ++i) {
				Utils.setWidgetVisibility(this.colorPickTab2s[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
		this.colorPickTab2s[this.currenrColorPickTab2Index].updateSelectState(true);
	}

	private addSelectColorPickTab2Action(index: number): void {
		if (this.currenrColorPickTab2Index == index) return;
		this.currenrColorPickTab2Index = index;
	}

	private colorPickTab3Colors: string[] = [];
	private colorPickTab3s: ColorPickTab3[] = [];
	private colorPickTab3Map: Map<string, ColorPickTab3> = new Map<string, ColorPickTab3>();
	private refreshColorPickTab3(): void {
		this.colorPickTab3Map.clear();
		if (this.colorPickTab3Colors.length > this.colorPickTab3s.length) {
			for (let i = 0; i < this.colorPickTab3s.length; ++i) {
				this.colorPickTab3s[i].initColorPickTab3(i, this.colorPickTab3Colors[i]);
				Utils.setWidgetVisibility(this.colorPickTab3s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.colorPickTab3Map.set(this.colorPickTab3Colors[i], this.colorPickTab3s[i]);
			}
			for (let i = this.colorPickTab3s.length; i < this.colorPickTab3Colors.length; ++i) {
				let colorPickTab3 = mw.UIService.create(ColorPickTab3);
				this.mTab3ContentCanvas.addChild(colorPickTab3.uiObject);
				colorPickTab3.initColorPickTab3(i, this.colorPickTab3Colors[i]);
				this.colorPickTab3s.push(colorPickTab3);
				this.colorPickTab3Map.set(this.colorPickTab3Colors[i], colorPickTab3);
			}
		} else {
			for (let i = 0; i < this.colorPickTab3Colors.length; ++i) {
				this.colorPickTab3s[i].initColorPickTab3(i, this.colorPickTab3Colors[i]);
				Utils.setWidgetVisibility(this.colorPickTab3s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.colorPickTab3Map.set(this.colorPickTab3Colors[i], this.colorPickTab3s[i]);
			}
			for (let i = this.colorPickTab3Colors.length; i < this.colorPickTab3s.length; ++i) {
				Utils.setWidgetVisibility(this.colorPickTab3s[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
		this.checkColorPickTab3();
	}

	private checkColorPickTab3(): void {
		if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) return;
		let colorKey = this.colorPickTab2Datas[this.currenrColorPickTab2Index].color;
		for (let key of this.colorPickTab3Map.keys()) {
			if (Utils.isEqulaLinearColor(Utils.colorHexToLinearColorToString(key), colorKey)) {
				this.colorPickTab3Map.get(key).updateSelectState(true);
				break;
			}
		}
	}

	private refreshColorPick(): void {
		if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) return;
		this.isLockColorPick = true;
		this.mColorPick.color = this.colorPickTab2Datas[this.currenrColorPickTab2Index].color;
		this.isLockColorPick = false;
	}

	public checkColorPickTab3AndColorPick(color: mw.LinearColor): void {
		if (!color) return;
		this.colorPickTab3Map.forEach((value: ColorPickTab3, key: string) => {
			value.updateSelectState(Utils.isEqulaLinearColor(Utils.colorHexToLinearColorToString(key), color));
		});
		this.isLockColorPick = true;
		this.mColorPick.color = color;
		this.isLockColorPick = false;
	}

	public refreshColorPickTab2AndColorPick(color: mw.LinearColor): void {
		if (!color) return;
		this.isLockColorPick = true;
		this.mColorPick.color = color;
		this.isLockColorPick = false;
		if (this.currenrColorPickTab2Index < 0 || !this.colorPickTab2s || this.currenrColorPickTab2Index >= this.colorPickTab2s.length) return;
		this.colorPickTab2s[this.currenrColorPickTab2Index].refreshColorImage(color);
	}

	private isLockColorPick: boolean = false;
	private addColorChanged(Content: mw.LinearColor): void {
		if (this.isLockColorPick) return;
		this.getMallModuleC.onColorPickChangedAction.call(Content);
		this.colorPickTab3Map.forEach((value: ColorPickTab3, key: string) => {
			value.updateSelectState(false);
		});
		if (this.currenrColorPickTab2Index < 0 || !this.colorPickTab2s || this.currenrColorPickTab2Index >= this.colorPickTab2s.length) return;
		this.colorPickTab2s[this.currenrColorPickTab2Index].refreshColorImage(Content);
	}
}
