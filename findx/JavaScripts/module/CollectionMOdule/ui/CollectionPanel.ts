
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.18-19.23.27
 */

import { Notice } from "../../../Common/notice/Notice";
import { ICollectionElement } from "../../../config/Collection";
import { GameConfig } from "../../../config/GameConfig";
import GlobalData from "../../../const/GlobalData";
import { ObjectPoolServices } from "../../../Tools/ObjectPool";
import CollectionPanel_Generate from "../../../ui-generate/module/CollectionUI/CollectionPanel_generate";
import CollectionModuleC from "../CollectionModuleC";
import CollectionItemPanel from "./CollectionItemPanel";

export default class CollectionPanel extends CollectionPanel_Generate {
	private collectionModuleC: CollectionModuleC = null;
	public onFindTipsAction: Action1<number> = new Action1<number>();
	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		this.initDatas();
		this.bindButtons();
		this.registerActions();
	}

	/**初始化数据 */
	private initDatas(): void {
		this.collectionModuleC = ModuleService.getModule(CollectionModuleC);
		this.initCollectionData();
	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mCloseBtn.onClicked.add(() => {
			this.hide();
		});
		this.bindCollectionTypeButtons();
	}

	/**记录当前点击的页签按钮 */
	private currentCollectionTypeBtn: mw.Button = this.mCollectionBtn1;
	/**记录当前点击的页签 */
	private currentCollectionType: CollectionType = CollectionType.FightingSkill;
	/**绑定Collection类型按钮 */
	private bindCollectionTypeButtons(): void {
		this.currentCollectionTypeBtn = this.mCollectionBtn1;
		this.currentCollectionType = CollectionType.FightingSkill;
		this.currentCollectionTypeBtn.normalImageColor = GlobalData.collectionTypeSelectColor;
		for (let i = 1; i <= 4; ++i) {
			(this['mCollectionBtn' + i] as mw.Button).onClicked.add(() => {
				this.updateCollectionType(i, (this['mCollectionBtn' + i] as mw.Button));
			});
		}
	}

	/**注册事件 */
	private registerActions(): void {

	}

	/**更新Collection类型（更新显示内容） */
	private updateCollectionType(collectionType: CollectionType, collectionTypeButton: mw.Button): void {
		if (this.currentCollectionType == collectionType) return;
		this.currentCollectionType = collectionType;
		if (this.currentCollectionTypeBtn) {
			this.currentCollectionTypeBtn.normalImageColor = GlobalData.collectionTypeNormalColor;
		}
		this.currentCollectionTypeBtn = collectionTypeButton;
		this.currentCollectionTypeBtn.normalImageColor = GlobalData.collectionTypeSelectColor;
		this.showCollectionContentPanel(this.currentCollectionType);
	}

	protected onShow(...params: any[]): void {
		this.showCollectionContentPanel(this.currentCollectionType);
	}

	/**Content子集位置 */
	private currentChildIndex: number = 1;

	/**布局位置Cloth */
	private getCollectionChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 5) * 225) + 50;
		let y = (Math.ceil(this.currentChildIndex / 5) - 1) * 225;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}

	//#region 收集
	/**--------------------------[收集]-------------------------- */
	private collections: ICollectionElement[] = [];
	private fightingSkills: ICollectionElement[] = [];
	private gongs: ICollectionElement[] = [];
	private elixirs: ICollectionElement[] = [];
	private anomalousFires: ICollectionElement[] = [];
	/**储存当前页签下的CollectionItem */
	private collectionItems: CollectionItem[] = [];
	/**给NPC换武器 */
	// public onChangeWeaponToNPCAnction: Action2<number, IWeaponElement> = new Action2<number, IWeaponElement>();

	/**初始化Collection数据 */
	private initCollectionData(): void {
		this.collections = GameConfig.Collection.getAllElement();
		for (let i = 0; i < this.collections.length; ++i) {
			let collectionElement = this.collections[i];
			switch (collectionElement.CollectionType) {
				case CollectionType.FightingSkill:
					this.fightingSkills.push(collectionElement);
					break;
				case CollectionType.Gong:
					this.gongs.push(collectionElement);
					break;
				case CollectionType.Elixir:
					this.elixirs.push(collectionElement);
					break;
				case CollectionType.AnomalousFire:
					this.anomalousFires.push(collectionElement);
					break;
				default:
					break;
			}
		}
		this.showCollectionContentPanel(this.currentCollectionType);
	}

	/**显示的Collection内容 */
	private showCollectionContentPanel(currentCollectionType: CollectionType): void {
		this.currentChildIndex = 1;
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(1200, 0);
		if (this.collectionItems.length > 0) {
			this.recycleCurrentCollectionItems();
		}
		let tmpCollections: ICollectionElement[] = [];
		switch (currentCollectionType) {
			case CollectionType.FightingSkill:
				tmpCollections = this.fightingSkills;
				break;
			case CollectionType.Gong:
				tmpCollections = this.gongs;
				break;
			case CollectionType.Elixir:
				tmpCollections = this.elixirs;
				break;
			case CollectionType.AnomalousFire:
				tmpCollections = this.anomalousFires;
				break;
			default:
				break;
		}
		for (let i = 0; i < tmpCollections.length; ++i) {
			let collectionItem = ObjectPoolServices.getPool(CollectionItem).spawn();
			let collection = tmpCollections[i];
			collectionItem.initData(collection.id, collection.CollectionIcon, this.collectionModuleC.isOwnItem(collection.id), collection.Annotation, collection.AddType, collection.AddValue);
			this.mContentCanvas.addChild(collectionItem.collectionItem);
			collectionItem.collectionItem.size = new mw.Vector2(200, 200);
			collectionItem.collectionItem.position = this.getCollectionChildPos();
			this.collectionItems.push(collectionItem);
		}

		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 5 == 0) {
			y = (this.currentChildIndex / 5) * 225;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 5)) * 225;
		}
		this.mContentCanvas.size = new mw.Vector2(1200, y);
	}

	/**回收当前页签下的内容CollectionItem */
	private recycleCurrentCollectionItems(): void {
		if (this.collectionItems.length == 0) return;
		this.collectionItems.forEach((collection) => {
			collection.recycleItem();
			this.mRecycleCanvas.addChild(collection.collectionItem);
		});
		this.collectionItems.length = 0;
	}
	/**--------------------------[收集]-------------------------- */
	//#endregion
}

/**Collection */
class CollectionItem {
	public collectionItem: mw.UserWidgetPrefab;

	public mBgImage: mw.Image = undefined;
	public mIconBtn: mw.Button = undefined;
	public mAdsTipBtn: mw.Button = undefined;
	public mAdsTipImg: mw.Image = undefined;
	public mAdsTipCanvas: mw.Canvas = undefined;

	private id: number = null;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.collectionItem = mw.createUIByName("module/CollectionUI/CollectItem");

		this.mBgImage = this.collectionItem.findChildByPath("RootCanvas/Canvas/mBgImage") as mw.Image;
		this.mIconBtn = this.collectionItem.findChildByPath("RootCanvas/Canvas/mIconBtn") as mw.Button;
		this.mAdsTipCanvas = this.collectionItem.findChildByPath("RootCanvas/Canvas/mAdsTipCanvas") as mw.Canvas;
		this.mAdsTipBtn = this.collectionItem.findChildByPath("RootCanvas/Canvas/mAdsTipCanvas/mAdsTipBtn") as mw.Button;
		this.mAdsTipImg = this.collectionItem.findChildByPath("RootCanvas/Canvas/mAdsTipCanvas/mAdsTipImg") as mw.Image;
	}

	/**填充数据 */
	public initData(id: number, icon: string, isOwn: boolean, name: string, addType: number, addValue: number): void {
		this.id = id;
		this.mIconBtn.normalImageGuid = icon;
		this.mIconBtn.pressedImageGuid = icon;
		this.mIconBtn.disableImageGuid = icon;
		this.mIconBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (!GlobalData.delayClick) {
				Notice.showDownNotice("小手别点太快");
				return;
			}
			GlobalData.delayClick = false;
			TimeUtil.delaySecond(1).then(() => {
				GlobalData.delayClick = true;
			});
			mw.UIService.getUI(CollectionItemPanel).showCollectionItemTip(icon, name, isOwn, addType, addValue);
		});
		this.mIconBtn.normalImageColor = (isOwn == true) ? GlobalData.collectionItemIconOwnColor : GlobalData.collectionItemIconNoOwnColor;
		this.mIconBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;

		this.mAdsTipBtn.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			mw.UIService.getUI(CollectionPanel).onFindTipsAction.call(this.id);
		});

		this.mAdsTipCanvas.visibility = (isOwn == true) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
		this.mAdsTipBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	}

	/**选中状态 */
	public selectState(): void {
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.isSelect = false;
	}

	/**回收Item */
	public recycleItem(): void {
		this.mIconBtn.onClicked.clear();
		ObjectPoolServices.getPool(CollectionItem).return(this);
	}
}

export enum CollectionType {
	/**斗技 */
	FightingSkill = 1,
	/**功法 */
	Gong = 2,
	/**丹药 */
	Elixir = 3,
	/**异火 */
	AnomalousFire = 4,
}
