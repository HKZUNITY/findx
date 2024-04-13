
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.22-22.17.26
 */

import GlobalData from "../../../const/GlobalData";
import FirstGamePanel_Generate from "../../../ui-generate/common/FirstGamePanel_generate";
import GuidePanel_Generate from "../../../ui-generate/module/HUDUI/GuidePanel_generate";
import CollectionModuleC from "../../CollectionMOdule/CollectionModuleC";
import CollectionPanel from "../../CollectionMOdule/ui/CollectionPanel";
import HUDModuleC from "../HUDModuleC";

export default class GuidePanel extends GuidePanel_Generate {
	private hudModuleC: HUDModuleC = null;
	/**下一个界面 */
	public onNextAction: Action = new Action();
	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		this.initData();
		this.bindButton();
		this.registerAction();
	}

	private roleImages: string[] = [];
	private roleImageLen: number = 0;
	private curRoleImageIndex: number = 0;

	private tipText: string[] = [
		"这里是属于你的个人演唱会，在舞台上尽情展示你的风采吧~",
		"这里是跳舞PK现场，加入他们，赢得接下来的比赛吧~",
		"这里是休息区，可以躺在椅子一边沐浴阳光，一边欣赏舞台上的风采。",
		"这里是聊天区，你可以在这里交到很多游戏好朋友，快点加入他们吧~",
		"这个是豪华的摩天轮，带上你的好朋友快来坐一坐免费的摩天轮吧~",
		"这个是豪华的旋转木马，带上你的游戏好友快来享受快乐吧~",
		"这个是高级蹦床，反复跳跃会越跳越高，小心跳出宇宙哦~带上你的游戏好友来尝试跳出宇宙吧~",
		"这个是能把人物击飞的旋转闸刀，千万不要触碰它们哟~",
		"听说这里的大炮可以把人物当作子弹发射出去、快带上你的游戏好友来试试吧~",
		"周围全部都是带电的围栏，千万不要触碰它们。周围布满了传送门，进入传送门会被传送到魔兽山脉，可以寻找斗技、功法、丹药和异火来帮助你升级哟~",
		"这里就是魔兽山脉，这里可以获得斗技、功法、丹药、异火，可以帮助你快速晋级到斗帝哟~",
		"魔兽山脉遍地都是宝贝，快通过传送门到这里寻找宝藏吧，记得带上你的游戏好友一起寻找哟~",
		"游戏中还有很多好玩的功能，比如右上角的商店里面可以使用各种各样的武器，漂亮帅气的服装，绚丽多彩的翅膀和拖尾。还有排行榜，可以查看自己在游戏中的所有玩家中的排名。还有图鉴里面可以查看所有的斗技、功法、丹药和异火。背景音乐可以自由切换等等。带上你的好友快来体验游戏中的乐趣吧。"
	];
	private tipTextLen: number = 0;
	private curTipTextLen: number = 0;

	/**初始化数据 */
	private initData(): void {
		this.hudModuleC = ModuleService.getModule(HUDModuleC);
		this.roleImages = GlobalData.roleImages.split(',');
		this.roleImageLen = this.roleImages.length;
		this.tipTextLen = this.tipText.length;
	}
	private isCanNext: boolean = true;

	/**按钮绑定 */
	private bindButton(): void {
		this.mNextBtn.onClicked.add(() => {
			if (!this.isCanNext) return;
			this.isCanNext = false;
			TimeUtil.delaySecond(1.5).then(() => {
				this.isCanNext = true;
			});
			this.onNextAction.call();
		});
	}

	/**注册事件 */
	private registerAction(): void {
		this.onNextAction.add(() => {
			if (this.curTipTextLen >= this.tipTextLen) {
				this.hide();
				this.hudModuleC.onOpenPetAction.call();
				this.hudModuleC.onOpenSignInAction1.call();
				// mw.UIService.getUI(CollectionPanel).onFindTipsAction.call(1);
				ModuleService.getModule(CollectionModuleC).startGuide(2);
				this.hudModuleC.firstGame();
				this.hudModuleC.setCurAttackValue(500);
				this.hudModuleC.setMaxHp(10000);
				let f = mw.UIService.getUI(FirstGamePanel_Generate);
				f.show();
				f.mCloseButton.onClicked.add(() => {
					f.hide();
				});
				return;
			}
			this.mRoleBgImage.imageGuid = this.roleImages[this.curRoleImageIndex++];
			if (this.curRoleImageIndex >= this.roleImageLen - 1) {
				this.curRoleImageIndex = 0;
			}
			this.mTipsText.text = this.tipText[this.curTipTextLen++];
		});
	}
}
