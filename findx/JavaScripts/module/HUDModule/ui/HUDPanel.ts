
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.05.25-10.21.12
 */

import Console from "../../../Tools/Console";
import { Tween, Utils } from "../../../Tools/utils";
import GlobalData from "../../../const/GlobalData";
import HUDPanel_Generate from "../../../ui-generate/module/HUDUI/HUDPanel_generate";
import HUDModuleC, { KillTipData, KillTipType } from "../HUDModuleC";
import KillTipItem_Generate from "../../../ui-generate/module/HUDUI/KillTipItem_generate";
import { Notice } from "../../../Common/notice/Notice";
import { ColdWeapon } from "../../ColdWeapon/ColdWeapon";

export default class HUDPanel extends HUDPanel_Generate {
	private hudModuleC: HUDModuleC = null;
	/**背景音乐按钮事件（true-打开|false-关闭） */
	public onBgmAction: Action1<boolean> = new Action1<boolean>();
	/**切换背景音乐（-1前一首|1下一首） */
	public onSwitchBgmAction: Action1<number> = new Action1<number>();
	/**重生事件 */
	public onRebirthAction: Action = new Action();
	/**攻击CD */
	// private attackCD: number = 2;

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		this.initUI();
		this.initData();
		this.bindButtons();
		// this.registerActions();
	}

	/**初始化数据 */
	private initData(): void {
		this.hudModuleC = ModuleService.getModule(HUDModuleC);
	}

	/**绑定按钮 */
	private bindButtons(): void {
		this.mJumpBtn.onClicked.add(() => {
			this.hudModuleC.onJumpAction.call();
		});
		this.mRankBtn.onClicked.add(() => {
			this.hudModuleC.onOpenRankingAction.call();
		});
		this.mHomeBtn.onClicked.add(() => {
			this.onRebirthAction.call();
		});
		this.mShopBtn.onClicked.add(() => {
			this.hudModuleC.onSkinShopAction.call();
		});
		this.mLevelBtn.onClicked.add(() => {
			this.hudModuleC.onOpenAndCloseCollectionPanelAction.call(true);
		});
		this.mSignInBtn.onClicked.add(() => {
			this.hudModuleC.onOpenSignInAction.call();
		});
		this.mAdsButton.onClicked.add(() => {
			this.hudModuleC.onOpenAdsAction.call();
		});
		this.mAchButton.onClicked.add(() => {
			this.hudModuleC.onOpenAchAction.call();
		});
		this.mPetButton.onClicked.add(() => {
			this.hudModuleC.onOpenPetAction.call();
		});
		this.mRaffleButton.onClicked.add(() => {
			this.hudModuleC.onOpenRaffleAction.call();
		});
		this.initAttackButton();

		this.initMusicButton();

		this.initWingButton();
		this.mFlyCanvas.visibility = mw.SlateVisibility.Collapsed;
	}

	private initUI(): void {
		this.initKillTipItems();
		Utils.setWidgetVisibility(this.mKillTipCountCanvas, mw.SlateVisibility.Collapsed);
		Utils.setWidgetVisibility(this.mKillTipTextBlock3, mw.SlateVisibility.Collapsed);
	}

	/**注册事件 */
	// private registerActions(): void {
	// 	this.hudModuleC.onUpdateAttackCD.add((cd: number) => {
	// 		this.attackCD = cd;
	// 		Console.error("[更新攻击CD：" + this.attackCD + "]");
	// 	});
	// }

	/**是否打开BGM */
	private isOpenBGM: boolean = true;
	/**初始化背景音乐按钮 */
	private initMusicButton(): void {
		this.mMusicCanvas.visibility = mw.SlateVisibility.Collapsed;

		this.mMusicBtn.onClicked.add(() => {
			this.hudModuleC.onMusicAction.call();
		});

		this.mOnOffMusicBtn.onClicked.add(() => {
			this.isOpenBGM = !this.isOpenBGM;
			this.onBgmAction.call(this.isOpenBGM);
			let offOnIcon = (this.isOpenBGM) ? GlobalData.onMusicIconGuid : GlobalData.offMusicIconGuid;
			this.mOnOffMusicBtn.normalImageGuid = offOnIcon;
			this.mOnOffMusicBtn.pressedImageGuid = offOnIcon;
			this.mOnOffMusicBtn.disableImageGuid = offOnIcon;
		});

		this.mLeftMusicBtn.onClicked.add(() => {
			this.onSwitchBgmAction.call(-1);
		});

		this.mRightMusicBtn.onClicked.add(() => {
			this.onSwitchBgmAction.call(1);
		});

		this.mCloseMusicBtn.onClicked.add(() => {
			if (this.mMusicCanvas.visibility == mw.SlateVisibility.Collapsed) return;
			this.mMusicCanvas.visibility = mw.SlateVisibility.Collapsed;
		});

		this.mMusicBtn.normalImageColor = new mw.LinearColor(0, 1, 1);
		this.flickerMusicButtonColor();
	}

	/**初始化攻击按钮 */
	private initAttackButton(): void {
		this.atk(0);
	}

	private curInputIndex: number = -1;
	private atk(index: number): void {
		this.mAttackButton.onPressed.add(() => {
			if (this.curInputIndex != -1) return;
			ColdWeapon.getInstance().attack(index);
			this.curInputIndex = index;
		});
		this.mAttackButton.onReleased.add(() => {
			if (this.curInputIndex != index) return;
			ColdWeapon.getInstance().endCharge(true);
			this.curInputIndex = -1;
		});
	}

	/**初始化飞行按钮 */
	private initWingButton(): void {
		this.mFlyMaskBtn.clickedDelegate.add(() => {
			if (!this.hudModuleC.IsFlying) {
				Notice.showDownNotice("正在使用飞行技能");
				return;
			}
			if (!this.hudModuleC.IsCanFly) {
				Notice.showDownNotice("使用蹦床期间不可以使用飞行翅膀哟~");
				return;
			}
			this.hudModuleC.IsFlying = false;
			this.hudModuleC.onFlyOrWalkAction.call();
		});
		this.mFlyMaskBtn.fanShapedValue = 1;
		this.mFlyMaskBtn.enable = true;
		this.mBeFlyingText.visibility = mw.SlateVisibility.Collapsed;
	}

	/**更新飞行按钮CD显示以及按钮可用性 */
	public updateFlyButtonCD(cd: number = GlobalData.wingFlyTime): void {
		this.mFlyMaskBtn.enable = false;
		this.mFlyText.visibility = mw.SlateVisibility.SelfHitTestInvisible;

		let tmpCD = cd;
		this.mFlyText.text = tmpCD.toString();
		this.mFlyMaskBtn.fanShapedValue = 0;

		new mw.Tween({ value: 0 }).to({ value: 1 }, tmpCD * 1000).onUpdate((v) => {
			this.mFlyText.text = (tmpCD - v.value * tmpCD).toFixed(1);
			this.mFlyMaskBtn.fanShapedValue = v.value;
		}).start().onComplete(() => {
			this.mFlyMaskBtn.enable = true;
			this.hudModuleC.IsFlying = true;
			this.mFlyText.visibility = mw.SlateVisibility.Collapsed;
		});
	}

	/**飞行时间倒计时间隔 */
	private flyIntervalId: number = null;

	/**更新飞行时间CD */
	public updateFlyCD(cd: number = GlobalData.wingFlyTime): void {
		this.mBeFlyingText.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		if (this.flyIntervalId) {
			TimeUtil.clearInterval(this.flyIntervalId);
			this.flyIntervalId = null;
		}
		let tmpCD = cd;
		this.mBeFlyingText.text = "飞行倒计时 " + tmpCD + " 秒";
		--tmpCD;
		this.flyIntervalId = TimeUtil.setInterval(() => {
			this.mBeFlyingText.text = "飞行倒计时 " + tmpCD + " 秒";
			if (tmpCD <= 0) {
				TimeUtil.clearInterval(this.flyIntervalId);
				this.flyIntervalId = null;
				this.mBeFlyingText.visibility = mw.SlateVisibility.Collapsed;
			}
			--tmpCD;
		}, 1);
	}

	/**闪烁音乐按钮 */
	private flickerMusicButtonColor(): void {
		let startFlicker = new Tween({ B: 1 })
			.to({ B: 0 }, 0.30 * 1000)
			.onUpdate((v) => {
				this.mMusicBtn.normalImageColor = new mw.LinearColor(0, 1, v.B);
			})
			.onComplete(() => {
				new Tween({ R: 0 })
					.to({ R: 1 }, 0.30 * 1000)
					.onUpdate((v) => {
						this.mMusicBtn.normalImageColor = new mw.LinearColor(v.R, 1, 0);
					})
					.onComplete(() => {
						new Tween({ G: 1 })
							.to({ G: 0 }, 0.30 * 1000)
							.onUpdate((v) => {
								this.mMusicBtn.normalImageColor = new mw.LinearColor(1, v.G, 0);
							})
							.onComplete(() => {
								new Tween({ B: 0 })
									.to({ B: 1 }, 0.30 * 1000)
									.onUpdate((v) => {
										this.mMusicBtn.normalImageColor = new mw.LinearColor(1, 0, v.B);
									})
									.onComplete(() => {
										new Tween({ R: 1 })
											.to({ R: 0 }, 0.30 * 1000)
											.onUpdate((v) => {
												this.mMusicBtn.normalImageColor = new mw.LinearColor(v.R, 0, 1);
											})
											.onComplete(() => {
												new Tween({ G: 0 })
													.to({ G: 1 }, 0.30 * 1000)
													.onUpdate((v) => {
														this.mMusicBtn.normalImageColor = new mw.LinearColor(0, v.G, 1);
													})
													.onComplete(() => {
														startFlicker.start();
													})
													.start();
											})
											.start();
									})
									.start();
							})
							.start();
					})
					.start();
			})
			.start();
	}

	//#region 击杀提示
	private initKillTipItems(): void {
		for (let i = 0; i < 4; ++i) {
			let killTipItem = UIService.create(KillTipItem);
			killTipItem.uiObject.position = new mw.Vector2(0, 37 * i);
			Utils.setWidgetVisibility(killTipItem.uiObject, mw.SlateVisibility.Collapsed);
			this.mKillTipCanvas.addChild(killTipItem.uiObject);
			this.killTipItems.push(killTipItem);
		}
	}

	private hideKillTipIntervalId: any = null;
	private killTipItems: KillTipItem[] = [];
	private killTipDatas: KillTipData[] = [];
	public killTip(killTipType: KillTipType, killerName: string, killedName: string): void {
		let killTipData: KillTipData = new KillTipData();
		killTipData.killTipType = killTipType;
		killTipData.killerName = killerName;
		killTipData.killedName = killedName;
		if (this.killTipDatas.length >= 4) {
			this.killTipDatas.shift();
		}
		this.killTipDatas.push(killTipData);
		this.updateKillTipItems();

		this.clearHideKillTipIntervalId();
		this.hideKillTipIntervalId = TimeUtil.setInterval(() => {
			if (this.killTipDatas && this.killTipDatas.length > 0) {
				this.killTipDatas.shift();
				this.updateKillTipItems();
			} else {
				this.clearHideKillTipIntervalId();
			}
		}, 5);
	}

	private clearHideKillTipIntervalId(): void {
		if (this.hideKillTipIntervalId) {
			TimeUtil.clearInterval(this.hideKillTipIntervalId);
			this.hideKillTipIntervalId = null;
		}
	}

	private updateKillTipItems(): void {
		for (let i = 0; i < this.killTipDatas.length; ++i) {
			this.killTipItems[i].setInfo(this.killTipDatas[i]);
		}
		for (let i = this.killTipDatas.length; i < 4; ++i) {
			Utils.setWidgetVisibility(this.killTipItems[i].uiObject, mw.SlateVisibility.Collapsed);
		}
	}
	//#endregion

	//#region 连杀提示
	private killTipsTimeOutId1: any = null;
	private killTipsTimeOutId2: any = null;
	public showKillTips1(killTips: string, killerName: string, killedName: string): void {
		Notice.showDownNotice("<color=#lime>" + "<size=18>" + killerName + " 击败了 " + killedName + "</size>" + "</color>"
			+ "\n" + "<color=#red>" + killTips + "</color>");
	}

	private clearKillTipsTimeOutId1(): void {
		if (this.killTipsTimeOutId1) {
			clearTimeout(this.killTipsTimeOutId1);
			this.killTipsTimeOutId1 = null;
		}
	}

	public showKillTips2(killerName: string, killedName: string, killTipType: KillTipType): void {
		if (killTipType == KillTipType.None) return;
		this.clearKillTipsTimeOutId2();
		if (killTipType == KillTipType.Killed) {
			this.mKillTipTextBlock3.text = "你已被 " + killerName + " 击败";
		} else if (killTipType == KillTipType.revenge) {
			this.mKillTipTextBlock3.text = "击败 " + killedName + " 完成复仇";
		}
		Utils.setWidgetVisibility(this.mKillTipTextBlock3, mw.SlateVisibility.SelfHitTestInvisible);
		this.killTipsTimeOutId2 = setTimeout(() => {
			Utils.setWidgetVisibility(this.mKillTipTextBlock3, mw.SlateVisibility.Collapsed);
			this.clearKillTipsTimeOutId2();
		}, 3 * 1000);
	}

	private clearKillTipsTimeOutId2(): void {
		if (this.killTipsTimeOutId2) {
			clearTimeout(this.killTipsTimeOutId2);
			this.killTipsTimeOutId2 = null;
		}
	}
	//#endregion
}

export class KillTipItem extends KillTipItem_Generate {
	protected onAwake(): void {

	}

	public setInfo(killTipDatas: KillTipData): void {
		this.mKillerTextBlock.text = killTipDatas.killerName;
		this.mKilledTextBlock.text = killTipDatas.killedName;
		switch (killTipDatas.killTipType) {
			case KillTipType.None:
				this.mKillerTextBlock.fontColor = mw.LinearColor.white;
				this.mKillerTextBlock.shadowColor = mw.LinearColor.white;
				this.mKilledTextBlock.fontColor = mw.LinearColor.white;
				this.mKilledTextBlock.shadowColor = mw.LinearColor.white;
				break;
			case KillTipType.Killer:
				this.mKillerTextBlock.fontColor = mw.LinearColor.yellow;
				this.mKillerTextBlock.shadowColor = mw.LinearColor.red;
				this.mKilledTextBlock.fontColor = mw.LinearColor.white;
				this.mKilledTextBlock.shadowColor = mw.LinearColor.white;
				break;
			case KillTipType.Killed:
				this.mKillerTextBlock.fontColor = mw.LinearColor.white;
				this.mKillerTextBlock.shadowColor = mw.LinearColor.white;
				this.mKilledTextBlock.fontColor = mw.LinearColor.yellow;
				this.mKilledTextBlock.shadowColor = mw.LinearColor.red;
				break;
			default:
				break;
		}
		Utils.setWidgetVisibility(this.uiObject, mw.SlateVisibility.SelfHitTestInvisible);
		setTimeout(() => {
			this.mBgImage.size = new mw.Vector2(this.mMainCanvas.size.x + 20, this.mMainCanvas.size.y);
		}, 1);
	}
}