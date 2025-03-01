import { Utils } from "../../Tools/utils";
import { Tab2Type, Tab3Type } from "./MallData";

export default class Mall {
    public static async copyCharacterSlot(fromCharacter: mw.Character, toCharacter: mw.Character): Promise<void> {
        if (!fromCharacter || !toCharacter) return;
        let slotDataArrStr = this.getSlotDataArrStr(fromCharacter);
        await this.setSlotByDataArrStr(toCharacter, slotDataArrStr);
    }
    private static slotSplit: string = "$"
    private static getSlotDataArrStr(character: Character): string[] {
        let slot = character.description.advance.slotAndDecoration.slot;
        let dataStrArr: string[] = [];
        for (let i = 0; i < slot.length; ++i) {
            for (let j = 0; j < slot[i].decoration.length; ++j) {
                let decoration = slot[i].decoration[j];
                if (!decoration.attachmentAssetId || !decoration.attachmentGameObject || !decoration.attachmentOffset) continue;
                let transform = new Transform();
                transform.position = new Vector(Number(decoration.attachmentOffset.position.x.toFixed(3)), Number(decoration.attachmentOffset.position.y.toFixed(3)), Number(decoration.attachmentOffset.position.z.toFixed(3)));
                transform.rotation = new Rotation(Number(decoration.attachmentOffset.rotation.x.toFixed(3)), Number(decoration.attachmentOffset.rotation.y.toFixed(3)), Number(decoration.attachmentOffset.rotation.z.toFixed(3)));
                transform.scale = new Vector(Number(decoration.attachmentOffset.scale.x.toFixed(3)), Number(decoration.attachmentOffset.scale.y.toFixed(3)), Number(decoration.attachmentOffset.scale.z.toFixed(3)));
                let str = `${i}${this.slotSplit}${decoration.attachmentAssetId}${this.slotSplit}${transform.toString()}`;
                dataStrArr.push(str);
            }
        }
        return dataStrArr.length > 0 ? dataStrArr : null;
    }

    private static async setSlotByDataArrStr(character: Character, strArr: string[]): Promise<void> {
        if (!strArr || strArr?.length == 0) return;
        for (let i = 0; i < strArr.length; ++i) {
            let [slotIndexStr, assetId, transform] = strArr[i].split(this.slotSplit);
            let slotIndex = Number(slotIndexStr);
            if (slotIndex >= 0 && slotIndex < character.description.advance.slotAndDecoration.slot.length) {
                await this.setDecoraBase(character, slotIndex, assetId, Transform.fromString(transform));
            }
        }
        await character.asyncReady();
    }

    private static async setDecoraBase(character: Character, slotIndex: number, assetId: string, offset: mw.Transform): Promise<boolean> {
        await Utils.asyncDownloadAsset(assetId);
        let model = await GameObject.asyncSpawn(assetId) as mw.Model;
        if (!model) return false;
        model.setCollision(mw.PropertyStatus.Off, true);
        if (model instanceof mw.Effect) {
            this.clearOneDecoraBySlotIndex(slotIndex, character);
        } else {
            this.clearOneDecoraBySlotIndex(slotIndex, character);
        }
        character.description.advance.slotAndDecoration.slot[slotIndex].decoration.add(model, offset);
        return true;
    }

    private static clearOneDecoraBySlotIndex(slotIndex: number, character: mw.Character): void {
        character.description.advance.slotAndDecoration.slot[slotIndex].decoration.clear();
    }

    public static async copyCharacterClothingAndHair(fromCharacter: mw.Character, toCharacter: mw.Character): Promise<void> {
        if (!fromCharacter || !toCharacter) return;
        let fromClothing = fromCharacter.description.advance.clothing;
        let fromHair = fromCharacter.description.advance.hair;
        let toClothing = toCharacter.description.advance.clothing;
        let toHair = toCharacter.description.advance.hair;

        let frontHairStyle = fromHair?.frontHair?.style;
        if (frontHairStyle) {
            await Utils.asyncDownloadAsset(frontHairStyle);
            toHair.frontHair.style = frontHairStyle;
        }
        let frontHairColor = fromHair?.frontHair?.color?.color;
        if (frontHairColor) toHair.frontHair.color.color = frontHairColor;
        let frontHairGradientColor = fromHair?.frontHair?.color?.gradientColor;
        if (frontHairGradientColor) toHair.frontHair.color.gradientColor = frontHairGradientColor;
        let frontHairGradientArea = fromHair?.frontHair?.color?.gradientArea;
        if (frontHairGradientArea) toHair.frontHair.color.gradientArea = frontHairGradientArea;
        let frontHairHighlightStyle = fromHair?.frontHair?.highlight?.highlightStyle;
        if (frontHairHighlightStyle) toHair.frontHair.highlight.highlightStyle = frontHairHighlightStyle;
        let frontHairAccessories = fromHair?.frontHair?.accessories;
        if (frontHairAccessories && frontHairAccessories.length > 0) {
            for (let i = 0; i < frontHairAccessories.length; ++i) {
                let accessoryColor = frontHairAccessories[i]?.color?.accessoryColor;
                if (accessoryColor) fromHair.frontHair.accessories[i].color.accessoryColor = accessoryColor;

                let designStyle = frontHairAccessories[i]?.design?.designStyle;
                if (designStyle) fromHair.frontHair.accessories[i].design.designStyle = designStyle;
                let designColor = frontHairAccessories[i]?.design?.designColor;
                if (designColor) fromHair.frontHair.accessories[i].design.designColor = designColor;
                let designRotation = frontHairAccessories[i]?.design?.designRotation;
                if (designRotation) fromHair.frontHair.accessories[i].design.designRotation = designRotation;
                let designScale = frontHairAccessories[i]?.design?.designScale;
                if (designScale) fromHair.frontHair.accessories[i].design.designScale = designScale;

                let patternStyle = frontHairAccessories[i]?.pattern?.patternStyle;
                if (patternStyle) fromHair.frontHair.accessories[i].pattern.patternStyle = patternStyle;
                let patternColor = frontHairAccessories[i]?.pattern?.patternColor;
                if (patternColor) fromHair.frontHair.accessories[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = frontHairAccessories[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) fromHair.frontHair.accessories[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = frontHairAccessories[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) fromHair.frontHair.accessories[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = frontHairAccessories[i]?.pattern?.patternRotation;
                if (patternRotation) fromHair.frontHair.accessories[i].pattern.patternRotation = patternRotation;
                let patternVisibility = frontHairAccessories[i]?.pattern?.patternVisibility;
                if (patternVisibility) fromHair.frontHair.accessories[i].pattern.patternVisibility = patternVisibility;
            }
        }

        let backHairStyle = fromHair?.backHair?.style;
        if (backHairStyle) {
            await Utils.asyncDownloadAsset(backHairStyle);
            toHair.backHair.style = backHairStyle;
        }
        let backHairColor = fromHair?.backHair?.color?.color;
        if (backHairColor) toHair.backHair.color.color = backHairColor;
        let backHairGradientColor = fromHair?.backHair?.color?.gradientColor;
        if (backHairGradientColor) toHair.backHair.color.gradientColor = backHairGradientColor;
        let backHairGradientArea = fromHair?.backHair?.color?.gradientArea;
        if (backHairGradientArea) toHair.backHair.color.gradientArea = backHairGradientArea;
        let backHairHighlightStyle = fromHair?.backHair?.highlight?.highlightStyle;
        if (backHairHighlightStyle) toHair.backHair.highlight.highlightStyle = backHairHighlightStyle;
        let backHairAccessories = fromHair?.backHair?.accessories;
        if (backHairAccessories && backHairAccessories.length > 0) {
            for (let i = 0; i < backHairAccessories.length; ++i) {
                let accessoryColor = backHairAccessories[i]?.color?.accessoryColor;
                if (accessoryColor) fromHair.backHair.accessories[i].color.accessoryColor = accessoryColor;

                let designStyle = backHairAccessories[i]?.design?.designStyle;
                if (designStyle) fromHair.backHair.accessories[i].design.designStyle = designStyle;
                let designColor = backHairAccessories[i]?.design?.designColor;
                if (designColor) fromHair.backHair.accessories[i].design.designColor = designColor;
                let designRotation = backHairAccessories[i]?.design?.designRotation;
                if (designRotation) fromHair.backHair.accessories[i].design.designRotation = designRotation;
                let designScale = backHairAccessories[i]?.design?.designScale;
                if (designScale) fromHair.backHair.accessories[i].design.designScale = designScale;

                let patternStyle = backHairAccessories[i]?.pattern?.patternStyle;
                if (patternStyle) fromHair.backHair.accessories[i].pattern.patternStyle = patternStyle;
                let patternColor = backHairAccessories[i]?.pattern?.patternColor;
                if (patternColor) fromHair.backHair.accessories[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = backHairAccessories[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) fromHair.backHair.accessories[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = backHairAccessories[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) fromHair.backHair.accessories[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = backHairAccessories[i]?.pattern?.patternRotation;
                if (patternRotation) fromHair.backHair.accessories[i].pattern.patternRotation = patternRotation;
                let patternVisibility = backHairAccessories[i]?.pattern?.patternVisibility;
                if (patternVisibility) fromHair.backHair.accessories[i].pattern.patternVisibility = patternVisibility;
            }
        }

        let upperClothStyle = fromClothing?.upperCloth?.style;
        if (upperClothStyle) {
            await Utils.asyncDownloadAsset(upperClothStyle);
            toClothing.upperCloth.style = upperClothStyle;
        }
        let upperClothPart = fromClothing?.upperCloth?.part;
        if (upperClothPart && upperClothPart.length > 0) {
            for (let i = 0; i < upperClothPart.length; ++i) {
                let areaColor = upperClothPart[i]?.color?.areaColor;
                if (areaColor) toClothing.upperCloth.part[i].color.areaColor = areaColor;

                let patternStyle = upperClothPart[i]?.pattern?.patternStyle;
                if (patternStyle) toClothing.upperCloth.part[i].pattern.patternStyle = patternStyle;
                let patternColor = upperClothPart[i]?.pattern?.patternColor;
                if (patternColor) toClothing.upperCloth.part[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = upperClothPart[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) toClothing.upperCloth.part[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = upperClothPart[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) toClothing.upperCloth.part[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = upperClothPart[i]?.pattern?.patternRotation;
                if (patternRotation) toClothing.upperCloth.part[i].pattern.patternRotation = patternRotation;
                let patternVisibility = upperClothPart[i]?.pattern?.patternVisibility;
                if (patternVisibility) toClothing.upperCloth.part[i].pattern.patternVisibility = patternVisibility;

                let designStyle = upperClothPart[i]?.design?.designStyle;
                if (designStyle) toClothing.upperCloth.part[i].design.designStyle = designStyle;
                let designColor = upperClothPart[i]?.design?.designColor;
                if (designColor) toClothing.upperCloth.part[i].design.designColor = designColor;
                let designRotation = upperClothPart[i]?.design?.designRotation;
                if (designRotation) toClothing.upperCloth.part[i].design.designRotation = patternVisibility;
            }
        }

        let lowerClothStyle = fromClothing?.lowerCloth?.style;
        if (lowerClothStyle) {
            await Utils.asyncDownloadAsset(lowerClothStyle);
            toClothing.lowerCloth.style = lowerClothStyle;
        }
        let lowerClothPart = fromClothing?.lowerCloth?.part;
        if (lowerClothPart && lowerClothPart.length > 0) {
            for (let i = 0; i < lowerClothPart.length; ++i) {
                let areaColor = lowerClothPart[i]?.color?.areaColor;
                if (areaColor) toClothing.lowerCloth.part[i].color.areaColor = areaColor;

                let patternStyle = lowerClothPart[i]?.pattern?.patternStyle;
                if (patternStyle) toClothing.lowerCloth.part[i].pattern.patternStyle = patternStyle;
                let patternColor = lowerClothPart[i]?.pattern?.patternColor;
                if (patternColor) toClothing.lowerCloth.part[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = lowerClothPart[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) toClothing.lowerCloth.part[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = lowerClothPart[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) toClothing.lowerCloth.part[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = lowerClothPart[i]?.pattern?.patternRotation;
                if (patternRotation) toClothing.lowerCloth.part[i].pattern.patternRotation = patternRotation;
                let patternVisibility = lowerClothPart[i]?.pattern?.patternVisibility;
                if (patternVisibility) toClothing.lowerCloth.part[i].pattern.patternVisibility = patternVisibility;

                let designStyle = lowerClothPart[i]?.design?.designStyle;
                if (designStyle) toClothing.lowerCloth.part[i].design.designStyle = designStyle;
                let designColor = lowerClothPart[i]?.design?.designColor;
                if (designColor) toClothing.lowerCloth.part[i].design.designColor = designColor;
                let designRotation = lowerClothPart[i]?.design?.designRotation;
                if (designRotation) toClothing.lowerCloth.part[i].design.designRotation = patternVisibility;
            }
        }

        let shoesStyle = fromClothing?.shoes?.style;
        if (shoesStyle) {
            await Utils.asyncDownloadAsset(shoesStyle);
            toClothing.shoes.style = shoesStyle;
        }
        let shoesPart = fromClothing?.shoes?.part;
        if (shoesPart && shoesPart.length > 0) {
            for (let i = 0; i < shoesPart.length; ++i) {
                let areaColor = shoesPart[i]?.color?.areaColor;
                if (areaColor) toClothing.shoes.part[i].color.areaColor = areaColor;

                let patternStyle = shoesPart[i]?.pattern?.patternStyle;
                if (patternStyle) toClothing.shoes.part[i].pattern.patternStyle = patternStyle;
                let patternColor = shoesPart[i]?.pattern?.patternColor;
                if (patternColor) toClothing.shoes.part[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = shoesPart[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) toClothing.shoes.part[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = shoesPart[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) toClothing.shoes.part[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = shoesPart[i]?.pattern?.patternRotation;
                if (patternRotation) toClothing.shoes.part[i].pattern.patternRotation = patternRotation;
                let patternVisibility = shoesPart[i]?.pattern?.patternVisibility;
                if (patternVisibility) toClothing.shoes.part[i].pattern.patternVisibility = patternVisibility;

                let designStyle = shoesPart[i]?.design?.designStyle;
                if (designStyle) toClothing.shoes.part[i].design.designStyle = designStyle;
                let designColor = shoesPart[i]?.design?.designColor;
                if (designColor) toClothing.shoes.part[i].design.designColor = designColor;
                let designRotation = shoesPart[i]?.design?.designRotation;
                if (designRotation) toClothing.shoes.part[i].design.designRotation = patternVisibility;
            }
        }

        let glovesStyle = fromClothing?.gloves?.style;
        if (glovesStyle) {
            await Utils.asyncDownloadAsset(glovesStyle);
            toClothing.gloves.style = glovesStyle;
        }
        let glovesPart = fromClothing?.gloves?.part;
        if (glovesPart && glovesPart.length > 0) {
            for (let i = 0; i < glovesPart.length; ++i) {
                let areaColor = glovesPart[i]?.color?.areaColor;
                if (areaColor) toClothing.gloves.part[i].color.areaColor = areaColor;

                let patternStyle = glovesPart[i]?.pattern?.patternStyle;
                if (patternStyle) toClothing.gloves.part[i].pattern.patternStyle = patternStyle;
                let patternColor = glovesPart[i]?.pattern?.patternColor;
                if (patternColor) toClothing.gloves.part[i].pattern.patternColor = patternColor;
                let patternHorizontalScale = glovesPart[i]?.pattern?.patternHorizontalScale;
                if (patternHorizontalScale) toClothing.gloves.part[i].pattern.patternHorizontalScale = patternHorizontalScale;
                let patternVerticalScale = glovesPart[i]?.pattern?.patternVerticalScale;
                if (patternVerticalScale) toClothing.gloves.part[i].pattern.patternVerticalScale = patternVerticalScale;
                let patternRotation = glovesPart[i]?.pattern?.patternRotation;
                if (patternRotation) toClothing.gloves.part[i].pattern.patternRotation = patternRotation;
                let patternVisibility = glovesPart[i]?.pattern?.patternVisibility;
                if (patternVisibility) toClothing.gloves.part[i].pattern.patternVisibility = patternVisibility;

                let designStyle = glovesPart[i]?.design?.designStyle;
                if (designStyle) toClothing.gloves.part[i].design.designStyle = designStyle;
                let designColor = glovesPart[i]?.design?.designColor;
                if (designColor) toClothing.gloves.part[i].design.designColor = designColor;
                let designRotation = glovesPart[i]?.design?.designRotation;
                if (designRotation) toClothing.gloves.part[i].design.designRotation = patternVisibility;
            }
        }
    }

    private static colorPickTabIds: number[] = [
        Tab2Type.Tab2_Eyebrows,
        Tab2Type.Tab2_Top,
        Tab3Type.Tab3_LongSinglePiece_Top,
        Tab3Type.Tab3_ShortJacket_Top,
        Tab3Type.Tab3_ShortSinglePiece_Top,
        Tab3Type.Tab3_Suit_Top,
        Tab3Type.Tab3_ALongCoat_Top,
        Tab2Type.Tab2_Bottom,
        Tab3Type.Tab3_ShortSkirt_Bottom,
        Tab3Type.Tab3_LongPants_Bottom,
        Tab3Type.Tab3_Shorts_Bottom,
        Tab3Type.Tab3_LongSkirt_Bottom,
        Tab3Type.Tab3_Tights_Bottom,
        Tab3Type.Tab3_Gloves_Gloves,
        Tab3Type.Tab3_Accessories_Gloves,
        Tab3Type.Tab3_Everyday_Shoes,
        Tab3Type.Tab3_Boots_Shoes,
        Tab3Type.Tab3_FootCover_Shoes,
        Tab3Type.Tab3_NakedDress_Shoes,
        Tab3Type.Tab3_HighHeels_Shoes,
        Tab3Type.Tab3_SportsShoes_Shoes,
        Tab2Type.Tab2_Shoes,
        Tab2Type.Tab2_Gloves,
        Tab3Type.Tab3_PupilStyle,
        Tab3Type.Tab3_Lens,
        Tab3Type.Tab3_UpperHighlight,
        Tab3Type.Tab3_LowerHighlight,
        Tab3Type.Tab3_Eyelashes,
        Tab3Type.Tab3_Eyeshadow,
        Tab3Type.Tab3_Blush,
        Tab3Type.Tab3_LipMakeup,
        Tab3Type.Tab3_FullHair,
        Tab3Type.Tab3_FrontHair,
        Tab3Type.Tab3_BackHair
    ];
    public static isSupportColorPick(tabId: number): boolean {
        return this.colorPickTabIds.includes(tabId);
    }

    private static removableTabIds: number[] = [
        Tab2Type.Tab2_Eyebrows,
        Tab2Type.Tab2_Top,
        Tab3Type.Tab3_LongSinglePiece_Top,
        Tab3Type.Tab3_ShortJacket_Top,
        Tab3Type.Tab3_ShortSinglePiece_Top,
        Tab3Type.Tab3_Suit_Top,
        Tab3Type.Tab3_ALongCoat_Top,
        Tab2Type.Tab2_Bottom,
        Tab3Type.Tab3_ShortSkirt_Bottom,
        Tab3Type.Tab3_LongPants_Bottom,
        Tab3Type.Tab3_Shorts_Bottom,
        Tab3Type.Tab3_LongSkirt_Bottom,
        Tab3Type.Tab3_Tights_Bottom,
        Tab3Type.Tab3_Gloves_Gloves,
        Tab3Type.Tab3_Accessories_Gloves,
        Tab3Type.Tab3_Everyday_Shoes,
        Tab3Type.Tab3_Boots_Shoes,
        Tab3Type.Tab3_FootCover_Shoes,
        Tab3Type.Tab3_NakedDress_Shoes,
        Tab3Type.Tab3_HighHeels_Shoes,
        Tab3Type.Tab3_SportsShoes_Shoes,
        Tab2Type.Tab2_Shoes,
        Tab2Type.Tab2_Gloves,
        Tab3Type.Tab3_PupilStyle,
        Tab3Type.Tab3_Lens,
        Tab3Type.Tab3_UpperHighlight,
        Tab3Type.Tab3_LowerHighlight,
        Tab3Type.Tab3_Eyelashes,
        Tab3Type.Tab3_Eyeshadow,
        Tab3Type.Tab3_Blush,
        Tab3Type.Tab3_LipMakeup,
        Tab3Type.Tab3_FullHair,
        Tab3Type.Tab3_FrontHair,
        Tab3Type.Tab3_BackHair,
        Tab3Type.Tab3_LeftHand,
        Tab3Type.Tab3_RightHand,
        Tab3Type.Tab3_Back,
        Tab3Type.Tab3_Ear,
        Tab3Type.Tab3_Face,
        Tab3Type.Tab3_Hip,
        Tab3Type.Tab3_Shoulder,
        Tab3Type.Tab3_Effects,
        Tab3Type.Tab3_Trailing,

        Tab2Type.Tab2_Outfit,
        Tab3Type.Tab3_DailyStyling_Suit1,
        Tab3Type.Tab3_DailyStyling_Suit2,
        Tab3Type.Tab3_MuppetStyling_Suit,
        Tab3Type.Tab3_HeroStyling_Suit,
        Tab3Type.Tab3_FantasyModeling_Suit,
        Tab3Type.Tab3_HolidayStyling_Suit,
        Tab3Type.Tab3_ScienceFictionStyling_Suit,
        Tab3Type.Tab3_AncientMolding_Suit,

        Tab2Type.Tab2_Pet,
    ];
    public static isRemovableTabId(tabId: number): boolean {
        return this.removableTabIds.includes(tabId);
    }

    private static slotTabIds: number[] = [
        Tab3Type.Tab3_LeftHand,
        Tab3Type.Tab3_RightHand,
        Tab3Type.Tab3_Back,
        Tab3Type.Tab3_Ear,
        Tab3Type.Tab3_Face,
        Tab3Type.Tab3_Hip,
        Tab2Type.Tab2_Pet,
        Tab3Type.Tab3_Shoulder,
        Tab3Type.Tab3_Effects,
        Tab3Type.Tab3_Trailing
    ];
    public static isSlot(tabId: number): boolean {
        return this.slotTabIds.includes(tabId);
    }

    private static clothingTabIds: number[] = [
        Tab2Type.Tab2_Eyebrows,
        Tab2Type.Tab2_Top,
        Tab3Type.Tab3_LongSinglePiece_Top,
        Tab3Type.Tab3_ShortJacket_Top,
        Tab3Type.Tab3_ShortSinglePiece_Top,
        Tab3Type.Tab3_Suit_Top,
        Tab3Type.Tab3_ALongCoat_Top,
        Tab3Type.Tab3_ShortSkirt_Bottom,
        Tab3Type.Tab3_LongPants_Bottom,
        Tab3Type.Tab3_Shorts_Bottom,
        Tab3Type.Tab3_LongSkirt_Bottom,
        Tab3Type.Tab3_Tights_Bottom,
        Tab3Type.Tab3_Gloves_Gloves,
        Tab3Type.Tab3_Accessories_Gloves,
        Tab3Type.Tab3_Everyday_Shoes,
        Tab3Type.Tab3_Boots_Shoes,
        Tab3Type.Tab3_FootCover_Shoes,
        Tab3Type.Tab3_NakedDress_Shoes,
        Tab3Type.Tab3_HighHeels_Shoes,
        Tab3Type.Tab3_SportsShoes_Shoes,
        Tab2Type.Tab2_Bottom,
        Tab2Type.Tab2_Shoes,
        Tab2Type.Tab2_Gloves,
        Tab3Type.Tab3_PupilStyle,
        Tab3Type.Tab3_Lens,
        Tab3Type.Tab3_UpperHighlight,
        Tab3Type.Tab3_LowerHighlight,
        Tab3Type.Tab3_Eyelashes,
        Tab3Type.Tab3_Eyeshadow,
        Tab3Type.Tab3_Blush,
        Tab3Type.Tab3_LipMakeup,
        Tab3Type.Tab3_FullHair,
        Tab3Type.Tab3_FrontHair,
        Tab3Type.Tab3_BackHair
    ];
    public static isClothingTabId(tabId: number): boolean {
        return this.clothingTabIds.includes(tabId);
    }

    private static defaultAssetIds: string[] = [
        `398608`,
        `77763`,
        `292004`,
        `343474`,
        `292002`,
        `343467`,
        `66505`,
        `343475`,
        `75663`,
        `343466`,
        `398609`,
        `47968`,
        `48041`,
        `32112`,
        `48026`,
        `32098`,
        `398607`,
        `48062`,
        `292003`,
        `292001`,
        `343471`,
        `343476`
    ];
    public static isDefaultAssetId(assetId: string): boolean {
        return this.defaultAssetIds.includes(assetId);
    }

    private static headTabIds: number[] = [
        Tab2Type.Tab2_Face,
        Tab2Type.Tab2_Eyebrows,
        Tab2Type.Tab2_Expression,
        Tab3Type.Tab3_PupilStyle,
        Tab3Type.Tab3_Lens,
        Tab3Type.Tab3_UpperHighlight,
        Tab3Type.Tab3_LowerHighlight,
        Tab3Type.Tab3_Eyelashes,
        Tab3Type.Tab3_Eyeshadow,
        Tab3Type.Tab3_Blush,
        Tab3Type.Tab3_LipMakeup,
        Tab3Type.Tab3_FaceTattoo,
        Tab3Type.Tab3_FullHair,
        Tab3Type.Tab3_FrontHair,
        Tab3Type.Tab3_BackHair,
    ];
    public static isHeadTabId(tabId: number): boolean {
        return this.headTabIds.includes(tabId);
    }

    public static getAssetId(type: number, character?: mw.Character): string {
        if (!character) character = Player.localPlayer.character;
        switch (type) {
            case Tab2Type.Tab2_Face:
                return character.description.advance.headFeatures.head.style;
            case Tab2Type.Tab2_Eyebrows:
                return character.description.advance.makeup.eyebrows.eyebrowStyle;
            case Tab2Type.Tab2_Top:
            case Tab3Type.Tab3_LongSinglePiece_Top:
            case Tab3Type.Tab3_ShortJacket_Top:
            case Tab3Type.Tab3_ShortSinglePiece_Top:
            case Tab3Type.Tab3_Suit_Top:
            case Tab3Type.Tab3_ALongCoat_Top:
                return character.description.advance.clothing.upperCloth.style;
            case Tab2Type.Tab2_Bottom:
            case Tab3Type.Tab3_ShortSkirt_Bottom:
            case Tab3Type.Tab3_LongPants_Bottom:
            case Tab3Type.Tab3_Shorts_Bottom:
            case Tab3Type.Tab3_LongSkirt_Bottom:
            case Tab3Type.Tab3_Tights_Bottom:
                return character.description.advance.clothing.lowerCloth.style;
            case Tab2Type.Tab2_Shoes:
            case Tab3Type.Tab3_Everyday_Shoes:
            case Tab3Type.Tab3_Boots_Shoes:
            case Tab3Type.Tab3_FootCover_Shoes:
            case Tab3Type.Tab3_NakedDress_Shoes:
            case Tab3Type.Tab3_HighHeels_Shoes:
            case Tab3Type.Tab3_SportsShoes_Shoes:
                return character.description.advance.clothing.shoes.style;
            case Tab2Type.Tab2_Gloves:
            case Tab3Type.Tab3_Gloves_Gloves:
            case Tab3Type.Tab3_Accessories_Gloves:
                return character.description.advance.clothing.gloves.style;
            case Tab3Type.Tab3_PupilStyle:
                return character.description.advance.makeup.coloredContacts.style.pupilStyle;
            case Tab3Type.Tab3_Lens:
                return character.description.advance.makeup.coloredContacts.decal.pupilStyle;
            case Tab3Type.Tab3_UpperHighlight:
                return character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle;
            case Tab3Type.Tab3_LowerHighlight:
                return character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle;
            case Tab3Type.Tab3_Eyelashes:
                return character.description.advance.makeup.eyelashes.eyelashStyle;
            case Tab3Type.Tab3_Eyeshadow:
                return character.description.advance.makeup.eyeShadow.eyeshadowStyle;
            case Tab3Type.Tab3_Blush:
                return character.description.advance.makeup.blush.blushStyle;
            case Tab3Type.Tab3_LipMakeup:
                return character.description.advance.makeup.lipstick.lipstickStyle;
            case Tab3Type.Tab3_FullHair:
                return character.description.advance.hair.backHair.style;
            case Tab3Type.Tab3_FrontHair:
                return character.description.advance.hair.frontHair.style;
            case Tab3Type.Tab3_BackHair:
                return character.description.advance.hair.backHair.style;
        }
    }

    // public static setAssetId(character: mw.Character, type: number, assetId: string): void {
    //     switch (type) {
    //         case Tab2Type.Tab2_Face:
    //             character.description.advance.headFeatures.head.style = assetId;
    //             break;
    //         case Tab2Type.Tab2_Eyebrows:
    //             character.description.advance.makeup.eyebrows.eyebrowStyle = assetId;
    //             break;
    //         case Tab2Type.Tab2_Top:
    //             character.description.advance.clothing.upperCloth.style = assetId;
    //             break;
    //         case Tab2Type.Tab2_Bottom:
    //             character.description.advance.clothing.lowerCloth.style = assetId;
    //             break;
    //         case Tab2Type.Tab2_Shoes:
    //             character.description.advance.clothing.shoes.style = assetId;
    //             break;
    //         case Tab2Type.Tab2_Gloves:
    //             character.description.advance.clothing.gloves.style = assetId;
    //             break;
    //         case Tab3Type.Tab3_PupilStyle:
    //             character.description.advance.makeup.coloredContacts.style.pupilStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_Lens:
    //             character.description.advance.makeup.coloredContacts.decal.pupilStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_UpperHighlight:
    //             character.description.advance.makeup.coloredContacts.highlight.upperHighlightStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_LowerHighlight:
    //             character.description.advance.makeup.coloredContacts.highlight.lowerHighlightStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_Eyelashes:
    //             character.description.advance.makeup.eyelashes.eyelashStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_Eyeshadow:
    //             character.description.advance.makeup.eyeShadow.eyeshadowStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_Blush:
    //             character.description.advance.makeup.blush.blushStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_LipMakeup:
    //             character.description.advance.makeup.lipstick.lipstickStyle = assetId;
    //             break;
    //         case Tab3Type.Tab3_FullHair:
    //             character.description.advance.hair.backHair.style = assetId;
    //             break;
    //         case Tab3Type.Tab3_FrontHair:
    //             character.description.advance.hair.frontHair.style = assetId;
    //             break;
    //         case Tab3Type.Tab3_BackHair:
    //             character.description.advance.hair.backHair.style = assetId;
    //             break;
    //     }
    // }

}