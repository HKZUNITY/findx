import { IAncientMoldingOutfitElement } from "../../../config/AncientMoldingOutfit";
import { IBodyTypeElement } from "../../../config/BodyType";
import { IDailyStylingOutfit1Element } from "../../../config/DailyStylingOutfit1";
import { IDailyStylingOutfit2Element } from "../../../config/DailyStylingOutfit2";
import { IFantasyModelingOutfitElement } from "../../../config/FantasyModelingOutfit";
import { GameConfig } from "../../../config/GameConfig";
import { IHeroStylingOutfitElement } from "../../../config/HeroStylingOutfit";
import { IHolidayStylingOutfitElement } from "../../../config/HolidayStylingOutfit";
import { IMuppetStylingOutfitElement } from "../../../config/MuppetStylingOutfit";
import { IOutfitElement } from "../../../config/Outfit";
import { IScienceFictionStylingOutfitElement } from "../../../config/ScienceFictionStylingOutfit";
import { Utils } from "../../../Tools/utils";
import MallItem_Big_Generate from "../../../ui-generate/module/MallModule/MallItem_Big_generate";
import { Tab2Type, Tab3Type, TabType } from "../MallData";
import MallModuleC from "../MallModuleC";

export default class MallItem_Big extends MallItem_Big_Generate {
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
		this.mIconImage.imageGuid = `32115`;
		this.updateSelectStateUI();
	}

	private bindButton(): void {
		this.mSelectButton.onClicked.add(this.addItemButton.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectItemAction.add(this.addSelectItemAction.bind(this));
	}

	private addItemButton(): void {
		this.getMallModuleC.onSelectItemAction.call(this.tabType, this.tabId, this.assetId);
	}

	private tabType: TabType = TabType.None;
	private tabId: number = 0;
	private assetId: string = null;
	public initItem(tabType: TabType, tabId: number, assetId: string): void {
		this.tabType = tabType;
		this.tabId = tabId;
		this.assetId = assetId;
		switch (tabId) {
			case Tab2Type.Tab2_BodyType:
				let bodyTypeElement: IBodyTypeElement = GameConfig.BodyType.getElement(assetId);
				this.mIconImage.imageGuid = bodyTypeElement.Icon;
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.Collapsed);
				this.mPriceTextBlock.text = StringUtil.format(GameConfig.Language.Text_BodyTypeDescribe.Value, bodyTypeElement.Scale);
				break;
			case Tab2Type.Tab2_Outfit:
				let outfitElement: IOutfitElement = GameConfig.Outfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(outfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_DailyStyling_Suit1:
				let dailyStylingOutfit1Element: IDailyStylingOutfit1Element = GameConfig.DailyStylingOutfit1.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(dailyStylingOutfit1Element.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_DailyStyling_Suit2:
				let dailyStylingOutfit2Element: IDailyStylingOutfit2Element = GameConfig.DailyStylingOutfit2.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(dailyStylingOutfit2Element.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_MuppetStyling_Suit:
				let muppetStylingOutfitElement: IMuppetStylingOutfitElement = GameConfig.MuppetStylingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(muppetStylingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_HeroStyling_Suit:
				let heroStylingOutfitElement: IHeroStylingOutfitElement = GameConfig.HeroStylingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(heroStylingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_FantasyModeling_Suit:
				let fantasyModelingOutfitElement: IFantasyModelingOutfitElement = GameConfig.FantasyModelingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(fantasyModelingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_HolidayStyling_Suit:
				let holidayStylingOutfitElement: IHolidayStylingOutfitElement = GameConfig.HolidayStylingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(holidayStylingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_ScienceFictionStyling_Suit:
				let scienceFictionStylingOutfitElement: IScienceFictionStylingOutfitElement = GameConfig.ScienceFictionStylingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(scienceFictionStylingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_AncientMolding_Suit:
				let ancientMoldingOutfitElement: IAncientMoldingOutfitElement = GameConfig.AncientMoldingOutfit.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(ancientMoldingOutfitElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			default:
				this.mIconImage.imageInfo.setByAssetIcon(assetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
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
		this.mSelectButton.renderOpacity = this.isSelect ? 1 : 0;
	}
}
