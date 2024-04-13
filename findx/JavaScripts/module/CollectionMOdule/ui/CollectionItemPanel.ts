
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.19-22.01.22
 */

import AdTips from "../../../Common/AdTips";
import GlobalData from "../../../const/GlobalData";
import CollectionItemTip_Generate from "../../../ui-generate/module/CollectionUI/CollectionItemTip_generate";
import { AdType } from "../../AdsModule/AdsModuleC";
import HUDModuleC from "../../HUDModule/HUDModuleC";
import CollectionPanel from "./CollectionPanel";

export default class CollectionItemPanel extends CollectionItemTip_Generate {
	private hudModuleC: HUDModuleC = null;
	private adTips: AdTips = null;
	private collectionPanel: CollectionPanel = null;
	private useCount: number = 2;
	private addType: number = 0;
	private addValue: number = 0;
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

	/**初始化数据 */
	private initDatas(): void {
		this.hudModuleC = ModuleService.getModule(HUDModuleC);
		this.adTips = mw.UIService.getUI(AdTips);
		this.collectionPanel = mw.UIService.getUI(CollectionPanel);
		this.useCount = 2;
	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mCloseButton.onClicked.add(() => {
			this.hide();
		});

		this.mUseButton.onClicked.add(() => {
			if (this.useCount > 0) {
				Event.dispatchToLocal("achUse", 1);
				switch (this.addType) {
					case 1:
						this.hudModuleC.setMaxHp(this.addValue);
						break;
					case 2:
						this.hudModuleC.setCurHp(this.addValue);
						break;
					case 3:
						this.hudModuleC.setCurAttackValue(this.addValue);
						break;
					case 4:
						this.hudModuleC.setMaxMoveSpeed(this.addValue);
						break;
					case 5:
						this.hudModuleC.setMaxFlySpeed(this.addValue);
						break;
					case 6:
						this.hudModuleC.setMaxJumpHeight(this.addValue);
						break;
					default:
						break;
				}
				--this.useCount;
				this.collectionPanel.hide();
			}
			else {
				if (GlobalData.isOpenIAA) {
					this.adTips.showAdTips(1, AdType.AddCount);
				}
				else {
					this.getReward();
				}
			}
			this.hide();
		});
	}

	/**得到奖励 */
	public getReward(): void {
		this.useCount = 2;
	}

	/**显示 */
	public showCollectionItemTip(icon: string, name: string, isOwn: boolean, addType: number, addValue: number): void {
		this.mIconImage.imageGuid = icon;
		this.mNameText.text = name;
		this.mOwnText.text = (isOwn) ? "已获得" : "未获得";
		this.mUseCanvas.visibility = (isOwn) ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
		this.addType = addType;
		this.addValue = addValue;
		if (this.useCount > 0) {
			switch (addType) {
				case 1:
					this.mUseText.text = "增加最大生命值\n+" + addValue;
					break;
				case 2:
					this.mUseText.text = "恢复当前生命值\n+" + addValue;
					break;
				case 3:
					this.mUseText.text = "增加攻击力\n+" + addValue;
					break;
				case 4:
					this.mUseText.text = "增加移动速度\n+" + addValue;
					break;
				case 5:
					this.mUseText.text = "增加飞行速度\n+" + addValue;
					break;
				case 6:
					this.mUseText.text = "增加跳跃高度\n+" + addValue;
					break;
				default:
					break;
			}
		}
		else {
			this.mUseText.text = "增加2次使用次数";
		}
		this.show();
	}
}
