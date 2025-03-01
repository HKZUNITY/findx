import { Notice } from "../../../Common/notice/Notice";
import { IAccessoriesGlovesElement } from "../../../config/AccessoriesGloves";
import { IALongCoatTopElement } from "../../../config/ALongCoatTop";
import { IAncientMoldingOutfitElement } from "../../../config/AncientMoldingOutfit";
import { IBackElement } from "../../../config/Back";
import { IBackHairElement } from "../../../config/BackHair";
import { IBlushElement } from "../../../config/Blush";
import { IBodyTypeElement } from "../../../config/BodyType";
import { IBootsShoesElement } from "../../../config/BootsShoes";
import { IBottomElement } from "../../../config/Bottom";
import { IDailyStylingOutfit1Element } from "../../../config/DailyStylingOutfit1";
import { IDailyStylingOutfit2Element } from "../../../config/DailyStylingOutfit2";
import { IEarElement } from "../../../config/Ear";
import { IEffectsElement } from "../../../config/Effects";
import { IEverydayShoesElement } from "../../../config/EverydayShoes";
import { IEyebrowsElement } from "../../../config/Eyebrows";
import { IEyelashesElement } from "../../../config/Eyelashes";
import { IEyeshadowElement } from "../../../config/Eyeshadow";
import { IFaceElement } from "../../../config/Face";
import { IFaceExpressionElement } from "../../../config/FaceExpression";
import { IFacingElement } from "../../../config/Facing";
import { IFantasyModelingOutfitElement } from "../../../config/FantasyModelingOutfit";
import { IFootCoverShoesElement } from "../../../config/FootCoverShoes";
import { IFrontHairElement } from "../../../config/FrontHair";
import { IFullHairElement } from "../../../config/FullHair";
import { GameConfig } from "../../../config/GameConfig";
import { IGlovesElement } from "../../../config/Gloves";
import { IGlovesGlovesElement } from "../../../config/GlovesGloves";
import { IHeroStylingOutfitElement } from "../../../config/HeroStylingOutfit";
import { IHighHeelsShoesElement } from "../../../config/HighHeelsShoes";
import { IHipElement } from "../../../config/Hip";
import { IHolidayStylingOutfitElement } from "../../../config/HolidayStylingOutfit";
import { ILeftHandElement } from "../../../config/LeftHand";
import { ILensElement } from "../../../config/Lens";
import { ILipMakeupElement } from "../../../config/LipMakeup";
import { ILongPantsBottomElement } from "../../../config/LongPantsBottom";
import { ILongSinglePieceTopElement } from "../../../config/LongSinglePieceTop";
import { ILongSkirtBottomElement } from "../../../config/LongSkirtBottom";
import { ILowerHighlightElement } from "../../../config/LowerHighlight";
import { IMuppetStylingOutfitElement } from "../../../config/MuppetStylingOutfit";
import { INakedDressShoesElement } from "../../../config/NakedDressShoes";
import { IOutfitElement } from "../../../config/Outfit";
import { IPetElement } from "../../../config/Pet";
import { IPetsElement } from "../../../config/Pets";
import { IPupilStyleElement } from "../../../config/PupilStyle";
import { IRightHandElement } from "../../../config/RightHand";
import { IScienceFictionStylingOutfitElement } from "../../../config/ScienceFictionStylingOutfit";
import { IShoesElement } from "../../../config/Shoes";
import { IShortJacketTopElement } from "../../../config/ShortJacketTop";
import { IShortsBottomElement } from "../../../config/ShortsBottom";
import { IShortSinglePieceTopElement } from "../../../config/ShortSinglePieceTop";
import { IShortSkirtBottomElement } from "../../../config/ShortSkirtBottom";
import { IShoulderElement } from "../../../config/Shoulder";
import { ISkinToneElement } from "../../../config/SkinTone";
import { ISportsShoesShoesElement } from "../../../config/SportsShoesShoes";
import { ISuitTopElement } from "../../../config/SuitTop";
import { ITab1Element } from "../../../config/Tab1";
import { ITightsBottomElement } from "../../../config/TightsBottom";
import { ITopElement } from "../../../config/Top";
import { ITrailingsElement } from "../../../config/Trailings";
import { IUpperHighlightElement } from "../../../config/UpperHighlight";
import { Enums, TouchScript } from "../../../Tools/TouchScript";
import { Utils } from "../../../Tools/utils";
import ExecutorManager from "../../../Tools/WaitingQueue";
import MallPanel_Generate from "../../../ui-generate/module/MallModule/MallPanel_generate";
import Mall from "../Mall";
import { AssetIdInfoData, Tab1Type, Tab2Type, Tab3Type, TabIdData, TabType } from "../MallData";
import MallModuleC from "../MallModuleC";
import MallItem_Big from "./MallItem_Big";
import MallItem_Color from "./MallItem_Color";
import MallItem_Self from "./MallItem_Self";
import MallItem_Small from "./MallItem_Small";
import MallTab1 from "./MallTab1";
import MallTab2 from "./MallTab2";
import MallTab3 from "./MallTab3";

export default class MallPanel extends MallPanel_Generate {
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
		this.initMallRot();
	}

	private initUI(): void {
		this.mSaveTextBlock.text = GameConfig.Language.Text_FreeSave.Value;
		this.mResetTextBlock.text = GameConfig.Language.Text_ResetImage.Value;
	}

	private bindButton(): void {
		this.mCloseButton.onClicked.add(this.addCloseButton.bind(this));
		this.mResetButton.onClicked.add(this.addResetButton.bind(this));
		this.mSaveButton.onClicked.add(this.addSaveButton.bind(this));
		this.mSexButton.onClicked.add(this.addSexButton.bind(this));
	}

	private addCloseButton(): void {
		this.getMallModuleC.onCloseMallPanelAction.call();
	}

	private addResetButton(): void {
		this.getMallModuleC.onResetAction.call();
	}

	private addSaveButton(): void {
		this.getMallModuleC.onSaveAction.call();
	}

	private addSexButton(): void {
		this.getMallModuleC.onSexAction.call();
	}

	private currentSomatotype: number = -1;
	private switchSexImage(somatotype: number): void {
		if (this.currentSomatotype == somatotype) return;
		this.currentSomatotype = somatotype;
		if (somatotype % 2 == 0) {
			this.mSexButton.normalImageGuid = `311549`;
		} else {
			this.mSexButton.normalImageGuid = `311563`;
		}
	}

	private bindAction(): void {
		this.getMallModuleC.onSelectTab1Action.add(this.addSelectTab1Action.bind(this));
		this.getMallModuleC.onSelectTab2Action.add(this.addSelectTab2Action.bind(this));
		this.getMallModuleC.onSelectTab3Action.add(this.addSelectTab3Action.bind(this));
	}

	public checkSkinToneMallItemStateAndShowMallPanel(): void {
		this.onOffLeftCanvas(true);
		this.checkSkinToneMallItemState();
	}

	public initMallPanel(somatotype: number, usingAssetIdMap: Map<number, AssetIdInfoData>): void {
		this.clearTabIdDataMap();
		this.switchSexImage(somatotype);
		this.refreshMallItemSelf(usingAssetIdMap);
		this.initTab1();
	}

	private tab1Elements: ITab1Element[] = [];
	private tab1Ids: number[] = [];
	private tab1Id: number = 0;
	private initTab1(): void {
		this.tab1Elements = GameConfig.Tab1.getAllElement();
		if (!this.tab1Elements || this.tab1Elements?.length == 0) {
			this.tab1Ids.length = 0;
			this.tab1Id = 0;
			this.hideTab123Canvas();
			this.initItem(TabType.None);
			return;
		}
		this.showTab1Canvas();
		this.tab1Ids.length = 0;
		this.tab1Elements.forEach((value: ITab1Element) => { this.tab1Ids.push(value.ID); });
		this.updateTab1();
		this.tab1Id = this.tab1Ids[0];//可修改默认
		this.getMallModuleC.onSelectTab1Action.call(this.tab1Id);
		this.initTab2();
	}

	private tab2Ids: number[] = [];
	private tab2Id: number = 0;
	private initTab2(): void {
		let tab1Element = GameConfig.Tab1.getElement(this.tab1Id);
		if (!tab1Element || !tab1Element?.Tab2 || tab1Element.Tab2?.length == 0) {
			this.tab2Ids.length = 0;
			this.tab2Id = 0;
			this.hideTab23Canvas();
			this.initItem(TabType.Tab1);
			return;
		}
		this.showTab2Canvas();
		this.tab2Ids.length = 0;
		this.tab2Ids = Utils.copyArray(tab1Element.Tab2);
		this.updateTab2();
		this.tab2Id = this.getTab2();
		this.getMallModuleC.onSelectTab2Action.call(this.tab2Id);
		this.initTab3();
	}

	private tab3Ids: number[] = [];
	private tab3Id: number = 0;
	private initTab3(): void {
		let tab2Element = GameConfig.Tab2.getElement(this.tab2Id);
		if (!tab2Element || !tab2Element?.Tab3 || tab2Element.Tab3?.length == 0) {
			this.tab3Ids.length = 0;
			this.tab3Id = 0;
			this.hideTab3Canvas();
			this.initItem(TabType.Tab2);
			return;
		}
		this.showTab3Canvas();
		this.tab3Ids.length = 0;
		this.tab3Ids = Utils.copyArray(tab2Element.Tab3);
		this.updateTab3();
		this.tab3Id = this.getTab3();
		this.getMallModuleC.onSelectTab3Action.call(this.tab3Id);
		this.initItem(TabType.Tab3);
	}

	private currentTabType: TabType = TabType.None;
	private initItem(tabType: TabType): void {
		this.currentTabType = tabType;
		this.calculateItemCanvas(tabType);
		switch (tabType) {
			case TabType.None:
				this.clearTabIdDataMap();
				break;
			case TabType.Tab1:
				this.initTab1IdDataMap();
				console.error(`tab1Id:${this.tab1Id}`);
				this.initTab1Item();
				break;
			case TabType.Tab2:
				this.initTab2IdDataMap();
				console.error(`tab2Id:${this.tab2Id}`);
				this.initTab2Item();
				break;
			case TabType.Tab3:
				this.initTab3IdDataMap();
				console.error(`tab3Id:${this.tab3Id}`);
				this.initTab3Item();
				break;
			default:
				break;
		}
		// console.error(this.tabIdDataMap.size);
		// this.tabIdDataMap.forEach((value: TabIdData) => {
		// 	console.error(JSON.stringify(value));
		// });
		// this.mItemScrollBox.scrollOffset = 0;
	}

	private calculateItemCanvas(tabType: TabType): void {
		let positionY = 0;
		let sizeY = 0;
		switch (tabType) {
			case TabType.Tab1:
				positionY = this.mTab1Canvas.position.y;
				sizeY = this.mTab1Canvas.size.y;
				break;
			case TabType.Tab2:
				positionY = this.mTab2Canvas.position.y;
				sizeY = this.mTab2Canvas.size.y;
				break;
			case TabType.Tab3:
				positionY = this.mTab3Canvas.position.y;
				sizeY = this.mTab3Canvas.size.y;
				break;
			default:
				positionY = this.mTab3Canvas.position.y;
				sizeY = this.mTab3Canvas.size.y;
				break;
		}
		this.mItemScrollBox.position = new mw.Vector(0, positionY + sizeY);
		this.mItemScrollBox.size = new mw.Vector(this.mItemScrollBox.size.x, this.rootCanvas.size.y - this.mItemScrollBox.position.y);
	}

	private tabIdDataMap: Map<number, TabIdData> = new Map<number, TabIdData>();
	private clearTabIdDataMap(): void {
		this.tabIdDataMap.clear();
	}

	private getTab2(): number {
		let tab2Id: number = this.tab2Ids[this.getDefaultTab2Index];//可修改默认
		if (this.tabIdDataMap.has(this.tab1Id)) {
			let tab2IdDataMap = this.tabIdDataMap.get(this.tab1Id).tabIdDataMap;
			if (!tab2IdDataMap || tab2IdDataMap.size == 0) return tab2Id;
			tab2IdDataMap.forEach((value: TabIdData, key: number) => {
				if (value.isOn) tab2Id = key;
			});
			return tab2Id;
		} else {
			return tab2Id;
		}
	}

	private get getDefaultTab2Index(): number {
		if (this.tab1Id == Tab1Type.Tab1_Appearance) return 5;
		if (this.tab1Id == Tab1Type.Tab1_Clothing) return 0;
		return 0;
	}

	private getTab3(): number {
		let tab3Id: number = this.tab3Ids[0];//可修改默认
		if (this.tabIdDataMap.has(this.tab1Id)) {
			let tab2IdDataMap = this.tabIdDataMap.get(this.tab1Id).tabIdDataMap;
			if (!tab2IdDataMap || tab2IdDataMap.size == 0) return tab3Id;
			if (tab2IdDataMap.has(this.tab2Id)) {
				let tab3IdDataMap = tab2IdDataMap.get(this.tab2Id).tabIdDataMap;
				if (!tab3IdDataMap || tab3IdDataMap.size == 0) return tab3Id;
				tab3IdDataMap.forEach((value: TabIdData, key: number) => {
					if (value.isOn) tab3Id = key;
				});
				return tab3Id;
			} else {
				return tab3Id;
			}
		} else {
			return tab3Id;
		}
	}

	private initTab1IdDataMap(): void {
		if (this.tabIdDataMap.has(this.tab1Id)) return;
		let tab1IdData: TabIdData = new TabIdData();
		tab1IdData.tabId = this.tab1Id;
		this.tabIdDataMap.set(this.tab1Id, tab1IdData);
		this.tabIdDataMap.forEach((value: TabIdData, key: number) => {
			value.isOn = (key == this.tab1Id);
		});
	}

	private initTab2IdDataMap(): void {
		let tab1IdData: TabIdData = null;
		if (this.tabIdDataMap.has(this.tab1Id)) {
			tab1IdData = this.tabIdDataMap.get(this.tab1Id);
			if (tab1IdData.tabIdDataMap.has(this.tab2Id)) {
			} else {
				let tab2IdData = new TabIdData();
				tab2IdData.tabId = this.tab2Id;
				tab1IdData.tabIdDataMap.set(this.tab2Id, tab2IdData);
			}
			tab1IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab2Id);
			});
		} else {
			tab1IdData = new TabIdData();
			tab1IdData.tabId = this.tab1Id;

			let tab2IdData = new TabIdData();
			tab2IdData.tabId = this.tab2Id;
			tab1IdData.tabIdDataMap.set(this.tab2Id, tab2IdData);
			tab1IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab2Id);
			});

			this.tabIdDataMap.set(this.tab1Id, tab1IdData);
			this.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab1Id);
			});
		}
	}

	private initTab3IdDataMap(): void {
		let tab1IdData: TabIdData = null;
		if (this.tabIdDataMap.has(this.tab1Id)) {
			tab1IdData = this.tabIdDataMap.get(this.tab1Id);
			let tab2IdData = new TabIdData();
			if (tab1IdData.tabIdDataMap.has(this.tab2Id)) {
				tab2IdData = tab1IdData.tabIdDataMap.get(this.tab2Id);
				if (tab2IdData.tabIdDataMap.has(this.tab3Id)) {
				} else {
					let tab3IdData = new TabIdData();
					tab3IdData.tabId = this.tab3Id;
					tab2IdData.tabIdDataMap.set(this.tab3Id, tab3IdData);
				}
				tab2IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
					value.isOn = (key == this.tab3Id);
				});
			} else {
				tab2IdData.tabId = this.tab2Id;
				tab1IdData.tabIdDataMap.set(this.tab2Id, tab2IdData);
				tab1IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
					value.isOn = (key == this.tab2Id);
				});

				let tab3IdData = new TabIdData();
				tab3IdData.tabId = this.tab3Id;
				tab2IdData.tabIdDataMap.set(this.tab3Id, tab3IdData);
				tab2IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
					value.isOn = (key == this.tab3Id);
				});
			}
		} else {
			tab1IdData = new TabIdData();
			tab1IdData.tabId = this.tab1Id;

			let tab2IdData = new TabIdData();
			tab2IdData.tabId = this.tab2Id;
			tab1IdData.tabIdDataMap.set(this.tab2Id, tab2IdData);
			tab1IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab2Id);
			});

			let tab3IdData = new TabIdData();
			tab3IdData.tabId = this.tab3Id;
			tab2IdData.tabIdDataMap.set(this.tab3Id, tab3IdData);
			tab2IdData.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab3Id);
			});

			this.tabIdDataMap.set(this.tab1Id, tab1IdData);
			this.tabIdDataMap.forEach((value: TabIdData, key: number) => {
				value.isOn = (key == this.tab1Id);
			});
		}
	}

	private mallItem_Color: MallItem_Color[] = [];
	private mallItem_Small: MallItem_Small[] = [];
	private mallItem_Big: MallItem_Big[] = [];
	private mallItemAssetIds: string[] = [];
	private mallItemMap: Map<string, MallItem_Small | MallItem_Big | MallItem_Color> = new Map<string, MallItem_Small | MallItem_Big | MallItem_Color>();
	private mallItemHasBig: number[] = [
		Tab2Type.Tab2_BodyType,
		Tab2Type.Tab2_Outfit,
		Tab3Type.Tab3_DailyStyling_Suit1,
		Tab3Type.Tab3_DailyStyling_Suit2,
		Tab3Type.Tab3_MuppetStyling_Suit,
		Tab3Type.Tab3_HeroStyling_Suit,
		Tab3Type.Tab3_FantasyModeling_Suit,
		Tab3Type.Tab3_HolidayStyling_Suit,
		Tab3Type.Tab3_ScienceFictionStyling_Suit,
		Tab3Type.Tab3_AncientMolding_Suit
	];
	private mallItemHasColor: number[] = [Tab2Type.Tab2_SkinTone];
	private currentConfigId: number = 0;
	private clearMallItemData(): void {
		this.mallItemMap.clear();
		this.mallItemAssetIds.length = 0;
	}
	private initTab2Item(): void {
		this.clearMallItemData();
		switch (this.tab2Id) {
			case Tab2Type.Tab2_BodyType:
				GameConfig.BodyType.getAllElement().forEach((value: IBodyTypeElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab2Type.Tab2_SkinTone:
				GameConfig.SkinTone.getAllElement().forEach((value: ISkinToneElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.SkinTone); });
				break;
			case Tab2Type.Tab2_Face:
				GameConfig.Face.getAllElement().forEach((value: IFaceElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Eyebrows:
				GameConfig.Eyebrows.getAllElement().forEach((value: IEyebrowsElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Expression:
				GameConfig.FaceExpression.getAllElement().forEach((value: IFaceExpressionElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab2Type.Tab2_Outfit:
				GameConfig.Outfit.getAllElement().forEach((value: IOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab2Type.Tab2_Top:
				GameConfig.Top.getAllElement().forEach((value: ITopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Bottom:
				GameConfig.Bottom.getAllElement().forEach((value: IBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Shoes:
				GameConfig.Shoes.getAllElement().forEach((value: IShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Gloves:
				GameConfig.Gloves.getAllElement().forEach((value: IGlovesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab2Type.Tab2_Pet:
				GameConfig.Pets.getAllElement().forEach((value: IPetsElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			default:
				break;
		}
		this.currentConfigId = this.tab2Id;
		this.initMallItem();
	}

	private initTab3Item(): void {
		this.clearMallItemData();
		switch (this.tab3Id) {
			case Tab3Type.Tab3_PupilStyle:
				GameConfig.PupilStyle.getAllElement().forEach((value: IPupilStyleElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_Lens:
				GameConfig.Lens.getAllElement().forEach((value: ILensElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_UpperHighlight:
				GameConfig.UpperHighlight.getAllElement().forEach((value: IUpperHighlightElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_LowerHighlight:
				GameConfig.LowerHighlight.getAllElement().forEach((value: ILowerHighlightElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_Eyelashes:
				GameConfig.Eyelashes.getAllElement().forEach((value: IEyelashesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_Eyeshadow:
				GameConfig.Eyeshadow.getAllElement().forEach((value: IEyeshadowElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_Blush:
				GameConfig.Blush.getAllElement().forEach((value: IBlushElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_LipMakeup:
				GameConfig.LipMakeup.getAllElement().forEach((value: ILipMakeupElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_FaceTattoo:
				// GameConfig.Eyelashes.getAllElement().forEach((value: IEyelashesElement) => { this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_FullHair:
				GameConfig.FullHair.getAllElement().forEach((value: IFullHairElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_FrontHair:
				GameConfig.FrontHair.getAllElement().forEach((value: IFrontHairElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_BackHair:
				GameConfig.BackHair.getAllElement().forEach((value: IBackHairElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(value.AssetId); });
				break;
			case Tab3Type.Tab3_LeftHand:
				GameConfig.LeftHand.getAllElement().forEach((value: ILeftHandElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_RightHand:
				GameConfig.RightHand.getAllElement().forEach((value: IRightHandElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Back:
				GameConfig.Back.getAllElement().forEach((value: IBackElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Ear:
				GameConfig.Ear.getAllElement().forEach((value: IEarElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Face:
				GameConfig.Facing.getAllElement().forEach((value: IFacingElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Hip:
				GameConfig.Hip.getAllElement().forEach((value: IHipElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Shoulder:
				GameConfig.Shoulder.getAllElement().forEach((value: IShoulderElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Effects:
				GameConfig.Effects.getAllElement().forEach((value: IEffectsElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Trailing:
				GameConfig.Trailings.getAllElement().forEach((value: ITrailingsElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_DailyStyling_Suit1:
				GameConfig.DailyStylingOutfit1.getAllElement().forEach((value: IDailyStylingOutfit1Element) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_DailyStyling_Suit2:
				GameConfig.DailyStylingOutfit2.getAllElement().forEach((value: IDailyStylingOutfit2Element) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_MuppetStyling_Suit:
				GameConfig.MuppetStylingOutfit.getAllElement().forEach((value: IMuppetStylingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_HeroStyling_Suit:
				GameConfig.HeroStylingOutfit.getAllElement().forEach((value: IHeroStylingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_FantasyModeling_Suit:
				GameConfig.FantasyModelingOutfit.getAllElement().forEach((value: IFantasyModelingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_HolidayStyling_Suit:
				GameConfig.HolidayStylingOutfit.getAllElement().forEach((value: IHolidayStylingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_ScienceFictionStyling_Suit:
				GameConfig.ScienceFictionStylingOutfit.getAllElement().forEach((value: IScienceFictionStylingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_AncientMolding_Suit:
				GameConfig.AncientMoldingOutfit.getAllElement().forEach((value: IAncientMoldingOutfitElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_LongSinglePiece_Top:
				GameConfig.LongSinglePieceTop.getAllElement().forEach((value: ILongSinglePieceTopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_ShortJacket_Top:
				GameConfig.ShortJacketTop.getAllElement().forEach((value: IShortJacketTopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_ShortSinglePiece_Top:
				GameConfig.ShortSinglePieceTop.getAllElement().forEach((value: IShortSinglePieceTopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Suit_Top:
				GameConfig.SuitTop.getAllElement().forEach((value: ISuitTopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_ALongCoat_Top:
				GameConfig.ALongCoatTop.getAllElement().forEach((value: IALongCoatTopElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_ShortSkirt_Bottom:
				GameConfig.ShortSkirtBottom.getAllElement().forEach((value: IShortSkirtBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_LongPants_Bottom:
				GameConfig.LongPantsBottom.getAllElement().forEach((value: ILongPantsBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Shorts_Bottom:
				GameConfig.ShortsBottom.getAllElement().forEach((value: IShortsBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_LongSkirt_Bottom:
				GameConfig.LongSkirtBottom.getAllElement().forEach((value: ILongSkirtBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Tights_Bottom:
				GameConfig.TightsBottom.getAllElement().forEach((value: ITightsBottomElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Gloves_Gloves:
				GameConfig.GlovesGloves.getAllElement().forEach((value: IGlovesGlovesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Accessories_Gloves:
				GameConfig.AccessoriesGloves.getAllElement().forEach((value: IAccessoriesGlovesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Everyday_Shoes:
				GameConfig.EverydayShoes.getAllElement().forEach((value: IEverydayShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_Boots_Shoes:
				GameConfig.BootsShoes.getAllElement().forEach((value: IBootsShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_FootCover_Shoes:
				GameConfig.FootCoverShoes.getAllElement().forEach((value: IFootCoverShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_NakedDress_Shoes:
				GameConfig.NakedDressShoes.getAllElement().forEach((value: INakedDressShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_HighHeels_Shoes:
				GameConfig.HighHeelsShoes.getAllElement().forEach((value: IHighHeelsShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			case Tab3Type.Tab3_SportsShoes_Shoes:
				GameConfig.SportsShoesShoes.getAllElement().forEach((value: ISportsShoesShoesElement) => { if (value.SexType == 0 || value.SexType == this.currentSomatotype) this.mallItemAssetIds.push(`${value.ID}`); });
				break;
			default:
				break;
		}
		this.currentConfigId = this.tab3Id;
		this.initMallItem();
	}

	private initTab1Item(): void {
		this.clearMallItemData();
		this.currentConfigId = this.tab1Id;
		this.initMallItem();
	}

	private thisFeatureIsNotEnabled(): void {
		if (!this.mallItemAssetIds || this.mallItemAssetIds.length == 0) {
			Notice.showDownNotice(GameConfig.Language.Text_ThisFeatureIsNotEnabled.Value);
		}
	}

	private hideMallItemSmallAndBig(): void {
		this.mallItem_Small.forEach((value: MallItem_Small) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
		this.mallItem_Big.forEach((value: MallItem_Big) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
	}

	private hideMallItemSamllAndColor(): void {
		this.mallItem_Small.forEach((value: MallItem_Small) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
		this.mallItem_Color.forEach((value: MallItem_Color) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
	}

	private hideMallItemBigAndColor(): void {
		this.mallItem_Big.forEach((value: MallItem_Big) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
		this.mallItem_Color.forEach((value: MallItem_Color) => {
			Utils.setWidgetVisibility(value.uiObject, mw.SlateVisibility.Collapsed);
		});
	}

	private initMallItem(): void {
		this.thisFeatureIsNotEnabled();
		if (this.mallItemHasBig.includes(this.currentConfigId)) {
			this.hideMallItemSamllAndColor();
			this.initMallItemBig();
		} else if (this.mallItemHasColor.includes(this.currentConfigId)) {
			this.hideMallItemSmallAndBig();
			this.initMallItemColor();
		} else {
			this.hideMallItemBigAndColor();
			this.initMallItemSmall();
		}
		this.checkMallItemState();
		this.getMallModuleC.onSwitchCameraAction.call(Mall.isHeadTabId(this.currentConfigId) ? 1 : 2);
	}

	private initMallItemBig(): void {
		if (this.mallItemAssetIds.length > this.mallItem_Big.length) {
			for (let i = 0; i < this.mallItem_Big.length; ++i) {
				this.mallItem_Big[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Big[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Big[i]);
			}
			for (let i = this.mallItem_Big.length; i < this.mallItemAssetIds.length; ++i) {
				let mallItem_Big = UIService.create(MallItem_Big);
				mallItem_Big.initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				this.mItemContentCanvas.addChild(mallItem_Big.uiObject);
				this.mallItem_Big.push(mallItem_Big);
				this.mallItemMap.set(this.mallItemAssetIds[i], mallItem_Big);
			}
		} else {
			for (let i = 0; i < this.mallItemAssetIds.length; ++i) {
				this.mallItem_Big[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Big[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Big[i]);
			}
			for (let i = this.mallItemAssetIds.length; i < this.mallItem_Big.length; ++i) {
				Utils.setWidgetVisibility(this.mallItem_Big[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private initMallItemSmall(): void {
		if (this.mallItemAssetIds.length > this.mallItem_Small.length) {
			for (let i = 0; i < this.mallItem_Small.length; ++i) {
				this.mallItem_Small[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Small[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Small[i]);
			}
			for (let i = this.mallItem_Small.length; i < this.mallItemAssetIds.length; ++i) {
				let mallItem_Small = UIService.create(MallItem_Small);
				mallItem_Small.initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				this.mItemContentCanvas.addChild(mallItem_Small.uiObject);
				this.mallItem_Small.push(mallItem_Small);
				this.mallItemMap.set(this.mallItemAssetIds[i], mallItem_Small);
			}
		} else {
			for (let i = 0; i < this.mallItemAssetIds.length; ++i) {
				this.mallItem_Small[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Small[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Small[i]);
			}
			for (let i = this.mallItemAssetIds.length; i < this.mallItem_Small.length; ++i) {
				Utils.setWidgetVisibility(this.mallItem_Small[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private initMallItemColor(): void {
		if (this.mallItemAssetIds.length > this.mallItem_Color.length) {
			for (let i = 0; i < this.mallItem_Color.length; ++i) {
				this.mallItem_Color[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Color[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Color[i]);
			}
			for (let i = this.mallItem_Color.length; i < this.mallItemAssetIds.length; ++i) {
				let mallItem_Color = UIService.create(MallItem_Color);
				mallItem_Color.initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				this.mItemContentCanvas.addChild(mallItem_Color.uiObject);
				this.mallItem_Color.push(mallItem_Color);
				this.mallItemMap.set(this.mallItemAssetIds[i], mallItem_Color);
			}
		} else {
			for (let i = 0; i < this.mallItemAssetIds.length; ++i) {
				this.mallItem_Color[i].initItem(this.currentTabType, this.currentConfigId, this.mallItemAssetIds[i]);
				Utils.setWidgetVisibility(this.mallItem_Color[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallItemMap.set(this.mallItemAssetIds[i], this.mallItem_Color[i]);
			}
			for (let i = this.mallItemAssetIds.length; i < this.mallItem_Color.length; ++i) {
				Utils.setWidgetVisibility(this.mallItem_Color[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private checkMallItemState(): void {
		ExecutorManager.instance.pushAsyncExecutor(async () => {
			let assetId: string | mw.LinearColor = null;
			switch (this.currentConfigId) {
				case Tab2Type.Tab2_SkinTone:
					assetId = await this.getMallModuleC.getCharacterAssetId(this.currentConfigId) as mw.LinearColor;
					let colorKey: string = `ColorPick`;
					for (let key of this.mallItemMap.keys()) {
						if (Utils.isEqulaLinearColor(assetId, Utils.colorHexToLinearColorToString(key))) {
							colorKey = key;
							break;
						}
					}
					if (!this.mallItemMap.has(colorKey)) return;
					this.mallItemMap.get(colorKey).updateSelectState(true);
					break;
				default:
					assetId = await this.getMallModuleC.getCharacterAssetId(this.currentConfigId) as string;
					if (!assetId || assetId.length == 0 || !this.mallItemMap.has(assetId)) return;
					this.mallItemMap.get(assetId).updateSelectState(true);
					break;
			}
		});
	}

	private checkSkinToneMallItemState(): void {
		if (this.currentConfigId != Tab2Type.Tab2_SkinTone) return;
		ExecutorManager.instance.pushAsyncExecutor(async () => {
			let assetId = await this.getMallModuleC.getCharacterAssetId(this.currentConfigId) as mw.LinearColor;
			let isHasSelect: boolean = false;
			this.mallItemMap.forEach((value: MallItem_Small | MallItem_Big | MallItem_Color, key: string) => {
				if (Utils.isEqulaLinearColor(Utils.colorHexToLinearColorToString(key), assetId)) {
					isHasSelect = true;
					value.updateSelectState(true);
				} else {
					value.updateSelectState(false);
				}
			});
			if (!isHasSelect) this.mallItemMap.get(`ColorPick`).updateSelectState(true);
		});
	}

	private hideTab123Canvas(): void {
		Utils.setWidgetVisibility(this.mTab1Canvas, mw.SlateVisibility.Collapsed);
		Utils.setWidgetVisibility(this.mTab2Canvas, mw.SlateVisibility.Collapsed);
		Utils.setWidgetVisibility(this.mTab3Canvas, mw.SlateVisibility.Collapsed);
	}

	private hideTab23Canvas(): void {
		Utils.setWidgetVisibility(this.mTab2Canvas, mw.SlateVisibility.Collapsed);
		Utils.setWidgetVisibility(this.mTab3Canvas, mw.SlateVisibility.Collapsed);
	}

	private hideTab3Canvas(): void {
		Utils.setWidgetVisibility(this.mTab3Canvas, mw.SlateVisibility.Collapsed);
	}

	private showTab1Canvas(): void {
		Utils.setWidgetVisibility(this.mTab1Canvas, mw.SlateVisibility.SelfHitTestInvisible);
	}

	private showTab2Canvas(): void {
		Utils.setWidgetVisibility(this.mTab2Canvas, mw.SlateVisibility.SelfHitTestInvisible);
	}

	private showTab3Canvas(): void {
		Utils.setWidgetVisibility(this.mTab3Canvas, mw.SlateVisibility.SelfHitTestInvisible);
	}

	private addSelectTab1Action(tab1Id: number): void {
		if (this.tab1Id == tab1Id) return;
		this.tab1Id = tab1Id;
		this.initTab2();
	}

	private addSelectTab2Action(tab2Id: number): void {
		if (this.tab2Id == tab2Id) return;
		this.tab2Id = tab2Id;
		this.initTab3();
	}

	private addSelectTab3Action(tab3Id: number): void {
		if (this.tab3Id == tab3Id) return;
		this.tab3Id = tab3Id;
		this.initItem(TabType.Tab3);
	}

	private mallTab1s: MallTab1[] = [];
	private updateTab1(): void {
		if (this.tab1Ids.length >= this.mallTab1s.length) {
			for (let i = 0; i < this.mallTab1s.length; ++i) {
				this.mallTab1s[i].initTab1(this.tab1Ids[i]);
				Utils.setWidgetVisibility(this.mallTab1s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.mallTab1s.length; i < this.tab1Ids.length; ++i) {
				let mallTab1 = UIService.create(MallTab1);
				mallTab1.initTab1(this.tab1Ids[i]);
				this.mTab1ContentCanvas.addChild(mallTab1.uiObject);
				this.mallTab1s.push(mallTab1);
			}
		} else {
			for (let i = 0; i < this.tab1Ids.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab1s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallTab1s[i].initTab1(this.tab1Ids[i]);
			}
			for (let i = this.tab1Ids.length; i < this.mallTab1s.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab1s[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private mallTab2s: MallTab2[] = [];
	private updateTab2(): void {
		if (this.tab2Ids.length >= this.mallTab2s.length) {
			for (let i = 0; i < this.mallTab2s.length; ++i) {
				this.mallTab2s[i].initTab2(this.tab2Ids[i]);
				Utils.setWidgetVisibility(this.mallTab2s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.mallTab2s.length; i < this.tab2Ids.length; ++i) {
				let mallTab2 = UIService.create(MallTab2);
				mallTab2.initTab2(this.tab2Ids[i]);
				this.mTab2ContentCanvas.addChild(mallTab2.uiObject);
				this.mallTab2s.push(mallTab2);
			}
		} else {
			for (let i = 0; i < this.tab2Ids.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab2s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallTab2s[i].initTab2(this.tab2Ids[i]);
			}
			for (let i = this.tab2Ids.length; i < this.mallTab2s.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab2s[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private mallTab3s: MallTab3[] = [];
	private updateTab3(): void {
		if (this.tab3Ids.length >= this.mallTab3s.length) {
			for (let i = 0; i < this.mallTab3s.length; ++i) {
				this.mallTab3s[i].initTab3(this.tab3Ids[i]);
				Utils.setWidgetVisibility(this.mallTab3s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.mallTab3s.length; i < this.tab3Ids.length; ++i) {
				let mallTab3 = UIService.create(MallTab3);
				mallTab3.initTab3(this.tab3Ids[i]);
				this.mTab3ContentCanvas.addChild(mallTab3.uiObject);
				this.mallTab3s.push(mallTab3);
			}
		} else {
			for (let i = 0; i < this.tab3Ids.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab3s[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
				this.mallTab3s[i].initTab3(this.tab3Ids[i]);
			}
			for (let i = this.tab3Ids.length; i < this.mallTab3s.length; ++i) {
				Utils.setWidgetVisibility(this.mallTab3s[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		}
	}

	private mallItem_Selfs: MallItem_Self[] = [];
	public refreshMallItemSelf(usingAssetIdMap: Map<number, AssetIdInfoData>, isCheck: boolean = false): void {
		if (isCheck) this.checkMallItemState();

		let valueArr = Array.from(usingAssetIdMap);
		if (this.mallItem_Selfs.length > valueArr.length) {
			for (let i = 0; i < valueArr.length; ++i) {
				this.mallItem_Selfs[i].initItem(valueArr[i][0], valueArr[i][1]);
				Utils.setWidgetVisibility(this.mallItem_Selfs[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = valueArr.length; i < this.mallItem_Selfs.length; ++i) {
				Utils.setWidgetVisibility(this.mallItem_Selfs[i].uiObject, mw.SlateVisibility.Collapsed);
			}
		} else {
			for (let i = 0; i < this.mallItem_Selfs.length; ++i) {
				this.mallItem_Selfs[i].initItem(valueArr[i][0], valueArr[i][1]);
				Utils.setWidgetVisibility(this.mallItem_Selfs[i].uiObject, mw.SlateVisibility.SelfHitTestInvisible);
			}
			for (let i = this.mallItem_Selfs.length; i < valueArr.length; ++i) {
				let mallItem_Self = UIService.create(MallItem_Self);
				mallItem_Self.initItem(valueArr[i][0], valueArr[i][1]);
				this.mSelfContentCanvas.addChild(mallItem_Self.uiObject);
				this.mallItem_Selfs.push(mallItem_Self);
			}
		}
	}

	protected onShow(...params: any[]): void {
		Event.dispatchToLocal(`OnOffMainHUD`, false);
		this.canUpdate = true;
		TouchScript.instance.addScreenListener(this.mTouchImage, this.onMoveTouchEvent.bind(this), false);
	}

	protected onHide(): void {
		Event.dispatchToLocal(`OnOffMainHUD`, true);
		this.canUpdate = false;
		TouchScript.instance.removeScreenListener(this.mTouchImage);
	}

	public onOffLeftCanvas(isOpen: boolean): void {
		Utils.setWidgetVisibility(this.mLeftCanvas, isOpen ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed);
		Utils.setWidgetVisibility(this.mSelfCanvas, isOpen ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed);
	}

	//#region Rotate-Camera
	private initMallRot(): void {
		this.moveVec = [];
		mw.TimeUtil.delayExecute(() => {
			this.movePos = this.mTouchImage.position.multiply(1);
		}, 3)
	}

	private moveId: number = -1;
	private moveVec: number[] = [];
	private dir: number = 0;
	private movePos: mw.Vector2;
	private onMoveTouchEvent = (widget: mw.Widget, event: Enums.TouchEvent, x: number, y: number, inPointerEvent: mw.PointerEvent) => {
		if (this.movePos) {
			if (event == Enums.TouchEvent.DOWN) {
				if (this.moveId < 0) {
					this.moveId = inPointerEvent.pointerIndex;
					this.moveVec[0] = x;
					this.moveVec[1] = y;
				}
			} else if (event == Enums.TouchEvent.MOVE) {
				if (this.moveId >= 0) {
					let xoffset = x - this.moveVec[0];
					let yoffset = y - this.moveVec[1];
					this.dir = 0;
					if (Math.abs(xoffset) > Math.abs(yoffset)) {
						this.dir = Math.floor(xoffset);
					}
					this.moveVec[0] = x;
					this.moveVec[1] = y;
				}
			} else if (event == Enums.TouchEvent.UP) {
				if (this.moveId >= 0) {
					this.moveId = -1;
					this.dir = 0;
				}
			}
		}
	}

	protected onUpdate(dt: number): void {
		if (this.dir != 0) {
			this.getMallModuleC.addRoatation(this.dir * dt);
			this.dir = 0;
		}
	}

	onTouchStarted(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
		return TouchScript.instance.onTouchStarted(inGemory, inPointerEvent);
	}

	onTouchMoved(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
		return TouchScript.instance.onTouchMoved(inGemory, inPointerEvent);
	}

	onTouchEnded(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
		return TouchScript.instance.onTouchEnded(inGemory, inPointerEvent);
	}
	//#endregion
}
