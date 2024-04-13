import Console from "../../../Tools/Console";
import { ObjectPoolServices } from "../../../Tools/ObjectPool";
import { IAchievementsElement } from "../../../config/Achievements";
import { GameConfig } from "../../../config/GameConfig";
import GlobalData from "../../../const/GlobalData";
import AchievementMain_Generate from "../../../ui-generate/module/Achievement/AchievementMain_generate";
import { Achievement } from "../AchievementData";
import AchievementModuleC from "../AchievementModuleC";

export default class AchievementPanel extends AchievementMain_Generate {
	private achievementModuleC: AchievementModuleC = null;

	private mContentCanvasSizeX: number = 0;
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

	private initDatas(): void {
		this.achievementModuleC = ModuleService.getModule(AchievementModuleC);
		this.mContentCanvasSizeX = this.mContentCanvas.size.x;
	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mCloseButton.onClicked.add(() => {
			this.hide();
		});
	}

	protected onShow(...params: any[]): void {
		Console.error("[AchievementPanel--onShow]");
		this.updatePanelData();
	}

	protected onHide(): void {
		Console.error("[AchievementPanel--onHide]");
		this.recycleAchievementItems();
	}

	private achievementItems: AchievementItem[] = [];

	/**更新面板数据 */
	private updatePanelData() {
		this.currentItemIndex = 0;
		this.mScrollBox.scrollOffset = 0;
		this.mContentCanvas.position = mw.Vector2.zero;
		this.mContentCanvas.size = new mw.Vector(this.mContentCanvasSizeX, 0);

		let achievementGradeMap = this.achievementModuleC.getAchievementGradeMap();
		let onCompleteAchievement: Achievement[] = [];
		for (let [key, value] of achievementGradeMap) {
			for (let i = 0; i < value.length; ++i) {
				if (value[i].isOnComplete) {
					onCompleteAchievement.push(value[i]); continue;
				}
				this.sapwnAchievementItems(value[i]);
			}
		}
		for (let i = 0; i < onCompleteAchievement.length; ++i) {
			this.sapwnAchievementItems(onCompleteAchievement[i]);
		}
		this.mContentCanvas.size = new mw.Vector(this.mContentCanvasSizeX,
			this.currentItemIndex * GlobalData.itemPositionInterval);
		Console.error("[this.currentItemIndex] = ", this.currentItemIndex);
	}

	/**生成成就Item */
	private sapwnAchievementItems(achievement: Achievement): void {
		let achievementItem = ObjectPoolServices.getPool(AchievementItem).spawn();
		achievementItem.initAchievementItemData(achievement);
		this.mContentCanvas.addChild(achievementItem.achievementItem);
		achievementItem.achievementItem.position = this.getCurrentItemPosition();
		//TODO--achievementItem.achievementItem.size = new mw.Vector2(260, 260);
		this.achievementItems.push(achievementItem);
	}

	private currentItemIndex: number = 0;
	private getCurrentItemPosition(): mw.Vector2 {
		return new mw.Vector2(0, this.currentItemIndex++ * GlobalData.itemPositionInterval);
	}

	/**回收成就item */
	private recycleAchievementItems(): void {
		if (this.achievementItems.length <= 0) return;
		for (let i = 0; i < this.achievementItems.length; ++i) {
			this.achievementItems[i].recycle();
			this.mRecycleCanvas.addChild(this.achievementItems[i].achievementItem);
		}
		this.achievementItems.length = 0;
	}
}

/**二级背包列表 */
class AchievementItem {
	public achievementItem: mw.UserWidgetPrefab;

	/**内容介绍 */
	public mText_AMdetial: mw.TextBlock = undefined;
	/**背景 */
	public mImage_GradeBG: mw.Image = undefined;
	/**BG */
	public mBgImage_1: mw.Image = undefined;
	/**进度条 */
	public mProgressBar: mw.ProgressBar = undefined;
	/**难易程度类型 */
	public mText_Grade: mw.TextBlock = undefined;
	/**当前任务名字 */
	public mText_AMname: mw.TextBlock = undefined;
	/**下一个任务显示的Canvas */
	public mCanvas_Pointto: mw.Canvas = undefined;
	/**下一个任务的名字 */
	public mText_NextLevel: mw.TextBlock = undefined;
	/**指向下一个任务的箭头 */
	public mImage_Point: mw.Image = undefined;
	/**进度百分比 */
	public mText_lording: mw.TextBlock = undefined;

	/**生成Item */
	constructor() {
		this.achievementItem = mw.createUIByName("module/Achievement/AchievementItem");

		this.mText_AMdetial = this.achievementItem.findChildByPath("RootCanvas/Canvas/DetailCanvas/mText_AMdetial") as mw.TextBlock;
		this.mText_Grade = this.achievementItem.findChildByPath("RootCanvas/Canvas/mText_Grade") as mw.TextBlock;
		this.mBgImage_1 = this.achievementItem.findChildByPath("RootCanvas/Canvas/DetailCanvas/mBgImage_1") as mw.Image;
		this.mText_AMname = this.achievementItem.findChildByPath("RootCanvas/Canvas/mText_AMname") as mw.TextBlock;
		this.mCanvas_Pointto = this.achievementItem.findChildByPath("RootCanvas/Canvas/mCanvas_Pointto") as mw.Canvas;
		this.mText_NextLevel = this.achievementItem.findChildByPath("RootCanvas/Canvas/mCanvas_Pointto/mText_NextLevel") as mw.TextBlock;
		this.mImage_Point = this.achievementItem.findChildByPath("RootCanvas/Canvas/mCanvas_Pointto/mImage_Point") as mw.Image;
		this.mText_lording = this.achievementItem.findChildByPath("RootCanvas/Canvas/mText_lording") as mw.TextBlock;
		this.mImage_GradeBG = this.achievementItem.findChildByPath("RootCanvas/Canvas/mImage_GradeBG") as mw.Image;
		this.mProgressBar = this.achievementItem.findChildByPath("RootCanvas/Canvas/mProgressBar") as mw.ProgressBar;
	}

	/**填充item数据 */
	public initAchievementItemData(achievement: Achievement): void {
		let achievementsElement = GameConfig.Achievements.getElement(achievement.achId);
		let st = achievementsElement.AMdetail;
		switch (achievementsElement.RewardType) {
			case 1:
				st += "，奖励等级+" + achievementsElement.RewardNum;
				break;
			case 2:
				st += "，奖励血量+" + achievementsElement.RewardNum;
				break;
			case 3:
				st += "，奖励攻击力+" + achievementsElement.RewardNum;
				break;
			default:
				break;
		}
		this.mText_AMdetial.text = st;
		let gradeType = (achievement.isOnComplete) ? GradeType.Complete : achievementsElement.Grade;
		this.updateGradeBGColorAndText(gradeType);
		this.updateAchievementProgressAndName(achievement, achievementsElement);
	}

	/**根据难易程度更新背景颜色 */
	private updateGradeBGColorAndText(gradeType: GradeType): void {
		let gradeBGColor: number[] = [];
		let gradeText: string = "";
		switch (gradeType) {
			case GradeType.Easy:
				gradeBGColor = GlobalData.easyImageBgColor;
				gradeText = "容易";
				break;
			case GradeType.Simple:
				gradeBGColor = GlobalData.simpleImageBgColor;
				gradeText = "简单";
				break;
			case GradeType.Medium:
				gradeBGColor = GlobalData.mediumImageBgColor;
				gradeText = "中等";
				break;
			case GradeType.Difficult:
				gradeBGColor = GlobalData.difficultImageBgColor;
				gradeText = "困难";
				break;
			case GradeType.Crazy:
				gradeBGColor = GlobalData.crazyImageBgColor;
				gradeText = "疯狂";
				break;
			case GradeType.Complete:
				gradeBGColor = GlobalData.completeImageBgColor;
				gradeText = "完成";
				break;
			default:
				break;
		}
		this.mImage_GradeBG.setImageColorDecimal(gradeBGColor[0], gradeBGColor[1], gradeBGColor[2], gradeBGColor[3]);
		this.mBgImage_1.setImageColorDecimal(gradeBGColor[0], gradeBGColor[1], gradeBGColor[2], gradeBGColor[3]);
		this.mText_Grade.text = gradeText;
	}

	/**更新进度条和成就名字 */
	private updateAchievementProgressAndName(achievement: Achievement, achievementsElement: IAchievementsElement): void {
		if (achievement.isOnComplete) {
			this.mProgressBar.visibility = mw.SlateVisibility.Collapsed;
			this.mText_lording.visibility = mw.SlateVisibility.Collapsed;
			this.mCanvas_Pointto.visibility = mw.SlateVisibility.Collapsed;

			this.mText_AMname.text = achievementsElement.Name;
		}
		else {
			this.mProgressBar.visibility = mw.SlateVisibility.HitTestInvisible;
			this.mText_lording.visibility = mw.SlateVisibility.SelfHitTestInvisible;

			let currentValue = 0;
			if (achievementsElement.TragetNum == 0) {
				currentValue = 0;
			}
			else {
				currentValue = achievement.progress / achievementsElement.TragetNum;
			}
			this.mProgressBar.currentValue = currentValue;
			this.mText_lording.text = Math.round(currentValue * 100) + "%";
			this.mText_AMname.text = achievementsElement.Name;
			if (achievementsElement.NextId) {
				this.mText_NextLevel.text = GameConfig.Achievements.getElement(achievementsElement.NextId).Name;
				this.mCanvas_Pointto.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			}
			else {
				this.mCanvas_Pointto.visibility = mw.SlateVisibility.Collapsed;
			}
		}
	}

	/**回收 */
	public recycle(): void {
		ObjectPoolServices.getPool(AchievementItem).return(this);
	}
}

export enum GradeType {
	/**容易 */
	Easy = 1,
	/**简单 */
	Simple = 2,
	/**中等 */
	Medium = 3,
	/**困难 */
	Difficult = 4,
	/**疯狂 */
	Crazy = 5,
	/**已完成 */
	Complete = 6,
}