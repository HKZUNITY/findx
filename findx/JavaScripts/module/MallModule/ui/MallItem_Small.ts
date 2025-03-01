import { IAccessoriesGlovesElement } from "../../../config/AccessoriesGloves";
import { IALongCoatTopElement } from "../../../config/ALongCoatTop";
import { IBackElement } from "../../../config/Back";
import { IBootsShoesElement } from "../../../config/BootsShoes";
import { IEarElement } from "../../../config/Ear";
import { IEffectsElement } from "../../../config/Effects";
import { IEverydayShoesElement } from "../../../config/EverydayShoes";
import { IFaceExpressionElement } from "../../../config/FaceExpression";
import { IFacingElement } from "../../../config/Facing";
import { IFootCoverShoesElement } from "../../../config/FootCoverShoes";
import { GameConfig } from "../../../config/GameConfig";
import { IGlovesGlovesElement } from "../../../config/GlovesGloves";
import { IHighHeelsShoesElement } from "../../../config/HighHeelsShoes";
import { IHipElement } from "../../../config/Hip";
import { ILongPantsBottomElement } from "../../../config/LongPantsBottom";
import { ILongSinglePieceTopElement } from "../../../config/LongSinglePieceTop";
import { ILongSkirtBottomElement } from "../../../config/LongSkirtBottom";
import { INakedDressShoesElement } from "../../../config/NakedDressShoes";
import { IPetsElement } from "../../../config/Pets";
import { IRightHandElement } from "../../../config/RightHand";
import { IShortJacketTopElement } from "../../../config/ShortJacketTop";
import { IShortsBottomElement } from "../../../config/ShortsBottom";
import { IShortSinglePieceTopElement } from "../../../config/ShortSinglePieceTop";
import { IShortSkirtBottomElement } from "../../../config/ShortSkirtBottom";
import { IShoulderElement } from "../../../config/Shoulder";
import { ISportsShoesShoesElement } from "../../../config/SportsShoesShoes";
import { ISuitTopElement } from "../../../config/SuitTop";
import { ITightsBottomElement } from "../../../config/TightsBottom";
import { ITrailingsElement } from "../../../config/Trailings";
import { Utils } from "../../../Tools/utils";
import MallItem_Small_Generate from "../../../ui-generate/module/MallModule/MallItem_Small_generate";
import Mall from "../Mall";
import { Tab2Type, Tab3Type, TabType } from "../MallData";
import MallModuleC from "../MallModuleC";

export default class MallItem_Small extends MallItem_Small_Generate {
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
		this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
		this.updateSelectStateUI();
	}

	private bindButton(): void {
		this.mSelectButton.onClicked.add(this.addItemButton.bind(this));
		this.mColorButton.onClicked.add(this.addColorButton.bind(this));
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectItemAction.add(this.addSelectItemAction.bind(this));
	}

	private addItemButton(): void {
		this.getMallModuleC.onSelectItemAction.call(this.tabType, this.tabId, this.assetId);
	}

	private addColorButton(): void {
		this.getMallModuleC.onOpenColorPickAction.call(this.tabType, this.tabId);
	}

	private tabType: TabType = TabType.None;
	private tabId: number = 0;
	private assetId: string = null;
	private isSupportColor: boolean = false;
	private isRemovableTabId: boolean = false;
	public initItem(tabType: TabType, tabId: number, assetId: string): void {
		this.tabType = tabType;
		this.tabId = tabId;
		this.assetId = assetId;
		this.mIconImage.imageColor = mw.LinearColor.white;
		this.isSupportColor = Mall.isSupportColorPick(tabId);
		this.isRemovableTabId = Mall.isRemovableTabId(tabId);
		switch (tabId) {
			case Tab3Type.Tab3_Lens:
			case Tab3Type.Tab3_UpperHighlight:
			case Tab3Type.Tab3_LowerHighlight:
				this.mIconImage.imageColor = new mw.LinearColor(0.3098, 0.1921, 0.7176);
				this.mIconImage.imageInfo.setByAssetIcon(assetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab2Type.Tab2_Expression:
				let faceExpressionElement: IFaceExpressionElement = GameConfig.FaceExpression.getElement(assetId);
				this.mIconImage.imageColor = new mw.LinearColor(0.3098, 0.1921, 0.7176);
				this.mIconImage.imageGuid = faceExpressionElement.Icon;
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.Collapsed);
				this.mPriceTextBlock.text = faceExpressionElement.Name;
				break;
			case Tab3Type.Tab3_LeftHand:
				let leftHandElement: IEffectsElement = GameConfig.LeftHand.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(leftHandElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_RightHand:
				let rightHandElement: IRightHandElement = GameConfig.RightHand.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(rightHandElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Back:
				let backElement: IBackElement = GameConfig.Back.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(backElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Ear:
				let earElement: IEarElement = GameConfig.Ear.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(earElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Face:
				let facingElement: IFacingElement = GameConfig.Facing.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(facingElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Hip:
				let hipElement: IHipElement = GameConfig.Hip.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(hipElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Shoulder:
				let shoulderElement: IShoulderElement = GameConfig.Shoulder.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(shoulderElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Effects:
				let effectsElement: IEffectsElement = GameConfig.Effects.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(effectsElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Trailing:
				let trailingElement: ITrailingsElement = GameConfig.Trailings.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(trailingElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_LongSinglePiece_Top:
				let longSinglePieceTopElement: ILongSinglePieceTopElement = GameConfig.LongSinglePieceTop.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(longSinglePieceTopElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_ShortJacket_Top:
				let shortJacketTopElement: IShortJacketTopElement = GameConfig.ShortJacketTop.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(shortJacketTopElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_ShortSinglePiece_Top:
				let shortSinglePieceTopElement: IShortSinglePieceTopElement = GameConfig.ShortSinglePieceTop.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(shortSinglePieceTopElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Suit_Top:
				let suitTopElement: ISuitTopElement = GameConfig.SuitTop.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(suitTopElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_ALongCoat_Top:
				let aLongCoatTopElement: IALongCoatTopElement = GameConfig.ALongCoatTop.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(aLongCoatTopElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_ShortSkirt_Bottom:
				let shortSkirtBottomElement: IShortSkirtBottomElement = GameConfig.ShortSkirtBottom.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(shortSkirtBottomElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_LongPants_Bottom:
				let longPantsBottomElement: ILongPantsBottomElement = GameConfig.LongPantsBottom.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(longPantsBottomElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Shorts_Bottom:
				let shortsBottomElement: IShortsBottomElement = GameConfig.ShortsBottom.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(shortsBottomElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_LongSkirt_Bottom:
				let longSkirtBottomElement: ILongSkirtBottomElement = GameConfig.LongSkirtBottom.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(longSkirtBottomElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Tights_Bottom:
				let tightsBottomElement: ITightsBottomElement = GameConfig.TightsBottom.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(tightsBottomElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Gloves_Gloves:
				let glovesGlovesElement: IGlovesGlovesElement = GameConfig.GlovesGloves.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(glovesGlovesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Accessories_Gloves:
				let accessoriesGlovesElement: IAccessoriesGlovesElement = GameConfig.AccessoriesGloves.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(accessoriesGlovesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Everyday_Shoes:
				let everydayShoesElement: IEverydayShoesElement = GameConfig.EverydayShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(everydayShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_Boots_Shoes:
				let bootsShoesElement: IBootsShoesElement = GameConfig.BootsShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(bootsShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_FootCover_Shoes:
				let footCoverShoesElement: IFootCoverShoesElement = GameConfig.FootCoverShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(footCoverShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_NakedDress_Shoes:
				let nakedDressShoesElement: INakedDressShoesElement = GameConfig.NakedDressShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(nakedDressShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_HighHeels_Shoes:
				let highHeelsShoesElement: IHighHeelsShoesElement = GameConfig.HighHeelsShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(highHeelsShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab3Type.Tab3_SportsShoes_Shoes:
				let sportsShoesShoesElement: ISportsShoesShoesElement = GameConfig.SportsShoesShoes.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(sportsShoesShoesElement.AssetId, mw.AssetIconSize.Icon_128px);
				Utils.setWidgetVisibility(this.mCoinIconImage, mw.SlateVisibility.SelfHitTestInvisible);
				this.mPriceTextBlock.text = GameConfig.Language.Text_MallItem_Free.Value;
				break;
			case Tab2Type.Tab2_Pet:
				let petElement: IPetsElement = GameConfig.Pets.getElement(assetId);
				this.mIconImage.imageInfo.setByAssetIcon(petElement.AssetId, mw.AssetIconSize.Icon_128px);
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
		this.updateSelectState(this.assetId == assetId, false);
	}

	private isSelect: boolean = false;
	public updateSelectState(isSelect: boolean, isDriectUpdate: boolean = true): void {
		if (isDriectUpdate) {
			if (this.isSelect == isSelect) return;
			this.isSelect = isSelect;
		} else {
			if (this.isRemovableTabId) {
				if (!this.isSelect && this.isSelect == isSelect) {
					return;
				} else if (!this.isSelect && this.isSelect != isSelect) {
					this.isSelect = isSelect;
				} else if (this.isSelect && this.isSelect == isSelect) {
					this.isSelect = false;
				} else if (this.isSelect && this.isSelect != isSelect) {
					this.isSelect = isSelect;
				}
			} else {
				if (this.isSelect == isSelect) return;
			}
		}
		this.updateSelectStateUI();
	}

	public updateSelectStateUI(): void {
		if (this.isSelect) {
			this.mSelectButton.renderOpacity = 1;
			if (this.isSupportColor) {
				Utils.setWidgetVisibility(this.mColorButton, mw.SlateVisibility.Visible);
			} else {
				Utils.setWidgetVisibility(this.mColorButton, mw.SlateVisibility.Collapsed);
			}
		} else {
			this.mSelectButton.renderOpacity = 0;
			Utils.setWidgetVisibility(this.mColorButton, mw.SlateVisibility.Collapsed);
		}
	}
}
