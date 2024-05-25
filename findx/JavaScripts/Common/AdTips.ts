import Console from "../Tools/Console";
import { AdType } from "../module/AdsModule/AdsModuleC";
import AdTips_Generate from "../ui-generate/common/AdTips_generate";
import { Notice } from "./notice/Notice";

export default class AdTips extends AdTips_Generate {
	/**点击看广告事件 */
	public onWatchAdsAction: Action2<number, number> = new Action2<number, number>();

	/**配置表的ID */
	private id: number = -1;
	private adType: number = -1;

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		this.initData();
		this.bindButtons();
	}

	/**初始化数据 */
	private initData(): void {

	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mYesBtn.onClose.add(this.onClickYesBtn.bind(this));

		this.mNoBtn.onClicked.add(() => {
			if (!this.visible) return;
			this.hide();
		});
	}

	private onClickYesBtn(isSuccess: boolean): void {
		if (!isSuccess) {
			Notice.showDownNotice("获取失败，请重试");
			return;
		}
		this.hideAdTips();
		this.onWatchAdsAction.call(this.id, this.adType);
	}


	/**显示此界面 */
	public showAdTips(id: number, adType: number): void {
		// if (this.visible) return;
		this.id = id;
		this.adType = adType;
		this.show();
	}

	/**隐藏此界面 */
	public hideAdTips(): void {
		if (!this.visible) return;
		this.hide();
	}

	protected onShow(...params: any[]): void {
		switch (this.adType) {
			case AdType.ChangeCloth:
				this.mContentTxt.text = "可以穿戴这套服装哟~";
				break;
			case AdType.Weapon:
				this.mContentTxt.text = "可以使用这个厉害的武器哟~";
				break;
			case AdType.Wing:
				this.mContentTxt.text = "可以使用超快翅膀飞行哟~";
				break;
			case AdType.Tail:
				this.mContentTxt.text = "可以使用这个帅气的拖尾哟~";
				break;
			case AdType.Tips:
				this.mContentTxt.text = "可以帮你找到它哟~";
				break;
			case AdType.AddCount:
				this.mContentTxt.text = "可以增加2次使用次数哟~";
				break;
			case AdType.AdsReward:
				this.mContentTxt.text = "可以随机提升攻击力、最大生命值、移动速度、飞行速度、跳跃高度。";
				break;
			case AdType.SignIn:
				this.mContentTxt.text = "可以补签哟~";
				break;
			case AdType.Raffle:
				this.mContentTxt.text = "可以免费抽奖哟~";
				break;
			case AdType.RandomGetId:
				this.mContentTxt.text = "带你去找皮肤~";
				break;
			default:
				break;
		}
		Console.error("[AdTips-onShow]");
	}
}
