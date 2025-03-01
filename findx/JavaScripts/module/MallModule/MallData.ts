
export default class MallData extends Subdata {

}

export class TabIdData {
    public tabId: number = 0;
    public isOn: boolean = false;
    public tabIdDataMap: Map<number, TabIdData> = new Map<number, TabIdData>;
}

export class ColorPickTab2Data {
    public text: string = null;
    public color: mw.LinearColor = null;

    public constructor(text: string, color: mw.LinearColor) {
        this.text = text;
        this.color = color;
    }
}

export class AssetIdInfoData {
    public assetId: string = null;
    public slotType: number = -1;
    public slotIndex: number = -1;

    public constructor(assetId: string, slotType?: number, slotIndex?: number) {
        this.assetId = assetId;
        this.slotType = slotType;
        this.slotIndex = slotIndex;
    }
}

export enum TabType {
    None,
    Tab1,
    Tab2,
    Tab3
}

export enum Tab1Type {
    Ta1_None,
    /**捏脸 */
    Tab1_Appearance = 1,
    /**换装 */
    Tab1_Clothing = 2,
    /**收藏 */
    Tab1_Collection = 3,
    /**测试 */
    Tab1_Test = 4
}

export enum Tab2Type {
    Tab2_None,
    /**体型 */
    Tab2_BodyType = 101,
    /**肤色 */
    Tab2_SkinTone,
    /**脸型 */
    Tab2_Face,
    /**眼睛 */
    Tab2_Eyes,
    /**眉毛 */
    Tab2_Eyebrows,
    /**妆容 */
    Tab2_Makeup,
    /**表情 */
    Tab2_Expression,
    /**套装 */
    Tab2_Outfit,
    /**头发 */
    Tab2_Hair,
    /**上衣 */
    Tab2_Top,
    /**下衣 */
    Tab2_Bottom,
    /**鞋子 */
    Tab2_Shoes,
    /**手套 */
    Tab2_Gloves,
    /**宠物 */
    Tab2_Pet,
    /**饰品 */
    Tab2_Accessory,
    /**体型-收藏 */
    Tab2_BodyType_Collection = 501,
    /**肤色-收藏 */
    Tab2_SkinTone_Collection,
    /**脸型-收藏 */
    Tab2_Face_Collection,
    /**眼睛-收藏 */
    Tab2_Eyes_Collection,
    /**眉毛_收藏 */
    Tab2_Eyebrows_Collection,
    /**妆容_收藏 */
    Tab2_Makeup_Collection,
    /**表情_收藏 */
    Tab2_Expression_Collection,
    /**套装_收藏 */
    Tab2_Outfit_Collection,
    /**头发_收藏 */
    Tab2_Hair_Collection,
    /**上衣_收藏 */
    Tab2_Top_Collection,
    /**下衣_收藏 */
    Tab2_Bottom_Collection,
    /**鞋子_收藏 */
    Tab2_Gloves_Collection,
    /**手套_收藏 */
    Tab2_Shoes_Collection,
    /**宠物_收藏 */
    Tab2_Pet_Collection,
    /**饰品_收藏 */
    Tab2_Accessory_Collection,
}

export enum Tab3Type {
    Tab3_None,
    /**瞳孔样式 */
    Tab3_PupilStyle = 1001,
    /**瞳孔贴画 */
    Tab3_Lens,
    /**上高光 */
    Tab3_UpperHighlight,
    /**下高光 */
    Tab3_LowerHighlight,
    /**睫毛 */
    Tab3_Eyelashes,
    /**眼影 */
    Tab3_Eyeshadow,
    /**腮红 */
    Tab3_Blush,
    /**口红 */
    Tab3_LipMakeup,
    /**面部彩绘 */
    Tab3_FaceTattoo,
    /**整体发型 */
    Tab3_FullHair,
    /**前发 */
    Tab3_FrontHair,
    /**后发 */
    Tab3_BackHair,
    /**左手 */
    Tab3_LeftHand,
    /**右手 */
    Tab3_RightHand,
    /**背饰 */
    Tab3_Back,
    /**耳饰 */
    Tab3_Ear,
    /**面饰 */
    Tab3_Face,
    /**臀部 */
    Tab3_Hip,
    /**肩部 */
    Tab3_Shoulder,
    /**特效 */
    Tab3_Effects,
    /**拖尾 */
    Tab3_Trailing,
    /**日常造型1 */
    Tab3_DailyStyling_Suit1,
    /**布偶造型 */
    Tab3_MuppetStyling_Suit,
    /**英雄造型 */
    Tab3_HeroStyling_Suit,
    /**幻想造型 */
    Tab3_FantasyModeling_Suit,
    /**节日造型 */
    Tab3_HolidayStyling_Suit,
    /**科幻造型 */
    Tab3_ScienceFictionStyling_Suit,
    /**古代造型 */
    Tab3_AncientMolding_Suit,
    /**长单件 */
    Tab3_LongSinglePiece_Top,
    /**短外套 */
    Tab3_ShortJacket_Top,
    /**短单件 */
    Tab3_ShortSinglePiece_Top,
    /**套装 */
    Tab3_Suit_Top,
    /**长外套 */
    Tab3_ALongCoat_Top,
    /**短裙 */
    Tab3_ShortSkirt_Bottom,
    /**长裤 */
    Tab3_LongPants_Bottom,
    /**短裤 */
    Tab3_Shorts_Bottom,
    /**长裙 */
    Tab3_LongSkirt_Bottom,
    /**裤袜 */
    Tab3_Tights_Bottom,
    /**手套 */
    Tab3_Gloves_Gloves,
    /**手套饰品 */
    Tab3_Accessories_Gloves,
    /**日常鞋 */
    Tab3_Everyday_Shoes,
    /**靴子 */
    Tab3_Boots_Shoes,
    /**足套 */
    Tab3_FootCover_Shoes,
    /**裸饰 */
    Tab3_NakedDress_Shoes,
    /**高跟鞋 */
    Tab3_HighHeels_Shoes,
    /**运动鞋 */
    Tab3_SportsShoes_Shoes,
    /**日常造型2 */
    Tab3_DailyStyling_Suit2,

    /**瞳孔样式_收藏 */
    Tab3_PupilStyle_Collection = 2001,
    /**瞳孔贴画_收藏 */
    Tab3_Lens_Collection,
    /**上高光_收藏 */
    Tab3_UpperHighlight_Collection,
    /**下高光_收藏 */
    Tab3_LowerHighlight_Collection,
    /**睫毛_收藏 */
    Tab3_Eyelashes_Collection,
    /**眼影_收藏 */
    Tab3_Eyeshadow_Collection,
    /**腮红_收藏 */
    Tab3_Blush_Collection,
    /**口红_收藏 */
    Tab3_LipMakeup_Collection,
    /**面部彩绘_收藏 */
    Tab3_FaceTattoo_Collection,
    /**整体发型_收藏 */
    Tab3_FullHair_Collection,
    /**前发_收藏 */
    Tab3_FrontHair_Collection,
    /**后发_收藏 */
    Tab3_BackHair_Collection,
    /**左手_收藏 */
    Tab3_LeftHand_Collection,
    /**右手_收藏 */
    Tab3_RightHand_Collection,
    /**背饰_收藏 */
    Tab3_Back_Collection,
    /**耳饰_收藏 */
    Tab3_Ear_Collection,
    /**面饰_收藏 */
    Tab3_Face_Collection,
    /**臀部_收藏 */
    Tab3_Hip_Collection,
    /**肩部_收藏 */
    Tab3_Shoulder_Collection,
    /**特效_收藏 */
    Tab3_Effects_Collection,
    /**拖尾_收藏 */
    Tab3_Trailing_Collection,
}