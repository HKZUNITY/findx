import MallItem_Color_Generate from "../../../ui-generate/module/MallModule/MallItem_Color_generate";
import { TabType } from "../MallData";
import MallModuleC from "../MallModuleC";

export default class MallItem_Color extends MallItem_Color_Generate {
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
		// this.mBgImage.imageGuid = `199136`;
		this.updateSelectStateUI();
	}

	private bindButton(): void {
		this.mSelectButton.onClicked.add(this.addItemButton.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectItemAction.add(this.addSelectItemAction.bind(this));
	}

	private addItemButton(): void {
		if (this.assetId == `ColorPick`) {
			this.getMallModuleC.onOpenColorPickAction.call(this.tabType, this.tabId);
		} else {
			this.getMallModuleC.onSelectItemAction.call(this.tabType, this.tabId, this.assetId);
		}
	}

	private tabType: TabType = TabType.None;
	private tabId: number = 0;
	private assetId: string = null;
	public initItem(tabType: TabType, tabId: number, assetId: string): void {
		this.tabType = tabType;
		this.tabId = tabId;
		this.assetId = assetId;
		if (assetId == `ColorPick`) {
			this.mBgImage.imageGuid = `169864`;
		} else {
			this.mBgImage.imageGuid = `199136`;
			this.mBgImage.setImageColorByHex(assetId);
		}
		this.updateSelectState(false);
	}

	private addSelectItemAction(tabType: TabType, tabId: number, assetId: string): void {
		if (this.tabType != tabType || this.tabId != tabId) return;
		this.updateSelectState(this.assetId == assetId);
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
