
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.07.01-11.13.56
 */

import { Utils } from "../../../Tools/utils";
import AdTips from "../../../Common/AdTips";
import { GameConfig } from "../../../config/GameConfig";
import { PetConfig } from "../../../config/Pet";
import GlobalData from "../../../const/GlobalData";
import PetRafflePanel_Generate from "../../../ui-generate/module/PetUI/PetRafflePanel_generate";
import { AdType } from "../../AdsModule/AdsModuleC";
import { PetModuleC } from "../PetModule";
import PetPanel from "./PetPanel";

export default class PetRafflePanel extends PetRafflePanel_Generate {
	private petModuleC: PetModuleC = null;
	private petPanel: PetPanel = null;
	private adTips: AdTips = null;
	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initDatas();
		this.bindButtons();
	}

	private mSelectImages: mw.Image[] = [];
	private mPetIcons: mw.Image[] = [];
	private initDatas(): void {
		this.petModuleC = ModuleService.getModule(PetModuleC);
		this.petPanel = mw.UIService.getUI(PetPanel);
		this.adTips = mw.UIService.getUI(AdTips);
		for (let i = 1; i <= 12; ++i) {
			this.mSelectImages.push(this['mSelectImage' + i]);
			this.mSelectImages[i - 1].visibility = mw.SlateVisibility.Collapsed;
			this.mPetIcons.push(this['mPetIcon' + i]);
		}
		this.mGetCanvas.visibility = mw.SlateVisibility.Collapsed;
	}
	public isFree: boolean = true;
	private bindButtons(): void {
		this.mCloseButton.onClicked.add(() => {
			this.hide();
		});
		this.mCloseGetButton.onClicked.add(() => {
			if (this.mGetCanvas.visibility != mw.SlateVisibility.SelfHitTestInvisible) return;
			this.mGetCanvas.visibility = mw.SlateVisibility.Collapsed;
		});
		this.mPetButton.onClicked.add(() => {
			this.hide();
			this.petPanel.show();
		});
		this.mRaffleButton.onClicked.add(() => {
			if (this.isFree) {
				this.startRaffle();
				this.raffleComplete();
				this.banButton(false);
			}
			else {
				if (GlobalData.isOpenIAA) {
					this.adTips.showAdTips(1, AdType.Raffle);
				}
				else {
					this.getRaffle();
				}
			}
		});
	}

	private banButton(v: boolean): void {
		this.mPetButton.enable = v;
		this.mRaffleButton.enable = v;
	}

	private raffleComplete(): void {
		this.isFree = false;
		this.petModuleC.saveIsFreeCount(false);
		this.mRaffleText.text = "增加次数";
	}

	public getRaffle(): void {
		this.isFree = true;
		this.petModuleC.saveIsFreeCount(true);
		this.mRaffleText.text = "免费抽奖";
	}

	protected onShow(...params: any[]): void {
		this.isFree = this.petModuleC.getIsFreeCount();
		let txt = "";
		if (this.isFree) {
			txt = "免费抽奖";
		}
		else {
			txt = "增加次数";
		}
		this.mRaffleText.text = txt;
	}
	private ids: number[] = [];
	private pets: PetConfig = null;
	public updateIcons(ids: number[]): void {
		this.ids = ids;
		this.pets = GameConfig.Pet;
		for (let i = 0; i < 12; ++i) {
			this.mPetIcons[i].imageGuid = this.pets.getElement(ids[i]).PetIcon;
		}
	}

	private tmpArr: number[] = [];
	private timer: number = 0.2;/**131832*/
	/**开始抽奖 */
	public startRaffle(): void {
		Event.dispatchToLocal("RaffAch", 1);
		let amount: number = Utils.getRandomInteger(40, 50);
		let index: number = 0;

		this.tmpArr = Utils.getRandomArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 6);
		for (let i = 0; i < this.tmpArr.length; ++i) {
			this.mSelectImages[this.tmpArr[i]].visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		index++;
		let id = TimeUtil.setInterval(() => {
			for (let i = 0; i < this.tmpArr.length; ++i) {
				this.mSelectImages[this.tmpArr[i]].visibility = mw.SlateVisibility.Collapsed;
			}
			this.tmpArr = Utils.getRandomArr([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 6);
			for (let i = 0; i < this.tmpArr.length; ++i) {
				this.mSelectImages[this.tmpArr[i]].visibility = mw.SlateVisibility.SelfHitTestInvisible;
			}
			this.playSound("137566");
			index++;
			if (index >= amount) {
				TimeUtil.clearInterval(id);
				for (let i = 0; i < this.tmpArr.length; ++i) {
					this.mSelectImages[this.tmpArr[i]].visibility = mw.SlateVisibility.Collapsed;
				}
				let i: number = Utils.getRandomInteger(0, 11);
				this.mSelectImages[i].visibility = mw.SlateVisibility.SelfHitTestInvisible;
				this.mGetImage.imageGuid = this.pets.getElement(this.ids[i]).PetIcon;
				this.mGetCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				this.petModuleC.savePetList(this.ids[i]);
				SoundService.playSound("131832");
				this.banButton(true);
				//计算中奖
			}
		}, this.timer);
	}
	private soundId: string = null;
	private playSound(id: string): void {
		if (this.soundId) {
			mw.SoundService.stopSound(this.soundId);
		}
		this.soundId = mw.SoundService.playSound(id, 1);
	}
}
