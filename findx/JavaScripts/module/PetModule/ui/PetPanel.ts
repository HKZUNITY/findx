
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.07.01-11.13.24
 */

import { Notice } from "../../../Common/notice/Notice";
import { ObjectPoolServices } from "../../../Tools/ObjectPool";
import { GameConfig } from "../../../config/GameConfig";
import { IPetElement } from "../../../config/Pet";
import PetPanel_Generate from "../../../ui-generate/module/PetUI/PetPanel_generate";
import { PetModuleC } from "../PetModule";
import PetRafflePanel from "./PetRafflePanel";

export default class PetPanel extends PetPanel_Generate {
	private petModuleC: PetModuleC = null;
	private petRafflePanel: PetRafflePanel = null;
	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initData();
		this.bindButton();
	}

	private pets: IPetElement[] = [];
	/**初始化数据 */
	private initData(): void {
		this.petModuleC = ModuleService.getModule(PetModuleC);
		this.petRafflePanel = mw.UIService.getUI(PetRafflePanel);
		this.pets = GameConfig.Pet.getAllElement();
	}

	/**绑定按钮 */
	private bindButton(): void {
		this.mCloseButton.onClicked.add(() => {
			this.hide();
			if (this.selectId != -1) {
				this.petModuleC.changePet(this.pets[this.selectId - 1].PetGuid);
			}
		});
		this.mRaffleButton.onClicked.add(() => {
			this.hide();
			if (this.selectId != -1) {
				this.petModuleC.changePet(this.pets[this.selectId - 1].PetGuid);
			}
			this.petRafflePanel.show();
		});
	}
	protected onShow(...params: any[]): void {
		this.showPetPanel();
	}

	/**Content子集位置 */
	private currentChildIndex: number = 1;

	/**布局位置Cloth */
	private getCollectionChildPos(): mw.Vector2 {
		let x = (((this.currentChildIndex - 1) % 4) * 250);
		let y = (Math.ceil(this.currentChildIndex / 4) - 1) * 250;
		++this.currentChildIndex;
		return new mw.Vector2(x, y);
	}

	private isFirstOpen: boolean = true;
	/**显示面板 */
	public showPetPanel(): void {
		if (this.isFirstOpen) {
			this.updatePetPanel();
			this.isFirstOpen = false;
		}
	}
	private petItems: PetItem[] = [];
	private updatePetPanel(): void {
		if (!this.pets) return;
		this.currentChildIndex = 1;
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = new mw.Vector2(0, 0);
		this.mContentCanvas.size = new mw.Vector2(1000, 0);
		for (let i = 0; i < this.pets.length; ++i) {
			let petItem = ObjectPoolServices.getPool(PetItem).spawn();
			petItem.initData(this.pets[i], this.petModuleC.isOwn(this.pets[i].id));
			this.mContentCanvas.addChild(petItem.petItem);
			petItem.petItem.size = new mw.Vector2(250, 250);
			petItem.petItem.position = this.getCollectionChildPos();
			this.petItems.push(petItem);
		}
		--this.currentChildIndex;
		let y = 0;
		if (this.currentChildIndex % 4 == 0) {
			y = (this.currentChildIndex / 4) * 250;
		}
		else {
			y = (Math.ceil(this.currentChildIndex / 4)) * 250;
		}
		this.mContentCanvas.size = new mw.Vector2(1000, y);
	}

	private selectId: number = -1;
	public updateItemState(id: number): void {
		if (this.selectId != -1) {
			this.petItems[this.selectId - 1].cancleSelectState();
		}
		this.selectId = id;
		this.petItems[this.selectId - 1].selectState();
	}

	public getPetItem(id: number): void {
		this.petItems[id - 1].updatePetItem();
	}
}

/**PetItem */
class PetItem {
	public petItem: mw.UserWidgetPrefab;

	public mIconButton: mw.Button = undefined;
	public mSelectImage: mw.Image = undefined;
	public mOwnTxt: mw.TextBlock = undefined;

	private id: number = null;
	private isOwn: boolean = false;

	private isSelect: boolean = false;

	/**生成Item */
	constructor() {
		this.petItem = mw.createUIByName("module/PetUI/PetItem");

		this.mIconButton = this.petItem.findChildByPath("RootCanvas/Canvas/mIconButton") as mw.Button;
		this.mSelectImage = this.petItem.findChildByPath("RootCanvas/Canvas/mSelectImage") as mw.Image;
		this.mOwnTxt = this.petItem.findChildByPath("RootCanvas/Canvas/mOwnTxt") as mw.TextBlock;
	}

	/**填充数据 */
	public initData(pet: IPetElement, isOwn: boolean): void {
		this.id = pet.id;
		this.isOwn = isOwn;
		this.mIconButton.normalImageGuid = pet.PetIcon;
		this.mIconButton.pressedImageGuid = pet.PetIcon;
		this.mIconButton.disableImageGuid = pet.PetIcon;
		this.mIconButton.onClicked.add(() => {
			Event.dispatchToLocal("PlayButtonClick");
			if (this.isOwn) {
				mw.UIService.getUI(PetPanel).updateItemState(this.id);
			}
			else {
				Notice.showDownNotice("未拥有、可在抽奖中获得哟~");
			}
		});
		this.mIconButton.touchMethod = mw.ButtonTouchMethod.PreciseTap;
		this.mSelectImage.visibility = mw.SlateVisibility.Collapsed;
		this.mOwnTxt.visibility = (isOwn == true) ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
	}

	/**选中状态 */
	public selectState(): void {
		this.mSelectImage.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		this.isSelect = true;
	}

	/**取消选中状态 */
	public cancleSelectState(): void {
		this.mSelectImage.visibility = mw.SlateVisibility.Collapsed;
		this.isSelect = false;
	}

	public updatePetItem(): void {
		this.isOwn = true;
		this.mOwnTxt.visibility = mw.SlateVisibility.Collapsed;
	}
}
