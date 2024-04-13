import { GameConfig } from "../config/GameConfig";

export default class GlobalData {
    /**log级别"None": "0", "Log": "1", "Warn": "2", "Error": "3" */
    public static logLevel: number = 0;

    /**是否隐藏头顶UI */
    public static isHideHeadUI: boolean = false;

    /**是否开启IAA */
    public static isOpenIAA: boolean = false;

    /**是否开启测试 */
    public static isOpenTest: boolean = false;

    /**排行榜显示前6名玩家 */
    public static rankingNumber: number = 18;

    /**全局UI点击音效Guid */
    public static uiClickSoundGuid: string = GameConfig.Assets.getElement(1).Guid;
    /**水声 */
    public static waterSoundGuid: string = GameConfig.Assets.getElement(2).Guid;
    /**坐的图标 */
    public static sitIconGuid: string = GameConfig.Assets.getElement(3).Guid;
    /**关闭背景音乐图标Guid */
    public static offMusicIconGuid: string = GameConfig.Assets.getElement(5).Guid;
    /**打开背景音乐图标Guid */
    public static onMusicIconGuid: string = GameConfig.Assets.getElement(6).Guid;
    /**震荡的图标 */
    public static shakeIconGuid: string = GameConfig.Assets.getElement(25).Guid;
    /**跳舞的图标 */
    public static danceIconGuid: string = GameConfig.Assets.getElement(29).Guid;
    /**换装特效 */
    public static changeClothEffectGuid: string = GameConfig.Assets.getElement(33).Guid;
    /**升级音效 */
    public static upgradeSoundGuid: string = GameConfig.Assets.getElement(34).Guid;
    /**升级特效 */
    public static upgradeEffectGuid: string = GameConfig.Assets.getElement(35).Guid;
    /**传送特效 */
    public static portalEffectGuid: string = GameConfig.Assets.getElement(41).Guid;
    /**属性加点特效 */
    public static playerAddEffectGuid: string = GameConfig.Assets.getElement(46).Guid;
    /**出生点位置 */
    public static homeLocs: mw.Vector[] = [
        new mw.Vector(-2600, 1900, 200),
        new mw.Vector(-2700, 1800, 200),
        new mw.Vector(2600, 1600, 200),
        new mw.Vector(25, 1600, 200)];
    /**出生点的人物朝向 */
    public static homeRots: mw.Rotation[] = [
        new mw.Rotation(0, 0, 0),
        new mw.Rotation(0, 0, 0),
        new mw.Rotation(0, 0, -180),
        new mw.Rotation(0, 0, -180)];
    /**传送位置 */
    public static portalLocs: mw.Vector[] = [
        new mw.Vector(-10779.29, 14817.72, 165.01),
        new mw.Vector(-11299.02, 15443.80, 122.82),
        new mw.Vector(-11980.34, 14851.36, 158.50),
        new mw.Vector(-11952.62, 14129.81, 184.51)
    ];
    /**shop正常状态下颜色 */
    public static nornalShopTypeBtnColor: mw.LinearColor = new mw.LinearColor(1, 1, 1);;
    /**shop选中状态颜色 */
    public static selectShopTypeBtnColor: mw.LinearColor = new mw.LinearColor(1, 0, 0);;
    /**Cloth取消选中状态 */
    public static cancleSelectClothColor: mw.LinearColor = new mw.LinearColor(1, 1, 1);;
    /**Cloth选中状态 */
    public static selectClothColor: mw.LinearColor = new mw.LinearColor(1, 1, 0);
    /**Weapon取消选中状态 */
    public static cancleSelectWeaponColor: mw.LinearColor = new mw.LinearColor(1, 0, 1);
    /**Weapon选中状态 */
    public static selectWeaponColor: mw.LinearColor = new mw.LinearColor(0, 1, 0);
    /**延迟点击标识 */
    public static delayClick: boolean = true;
    /**翅膀飞行时间 */
    public static wingFlyTime: number = 10;
    /**翅膀问号icon */
    public static wingIconGuid: string = GameConfig.Assets.getElement(37).Guid;
    /**collectItem Nornal Color */
    public static collectionItemNormalColor: mw.LinearColor = new mw.LinearColor(1, 1, 0);
    /**collectItem Press Color */
    public static collectionItemPressColor: mw.LinearColor = new mw.LinearColor(0.7, 0.7, 0);
    /**collectType Nornal Color */
    public static collectionTypeNormalColor: mw.LinearColor = new mw.LinearColor(1, 0, 0);
    /**collectType Select Color */
    public static collectionTypeSelectColor: mw.LinearColor = new mw.LinearColor(0, 1, 0);
    /**CollectionItem已拥有的颜色 */
    public static collectionItemIconOwnColor: mw.LinearColor = new mw.LinearColor(1, 1, 1);
    /**CollectionItem没拥有的颜色 */
    public static collectionItemIconNoOwnColor: mw.LinearColor = new mw.LinearColor(0.05, 0.05, 0.05);
    /**引导线特效Guid */
    public static guideEffectGuid: string = GameConfig.Assets.getElement(44).Guid;
    /**引导目标点特效Guid */
    public static targetEffectGuid: string = GameConfig.Assets.getElement(45).Guid;
    /**跳舞动画Guid1 */
    public static danceGuid1: string = GameConfig.Assets.getElement(30).Guid;
    /**跳舞动画Guid2 */
    public static danceGuid2: string = GameConfig.Assets.getElement(31).Guid;
    /**新手引导需要的Image */
    public static roleImages: string = GameConfig.Assets.getElement(47).Guid;

    /**容易 */
    public static easyImageBgColor: number[] = [0, 255, 255, 255];
    /**简单 */
    public static simpleImageBgColor: number[] = [255, 255, 0, 255];
    /**中等 */
    public static mediumImageBgColor: number[] = [0, 0, 255, 255];
    /**困难 */
    public static difficultImageBgColor: number[] = [255, 0, 255, 255];
    /**疯狂 */
    public static crazyImageBgColor: number[] = [255, 0, 0, 255];
    /**完成 */
    public static completeImageBgColor: number[] = [0, 255, 0, 255];

    /**item间隔 */
    public static itemPositionInterval: number = 270;
}