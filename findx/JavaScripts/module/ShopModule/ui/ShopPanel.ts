
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.03-22.22.02
 */

import Console from "../../../Tools/Console";
import { ObjectPoolServices } from "../../../Tools/ObjectPool";
import AdTips from "../../../Common/AdTips";
import P_Tips from "../../../Common/P_Tips";
import { IClothesElement } from "../../../config/Clothes";
import { GameConfig } from "../../../config/GameConfig";
import { ITailElement } from "../../../config/Tail";
import { IWeaponElement } from "../../../config/Weapon";
import { IWingElement } from "../../../config/Wing";
import GlobalData from "../../../const/GlobalData";
import ShopPanel_Generate from "../../../ui-generate/module/ShopUI/ShopPanel_generate";
import { AdType } from "../../AdsModule/AdsModuleC";
import ShopModuleC, { ClothType } from "../ShopModuleC";

export default class ShopPanel extends ShopPanel_Generate {
	/**皮肤商店模块 */
	private shopModuleC: ShopModuleC = null;
	private adsTips: AdTips = null;

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initData();
		this.bindButtons();
		this.registerActions();
	}

	/**初始化数据 */
	private initData(): void {
		this.shopModuleC = ModuleService.getModule(ShopModuleC);
		this.adsTips = mw.UIService.getUI(AdTips);
		this.initClothData();
		this.initWeaponData();
		this.initWingData();
		this.initTailData();
	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mCloseBtn.onClicked.add(() => {
			this.hide();
			this.shopModuleC.onSwitchCameraAction.call(false);
		});
		this.mSaveBtn.onClicked.add(() => {
			switch (this.currentShopType) {
				case ShopType.Weapon:
					this.saveWeaponShopButton();
					break;
				case ShopType.Colthes:
					this.saveClothShopButton();
					break;
				case ShopType.Wing:
					this.saveWingShopButton();
					break;
				case ShopType.Tail:
					this.saveTailShopButton();
					break;
				default:
					break;
			}
		});

		this.bindShopTypeButtons();
		this.bindClothButtons();
	}

	/**保存服装商店按钮 */
	private saveClothShopButton(): void {
		if (GlobalData.isOpenIAA) {
			if (this.shopModuleC.clothIsNeedAds()) {
				this.adsTips.showAdTips(1, AdType.ChangeCloth);
			}
			else {
				this.shopModuleC.onSaveClothAction.call();
				this.closeShop();
			}
		}
		else {
			this.shopModuleC.onSaveClothAction.call();
			this.closeShop();
		}
	}

	/**保存武器商店按钮 */
	private saveWeaponShopButton(): void {
		this.shopModuleC.useWeapon();
	}

	/**保存翅膀商店按钮 */
	private saveWingShopButton(): void {
		this.shopModuleC.useWing();
	}

	/**保存拖尾商店按钮 */
	private saveTailShopButton(): void {
		this.shopModuleC.useTail();
	}

	/**关闭商店 */
	public closeShop(): void {
		this.hide();
		this.shopModuleC.onSwitchCameraAction.call(false);
	}

	/**注册事件 */
	private registerActions(): void {
	}

	//#region Common
	/**--------------------------[Common]-------------------------- */
	/**记录当前点击的页签按钮 */
	private currentShopTypeBtn: mw.Button = this.mShopBtn1;
	/**记录当前点击的页签 */
	private currentShopType: ShopType = ShopType.Weapon;

	/**绑定Shop类型按钮 */
	private bindShopTypeButtons(): void {
		this.currentShopTypeBtn = this.mShopBtn1;
		this.currentShopType = ShopType.Weapon;
		this.currentShopTypeBtn.normalImageColor = GlobalData.selectShopTypeBtnColor;
		this.mSaveText.text = "保存武器";
		for (let i = 0; i < 4; ++i) {
			(this['mShopBtn' + (i + 1)] as mw.Button).onClicked.add(() => {
				this.updateSkinType(i + 1, (this['mShopBtn' + (i + 1)] as mw.Button));
			});
		}
	}

	/**更新SHop类型（更新显示内容） */
	private updateSkinType(shopType: ShopType, shopTypeBtn: mw.Button): void {
		if (this.currentShopType == shopType) return;
		this.currentShopType = shopType;
		if (this.currentShopTypeBtn) {
			this.currentShopTypeBtn.normalImageColor = GlobalData.nornalShopTypeBtnColor;
		}
		this.currentShopTypeBtn = shopTypeBtn;
		this.currentShopTypeBtn.normalImageColor = GlobalData.selectShopTypeBtnColor;
		this.showShopTypeContentPanel(this.currentShopType);
	}

	/**更新要显示的Shop内容 */
	private showShopTypeContentPanel(shopType: ShopType): void {
		this.updateClothVisibility(shopType);
		this.updateWeaponVisibility(shopType);
		this.updateWingVisibility(shopType);
		this.updateTailVisibility(shopType);
		switch (shopType) {
			case ShopType.Weapon:
				this.showWeaponContentPanel();
				this.updateWeaponIsNeedAds();
				this.mSaveText.text = "保存武器";
				break;
			case ShopType.Colthes:
				this.showClothTypeContentPanel(this.currentClothType);
				this.updateClothIsNeedAds();
				this.mSaveText.text = "保存服装";
				break;
			case ShopType.Wing:
				this.showWingContentPanel();
				this.updateWingIsNeedAds();
				this.mSaveText.text = "保存翅膀";
				break;
			case ShopType.Tail:
				this.showTailContentPanel();
				this.updateTailIsNeedAds();
				this.mSaveText.text = "保存拖尾";
				break;
			default:
				break;
		}
	}

	protected onShow(...params: any[]): void {
		Console.error("[打开皮肤商店]");
	}

	protected onHide(): void {
		Console.error("[关闭皮肤商店]");
	}

	/**Content子集位置 */
	private currentChildIndex: number = 1;

	/**布局位置Cloth */
	private getClothChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 3) * 300) + 35;
		let y = (Math.ceil(this.currentChildIndex / 3) - 1) * 280;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}

	/**布局位置Weapon */
	private getWeaponChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 3) * 350) + 75;
		let y = (Math.ceil(this.currentChildIndex / 3) - 1) * 300;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}

	/**布局位置Wing */
	private getWingChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 3) * 350) + 75;
		let y = (Math.ceil(this.currentChildIndex / 3) - 1) * 300;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}

	/**布局位置Tail */
	private getTailChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 3) * 350) + 75;
		let y = (Math.ceil(this.currentChildIndex / 3) - 1) * 300;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}
	/**--------------------------[Common]-------------------------- */
	//#endregion
	//#region 服装
	/**--------------------------[服装]-------------------------- */
	private clothElements: IClothesElement[] = null;
	/**储存当前页签下的ClothItem */
	private clothItems: ClothItem[] = [];
	/**给NPC换装 */
	public onChangeClothToNPCAnction: Action2<number, IClothesElement> = new Action2<number, IClothesElement>();

	private hairs: IClothesElement[] = [];
	private upperCloths: IClothesElement[] = [];
	private lowerCloths: IClothesElement[] = [];
	private gloves: IClothesElement[] = [];
	private shoes: IClothesElement[] = [];
	private bodys: IClothesElement[] = [];

	/**初始化Cloth数据 */
	private initClothData(): void {
		this.clothElements = GameConfig.Clothes.getAllElement();

		for (let i = 0; i < this.clothElements.length; ++i) {
			let clothElement = this.clothElements[i];
			switch (clothElement.ClothType) {
				case ClothType.hair:
					this.hairs.push(clothElement);
					break;
				case ClothType.upperCloth:
					this.upperCloths.push(clothElement);
					break;
				case ClothType.lowerCloth:
					this.lowerCloths.push(clothElement);
					break;
				case ClothType.gloves:
					this.gloves.push(clothElement);
					break;
				case ClothType.shoe:
					this.shoes.push(clothElement);
					break;
				case ClothType.body:
					this.bodys.push(clothElement);
					break;
				default:
					break;
			}
		}

		this.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
	}

	/**记录当前点击的衣服类型按钮 */
	private currentClothTypeBtn: mw.Button = this.mClothesBtn1;
	/**记录当前点击的衣服类型 */
	private currentClothType: ClothType = ClothType.hair;
	/**服装按钮绑定 */
	private bindClothButtons(): void {
		this.mClothesCanvas.visibility = mw.SlateVisibility.Collapsed;
		this.currentClothTypeBtn = this.mClothesBtn1;
		this.currentClothType = ClothType.hair;
		this.currentClothTypeBtn.normalImageColor = GlobalData.selectShopTypeBtnColor;
		for (let i = 0; i < 6; ++i) {
			(this['mClothesBtn' + (i + 1)] as mw.Button).onClicked.add(() => {
				this.updateClothType(i + 1, (this['mClothesBtn' + (i + 1)] as mw.Button));
			});
		}
	}

	/**更新服装类型（更新显示内容） */
	private updateClothType(clothType: ClothType, clothTypeBtn: mw.Button): void {
		if (this.currentClothType == clothType) return;
		this.currentClothType = clothType;
		if (this.currentClothTypeBtn) {
			this.currentClothTypeBtn.normalImageColor = GlobalData.nornalShopTypeBtnColor;
		}
		this.currentClothTypeBtn = clothTypeBtn;
		this.currentClothTypeBtn.normalImageColor = GlobalData.selectShopTypeBtnColor;
		this.showClothTypeContentPanel(this.currentClothType);
	}

	/**当前可见性 */
	private currentVisibility: mw.SlateVisibility = mw.SlateVisibility.Collapsed;
	/**更新Cloth的可见性 */
	private updateClothVisibility(shopType: ShopType) {
		let visibility = (shopType == ShopType.Colthes) ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
		if (this.currentVisibility != visibility) {
			this.mClothesCanvas.visibility = visibility;
			this.currentVisibility = visibility;
		}
		if (shopType != ShopType.Colthes) {
			this.recycleCurrentClothShopItems();
		}
	}

	/**显示的服装内容 */
	private showClothTypeContentPanel(clothType: ClothType): void {
		this.currentChildIndex = 1;
		this.mScrollBox.size = new mw.Vector(900, 850);
		this.mScrollBox.position = new mw.Vector(200, 200);
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(900, 0);
		if (this.clothItems.length > 0) {
			this.recycleCurrentClothShopItems();
		}
		let tmpCloths: IClothesElement[] = [];
		switch (clothType) {
			case ClothType.hair:
				tmpCloths = this.hairs;
				break;
			case ClothType.upperCloth:
				tmpCloths = this.upperCloths;
				break;
			case ClothType.lowerCloth:
				tmpCloths = this.lowerCloths;
				break;
			case ClothType.gloves:
				tmpCloths = this.gloves;
				break;
			case ClothType.shoe:
				tmpCloths = this.shoes;
				break;
			case ClothType.body:
				tmpCloths = this.bodys;
				break;
			default:
				break;
		}
		for (let i = 0; i < tmpCloths.length; ++i) {
			let clothItem = ObjectPoolServices.getPool(ClothItem).spawn();
			clothItem.initData(i, tmpCloths[i]);
			this.mContentCanvas.addChild(clothItem.clothItem);
			clothItem.clothItem.size = new mw.Vector2(230, 230);
			clothItem.clothItem.position = this.getClothChildPos();
			this.clothItems.push(clothItem);
		}
		if (this.currentSelectClothIndexs[this.currentClothType] != -1) {
			this.clothItems[this.currentSelectClothIndexs[this.currentClothType]].selectState();
		}
		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 3 == 0) {
			y = (this.currentChildIndex / 3) * 280;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 3)) * 280;
		}
		this.mContentCanvas.size = new mw.Vector2(900, y);
	}
	/**记录当前选中的Clothitem */
	private currentSelectClothIndexs: number[] = [-1, -1, -1, -1, -1, -1, -1];
	/**更新当前页的Clothitem状态 */
	public updateClothItemState(id: number): void {
		if (this.currentSelectClothIndexs[this.currentClothType] != -1) {
			this.clothItems[this.currentSelectClothIndexs[this.currentClothType]].cancleSelectState();
		}
		this.currentSelectClothIndexs[this.currentClothType] = id;
		this.clothItems[this.currentSelectClothIndexs[this.currentClothType]].selectState();
		if (this.currentClothType == ClothType.body) {
			for (let i = 1; i <= 5; ++i) {
				this.currentSelectClothIndexs[i] = -1;
			}
		}
		if (this.currentClothType != ClothType.body && this.currentSelectClothIndexs[6] != -1) {
			let isCancleBody: boolean = true;
			for (let i = 1; i <= 5; ++i) {
				if (this.currentSelectClothIndexs[i] != -1) {
					isCancleBody = false;
					break;
				}
			}
			if (isCancleBody) {
				Console.error("[]");
				this.currentSelectClothIndexs[6] = -1;
			}
		}
		this.updateClothIsNeedAds();
	}

	/**更新Cloth是否需要Ads */
	private updateClothIsNeedAds(): void {
		if (this.shopModuleC.clothIsNeedAds()) {
			this.mIAAImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		else {
			this.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**回收当前页签下的内容ClothItem */
	private recycleCurrentClothShopItems(): void {
		if (this.clothItems.length == 0) return;
		this.clothItems.forEach((clothItem) => {
			clothItem.recycleItem();
			this.mRecycleCanvas.addChild(clothItem.clothItem);
		});
		this.clothItems.length = 0;
	}
	/**--------------------------[服装]-------------------------- */
	//#endregion

	//#region 武器
	/**--------------------------[武器]-------------------------- */
	private weapons: IWeaponElement[] = [];
	/**储存当前页签下的WeaponItem */
	private weaponItems: WeaponItem[] = [];
	/**给NPC换武器 */
	public onChangeWeaponToNPCAnction: Action2<number, IWeaponElement> = new Action2<number, IWeaponElement>();

	/**初始化Weapon数据 */
	private initWeaponData(): void {
		this.weapons = GameConfig.Weapon.getAllElement();
		this.showWeaponContentPanel();
	}

	/**显示的服装内容 */
	private showWeaponContentPanel(): void {
		this.currentChildIndex = 1;
		this.mScrollBox.size = new mw.Vector(1100, 850);
		this.mScrollBox.position = new mw.Vector(0, 200);
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(1100, 0);
		if (this.weaponItems.length > 0) {
			this.recycleCurrentWeaponShopItems();
		}
		for (let i = 0; i < this.weapons.length; ++i) {
			let weaponItem = ObjectPoolServices.getPool(WeaponItem).spawn();
			weaponItem.initData(i, this.weapons[i]);
			this.mContentCanvas.addChild(weaponItem.weaponItem);
			weaponItem.weaponItem.size = new mw.Vector2(260, 260);
			weaponItem.weaponItem.position = this.getWeaponChildPos();
			this.weaponItems.push(weaponItem);
		}
		if (this.currentSelectWeaponIndex != -1) {
			this.weaponItems[this.currentSelectWeaponIndex].selectState();
		}
		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 3 == 0) {
			y = (this.currentChildIndex / 3) * 300;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 3)) * 300;
		}
		this.mContentCanvas.size = new mw.Vector2(1100, y);
	}
	private currentSelectWeaponIndex: number = 0;
	/**更新当前页的WeaponItem状态 */
	public updateWeaponItemState(id: number): void {
		if (this.currentSelectWeaponIndex != -1) {
			this.weaponItems[this.currentSelectWeaponIndex].cancleSelectState();
		}
		this.currentSelectWeaponIndex = id;
		this.weaponItems[this.currentSelectWeaponIndex].selectState();
		this.updateWeaponIsNeedAds();
	}

	/**更新武器是否需要Ads */
	private updateWeaponIsNeedAds(): void {
		if (this.shopModuleC.weaponIsNeedAds()) {
			this.mIAAImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		else {
			this.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**更新Weapon的可见性 */
	private updateWeaponVisibility(shopType: ShopType) {
		if (shopType != ShopType.Weapon) {
			this.recycleCurrentWeaponShopItems();
		}
	}

	/**回收当前页签下的内容WeaponItem */
	private recycleCurrentWeaponShopItems(): void {
		if (this.weaponItems.length == 0) return;
		this.weaponItems.forEach((weaponItem) => {
			weaponItem.recycleItem();
			this.mRecycleCanvas.addChild(weaponItem.weaponItem);
		});
		this.weaponItems.length = 0;
	}
	/**--------------------------[武器]-------------------------- */
	//#endregion

	//#region 翅膀
	/**--------------------------[翅膀]-------------------------- */
	private wings: IWingElement[] = [];
	/**储存当前页签下的WingItem */
	private wingItems: WingItem[] = [];
	/**给NPC换翅膀 */
	public onChangeWingToNPCAnction: Action2<number, IWingElement> = new Action2<number, IWingElement>();

	/**初始化Wing数据 */
	private initWingData(): void {
		this.wings = GameConfig.Wing.getAllElement();
	}

	/**显示的翅膀内容 */
	private showWingContentPanel(): void {
		this.currentChildIndex = 1;
		this.mScrollBox.size = new mw.Vector(1100, 850);
		this.mScrollBox.position = new mw.Vector(0, 200);
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(1100, 0);
		if (this.wingItems.length > 0) {
			this.recycleCurrentWingShopItems();
		}
		for (let i = 0; i < this.wings.length; ++i) {
			let wingItem = ObjectPoolServices.getPool(WingItem).spawn();
			wingItem.initData(i, this.wings[i]);
			this.mContentCanvas.addChild(wingItem.wingItem);
			wingItem.wingItem.size = new mw.Vector2(260, 260);
			wingItem.wingItem.position = this.getWingChildPos();
			this.wingItems.push(wingItem);
		}
		if (this.currentSelectWingIndex != -1) {
			this.wingItems[this.currentSelectWingIndex].selectState();
		}
		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 3 == 0) {
			y = (this.currentChildIndex / 3) * 300;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 3)) * 300;
		}
		this.mContentCanvas.size = new mw.Vector2(1100, y);
	}
	private currentSelectWingIndex: number = 0;
	/**更新当前页的WingItem状态 */
	public updateWingItemState(id: number): void {
		if (this.currentSelectWingIndex != -1) {
			this.wingItems[this.currentSelectWingIndex].cancleSelectState();
		}
		this.currentSelectWingIndex = id;
		this.wingItems[this.currentSelectWingIndex].selectState();
		this.updateWingIsNeedAds();
	}

	/**更新翅膀是否需要Ads */
	private updateWingIsNeedAds(): void {
		if (this.shopModuleC.wingIsNeedAds()) {
			this.mIAAImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		else {
			this.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**更新Wing的可见性 */
	private updateWingVisibility(shopType: ShopType) {
		if (shopType != ShopType.Wing) {
			this.recycleCurrentWingShopItems();
		}
	}

	/**回收当前页签下的内容WingItem */
	private recycleCurrentWingShopItems(): void {
		if (this.wingItems.length == 0) return;
		this.wingItems.forEach((wingItem) => {
			wingItem.recycleItem();
			this.mRecycleCanvas.addChild(wingItem.wingItem);
		});
		this.wingItems.length = 0;
	}
	/**--------------------------[翅膀]-------------------------- */
	//#endregion

	//#region 拖尾
	/**--------------------------[拖尾]-------------------------- */
	private tails: ITailElement[] = [];
	/**储存当前页签下的TailItem */
	private tailItems: TailItem[] = [];
	/**给NPC换拖尾 */
	public onChangeTailToNPCAnction: Action2<number, ITailElement> = new Action2<number, ITailElement>();

	/**初始化Tail数据 */
	private initTailData(): void {
		this.tails = GameConfig.Tail.getAllElement();
	}

	/**显示的翅膀内容 */
	private showTailContentPanel(): void {
		this.currentChildIndex = 1;
		this.mScrollBox.size = new mw.Vector(1100, 850);
		this.mScrollBox.position = new mw.Vector(0, 200);
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(1100, 0);
		if (this.tailItems.length > 0) {
			this.recycleCurrentTailShopItems();
		}
		for (let i = 0; i < this.tails.length; ++i) {
			let tailItem = ObjectPoolServices.getPool(TailItem).spawn();
			tailItem.initData(i, this.tails[i]);
			this.mContentCanvas.addChild(tailItem.tailItem);
			tailItem.tailItem.size = new mw.Vector2(260, 260);
			tailItem.tailItem.position = this.getTailChildPos();
			this.tailItems.push(tailItem);
		}
		if (this.currentSelectTailIndex != -1) {
			this.tailItems[this.currentSelectTailIndex].selectState();
		}
		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 3 == 0) {
			y = (this.currentChildIndex / 3) * 300;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 3)) * 300;
		}
		this.mContentCanvas.size = new mw.Vector2(1100, y);
	}
	private currentSelectTailIndex: number = 0;
	/**更新当前页的TailItem状态 */
	public updateTailItemState(id: number): void {
		if (this.currentSelectTailIndex != -1) {
			this.tailItems[this.currentSelectTailIndex].cancleSelectState();
		}
		this.currentSelectTailIndex = id;
		this.tailItems[this.currentSelectTailIndex].selectState();
		this.updateTailIsNeedAds();
	}

	/**更新拖尾是否需要Ads */
	private updateTailIsNeedAds(): void {
		if (this.shopModuleC.tailIsNeedAds()) {
			this.mIAAImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		else {
			this.mIAAImg.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**更新Tail的可见性 */
	private updateTailVisibility(shopType: ShopType) {
		if (shopType != ShopType.Tail) {
			this.recycleCurrentTailShopItems();
		}
	}

	/**回收当前页签下的内容TailItem */
	private recycleCurrentTailShopItems(): void {
		if (this.tailItems.length == 0) return;
		this.tailItems.forEach((tailItem) => {
			tailItem.recycleItem();
			this.mRecycleCanvas.addChild(tailItem.tailItem);
		});
		this.tailItems.length = 0;
	}
	/**--------------------------[翅膀]-------------------------- */
	//#endregion
}
/**服装 */
class ClothItem {
	public clothItem: mw.UserWidgetPrefab;

	public mSelectImg: mw.Image = undefined;
	public mIAAImg: mw.Image = undefined;
	public mIconBtn: mw.Button = undefined;
	public mCanvas: mw.Canvas = undefined;

	private id: number = null;
	private cloth: IClothesElement = null;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.clothItem = mw.createUIByName("module/ShopUI/ClothItem");

		this.mCanvas = this.clothItem.findChildByPath("RootCanvas/mCanvas") as mw.Canvas;
		this.mIconBtn = this.clothItem.findChildByPath("RootCanvas/mCanvas/mIconBtn") as mw.Button;
		this.mIAAImg = this.clothItem.findChildByPath("RootCanvas/mCanvas/mIAAImg") as mw.Image;
		this.mSelectImg = this.clothItem.findChildByPath("RootCanvas/mCanvas/mSelectImg") as mw.Image;
	}

	/**填充数据 */
	public initData(id: number, cloth: IClothesElement): void {
		this.id = id;
		this.cloth = cloth;
		let vis: mw.SlateVisibility = (cloth.IsIAA == 0) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
		this.mIAAImg.visibility = vis;
		this.mIconBtn.normalImageGuid = cloth.Icon;
		this.mIconBtn.pressedImageGuid = cloth.Icon;
		this.mIconBtn.disableImageGuid = cloth.Icon;
		this.mIconBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (!GlobalData.delayClick) {
				P_Tips.show("小手别点太快");
				return;
			}
			GlobalData.delayClick = false;
			TimeUtil.delaySecond(1).then(() => {
				GlobalData.delayClick = true;
			});
			mw.UIService.getUI(ShopPanel).onChangeClothToNPCAnction.call(this.id, this.cloth);
		});
		this.mIconBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	}

	/**选中状态 */
	public selectState(): void {
		this.mSelectImg.imageColor = GlobalData.selectClothColor;
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.mSelectImg.imageColor = GlobalData.cancleSelectClothColor;
		this.isSelect = false;
	}

	/**回收Item */
	public recycleItem(): void {
		this.mIconBtn.onClicked.clear();
		if (this.isSelect) {
			this.cancleSelectState();
		}
		ObjectPoolServices.getPool(ClothItem).return(this);
	}
}

/**服装 */
class WeaponItem {
	public weaponItem: mw.UserWidgetPrefab;

	public mCanvas: mw.Canvas = undefined;
	public mSelectImg: mw.Image = undefined;
	public mIAAImg: mw.Image = undefined;
	public mIconBtn: mw.Button = undefined;
	public mNameText: mw.TextBlock = undefined;

	private id: number = null;
	private weapon: IWeaponElement = null;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.weaponItem = mw.createUIByName("module/ShopUI/WeaponItem");

		this.mCanvas = this.weaponItem.findChildByPath("RootCanvas/mCanvas") as mw.Canvas;
		this.mIconBtn = this.weaponItem.findChildByPath("RootCanvas/mCanvas/mIconBtn") as mw.Button;
		this.mIAAImg = this.weaponItem.findChildByPath("RootCanvas/mCanvas/mIAAImg") as mw.Image;
		this.mSelectImg = this.weaponItem.findChildByPath("RootCanvas/mCanvas/mSelectImg") as mw.Image;
		this.mNameText = this.weaponItem.findChildByPath("RootCanvas/mCanvas/mNameText") as mw.TextBlock;
	}

	/**填充数据 */
	public initData(id: number, weapon: IWeaponElement): void {
		this.id = id;
		this.weapon = weapon;
		let vis: mw.SlateVisibility = (weapon.IsIAA == 0) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
		this.mIAAImg.visibility = vis;
		this.mIconBtn.normalImageGuid = weapon.WeaponIcon;
		this.mIconBtn.pressedImageGuid = weapon.WeaponIcon;
		this.mIconBtn.disableImageGuid = weapon.WeaponIcon;
		this.mIconBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (!GlobalData.delayClick) {
				P_Tips.show("小手别点太快");
				return;
			}
			GlobalData.delayClick = false;
			TimeUtil.delaySecond(1).then(() => {
				GlobalData.delayClick = true;
			});
			mw.UIService.getUI(ShopPanel).onChangeWeaponToNPCAnction.call(this.id, this.weapon);
		});
		this.mNameText.text = weapon.WeaponName;
		this.mIconBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	}

	/**选中状态 */
	public selectState(): void {
		this.mSelectImg.imageColor = GlobalData.selectWeaponColor;
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.mSelectImg.imageColor = GlobalData.cancleSelectWeaponColor;
		this.isSelect = false;
	}

	/**回收Item */
	public recycleItem(): void {
		this.mIconBtn.onClicked.clear();
		if (this.isSelect) {
			this.cancleSelectState();
		}
		ObjectPoolServices.getPool(WeaponItem).return(this);
	}
}

/**翅膀 */
class WingItem {
	public wingItem: mw.UserWidgetPrefab;

	public mSelectImg: mw.Image = undefined;
	public mIAAImg: mw.Image = undefined;
	public mIconBtn: mw.Button = undefined;
	public mCanvas: mw.Canvas = undefined;

	private id: number = null;
	private wing: IWingElement = null;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.wingItem = mw.createUIByName("module/ShopUI/WingItem");

		this.mCanvas = this.wingItem.findChildByPath("RootCanvas/mCanvas") as mw.Canvas;
		this.mIconBtn = this.wingItem.findChildByPath("RootCanvas/mCanvas/mIconBtn") as mw.Button;
		this.mIAAImg = this.wingItem.findChildByPath("RootCanvas/mCanvas/mIAAImg") as mw.Image;
		this.mSelectImg = this.wingItem.findChildByPath("RootCanvas/mCanvas/mSelectImg") as mw.Image;
	}

	/**填充数据 */
	public initData(id: number, wing: IWingElement): void {
		this.id = id;
		this.wing = wing;
		let vis: mw.SlateVisibility = (wing.IsIAA == 0) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
		this.mIAAImg.visibility = vis;
		let wingIcon = wing.WingIcon ? wing.WingIcon : GlobalData.wingIconGuid;
		this.mIconBtn.normalImageGuid = wingIcon;
		this.mIconBtn.pressedImageGuid = wingIcon;
		this.mIconBtn.disableImageGuid = wingIcon;
		this.mIconBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (!GlobalData.delayClick) {
				P_Tips.show("小手别点太快");
				return;
			}
			GlobalData.delayClick = false;
			TimeUtil.delaySecond(1).then(() => {
				GlobalData.delayClick = true;
			});
			mw.UIService.getUI(ShopPanel).onChangeWingToNPCAnction.call(this.id, this.wing);
		});
		this.mIconBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
		this.mSelectImg.visibility = mw.SlateVisibility.Collapsed;
	}

	/**选中状态 */
	public selectState(): void {
		this.mSelectImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.mSelectImg.visibility = mw.SlateVisibility.Collapsed;
		this.isSelect = false;
	}

	/**回收Item */
	public recycleItem(): void {
		this.mIconBtn.onClicked.clear();
		if (this.isSelect) {
			this.cancleSelectState();
		}
		ObjectPoolServices.getPool(WingItem).return(this);
	}
}

/**拖尾 */
class TailItem {
	public tailItem: mw.UserWidgetPrefab;

	public mSelectImg: mw.Image = undefined;
	public mIAAImg: mw.Image = undefined;
	public mIconBtn: mw.Button = undefined;
	public mCanvas: mw.Canvas = undefined;

	private id: number = null;
	private tail: ITailElement = null;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.tailItem = mw.createUIByName("module/ShopUI/TailItem");

		this.mCanvas = this.tailItem.findChildByPath("RootCanvas/mCanvas") as mw.Canvas;
		this.mIconBtn = this.tailItem.findChildByPath("RootCanvas/mCanvas/mIconBtn") as mw.Button;
		this.mIAAImg = this.tailItem.findChildByPath("RootCanvas/mCanvas/mIAAImg") as mw.Image;
		this.mSelectImg = this.tailItem.findChildByPath("RootCanvas/mCanvas/mSelectImg") as mw.Image;
	}

	/**填充数据 */
	public initData(id: number, tail: ITailElement): void {
		this.id = id;
		this.tail = tail;
		let vis: mw.SlateVisibility = (tail.IsIAA == 0) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
		this.mIAAImg.visibility = vis;
		let tailIcon = tail.TailIcon;
		this.mIconBtn.normalImageGuid = tailIcon;
		this.mIconBtn.pressedImageGuid = tailIcon;
		this.mIconBtn.disableImageGuid = tailIcon;
		this.mIconBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (!GlobalData.delayClick) {
				P_Tips.show("小手别点太快");
				return;
			}
			GlobalData.delayClick = false;
			TimeUtil.delaySecond(1).then(() => {
				GlobalData.delayClick = true;
			});
			mw.UIService.getUI(ShopPanel).onChangeTailToNPCAnction.call(this.id, this.tail);
		});
		this.mIconBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
		this.mSelectImg.visibility = mw.SlateVisibility.Collapsed;
	}

	/**选中状态 */
	public selectState(): void {
		this.mSelectImg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.mSelectImg.visibility = mw.SlateVisibility.Collapsed;
		this.isSelect = false;
	}

	/**回收Item */
	public recycleItem(): void {
		this.mIconBtn.onClicked.clear();
		if (this.isSelect) {
			this.cancleSelectState();
		}
		ObjectPoolServices.getPool(TailItem).return(this);
	}
}

export enum ShopType {
	/**武器 */
	Weapon = 1,
	/**f服装 */
	Colthes = 2,
	/**翅膀 */
	Wing = 3,
	/**拖尾 */
	Tail = 4,
}
