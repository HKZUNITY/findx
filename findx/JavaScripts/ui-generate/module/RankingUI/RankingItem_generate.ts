/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/RankingUI/RankingItem.ui
 * TIME: 2023.10.21-10.15.16
 */
 
@UIBind('UI/module/RankingUI/RankingItem.ui')
export default class RankingItem_Generate extends UIScript {
		private mRankingTxt_Internal: mw.TextBlock
	public get mRankingTxt(): mw.TextBlock {
		if(!this.mRankingTxt_Internal&&this.uiWidgetBase) {
			this.mRankingTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas/mRankingTxt') as mw.TextBlock
		}
		return this.mRankingTxt_Internal
	}
	private mSelfNameTxt_Internal: mw.TextBlock
	public get mSelfNameTxt(): mw.TextBlock {
		if(!this.mSelfNameTxt_Internal&&this.uiWidgetBase) {
			this.mSelfNameTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas/mSelfNameTxt') as mw.TextBlock
		}
		return this.mSelfNameTxt_Internal
	}
	private mMaxHeightTxt_Internal: mw.TextBlock
	public get mMaxHeightTxt(): mw.TextBlock {
		if(!this.mMaxHeightTxt_Internal&&this.uiWidgetBase) {
			this.mMaxHeightTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas/mMaxHeightTxt') as mw.TextBlock
		}
		return this.mMaxHeightTxt_Internal
	}
	private mKillCountTxt_Internal: mw.TextBlock
	public get mKillCountTxt(): mw.TextBlock {
		if(!this.mKillCountTxt_Internal&&this.uiWidgetBase) {
			this.mKillCountTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas/mKillCountTxt') as mw.TextBlock
		}
		return this.mKillCountTxt_Internal
	}
	private mScoreTxt_Internal: mw.TextBlock
	public get mScoreTxt(): mw.TextBlock {
		if(!this.mScoreTxt_Internal&&this.uiWidgetBase) {
			this.mScoreTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas/mScoreTxt') as mw.TextBlock
		}
		return this.mScoreTxt_Internal
	}
	private mContainerCanvas_Internal: mw.Canvas
	public get mContainerCanvas(): mw.Canvas {
		if(!this.mContainerCanvas_Internal&&this.uiWidgetBase) {
			this.mContainerCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mContainerCanvas') as mw.Canvas
		}
		return this.mContainerCanvas_Internal
	}


	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		//按钮添加点击
		
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mRankingTxt)
		
	
		this.initLanguage(this.mSelfNameTxt)
		
	
		this.initLanguage(this.mMaxHeightTxt)
		
	
		this.initLanguage(this.mKillCountTxt)
		
	
		this.initLanguage(this.mScoreTxt)
		
	
		//文本多语言
		
	}
	
	/*初始化多语言*/
	private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }

	protected onShow(...params: any[]): void {};

	/*显示panel*/
    public show(...param): void {
		mw.UIService.showUI(this, this.layer, ...param);
	}

	/*隐藏panel*/
    public hide(): void {
		mw.UIService.hideUI(this);
	}
 }
 