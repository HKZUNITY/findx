import { Notice } from "../../Common/notice/Notice";
import { IBodyTypeElement } from "../../config/BodyType";
import { IColorValueElement } from "../../config/ColorValue";
import { IFaceExpressionElement } from "../../config/FaceExpression";
import { GameConfig } from "../../config/GameConfig";
import { IOutfitElement } from "../../config/Outfit";
import { Utils } from "../../Tools/utils";
import ExecutorManager from "../../Tools/WaitingQueue";
import HUDModuleC from "../HUDModule/HUDModuleC";
import Mall from "./Mall";
import MallData, { AssetIdInfoData, ColorPickTab2Data, Tab2Type, Tab3Type, TabType } from "./MallData";
import MallModuleS from "./MallModuleS";
import ColorPickPanel from "./ui/ColorPickPanel";
import MallPanel from "./ui/MallPanel";
import MallTipsPanel from "./ui/MallTipsPanel";

export default class MallModuleC extends ModuleC<MallModuleS, MallData> {
    private hudModuleC: HUDModuleC = null;
    private get getHUDModuleC(): HUDModuleC {
        if (!this.hudModuleC) {
            this.hudModuleC = ModuleService.getModule(HUDModuleC);
        }
        return this.hudModuleC;
    }

    private mallPanel: MallPanel = null;
    private get getMallPanel(): MallPanel {
        if (!this.mallPanel) {
            this.mallPanel = UIService.getUI(MallPanel);
        }
        return this.mallPanel;
    }

    private colorPickPanel: ColorPickPanel = null;
    private get getColorPickPanel(): ColorPickPanel {
        if (!this.colorPickPanel) {
            this.colorPickPanel = UIService.getUI(ColorPickPanel);
        }
        return this.colorPickPanel;
    }

    private mallTipsPanel: MallTipsPanel = null;
    private get getMallTipsPanel(): MallTipsPanel {
        if (!this.mallTipsPanel) {
            this.mallTipsPanel = UIService.getUI(MallTipsPanel);
        }
        return this.mallTipsPanel;
    }

    public onSelectTab1Action: Action1<number> = new Action1<number>();
    public onSelectTab2Action: Action1<number> = new Action1<number>();
    public onSelectTab3Action: Action1<number> = new Action1<number>();
    public onSelectItemAction: Action3<number, number, string> = new Action3<number, number, string>();
    public onOpenColorPickAction: Action2<number, number> = new Action2<number, number>();
    public onResetAction: Action = new Action();
    public onSaveAction: Action = new Action();
    public onSexAction: Action = new Action();
    public onCloseMallPanelAction: Action = new Action();
    public onSelectColorPickTab2Action: Action1<number> = new Action1<number>();
    public onSelectColorPickTab3Action: Action1<number> = new Action1<number>();
    public onColorPickChangedAction: Action1<mw.LinearColor> = new Action1<mw.LinearColor>();
    public onCloseColorPickPanelAction: Action = new Action();
    public onSaveColorPickPanelAction: Action = new Action();
    public onCloseMallItemSelfAction: Action2<number, string> = new Action2<number, string>();

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.bindAction();
        this.bindEvent();
    }

    protected onEnterScene(sceneType: number): void {
        this.initNpc();
        this.initShopCamera();
    }

    private bindAction(): void {
        this.getHUDModuleC?.onOpenShareAction.add(this.addOpenMallAction.bind(this));
        this.onSelectItemAction.add(this.addSelectItemAction.bind(this));
        this.onOpenColorPickAction.add(this.addOpenColorPickAction.bind(this));
        this.onSaveAction.add(this.addSaveAction.bind(this));
        this.onCloseMallPanelAction.add(this.addCloseAction.bind(this));
        this.onResetAction.add(this.addResetAction.bind(this));
        this.onSexAction.add(this.addSexAction.bind(this));
        this.onSelectColorPickTab2Action.add(this.addSelectColorPickTab2Action.bind(this));
        this.onSelectColorPickTab3Action.add(this.addSelectColorPickTab3Action.bind(this));
        this.onColorPickChangedAction.add(this.changeCharacterColor.bind(this));
        this.onCloseColorPickPanelAction.add(this.addCloseColorPickPanelAction.bind(this));
        this.onSaveColorPickPanelAction.add(this.addSaveColorPickPanelAction.bind(this));
        this.onCloseMallItemSelfAction.add(this.addCloseMallItemSelfAction.bind(this));
    }

    private bindEvent(): void {
        InputUtil.onKeyDown(mw.Keys.O, () => {
            this.addOpenMallAction();
        });
    }

    private addSaveColorPickPanelAction(): void {
        this.isNeedSaveColor = false;
        this.getMallPanel.checkSkinToneMallItemStateAndShowMallPanel();
    }

    private addCloseColorPickPanelAction(): void {
        if (this.isNeedSaveColor) {
            this.getMallTipsPanel.showTips(() => {
                this.isNeedSaveColor = false;
                this.getMallPanel.checkSkinToneMallItemStateAndShowMallPanel();
            }, () => {
                this.isNeedSaveColor = false;
                ExecutorManager.instance.pushAsyncExecutor(async () => {
                    await this.copyNpc.asyncReady();
                    this.localPlayer.character.setDescription(this.copyNpc.getDescription());
                    await this.localPlayer.character.asyncReady();
                    this.getMallPanel.checkSkinToneMallItemStateAndShowMallPanel();
                });
            }, GameConfig.Language.Text_CloseTips.Value
                , GameConfig.Language.Text_WhetherToKeepTheCurrentColor.Value
                , GameConfig.Language.Text_NoRetain.Value
                , GameConfig.Language.Text_Retain.Value);
        } else {
            this.getMallPanel.checkSkinToneMallItemStateAndShowMallPanel();
        }
    }

    private addOpenMallAction(): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            await this.localPlayer.character.asyncReady();
            this.initUsingCharacterData();
            this.onSwitchCameraAction.call(2);
            if (!mw.UIService.getUI(MallPanel, false)?.visible) {
                this.mallPanel = UIService.getUI(MallPanel);
                this.getMallPanel.initMallPanel(this.saveSomatotype, this.usingAssetIdMap);
            }
            this.getMallPanel.show();

            this.decorationIndexMap.clear();//TODO-WFZ
        });
    }

    public closeMallPanel(): void {
        this.getMallPanel.hide();
        this.onSwitchCameraAction.call(0);
    }

    private usingAssetIdMap: Map<number, AssetIdInfoData> = new Map<number, AssetIdInfoData>();
    private usingAssetIds: number[] = [];
    private initUsingCharacterData(): void {
        this.usingAssetIdMap.clear();
        this.usingAssetIds.length = 0;

        let fullHair = Mall.getAssetId(Tab3Type.Tab3_FullHair);
        if (fullHair && fullHair.length > 0) {
            let fullHairElement = GameConfig.FullHair.findElement(`AssetId`, fullHair);
            if (fullHairElement) {
                this.usingAssetIdMap.set(Tab3Type.Tab3_FullHair, new AssetIdInfoData(fullHair));
            } else {
                let frontHair = Mall.getAssetId(Tab3Type.Tab3_FrontHair);
                if (frontHair && frontHair.length > 0) this.usingAssetIdMap.set(Tab3Type.Tab3_FrontHair, new AssetIdInfoData(frontHair));
                this.usingAssetIdMap.set(Tab3Type.Tab3_BackHair, new AssetIdInfoData(fullHair));
            }
        }

        let top = Mall.getAssetId(Tab2Type.Tab2_Top);
        if (top && top.length > 0) this.usingAssetIdMap.set(Tab2Type.Tab2_Top, new AssetIdInfoData(top));
        let bottom = Mall.getAssetId(Tab2Type.Tab2_Bottom);
        if (bottom && bottom.length > 0) this.usingAssetIdMap.set(Tab2Type.Tab2_Bottom, new AssetIdInfoData(bottom));
        let shoes = Mall.getAssetId(Tab2Type.Tab2_Shoes);
        if (shoes && shoes.length > 0) this.usingAssetIdMap.set(Tab2Type.Tab2_Shoes, new AssetIdInfoData(shoes));
        let gloves = Mall.getAssetId(Tab2Type.Tab2_Gloves);
        if (gloves && gloves.length > 0) this.usingAssetIdMap.set(Tab2Type.Tab2_Gloves, new AssetIdInfoData(gloves));

        let slot = this.localPlayer.character.description.advance.slotAndDecoration.slot;
        for (let i = 0; i < slot.length; ++i) {
            for (let j = 0; j < slot[i].decoration.length; ++j) {
                let decoration = slot[i].decoration[j];
                if (!decoration.attachmentAssetId || !decoration.attachmentGameObject || !decoration.attachmentOffset) continue;
                this.usingAssetIdMap.set(Number(decoration.attachmentAssetId), new AssetIdInfoData(decoration.attachmentAssetId, i, j));
                this.usingAssetIds.push(Number(decoration.attachmentAssetId));
            }
        }

        let eyebrows = Mall.getAssetId(Tab2Type.Tab2_Eyebrows);
        if (eyebrows && eyebrows.length > 0 && eyebrows != `32115`) this.usingAssetIdMap.set(Tab2Type.Tab2_Eyebrows, new AssetIdInfoData(eyebrows));
        let pupilStyle = Mall.getAssetId(Tab3Type.Tab3_PupilStyle);
        if (pupilStyle && pupilStyle.length > 0 && pupilStyle != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_PupilStyle, new AssetIdInfoData(pupilStyle));
        let Lens = Mall.getAssetId(Tab3Type.Tab3_Lens);
        if (Lens && Lens.length > 0 && Lens != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_Lens, new AssetIdInfoData(Lens));
        let UpperHighlight = Mall.getAssetId(Tab3Type.Tab3_UpperHighlight);
        if (UpperHighlight && UpperHighlight.length > 0 && UpperHighlight != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_UpperHighlight, new AssetIdInfoData(UpperHighlight));
        let LowerHighlight = Mall.getAssetId(Tab3Type.Tab3_LowerHighlight);
        if (LowerHighlight && LowerHighlight.length > 0 && LowerHighlight != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_LowerHighlight, new AssetIdInfoData(LowerHighlight));
        let Eyelashes = Mall.getAssetId(Tab3Type.Tab3_Eyelashes);
        if (Eyelashes && Eyelashes.length > 0 && Eyelashes != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_Eyelashes, new AssetIdInfoData(Eyelashes));
        let Eyeshadow = Mall.getAssetId(Tab3Type.Tab3_Eyeshadow);
        if (Eyeshadow && Eyeshadow.length > 0 && Eyeshadow != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_Eyeshadow, new AssetIdInfoData(Eyeshadow));
        let Blush = Mall.getAssetId(Tab3Type.Tab3_Blush);
        if (Blush && Blush.length > 0 && Blush != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_Blush, new AssetIdInfoData(Blush));
        let LipMakeup = Mall.getAssetId(Tab3Type.Tab3_LipMakeup);
        if (LipMakeup && LipMakeup.length > 0 && LipMakeup != `32115`) this.usingAssetIdMap.set(Tab3Type.Tab3_LipMakeup, new AssetIdInfoData(LipMakeup));
    }

    // private refreshUsingCharacterDataByTabId(tabId: number): void {
    //     let assetId = Mall.getAssetId(tabId);
    //     if (assetId && assetId.length > 0) {
    //         this.usingAssetIdMap.set(tabId, new AssetIdInfoData(assetId));
    //     } else {
    //         if (this.usingAssetIdMap.has(tabId)) this.usingAssetIdMap.delete(tabId);
    //     }
    // }

    // private refreshUsingCharacterDataByAssetId(): void {
    //     if (this.usingAssetIds && this.usingAssetIds.length > 0) {
    //         this.usingAssetIds.forEach((value: number) => {
    //             if (this.usingAssetIdMap.has(value)) this.usingAssetIdMap.delete(value);
    //         });
    //     }
    //     this.usingAssetIds.length = 0;
    //     let slot = this.localPlayer.character.description.advance.slotAndDecoration.slot;
    //     for (let i = 0; i < slot.length; ++i) {
    //         for (let j = 0; j < slot[i].decoration.length; ++j) {
    //             let decoration = slot[i].decoration[j];
    //             if (!decoration.attachmentAssetId || !decoration.attachmentGameObject || !decoration.attachmentOffset) continue;
    //             this.usingAssetIdMap.set(Number(decoration.attachmentAssetId), new AssetIdInfoData(decoration.attachmentAssetId, i, j));
    //             this.usingAssetIds.push(Number(decoration.attachmentAssetId));
    //         }
    //     }
    // }

    private addCloseMallItemSelfAction(tabId: number, assetId: string): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            if (Mall.isClothingTabId(tabId)) {
                await this.changeCharacter(tabId, assetId);
            } else {
                if (!this.usingAssetIdMap.has(Number(assetId))) return;
                let assetIdInfoData = this.usingAssetIdMap.get(Number(assetId));
                await this.localPlayer.character.asyncReady();
                let attachmentGameObject = this.localPlayer.character.description.advance
                    ?.slotAndDecoration?.slot[assetIdInfoData.slotType]?.decoration[assetIdInfoData.slotIndex]?.attachmentGameObject;
                if (!attachmentGameObject) return;
                this.localPlayer.character.description.advance.slotAndDecoration.slot[assetIdInfoData.slotType].decoration.delete(attachmentGameObject, true);
                this.usingAssetIdMap.delete(Number(assetId));
                if (this.usingAssetIds.indexOf(Number(assetId)) != -1) this.usingAssetIds.splice(this.usingAssetIds.indexOf(Number(assetId)), 1);
                await this.localPlayer.character.asyncReady();
            }
            this.initUsingCharacterData();
            this.getMallPanel.refreshMallItemSelf(this.usingAssetIdMap, true);
        });
    }

    private addSelectItemAction(tabType: TabType, tabId: number, assetId: string): void {
        if (tabType == TabType.None) return;
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            await this.changeCharacter(tabId, assetId);
            if (!Mall.isRemovableTabId(tabId)) return;
            // if (Mall.isClothingTabId(tabId)) {
            //     this.refreshUsingCharacterDataByTabId(tabId);
            // } else {
            //     this.refreshUsingCharacterDataByAssetId();
            // }
            this.initUsingCharacterData();
            this.getMallPanel.refreshMallItemSelf(this.usingAssetIdMap, Mall.isSlot(tabId));
        });
    }

    private isNeedSaveCharacter: boolean = false;
    private async changeCharacter(tabId: number, assetId: string): Promise<void> {
        await this.localPlayer.character.asyncReady();
        switch (tabId) {
            case Tab2Type.Tab2_BodyType:
                let bodyTypeElement: IBodyTypeElement = GameConfig.BodyType.getElement(assetId);
                if (!bodyTypeElement || bodyTypeElement?.Scale == 0) return;
                this.localPlayer.character.description.advance.bodyFeatures.body.height = bodyTypeElement.Scale;
                break;
            case Tab2Type.Tab2_SkinTone:
                this.localPlayer.character.description.advance.makeup.skinTone.skinColor = mw.LinearColor.colorHexToLinearColor(assetId);
                break;
            case Tab2Type.Tab2_Face:
                await Utils.asyncDownloadAsset(assetId);
                this.localPlayer.character.description.advance.headFeatures.head.style = assetId;
                break;
            case Tab2Type.Tab2_Eyebrows:
                if (this.localPlayer.character.description.advance.makeup.eyebrows.eyebrowStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.eyebrows.eyebrowStyle = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let eyebrowStyle: string = ``;
                    if (somatotype % 2 == 0) {
                        eyebrowStyle = `398608`;
                    } else {
                        eyebrowStyle = `77763`;
                    }
                    await Utils.asyncDownloadAsset(eyebrowStyle);
                    this.localPlayer.character.description.advance.makeup.eyebrows.eyebrowStyle = eyebrowStyle;
                }
                break;
            case Tab2Type.Tab2_Expression:
                let faceExpressionElement: IFaceExpressionElement = GameConfig.FaceExpression.getElement(assetId);
                if (!faceExpressionElement || faceExpressionElement?.ExpressionType < 0 || faceExpressionElement?.ExpressionType > 9) return;
                this.localPlayer.character.description.advance.headFeatures.expressions.changeExpression = faceExpressionElement.ExpressionType;
                break;
            case Tab2Type.Tab2_Outfit:
                await this.changeOutfit(GameConfig.Outfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_DailyStyling_Suit1:
                await this.changeOutfit(GameConfig.DailyStylingOutfit1.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_DailyStyling_Suit2:
                await this.changeOutfit(GameConfig.DailyStylingOutfit2.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_MuppetStyling_Suit:
                await this.changeOutfit(GameConfig.MuppetStylingOutfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_HeroStyling_Suit:
                await this.changeOutfit(GameConfig.HeroStylingOutfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_FantasyModeling_Suit:
                await this.changeOutfit(GameConfig.FantasyModelingOutfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_HolidayStyling_Suit:
                await this.changeOutfit(GameConfig.HolidayStylingOutfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_ScienceFictionStyling_Suit:
                await this.changeOutfit(GameConfig.ScienceFictionStylingOutfit.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_AncientMolding_Suit:
                await this.changeOutfit(GameConfig.AncientMoldingOutfit.getElement(assetId).AssetId);
                break;
            case Tab2Type.Tab2_Top:
                await this.changeTop(assetId);
                break;
            case Tab3Type.Tab3_LongSinglePiece_Top:
                await this.changeTop(GameConfig.LongSinglePieceTop.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_ShortJacket_Top:
                await this.changeTop(GameConfig.ShortJacketTop.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_ShortSinglePiece_Top:
                await this.changeTop(GameConfig.ShortSinglePieceTop.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_Suit_Top:
                await this.changeTop(GameConfig.SuitTop.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_ALongCoat_Top:
                await this.changeTop(GameConfig.ALongCoatTop.getElement(assetId).AssetId);
                break;
            case Tab2Type.Tab2_Bottom:
                await this.changeBottom(assetId);
                break;
            case Tab3Type.Tab3_ShortSkirt_Bottom:
                await this.changeBottom(GameConfig.ShortSkirtBottom.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_LongPants_Bottom:
                await this.changeBottom(GameConfig.LongPantsBottom.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_Shorts_Bottom:
                await this.changeBottom(GameConfig.ShortsBottom.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_LongSkirt_Bottom:
                await this.changeBottom(GameConfig.LongSkirtBottom.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_Tights_Bottom:
                await this.changeBottom(GameConfig.TightsBottom.getElement(assetId).AssetId);
                break;
            case Tab2Type.Tab2_Shoes:
                await this.changeShoes(assetId);
                break;
            case Tab3Type.Tab3_Everyday_Shoes:
                await this.changeShoes(GameConfig.EverydayShoes.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_Boots_Shoes:
                await this.changeShoes(GameConfig.BootsShoes.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_FootCover_Shoes:
                await this.changeShoes(GameConfig.FootCoverShoes.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_NakedDress_Shoes:
                await this.changeShoes(GameConfig.NakedDressShoes.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_HighHeels_Shoes:
                await this.changeShoes(GameConfig.HighHeelsShoes.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_SportsShoes_Shoes:
                await this.changeShoes(GameConfig.SportsShoesShoes.getElement(assetId).AssetId);
                break;
            case Tab2Type.Tab2_Gloves:
                await this.changeGloves(assetId);
                break;
            case Tab3Type.Tab3_Gloves_Gloves:
                await this.changeGloves(GameConfig.GlovesGloves.getElement(assetId).AssetId);
                break;
            case Tab3Type.Tab3_Accessories_Gloves:
                await this.changeGloves(GameConfig.AccessoriesGloves.getElement(assetId).AssetId);
                break;
            case Tab2Type.Tab2_Pet:
                let petElement = GameConfig.Pets.getElement(assetId);
                if (!petElement) return;
                await this.changeSlotAndDecoration(tabId, petElement.AssetId, Utils.stringArrayToTransform(petElement.Transform), mw.HumanoidSlotType.Root);
                break;
            case Tab3Type.Tab3_PupilStyle:
                if (this.localPlayer.character.description.advance.makeup.coloredContacts.style.pupilStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.style.pupilStyle = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let pupilStyle: string = ``;
                    if (somatotype % 2 == 0) {
                        pupilStyle = `398609`;
                    } else {
                        pupilStyle = `47968`;
                    }
                    await Utils.asyncDownloadAsset(pupilStyle);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.style.pupilStyle = pupilStyle;
                }
                break;
            case Tab3Type.Tab3_Lens:
                if (this.localPlayer.character.description.advance.makeup.coloredContacts.decal.pupilStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.decal.pupilStyle = assetId;
                } else {
                    await Utils.asyncDownloadAsset(`32115`);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.decal.pupilStyle = `32115`;
                }
                break;
            case Tab3Type.Tab3_UpperHighlight:
                if (this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let upperHighlightStyle: string = ``;
                    if (somatotype % 2 == 0) {
                        upperHighlightStyle = `48041`;
                    } else {
                        upperHighlightStyle = `32112`;
                    }
                    await Utils.asyncDownloadAsset(upperHighlightStyle);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle = upperHighlightStyle;
                }
                break;
            case Tab3Type.Tab3_LowerHighlight:
                if (this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let lowerHighlightStyle: string = ``;
                    if (somatotype % 2 == 0) {
                        lowerHighlightStyle = `48026`;
                    } else {
                        lowerHighlightStyle = `32098`;
                    }
                    await Utils.asyncDownloadAsset(lowerHighlightStyle);
                    this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle = lowerHighlightStyle;
                }
                break;
            case Tab3Type.Tab3_Eyelashes:
                if (this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let eyelashStyle: string = ``;
                    if (somatotype % 2 == 0) {
                        eyelashStyle = `398607`;
                    } else {
                        eyelashStyle = `48062`;
                    }
                    await Utils.asyncDownloadAsset(eyelashStyle);
                    this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle = eyelashStyle;
                }
                break;
            case Tab3Type.Tab3_Eyeshadow:
                if (this.localPlayer.character.description.advance.makeup.eyeShadow.eyeshadowStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.eyeShadow.eyeshadowStyle = assetId;
                } else {
                    await Utils.asyncDownloadAsset(`32115`);
                    this.localPlayer.character.description.advance.makeup.eyeShadow.eyeshadowStyle = `32115`;
                }
                break;
            case Tab3Type.Tab3_Blush:
                if (this.localPlayer.character.description.advance.makeup.blush.blushStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.blush.blushStyle = assetId;
                } else {
                    await Utils.asyncDownloadAsset(`32115`);
                    this.localPlayer.character.description.advance.makeup.blush.blushStyle = `32115`;
                }
                break;
            case Tab3Type.Tab3_LipMakeup:
                if (this.localPlayer.character.description.advance.makeup.lipstick.lipstickStyle != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.makeup.lipstick.lipstickStyle = assetId;
                } else {
                    await Utils.asyncDownloadAsset(`32115`);
                    this.localPlayer.character.description.advance.makeup.lipstick.lipstickStyle = `32115`;
                }
                break;
            case Tab3Type.Tab3_FaceTattoo:
                // this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle = assetId;
                break;
            case Tab3Type.Tab3_FullHair:
                if (this.localPlayer.character.description.advance.hair.backHair.style != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.hair.backHair.style = assetId;
                    this.localPlayer.character.description.advance.hair.frontHair.style = ``;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let frontHair: string = ``;
                    let backHair: string = ``;
                    if (somatotype % 2 == 0) {
                        frontHair = `292003`;
                        backHair = `292001`;
                    } else {
                        frontHair = `343471`;
                        backHair = `343476`;
                    }
                    await Utils.asyncDownloadAssets([frontHair, backHair]);
                    this.localPlayer.character.description.advance.hair.frontHair.style = frontHair;
                    this.localPlayer.character.description.advance.hair.backHair.style = backHair;
                }
                break;
            case Tab3Type.Tab3_FrontHair:
                if (this.localPlayer.character.description.advance.hair.frontHair.style != assetId) {
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.hair.frontHair.style = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let frontHair: string = ``;
                    if (somatotype % 2 == 0) {
                        frontHair = `292003`;
                    } else {
                        frontHair = `343471`;
                    }
                    await Utils.asyncDownloadAsset(frontHair);
                    this.localPlayer.character.description.advance.hair.frontHair.style = frontHair;
                }
                let backHair = this.localPlayer.character.description.advance.hair.backHair.style;
                let fullHairElement = GameConfig.FullHair.findElement(`AssetId`, backHair);
                if (fullHairElement) {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let backHair: string = ``;
                    if (somatotype % 2 == 0) {
                        backHair = `292001`;
                    } else {
                        backHair = `343476`;
                    }
                    await Utils.asyncDownloadAsset(backHair);
                    this.localPlayer.character.description.advance.hair.backHair.style = backHair;
                } else { }
                break;
            case Tab3Type.Tab3_BackHair:
                if (this.localPlayer.character.description.advance.hair.backHair.style != assetId) {
                    let backHair = this.localPlayer.character.description.advance.hair.backHair.style;
                    let fullHairElement = GameConfig.FullHair.findElement(`AssetId`, backHair);
                    if (fullHairElement) {
                        let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                        let frontHair: string = ``;
                        if (somatotype % 2 == 0) {
                            frontHair = `292003`;
                        } else {
                            frontHair = `343471`;
                        }
                        await Utils.asyncDownloadAsset(frontHair);
                        this.localPlayer.character.description.advance.hair.frontHair.style = frontHair;
                    } else { }
                    await Utils.asyncDownloadAsset(assetId);
                    this.localPlayer.character.description.advance.hair.backHair.style = assetId;
                } else {
                    let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
                    let backHair: string = ``;
                    if (somatotype % 2 == 0) {
                        backHair = `292001`;
                    } else {
                        backHair = `343476`;
                    }
                    await Utils.asyncDownloadAsset(backHair);
                    this.localPlayer.character.description.advance.hair.backHair.style = backHair;
                }
                break;
            case Tab3Type.Tab3_LeftHand:
                let leftHandElement = GameConfig.LeftHand.getElement(assetId);
                if (!leftHandElement) return;
                await this.changeSlotAndDecoration(tabId, leftHandElement.AssetId, Utils.stringArrayToTransform(leftHandElement.Transform), mw.HumanoidSlotType.LeftHand);
                break;
            case Tab3Type.Tab3_RightHand:
                let rightHandElement = GameConfig.RightHand.getElement(assetId);
                if (!rightHandElement) return;
                await this.changeSlotAndDecoration(tabId, rightHandElement.AssetId, Utils.stringArrayToTransform(rightHandElement.Transform), mw.HumanoidSlotType.RightHand);
                break;
            case Tab3Type.Tab3_Back:
                let backElement = GameConfig.Back.getElement(assetId);
                if (!backElement) return;
                await this.changeSlotAndDecoration(tabId, backElement.AssetId, Utils.stringArrayToTransform(backElement.Transform), mw.HumanoidSlotType.BackOrnamental);
                break;
            case Tab3Type.Tab3_Ear:
                let earElement = GameConfig.Ear.getElement(assetId);
                if (!earElement) return;
                await this.changeSlotAndDecoration(tabId, earElement.AssetId, Utils.stringArrayToTransform(earElement.Transform), mw.HumanoidSlotType.Head);
                break;
            case Tab3Type.Tab3_Face:
                let facingElement = GameConfig.Facing.getElement(assetId);
                if (!facingElement) return;
                await this.changeSlotAndDecoration(tabId, facingElement.AssetId, Utils.stringArrayToTransform(facingElement.Transform), mw.HumanoidSlotType.FaceOrnamental);
                break;
            case Tab3Type.Tab3_Hip:
                let hipElement = GameConfig.Hip.getElement(assetId);
                if (!hipElement) return;
                await this.changeSlotAndDecoration(tabId, hipElement.AssetId, Utils.stringArrayToTransform(hipElement.Transform), mw.HumanoidSlotType.Buttocks);
                break;
            case Tab3Type.Tab3_Shoulder:
                let shoulderElement = GameConfig.Shoulder.getElement(assetId);
                if (!shoulderElement) return;
                await this.changeSlotAndDecoration(tabId, shoulderElement.AssetId, Utils.stringArrayToTransform(shoulderElement.Transform), mw.HumanoidSlotType.Rings);
                break;
            case Tab3Type.Tab3_Effects:
                let effectsElement = GameConfig.Effects.getElement(assetId);
                if (!effectsElement) return;
                await this.changeSlotAndDecoration(tabId, effectsElement.AssetId, Utils.stringArrayToTransform(effectsElement.Transform), mw.HumanoidSlotType.Root);
                break;
            case Tab3Type.Tab3_Trailing:
                let trailingElement = GameConfig.Trailings.getElement(assetId);
                if (!trailingElement) return;
                await this.changeSlotAndDecoration(tabId, trailingElement.AssetId, Utils.stringArrayToTransform(trailingElement.Transform), mw.HumanoidSlotType.Root);
                break;
            default:
                break;
        }
        await this.localPlayer.character.asyncReady();
        this.isNeedSaveCharacter = true;
        // this.localPlayer.character.syncDescription();
    }

    private async changeTop(assetId: string): Promise<void> {
        if (this.localPlayer.character.description.advance.clothing.upperCloth.style != assetId) {
            await Utils.asyncDownloadAsset(assetId);
            this.localPlayer.character.description.advance.clothing.upperCloth.style = assetId;
        } else {
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            let upperClothStyle: string = ``;
            if (somatotype % 2 == 0) {
                upperClothStyle = `292004`;
            } else {
                upperClothStyle = `343474`;
            }
            await Utils.asyncDownloadAsset(upperClothStyle);
            this.localPlayer.character.description.advance.clothing.upperCloth.style = upperClothStyle;
        }
    }

    private async changeBottom(assetId: string): Promise<void> {
        if (this.localPlayer.character.description.advance.clothing.lowerCloth.style != assetId) {
            await Utils.asyncDownloadAsset(assetId);
            this.localPlayer.character.description.advance.clothing.lowerCloth.style = assetId;
        } else {
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            let lowerClothStyle: string = ``;
            if (somatotype % 2 == 0) {
                lowerClothStyle = `292002`;
            } else {
                lowerClothStyle = `343467`;
            }
            await Utils.asyncDownloadAsset(lowerClothStyle);
            this.localPlayer.character.description.advance.clothing.lowerCloth.style = lowerClothStyle;
        }
    }

    private async changeShoes(assetId: string): Promise<void> {
        if (this.localPlayer.character.description.advance.clothing.shoes.style != assetId) {
            await Utils.asyncDownloadAsset(assetId);
            this.localPlayer.character.description.advance.clothing.shoes.style = assetId;
        } else {
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            let shoesStyle: string = ``;
            if (somatotype % 2 == 0) {
                shoesStyle = `66505`;
            } else {
                shoesStyle = `343475`;
            }
            await Utils.asyncDownloadAsset(shoesStyle);
            this.localPlayer.character.description.advance.clothing.shoes.style = shoesStyle;
        }
    }

    private async changeGloves(assetId: string): Promise<void> {
        if (this.localPlayer.character.description.advance.clothing.gloves.style != assetId) {
            await Utils.asyncDownloadAsset(assetId);
            this.localPlayer.character.description.advance.clothing.gloves.style = assetId;
        } else {
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            let glovesStyle: string = ``;
            if (somatotype % 2 == 0) {
                glovesStyle = `75663`;
            } else {
                glovesStyle = `343466`;
            }
            await Utils.asyncDownloadAsset(glovesStyle);
            this.localPlayer.character.description.advance.clothing.gloves.style = glovesStyle;
        }
    }

    private async changeOutfit(assetId: string): Promise<void> {
        await Utils.asyncDownloadAsset(assetId);
        await this.changeOutfitTransition(assetId);
    }

    private async changeOutfit_abandon(configId: string): Promise<void> {
        let outfitElement: IOutfitElement = GameConfig.Outfit.getElement(configId);
        let currentSomatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
        await Utils.asyncDownloadAsset(outfitElement.AssetId);
        if (currentSomatotype == outfitElement.SexType) {
            await this.changeOutfitTransition(outfitElement.AssetId);
            // if (outfitElement.IsTransition > 0) {
            // } else {
            //     this.localPlayer.character.setDescription([outfitElement.AssetId]);
            // }
            // } else {
            //     if (outfitElement.SexType % 2 == 0) {
            //         this.localPlayer.character.setDescription(this.feMaleNpc.getDescription());
            //     } else {
            //         this.localPlayer.character.setDescription(this.maleNpc.getDescription());
            //     }
            //     await this.localPlayer.character.asyncReady();
            //     if (outfitElement.IsTransition > 0) {
            //         await this.changeOutfitTransition(outfitElement.AssetId);
            //     } else {
            //         this.localPlayer.character.setDescription([outfitElement.AssetId]);
            //     }
            //     await this.localPlayer.character.asyncReady();
            //     currentSomatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            //     if (currentSomatotype != outfitElement.SexType) this.localPlayer.character.description.advance.base.characterSetting.somatotype = outfitElement.SexType;
        }
        await this.localPlayer.character.asyncReady();
    }

    private async changeOutfitTransition(assetId: string): Promise<void> {
        if (!this.transitionNpc) await this.initTransitionNpc();
        this.transitionNpc.setDescription([assetId]);
        await this.transitionNpc.asyncReady();
        await Mall.copyCharacterClothingAndHair(this.transitionNpc, this.localPlayer.character);
        // await Mall.copyCharacterSlot(this.transitionNpc, this.localPlayer.character);
    }

    private decorationIndexMap: Map<number, number> = new Map<number, number>();
    private async changeSlotAndDecoration(tagId: number, assetId: string, transform: mw.Transform, slotIndex: number): Promise<void> {
        let decorationIndex: number = -1;
        if (this.decorationIndexMap.has(tagId)) {
            decorationIndex = this.decorationIndexMap.get(tagId);
            let attachmentGameObject = this.localPlayer.character.description.advance.slotAndDecoration.slot[slotIndex].decoration[decorationIndex - 1]?.attachmentGameObject;
            if (attachmentGameObject) {
                let attachmentAssetId = this.localPlayer.character.description.advance.slotAndDecoration.slot[slotIndex].decoration[decorationIndex - 1].attachmentAssetId;
                this.localPlayer.character.description.advance.slotAndDecoration.slot[slotIndex].decoration.delete(attachmentGameObject, true);
                if (assetId == attachmentAssetId) {
                    this.decorationIndexMap.delete(tagId);
                    return;
                }
            } else {
                this.decorationIndexMap.delete(tagId);
            }
        } else {
        }
        if (this.isUsingDecoration(assetId)) {
            this.decorationIndexMap.delete(tagId);
            return;
        }
        await Utils.asyncDownloadAsset(assetId);
        let model = await GameObject.asyncSpawn(assetId) as mw.Model;
        if (!model) return;
        model.setCollision(mw.PropertyStatus.Off, true);
        decorationIndex = this.localPlayer.character.description.advance.slotAndDecoration.slot[slotIndex].decoration.add(model, transform);
        this.decorationIndexMap.set(tagId, decorationIndex);
    }

    private isUsingDecoration(assetId: string): boolean {
        let slot = this.localPlayer.character.description.advance.slotAndDecoration.slot;
        if (!slot || slot.length == 0) return false;
        for (let i = 0; i < slot.length; ++i) {
            for (let j = 0; j < slot[i].decoration.length; ++j) {
                let decoration = slot[i].decoration[j];
                if (decoration.attachmentAssetId == assetId) return true;
            }
        }
        return false;
    }

    private getSlotAndDecoration(tagId: number, slotIndex: number): string {
        if (this.decorationIndexMap.has(tagId)) {
            let decorationIndex = this.decorationIndexMap.get(tagId);
            return this.localPlayer.character.description.advance.slotAndDecoration.slot[slotIndex].decoration[decorationIndex - 1]?.attachmentAssetId;
        } else {
            return null;
        }
    }

    private async deleteDecoration(): Promise<void> {

    }

    public async getCharacterAssetId(configId: number): Promise<string | mw.LinearColor> {
        await this.localPlayer.character.asyncReady();
        switch (configId) {
            case Tab2Type.Tab2_BodyType:
                let heightRatio: number = this.localPlayer.character.description.advance.bodyFeatures.body.height;
                let scale: string = heightRatio.toFixed(1);
                let bodyTypeElement = GameConfig.BodyType.findElement(`Scale`, scale);
                if (!bodyTypeElement) return null;
                return bodyTypeElement.ID.toString();
            case Tab2Type.Tab2_SkinTone:
                return this.localPlayer.character.description.advance.makeup.skinTone.skinColor;
            case Tab2Type.Tab2_Face:
                return this.localPlayer.character.description.advance.headFeatures.head.style;
            case Tab2Type.Tab2_Eyebrows:
                return this.localPlayer.character.description.advance.makeup.eyebrows.eyebrowStyle;
            case Tab2Type.Tab2_Expression:
                let expressionType = this.localPlayer.character.description.advance.headFeatures.expressions.changeExpression;
                if (expressionType < 0 || expressionType > 9) return null;
                let faceExpressionElement: IFaceExpressionElement = GameConfig.FaceExpression.findElement(`ExpressionType`, expressionType);
                if (!faceExpressionElement) return null;
                return faceExpressionElement.ID.toString();
            case Tab2Type.Tab2_Outfit:
                return null;
            case Tab3Type.Tab3_DailyStyling_Suit1:
                return null;
            case Tab3Type.Tab3_DailyStyling_Suit2:
                return null;
            case Tab3Type.Tab3_MuppetStyling_Suit:
                return null;
            case Tab3Type.Tab3_HeroStyling_Suit:
                return null;
            case Tab3Type.Tab3_FantasyModeling_Suit:
                return null;
            case Tab3Type.Tab3_HolidayStyling_Suit:
                return null;
            case Tab3Type.Tab3_ScienceFictionStyling_Suit:
                return null;
            case Tab3Type.Tab3_AncientMolding_Suit:
                return null;
            case Tab2Type.Tab2_Top:
            case Tab3Type.Tab3_LongSinglePiece_Top:
            case Tab3Type.Tab3_ShortJacket_Top:
            case Tab3Type.Tab3_ShortSinglePiece_Top:
            case Tab3Type.Tab3_Suit_Top:
            case Tab3Type.Tab3_ALongCoat_Top:
                return this.localPlayer.character.description.advance.clothing.upperCloth.style;
            case Tab2Type.Tab2_Bottom:
            case Tab3Type.Tab3_ShortSkirt_Bottom:
            case Tab3Type.Tab3_LongPants_Bottom:
            case Tab3Type.Tab3_Shorts_Bottom:
            case Tab3Type.Tab3_LongSkirt_Bottom:
            case Tab3Type.Tab3_Tights_Bottom:
                return this.localPlayer.character.description.advance.clothing.lowerCloth.style;
            case Tab2Type.Tab2_Shoes:
            case Tab3Type.Tab3_Everyday_Shoes:
            case Tab3Type.Tab3_Boots_Shoes:
            case Tab3Type.Tab3_FootCover_Shoes:
            case Tab3Type.Tab3_NakedDress_Shoes:
            case Tab3Type.Tab3_HighHeels_Shoes:
            case Tab3Type.Tab3_SportsShoes_Shoes:
                return this.localPlayer.character.description.advance.clothing.shoes.style;
            case Tab2Type.Tab2_Gloves:
            case Tab3Type.Tab3_Gloves_Gloves:
            case Tab3Type.Tab3_Accessories_Gloves:
                return this.localPlayer.character.description.advance.clothing.gloves.style;
            case Tab2Type.Tab2_Pet:
                // return this.localPlayer.character.description.advance.clothing.upperCloth.style = assetId;
                break;
            case Tab3Type.Tab3_PupilStyle:
                return this.localPlayer.character.description.advance.makeup.coloredContacts.style.pupilStyle;
            case Tab3Type.Tab3_Lens:
                return this.localPlayer.character.description.advance.makeup.coloredContacts.decal.pupilStyle;
            case Tab3Type.Tab3_UpperHighlight:
                return this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle;
            case Tab3Type.Tab3_LowerHighlight:
                return this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle;
            case Tab3Type.Tab3_Eyelashes:
                return this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle;
            case Tab3Type.Tab3_Eyeshadow:
                return this.localPlayer.character.description.advance.makeup.eyeShadow.eyeshadowStyle;
            case Tab3Type.Tab3_Blush:
                return this.localPlayer.character.description.advance.makeup.blush.blushStyle;
            case Tab3Type.Tab3_LipMakeup:
                return this.localPlayer.character.description.advance.makeup.lipstick.lipstickStyle;
            case Tab3Type.Tab3_FaceTattoo:
                //return this.localPlayer.character.description.advance.makeup.eyelashes.eyelashStyle = assetId;
                break;
            case Tab3Type.Tab3_FullHair:
                return this.localPlayer.character.description.advance.hair.backHair.style;
            case Tab3Type.Tab3_FrontHair:
                return this.localPlayer.character.description.advance.hair.frontHair.style;
            case Tab3Type.Tab3_BackHair:
                return this.localPlayer.character.description.advance.hair.backHair.style;
            case Tab3Type.Tab3_LeftHand:
                let leftHand = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.LeftHand);
                if (!leftHand) return null;
                let leftHandElement = GameConfig.LeftHand.findElement(`AssetId`, leftHand);
                if (!leftHandElement) return null;
                return leftHandElement.ID.toString();
            case Tab3Type.Tab3_RightHand:
                let rightHand = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.RightHand);
                if (!rightHand) return null;
                let rightHandElement = GameConfig.RightHand.findElement(`AssetId`, rightHand);
                if (!rightHandElement) return null;
                return rightHandElement.ID.toString();
            case Tab3Type.Tab3_Back:
                let backOrnamental = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.BackOrnamental);
                if (!backOrnamental) return null;
                let backElement = GameConfig.Back.findElement(`AssetId`, backOrnamental);
                if (!backElement) return null;
                return backElement.ID.toString();
            case Tab3Type.Tab3_Ear:
                let ear = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.Head);
                if (!ear) return null;
                let earElement = GameConfig.Ear.findElement(`AssetId`, ear);
                if (!earElement) return null;
                return earElement.ID.toString();
            case Tab3Type.Tab3_Face:
                let face = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.FaceOrnamental);
                if (!face) return null;
                let facingElement = GameConfig.Facing.findElement(`AssetId`, face);
                if (!facingElement) return null;
                return facingElement.ID.toString();
            case Tab3Type.Tab3_Hip:
                let hip = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.Buttocks);
                if (!hip) return null;
                let hipElement = GameConfig.Hip.findElement(`AssetId`, hip);
                if (!hipElement) return null;
                return hipElement.ID.toString();
            case Tab3Type.Tab3_Shoulder:
                let shoulder = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.RightBack);
                if (!shoulder) return null;
                let shoulderElement = GameConfig.Shoulder.findElement(`AssetId`, shoulder);
                if (!shoulderElement) return null;
                return shoulderElement.ID.toString();
            case Tab3Type.Tab3_Effects:
                let effect = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.Root);
                if (!effect) return null;
                let effectsElement = GameConfig.Effects.findElement(`AssetId`, effect);
                if (!effectsElement) return null;
                return effectsElement.ID.toString();
            case Tab3Type.Tab3_Trailing:
                let trailing = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.Root);
                if (!trailing) return null;
                let trailingElement = GameConfig.Trailings.findElement(`AssetId`, trailing);
                if (!trailingElement) return null;
                return trailingElement.ID.toString();
            case Tab2Type.Tab2_Pet:
                let pet = this.getSlotAndDecoration(configId, mw.HumanoidSlotType.Root);
                if (!pet) return null;
                let petElement = GameConfig.Pets.findElement(`AssetId`, pet);
                if (!petElement) return null;
                return petElement.ID.toString();
            default:
                return null;
        }
    }

    public onSwitchCameraAction: Action1<number> = new Action1<number>();
    private lastCameraType: number = -1;
    private async initShopCamera(): Promise<void> {
        // let myCamera = Camera.currentCamera;
        // let shopCamera: mw.Camera = await GameObject.asyncSpawn<mw.Camera>(`Camera`);
        // shopCamera.parent = this.localPlayer.character;
        // shopCamera.localTransform.position = new mw.Vector(200, -10, 30);
        // shopCamera.localTransform.rotation = new mw.Rotation(0, -5, 200);
        // this.onSwitchCameraAction.add((cameraType: number) => {
        //     if (cameraType == 0) {
        //         Camera.switch(myCamera);
        //     } else {
        //         Camera.switch(shopCamera, 0.5, mw.CameraSwitchBlendFunction.Linear);
        //     }
        // });

        let myCamera = Camera.currentCamera;
        let shopCamera: mw.Camera = await GameObject.asyncSpawn<mw.Camera>(`Camera`);
        shopCamera.worldTransform.rotation = mw.Rotation.zero;
        this.onSwitchCameraAction.add((cameraType: number) => {
            if (this.lastCameraType == cameraType) return;
            if (cameraType == 0) {
                Camera.switch(myCamera);
            } else if (cameraType == 1) {
                let rootLoc = this.localPlayer.character.getSlotWorldPosition(mw.HumanoidSlotType.Head);
                // shopCamera.worldTransform.position = new mw.Vector(rootLoc.x - 55, rootLoc.y + 32, rootLoc.z + 10);
                let offsetZ = this.localPlayer.character.collisionExtent.z;
                shopCamera.worldTransform.position = new mw.Vector(rootLoc.x - offsetZ / 2.8, rootLoc.y + offsetZ / 5.3, rootLoc.z + offsetZ / 16);
                Camera.switch(shopCamera, 0.5, mw.CameraSwitchBlendFunction.Linear);
            } else if (cameraType == 2) {
                let rootLoc = this.localPlayer.character.getSlotWorldPosition(mw.HumanoidSlotType.Head);
                // shopCamera.worldTransform.position = new mw.Vector(rootLoc.x - 174, rootLoc.y + 102, rootLoc.z - 54);
                let offsetZ = this.localPlayer.character.collisionExtent.z;
                shopCamera.worldTransform.position = new mw.Vector(rootLoc.x - offsetZ * 1.3, rootLoc.y + offsetZ / 1.6, rootLoc.z - offsetZ / 3);
                Camera.switch(shopCamera, 0.5, mw.CameraSwitchBlendFunction.Linear);
            }
            this.lastCameraType = cameraType;
        });
    }

    private mallCharacterRotSpeed: number = 30;
    public addRoatation(dir: number) {
        if (!this.localPlayer || !this.localPlayer?.character || !this.localPlayer.character?.worldTransform) return;
        this.localPlayer.character.worldTransform.rotation = this.localPlayer.character.worldTransform.rotation.add(new mw.Rotation(0, 0, -(this.mallCharacterRotSpeed * dir)))
    }

    private maleNpc: mw.Character = null;
    private feMaleNpc: mw.Character = null;
    private transitionNpc: mw.Character = null;
    private copyNpc: mw.Character = null;
    private async initNpc(): Promise<void> {
        this.maleNpc = await mw.GameObject.asyncFindGameObjectById(`2E11BC8E`) as mw.Character;
        this.feMaleNpc = await mw.GameObject.asyncFindGameObjectById(`1C9CC89E`) as mw.Character;
        this.transitionNpc = await mw.GameObject.asyncFindGameObjectById(`16572273`) as mw.Character;
        this.copyNpc = await mw.GameObject.asyncFindGameObjectById(`089BF2E4`) as mw.Character;
        await this.localPlayer.character.asyncReady();
        let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
        this.recordSex(somatotype);
        if (somatotype % 2 == 0) {
            await this.feMaleNpc.asyncReady();
            this.feMaleNpc.setDescription(this.localPlayer.character.getDescription());
        } else {
            await this.maleNpc.asyncReady();
            this.maleNpc.setDescription(this.localPlayer.character.getDescription());
        }
    }

    private saveSomatotype: number = 2;
    private recordSex(somatotype: number): void {
        this.saveSomatotype = somatotype;
    }

    private async initTransitionNpc(): Promise<void> {
        this.transitionNpc = await mw.GameObject.asyncSpawn(`Character`) as mw.Character;
        await this.transitionNpc.asyncReady();
    }

    private addOpenColorPickAction(tabType: TabType, tabId: number): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            await this.localPlayer.character.asyncReady();
            this.copyNpc.setDescription(this.localPlayer.character.getDescription());
            await this.copyNpc.asyncReady();
            this.openColorPickPanel(tabId);
        });
    }

    private addSaveAction(): void {
        this.saveCharacterDescription();
    }

    private saveCharacterDescription(): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            await this.localPlayer.character.asyncReady();
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            this.recordSex(somatotype);
            if (somatotype % 2 == 0) {
                this.feMaleNpc.setDescription(this.localPlayer.character.getDescription());
                await this.feMaleNpc.asyncReady();
            } else {
                this.maleNpc.setDescription(this.localPlayer.character.getDescription());
                await this.maleNpc.asyncReady();
            }
            this.localPlayer.character.syncDescription();
            this.isNeedSaveCharacter = false;
            this.closeMallPanel();
            Notice.showDownNotice(GameConfig.Language.Text_SaveSuccessfully.Value);
        });
    }

    private addCloseAction(): void {
        if (this.isNeedSaveCharacter) {
            this.getMallTipsPanel.showTips(() => {
                this.isNeedSaveCharacter = false;
                this.saveCharacterDescription();
                this.closeMallPanel();
            }, () => {
                this.isNeedSaveCharacter = false;
                this.recoverCharacter();
                this.closeMallPanel();
            }, GameConfig.Language.Text_CloseTips.Value
                , GameConfig.Language.Text_WhetherSaveImage.Value
                , GameConfig.Language.Text_NoSave.Value
                , GameConfig.Language.Text_Save.Value);
        } else {
            this.closeMallPanel();
        }
    }

    private recoverCharacter(): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            this.getMallPanel.hide();
            this.onSwitchCameraAction.call(0);
            if (this.saveSomatotype % 2 == 0) {
                this.localPlayer.character.setDescription(this.feMaleNpc.getDescription());
            } else {
                this.localPlayer.character.setDescription(this.maleNpc.getDescription());
            }
            await this.localPlayer.character.asyncReady();
            // this.localPlayer.character.syncDescription();
        });
    }

    private addResetAction(): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            let isSuccess = await Utils.accountServiceDownloadData(this.localPlayer.character);
            if (!isSuccess) {
                Notice.showDownNotice(GameConfig.Language.Text_ResetImageFaild.Value);
                return;
            }
            await this.localPlayer.character.asyncReady();
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            this.initUsingCharacterData();
            if (mw.UIService.getUI(MallPanel, false)?.visible) this.getMallPanel.initMallPanel(somatotype, this.usingAssetIdMap);
            Notice.showDownNotice(GameConfig.Language.Text_ResetSuccessfully.Value);
        });
    }

    private addSexAction(): void {
        ExecutorManager.instance.pushAsyncExecutor(async () => {
            await this.localPlayer.character.asyncReady();
            let somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            if (somatotype % 2 == 0) {
                this.localPlayer.character.setDescription(this.maleNpc.getDescription());
            } else {
                this.localPlayer.character.setDescription(this.feMaleNpc.getDescription());
            }
            await this.localPlayer.character.asyncReady();
            somatotype = this.localPlayer.character.description.advance.base.characterSetting.somatotype;
            this.initUsingCharacterData();
            if (mw.UIService.getUI(MallPanel, false)?.visible) this.getMallPanel.initMallPanel(somatotype, this.usingAssetIdMap);
            Notice.showDownNotice(GameConfig.Language.Text_SwitchSuccessfully.Value);
        });
    }

    private colorPickTabId: number = -1;
    private colorPickTab2Datas: ColorPickTab2Data[] = [];
    private colorPickTab3Colors: string[] = [];
    private openColorPickPanel(tabId: number): void {
        this.colorPickTabId = tabId;

        this.colorPickTab2Index = 0;
        this.colorPickTab2Datas.length = 0;

        this.colorPickTab3Colors.length = 0;
        switch (tabId) {
            case Tab2Type.Tab2_SkinTone:
                this.openSkinToneColorPickPanel();
                break;
            case Tab2Type.Tab2_Eyebrows:
                this.openEyebrowsColorPickPanel();
                break;
            case Tab2Type.Tab2_Top:
            case Tab3Type.Tab3_LongSinglePiece_Top:
            case Tab3Type.Tab3_ShortJacket_Top:
            case Tab3Type.Tab3_ShortSinglePiece_Top:
            case Tab3Type.Tab3_Suit_Top:
            case Tab3Type.Tab3_ALongCoat_Top:
                this.openTopColorPickPanel();
                break;
            case Tab2Type.Tab2_Bottom:
            case Tab3Type.Tab3_ShortSkirt_Bottom:
            case Tab3Type.Tab3_LongPants_Bottom:
            case Tab3Type.Tab3_Shorts_Bottom:
            case Tab3Type.Tab3_LongSkirt_Bottom:
            case Tab3Type.Tab3_Tights_Bottom:
                this.openBottomColorPickPanel();
                break;
            case Tab2Type.Tab2_Shoes:
            case Tab3Type.Tab3_Everyday_Shoes:
            case Tab3Type.Tab3_Boots_Shoes:
            case Tab3Type.Tab3_FootCover_Shoes:
            case Tab3Type.Tab3_NakedDress_Shoes:
            case Tab3Type.Tab3_HighHeels_Shoes:
            case Tab3Type.Tab3_SportsShoes_Shoes:
                this.openShoesColorPickPanel();
                break;
            case Tab2Type.Tab2_Gloves:
            case Tab3Type.Tab3_Gloves_Gloves:
            case Tab3Type.Tab3_Accessories_Gloves:
                this.openGlovesColorPickPanel();
                break;
            case Tab3Type.Tab3_PupilStyle:
                this.openPupilStyleColorPickPanel();
                break;
            case Tab3Type.Tab3_Lens:
                this.openLensColorPickPanel();
                break;
            case Tab3Type.Tab3_UpperHighlight:
                this.openUpperHighlightColorPickPanel();
                break;
            case Tab3Type.Tab3_LowerHighlight:
                this.openLowerHighlightColorPickPanel();
                break;
            case Tab3Type.Tab3_Eyelashes:
                this.openEyelashesColorPickPanel();
                break;
            case Tab3Type.Tab3_Eyeshadow:
                this.openEyeshadowColorPickPanel();
                break;
            case Tab3Type.Tab3_Blush:
                this.openBlushColorPickPanel();
                break;
            case Tab3Type.Tab3_LipMakeup:
                this.openLipMakeupColorPickPanel();
                break;
            case Tab3Type.Tab3_FullHair:
                this.openFullHairColorPickPanel();
                break;
            case Tab3Type.Tab3_FrontHair:
                this.openFrontHairColorPickPanel();
                break;
            case Tab3Type.Tab3_BackHair:
                this.openBackHairColorPickPanel();
                break;
            default:
                break;
        }
    }

    private colorPickTab2Index: number = 0;
    private addSelectColorPickTab2Action(index: number): void {
        if (this.colorPickTab2Index == index) return;
        this.colorPickTab2Index = index;
        this.getColorPickPanel.checkColorPickTab3AndColorPick(this.colorPickTab2Datas[this.colorPickTab2Index].color);
    }

    private addSelectColorPickTab3Action(index: number): void {
        let color = mw.LinearColor.colorHexToLinearColor(this.colorPickTab3Colors[index]);
        this.getColorPickPanel.refreshColorPickTab2AndColorPick(color);
        this.changeCharacterColor(color);
    }

    private openSkinToneColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_102.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let colorPickTab2Data = new ColorPickTab2Data(name,
            this.localPlayer.character.description.advance.makeup.skinTone.skinColor as mw.LinearColor);
        this.colorPickTab2Datas.push(colorPickTab2Data);

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.SkinToneColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openEyebrowsColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_105.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let eyebrows = this.localPlayer.character.description.advance.makeup.eyebrows;
        let eyebrowColor: mw.LinearColor = mw.LinearColor.white;
        if (eyebrows?.eyebrowColor) eyebrowColor = eyebrows?.eyebrowColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(name, eyebrowColor));

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.EyebrowsColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openTopColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_110.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let part = this.localPlayer.character.description.advance.clothing.upperCloth?.part;
        if (!part || part.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        for (let i = 0; i < part.length; ++i) {
            let color: mw.LinearColor = mw.LinearColor.white;
            if (part[i]?.color?.areaColor) color = part[i]?.color?.areaColor as mw.LinearColor;
            this.colorPickTab2Datas.push(new ColorPickTab2Data(StringUtil.format(GameConfig.Language.Text_ColorPart.Value, i + 1), color));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.TopColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openBottomColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_111.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let part = this.localPlayer.character.description.advance.clothing.lowerCloth?.part;
        if (!part || part.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        for (let i = 0; i < part.length; ++i) {
            let color: mw.LinearColor = mw.LinearColor.white;
            if (part[i]?.color?.areaColor) color = part[i]?.color?.areaColor as mw.LinearColor;
            this.colorPickTab2Datas.push(new ColorPickTab2Data(StringUtil.format(GameConfig.Language.Text_ColorPart.Value, i + 1), color));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.BottomColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openShoesColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_112.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let part = this.localPlayer.character.description.advance.clothing.shoes?.part;
        if (!part || part.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        for (let i = 0; i < part.length; ++i) {
            let color: mw.LinearColor = mw.LinearColor.white;
            if (part[i]?.color?.areaColor) color = part[i]?.color?.areaColor as mw.LinearColor;
            this.colorPickTab2Datas.push(new ColorPickTab2Data(StringUtil.format(GameConfig.Language.Text_ColorPart.Value, i + 1), color));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.ShoeColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openGlovesColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab2_113.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let part = this.localPlayer.character.description.advance.clothing.gloves?.part;
        if (!part || part.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        for (let i = 0; i < part.length; ++i) {
            let color: mw.LinearColor = mw.LinearColor.white;
            if (part[i]?.color?.areaColor) color = part[i]?.color?.areaColor as mw.LinearColor;
            this.colorPickTab2Datas.push(new ColorPickTab2Data(StringUtil.format(GameConfig.Language.Text_ColorPart.Value, i + 1), color));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.GloveColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openPupilStyleColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1001.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let coloredContactsStyle = this.localPlayer.character.description.advance.makeup.coloredContacts.style;
        if (!coloredContactsStyle || !coloredContactsStyle?.pupilStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        let pupilColor: mw.LinearColor = mw.LinearColor.white;
        if (coloredContactsStyle?.leftPupilColor) pupilColor = coloredContactsStyle?.leftPupilColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_PupilColor.Value, pupilColor));

        let leftPupilColor: mw.LinearColor = mw.LinearColor.white;
        if (coloredContactsStyle?.leftPupilColor) leftPupilColor = coloredContactsStyle?.leftPupilColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_LeftPupilColor.Value, leftPupilColor));

        let rightPupilColor: mw.LinearColor = mw.LinearColor.white;
        if (coloredContactsStyle?.rightPupilColor) rightPupilColor = coloredContactsStyle?.rightPupilColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_RightPupilColor.Value, rightPupilColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.PupilStyleColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openLensColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1002.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let coloredContactsDecal = this.localPlayer.character.description.advance.makeup.coloredContacts.decal;
        if (!coloredContactsDecal || !coloredContactsDecal?.pupilStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let decalPupilColor: mw.LinearColor = mw.LinearColor.white;
        if (coloredContactsDecal?.pupilColor) decalPupilColor = coloredContactsDecal?.pupilColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_DecalColor.Value, decalPupilColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.PupilStyleColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openUpperHighlightColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1003.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let highlight = this.localPlayer.character.description.advance.makeup.coloredContacts.highlight;
        if (!highlight || !highlight?.upperHighlightStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let upperHighlightColor: mw.LinearColor = mw.LinearColor.white;
        if (highlight?.upperHighlightColor) upperHighlightColor = highlight?.upperHighlightColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_UpperHighlightColor.Value, upperHighlightColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.PupilStyleColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openLowerHighlightColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1004.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let highlight = this.localPlayer.character.description.advance.makeup.coloredContacts.highlight;
        if (!highlight || !highlight?.lowerHighlightStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let lowerHighlightColor: mw.LinearColor = mw.LinearColor.white;
        if (highlight?.lowerHighlightColor) lowerHighlightColor = highlight?.lowerHighlightColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_LowerHighlightColor.Value, lowerHighlightColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.PupilStyleColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openEyelashesColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1005.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let eyelashes = this.localPlayer.character.description.advance.makeup.eyelashes;
        if (!eyelashes || !eyelashes?.eyelashStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let eyelashColor: mw.LinearColor = mw.LinearColor.white;
        if (eyelashes?.eyelashColor) eyelashColor = eyelashes?.eyelashColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_EyelashColor.Value, eyelashColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.EyeLashColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openEyeshadowColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1006.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let eyeShadow = this.localPlayer.character.description.advance.makeup.eyeShadow;
        if (!eyeShadow || !eyeShadow?.eyeshadowStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let eyeshaowColor: mw.LinearColor = mw.LinearColor.white;
        if (eyeShadow?.eyeshaowColor) eyeshaowColor = eyeShadow?.eyeshaowColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_EyeshaowColor.Value, eyeshaowColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.EyeShadow);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openBlushColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1007.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let blush = this.localPlayer.character.description.advance.makeup.blush;
        if (!blush || !blush?.blushStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let blushColor: mw.LinearColor = mw.LinearColor.white;
        if (blush?.blushColor) blushColor = blush?.blushColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_BlushColor.Value, blushColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.BlushColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openLipMakeupColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1008.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let lipstick = this.localPlayer.character.description.advance.makeup.lipstick;
        if (!lipstick || !lipstick?.lipstickStyle) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        let lipstickColor: mw.LinearColor = mw.LinearColor.white;
        if (lipstick?.lipstickColor) lipstickColor = lipstick?.lipstickColor as mw.LinearColor;
        this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_LipstickColor.Value, lipstickColor));

        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.LipstickColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openFullHairColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1010.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let hairColor = this.localPlayer.character.description.advance.hair.backHair.color;
        if (!hairColor) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        if (hairColor?.color && hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_Monochrome.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.color) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TopColor.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TailColor.Value, hairColor?.gradientColor as mw.LinearColor));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.HairColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openFrontHairColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1011.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let hairColor = this.localPlayer.character.description.advance.hair.frontHair.color;
        if (!hairColor) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        if (hairColor?.color && hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_Monochrome.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.color) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TopColor.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TailColor.Value, hairColor?.gradientColor as mw.LinearColor));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.HairColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private openBackHairColorPickPanel(): void {
        let name = GameConfig.Language.Text_Tab3_1012.Value;
        let tab1Text = `${GameConfig.Language.Text_ColorPick.Value} - ${name}`;

        let hairColor = this.localPlayer.character.description.advance.hair.backHair.color;
        if (!hairColor) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }
        if (hairColor?.color && hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_Monochrome.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.color) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TopColor.Value, hairColor?.color as mw.LinearColor));
        }
        if (hairColor?.gradientColor) {
            this.colorPickTab2Datas.push(new ColorPickTab2Data(GameConfig.Language.Text_TailColor.Value, hairColor?.gradientColor as mw.LinearColor));
        }
        if (!this.colorPickTab2Datas || this.colorPickTab2Datas.length == 0) {
            Notice.showDownNotice(StringUtil.format(GameConfig.Language.Text_NotSupportToning.Value, name));
            return;
        }

        GameConfig.ColorValue.getAllElement().forEach((value: IColorValueElement) => {
            this.colorPickTab3Colors.push(value.HairColor);
        });
        this.getColorPickPanel.showColorPickPanel(tab1Text, name, this.colorPickTab2Datas, this.colorPickTab3Colors);
    }

    private isNeedSaveColor: boolean = false;
    private changeCharacterColor(color: mw.LinearColor): void {
        switch (this.colorPickTabId) {
            case Tab2Type.Tab2_SkinTone:
                this.localPlayer.character.description.advance.makeup.skinTone.skinColor = color;
                break;
            case Tab2Type.Tab2_Eyebrows:
                this.localPlayer.character.description.advance.makeup.eyebrows.eyebrowColor = color;
                break;
            case Tab2Type.Tab2_Top:
            case Tab3Type.Tab3_LongSinglePiece_Top:
            case Tab3Type.Tab3_ShortJacket_Top:
            case Tab3Type.Tab3_ShortSinglePiece_Top:
            case Tab3Type.Tab3_Suit_Top:
            case Tab3Type.Tab3_ALongCoat_Top:
                this.localPlayer.character.description.advance.clothing.upperCloth.part[this.colorPickTab2Index].color.areaColor = color;
                break;
            case Tab2Type.Tab2_Bottom:
            case Tab3Type.Tab3_ShortSkirt_Bottom:
            case Tab3Type.Tab3_LongPants_Bottom:
            case Tab3Type.Tab3_Shorts_Bottom:
            case Tab3Type.Tab3_LongSkirt_Bottom:
            case Tab3Type.Tab3_Tights_Bottom:
                this.localPlayer.character.description.advance.clothing.lowerCloth.part[this.colorPickTab2Index].color.areaColor = color;
                break;
            case Tab2Type.Tab2_Shoes:
            case Tab3Type.Tab3_Everyday_Shoes:
            case Tab3Type.Tab3_Boots_Shoes:
            case Tab3Type.Tab3_FootCover_Shoes:
            case Tab3Type.Tab3_NakedDress_Shoes:
            case Tab3Type.Tab3_HighHeels_Shoes:
            case Tab3Type.Tab3_SportsShoes_Shoes:
                this.localPlayer.character.description.advance.clothing.shoes.part[this.colorPickTab2Index].color.areaColor = color;
                break;
            case Tab2Type.Tab2_Gloves:
            case Tab3Type.Tab3_Gloves_Gloves:
            case Tab3Type.Tab3_Accessories_Gloves:
                this.localPlayer.character.description.advance.clothing.gloves.part[this.colorPickTab2Index].color.areaColor = color;
                break;
            case Tab3Type.Tab3_PupilStyle:
                switch (this.colorPickTab2Index) {
                    case 0:
                        // this.localPlayer.character.description.advance.makeup.coloredContacts.style.pupilColor = color;
                        this.localPlayer.character.description.advance.makeup.coloredContacts.style.leftPupilColor = color;
                        this.localPlayer.character.description.advance.makeup.coloredContacts.style.rightPupilColor = color;
                        break;
                    case 1:
                        this.localPlayer.character.description.advance.makeup.coloredContacts.style.leftPupilColor = color;
                        break;
                    case 2:
                        this.localPlayer.character.description.advance.makeup.coloredContacts.style.rightPupilColor = color;
                        break;
                    default:
                        break;
                }
                break;
            case Tab3Type.Tab3_Lens:
                this.localPlayer.character.description.advance.makeup.coloredContacts.decal.pupilColor = color;
                break;
            case Tab3Type.Tab3_UpperHighlight:
                this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.upperHighlightColor = color;
                break;
            case Tab3Type.Tab3_LowerHighlight:
                this.localPlayer.character.description.advance.makeup.coloredContacts.highlight.lowerHighlightColor = color;
                break;
            case Tab3Type.Tab3_Eyelashes:
                this.localPlayer.character.description.advance.makeup.eyelashes.eyelashColor = color;
                break;
            case Tab3Type.Tab3_Eyeshadow:
                this.localPlayer.character.description.advance.makeup.eyeShadow.eyeshaowColor = color;
                break;
            case Tab3Type.Tab3_Blush:
                this.localPlayer.character.description.advance.makeup.blush.blushColor = color;
                break;
            case Tab3Type.Tab3_LipMakeup:
                this.localPlayer.character.description.advance.makeup.lipstick.lipstickColor = color;
                break;
            case Tab3Type.Tab3_FullHair:
                switch (this.colorPickTab2Index) {
                    case 0:
                        this.localPlayer.character.description.advance.hair.backHair.color.color = color;
                        this.localPlayer.character.description.advance.hair.backHair.color.gradientColor = color;
                        break;
                    case 1:
                        this.localPlayer.character.description.advance.hair.backHair.color.color = color;
                        break;
                    case 2:
                        this.localPlayer.character.description.advance.hair.backHair.color.gradientColor = color;
                        break;
                    default:
                        break;
                }
                break;
            case Tab3Type.Tab3_FrontHair:
                switch (this.colorPickTab2Index) {
                    case 0:
                        this.localPlayer.character.description.advance.hair.frontHair.color.color = color;
                        this.localPlayer.character.description.advance.hair.frontHair.color.gradientColor = color;
                        break;
                    case 1:
                        this.localPlayer.character.description.advance.hair.frontHair.color.color = color;
                        break;
                    case 2:
                        this.localPlayer.character.description.advance.hair.frontHair.color.gradientColor = color;
                        break;
                    default:
                        break;
                }
                break;
            case Tab3Type.Tab3_BackHair:
                switch (this.colorPickTab2Index) {
                    case 0:
                        this.localPlayer.character.description.advance.hair.backHair.color.color = color;
                        this.localPlayer.character.description.advance.hair.backHair.color.gradientColor = color;
                        break;
                    case 1:
                        this.localPlayer.character.description.advance.hair.backHair.color.color = color;
                        break;
                    case 2:
                        this.localPlayer.character.description.advance.hair.backHair.color.gradientColor = color;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        this.isNeedSaveColor = true;
        this.isNeedSaveCharacter = true;
    }
}