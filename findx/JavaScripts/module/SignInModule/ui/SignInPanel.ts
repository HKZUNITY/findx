
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.26-16.29.14
 */

import { Utils } from "../../../Tools/utils";
import AdTips from "../../../Common/AdTips";
import P_Tips from "../../../Common/P_Tips";
import GlobalData from "../../../const/GlobalData";
import SignInPanel_Generate from "../../../ui-generate/module/SignInUI/SignInPanel_generate";
import { AdType } from "../../AdsModule/AdsModuleC";
import SignInModuleC from "../SignInModuleC";

export default class SignInPanel extends SignInPanel_Generate {
	private signInModuleC: SignInModuleC = null;
	private adTips: AdTips = null;

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initDatas();
		this.bindButton();
	}
	private mSignInBtns: mw.Button[] = [];
	// private mSignInTxts: mw.TextBlock[] = [];
	private mRewardImages: mw.Image[] = [];
	/**初始化数据 */
	private initDatas(): void {
		this.signInModuleC = ModuleService.getModule(SignInModuleC);
		this.adTips = mw.UIService.getUI(AdTips);
		for (let i = 1; i <= 7; ++i) {
			this.mSignInBtns.push((this['mSignInBtn' + i] as mw.Button));
			this.mSignInBtns[i - 1].renderOpacity = 0;
			this.mSignInBtns[i - 1].onClicked.add(() => {
				this.bindSignInButton(i - 1);
			});

			// this.mSignInTxts.push((this['mSignInTxt' + i] as mw.TextBlock));
			// this.mSignInTxts[i - 1].visibility = mw.SlateVisibility.Collapsed;

			this.mRewardImages.push((this['mReawrdImage' + i] as mw.Image));
			this.mRewardImages[i - 1].visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**按钮绑定 */
	private bindButton(): void {
		this.mCloseButton.onClicked.add(() => {
			this.hide();
		});
	}
	private isSignIns: boolean[] = [];
	private whatDay: number = 0;
	private bindSignInButton(index: number): void {
		if (this.isSignIns[index]) {
			P_Tips.show("已领取哟~");
		}
		else {
			if (index < this.whatDay) {
				if (GlobalData.isOpenIAA) {
					this.adTips.showAdTips(index, AdType.SignIn);
				}
				else {
					this.signInModuleC.saveIsSignIns(index);
				}
			}
			else if (index == this.whatDay) {
				this.signInModuleC.saveIsSignIns(index);
			}
			else {
				P_Tips.show("未到领取时间哟~");
			}
		}
	}

	protected onShow(...params: any[]): void {
		this.isSignIns = this.signInModuleC.getIsSignIns();
		this.whatDay = Number(Utils.getWhatDay()) - 1;
		for (let i = 0; i < this.isSignIns.length; ++i) {
			if (this.isSignIns[i]) {
				this.mRewardImages[i].visibility = mw.SlateVisibility.SelfHitTestInvisible;
				this.mSignInBtns[i].renderOpacity = 0;
			}
			else {
				if (i < this.whatDay) {
					this.mSignInBtns[i].renderOpacity = 0.75;
				}
				else {
					this.mSignInBtns[i].renderOpacity = 0;
				}
				this.mRewardImages[i].visibility = mw.SlateVisibility.Collapsed;
			}
		}
	}
}
