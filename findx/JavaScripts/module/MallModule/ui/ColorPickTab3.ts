import ColorPickTab3_Generate from "../../../ui-generate/module/MallModule/ColorPickTab3_generate";
import MallModuleC from "../MallModuleC";

export default class ColorPickTab3 extends ColorPickTab3_Generate {
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
		this.mBgImage.imageGuid = `199136`;
		this.updateSelectStateUI();
	}

	private bindButton(): void {
		this.mSelectButton.onClicked.add(this.addSelectButton.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectColorPickTab3Action.add(this.addSelectItemAction.bind(this));
	}

	private addSelectButton(): void {
		this.getMallModuleC.onSelectColorPickTab3Action.call(this.index);
	}

	private index: number = -1;
	private color: string = null;
	public initColorPickTab3(index: number, color: string): void {
		this.index = index;
		this.color = color;
		this.mBgImage.setImageColorByHex(color);
		this.updateSelectState(false);
	}

	private addSelectItemAction(index: number): void {
		this.updateSelectState(this.index == index);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean): void {
		if (this.isSelect == isSelect) return;
		this.isSelect = isSelect;
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		this.mSelectImage.renderOpacity = this.isSelect ? 1 : 0;
	}
}
