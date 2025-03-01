import { Utils } from "../../../Tools/utils";
import MallItem_Self_Generate from "../../../ui-generate/module/MallModule/MallItem_Self_generate";
import Mall from "../Mall";
import { AssetIdInfoData, Tab3Type } from "../MallData";
import MallModuleC from "../MallModuleC";

export default class MallItem_Self extends MallItem_Self_Generate {
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
	}

	private initUI(): void {
		this.mIconImage.imageGuid = `32115`;
	}

	private bindButton(): void {
		this.mCloseButton.onClicked.add(this.addCloseButton.bind(this));
	}

	private addCloseButton(): void {
		this.getMallModuleC.onCloseMallItemSelfAction.call(this.assetType, this.assetId);
	}

	private assetType: number = 0;
	private assetId: string = null;
	private isDefault: boolean = false;
	public initItem(assetType: number, assetIdInfoData: AssetIdInfoData): void {
		this.assetType = assetType;
		this.assetId = assetIdInfoData.assetId;
		this.mIconImage.imageInfo.setByAssetIcon(this.assetId, mw.AssetIconSize.Icon_128px);
		this.mIconImage.imageColor = mw.LinearColor.white;
		switch (assetType) {
			case Tab3Type.Tab3_Lens:
			case Tab3Type.Tab3_UpperHighlight:
			case Tab3Type.Tab3_LowerHighlight:
				this.mIconImage.imageColor = new mw.LinearColor(0.3098, 0.1921, 0.7176);
				break;
			default:
				break;
		}
		this.isDefault = Mall.isDefaultAssetId(this.assetId);
		Utils.setWidgetVisibility(this.mCloseButton, this.isDefault ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.Visible);
	}
}
