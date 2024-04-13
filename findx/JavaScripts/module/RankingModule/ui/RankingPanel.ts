import Console from "../../../Tools/Console";
import { ObjectPoolServices } from "../../../Tools/ObjectPool";
import GlobalData from "../../../const/GlobalData";
import RankingPanel_Generate from "../../../ui-generate/module/RankingUI/RankingPanel_generate";
import { RankType } from "../RankingModuleC";
import { PlayerData } from "../RankingModuleS";

/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.04.08-17.56.43
 */
export default class RankingPanel extends RankingPanel_Generate {
	private rankingItems: RankingItem[] = [];

	/**排行模式 */
	public onRankTypeAction: Action1<RankType> = new Action1<RankType>();

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
		Console.error("初始化排行榜");
		for (let i = 0; i < GlobalData.rankingNumber; ++i) {
			let rankingItem = ObjectPoolServices.getPool(RankingItem).spawn();
			this.mContent.addChild(rankingItem.rankingItem);
			rankingItem.rankingItem.visibility = mw.SlateVisibility.Collapsed;
			this.rankingItems.push(rankingItem);
		}

		this.initPanelTxt();
	}

	/**初始化界面 */
	private initPanelTxt(): void {
		this.mTitle_txt.text = "排行榜";
		this.mField1_txt.text = "排名";
		this.mField2_txt.text = "昵称";
		this.mField3_txt.text = "历史最高";
		this.mField4_txt.text = "击杀人数";
		this.mField5_txt.text = "等级";
	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mClose_btn.onClicked.add(() => {
			this.hide();
		});

		this.mMaxHeightBtn.onClicked.add(() => {
			this.onRankTypeAction.call(RankType.MaxHeight);
			this.mRankTypeText.text = "历史最高";
		});
		this.mKillCountBtn.onClicked.add(() => {
			this.onRankTypeAction.call(RankType.KillCount);
			this.mRankTypeText.text = "击杀人数";
		});
		this.mScoreBtn.onClicked.add(() => {
			this.onRankTypeAction.call(RankType.Score);
			this.mRankTypeText.text = "等级";
		});
	}

	/**重新排名 */
	public rerank(playerDatas: PlayerData[], playerData: PlayerData, ranking: number): void {
		this.refreshRank(playerDatas);
		this.refreshSelf(playerData, ranking);
	}

	/**刷新排行榜（前多少名） */
	private refreshRank(playerDatas: PlayerData[]): void {
		Console.error("几个人：" + playerDatas.length);
		for (let i = 0; i < playerDatas.length; ++i) {
			this.rankingItems[i].mRankingTxt.text = "第 " + (i + 1) + " 名";
			this.rankingItems[i].mSelfNameTxt.text = playerDatas[i].playerName;
			this.rankingItems[i].mMaxHeightTxt.text = playerDatas[i].maxHeight.toString();
			this.rankingItems[i].mKillCountTxt.text = playerDatas[i].killCount.toString();
			this.rankingItems[i].mScoreTxt.text = playerDatas[i].score.toString();
			this.rankingItems[i].rankingItem.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		for (let i = playerDatas.length; i < GlobalData.rankingNumber; ++i) {
			this.rankingItems[i].rankingItem.visibility = mw.SlateVisibility.Collapsed;
		}
	}

	/**刷新自己的数据 */
	private refreshSelf(playerData: PlayerData, ranking: number): void {
		if (playerData == null) return;
		this.mRankingTxt.text = (ranking >= GlobalData.rankingNumber || ranking < 0) ? "未上榜" : "第 " + (ranking + 1) + " 名";
		this.mSelfNameTxt.text = playerData.playerName;
		this.mMaxHeightTxt.text = playerData.maxHeight.toString();
		this.mKillCountTxt.text = playerData.killCount.toString();
		this.mScoreTxt.text = playerData.score.toString();
	}
}

/**二级背包列表 */
class RankingItem {
	public rankingItem: mw.UserWidgetPrefab;

	public mContainerCanvas: mw.Canvas = undefined;
	public mRankingTxt: mw.TextBlock = undefined;
	public mSelfNameTxt: mw.TextBlock = undefined;
	public mMaxHeightTxt: mw.TextBlock = undefined;
	public mKillCountTxt: mw.TextBlock = undefined;
	public mScoreTxt: mw.TextBlock = undefined;

	/**生成Item */
	constructor() {
		this.rankingItem = mw.createUIByName("module/RankingUI/RankingItem");

		this.mContainerCanvas = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas") as mw.Canvas;
		this.mRankingTxt = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas/mRankingTxt") as mw.TextBlock;
		this.mSelfNameTxt = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas/mSelfNameTxt") as mw.TextBlock;
		this.mMaxHeightTxt = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas/mMaxHeightTxt") as mw.TextBlock;
		this.mKillCountTxt = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas/mKillCountTxt") as mw.TextBlock;
		this.mScoreTxt = this.rankingItem.findChildByPath("RootCanvas/mContainerCanvas/mScoreTxt") as mw.TextBlock;
	}

	/**填充数据 */
	public initData(): void {
	}

	/**回收Item */
	public recycleItem(): void {
		ObjectPoolServices.getPool(RankingItem).return(this);
	}
}