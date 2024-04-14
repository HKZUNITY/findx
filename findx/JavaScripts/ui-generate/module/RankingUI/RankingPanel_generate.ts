/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/RankingUI/RankingPanel.ui
 * TIME: 2024.04.14-22.02.14
 */
 
@UIBind('UI/module/RankingUI/RankingPanel.ui')
export default class RankingPanel_Generate extends UIScript {
		private mTitle_txt_Internal: mw.TextBlock
	public get mTitle_txt(): mw.TextBlock {
		if(!this.mTitle_txt_Internal&&this.uiWidgetBase) {
			this.mTitle_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mTitle_txt') as mw.TextBlock
		}
		return this.mTitle_txt_Internal
	}
	private mFieldName_Internal: mw.Canvas
	public get mFieldName(): mw.Canvas {
		if(!this.mFieldName_Internal&&this.uiWidgetBase) {
			this.mFieldName_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName') as mw.Canvas
		}
		return this.mFieldName_Internal
	}
	private mField1_txt_Internal: mw.TextBlock
	public get mField1_txt(): mw.TextBlock {
		if(!this.mField1_txt_Internal&&this.uiWidgetBase) {
			this.mField1_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName/mField1_txt') as mw.TextBlock
		}
		return this.mField1_txt_Internal
	}
	private mField2_txt_Internal: mw.TextBlock
	public get mField2_txt(): mw.TextBlock {
		if(!this.mField2_txt_Internal&&this.uiWidgetBase) {
			this.mField2_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName/mField2_txt') as mw.TextBlock
		}
		return this.mField2_txt_Internal
	}
	private mField3_txt_Internal: mw.TextBlock
	public get mField3_txt(): mw.TextBlock {
		if(!this.mField3_txt_Internal&&this.uiWidgetBase) {
			this.mField3_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName/mField3_txt') as mw.TextBlock
		}
		return this.mField3_txt_Internal
	}
	private mField4_txt_Internal: mw.TextBlock
	public get mField4_txt(): mw.TextBlock {
		if(!this.mField4_txt_Internal&&this.uiWidgetBase) {
			this.mField4_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName/mField4_txt') as mw.TextBlock
		}
		return this.mField4_txt_Internal
	}
	private mField5_txt_Internal: mw.TextBlock
	public get mField5_txt(): mw.TextBlock {
		if(!this.mField5_txt_Internal&&this.uiWidgetBase) {
			this.mField5_txt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mFieldName/mField5_txt') as mw.TextBlock
		}
		return this.mField5_txt_Internal
	}
	private mContent_Internal: mw.Canvas
	public get mContent(): mw.Canvas {
		if(!this.mContent_Internal&&this.uiWidgetBase) {
			this.mContent_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/ScrollView/mContent') as mw.Canvas
		}
		return this.mContent_Internal
	}
	private mSelfList_Internal: mw.Canvas
	public get mSelfList(): mw.Canvas {
		if(!this.mSelfList_Internal&&this.uiWidgetBase) {
			this.mSelfList_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList') as mw.Canvas
		}
		return this.mSelfList_Internal
	}
	private mRankingTxt_Internal: mw.TextBlock
	public get mRankingTxt(): mw.TextBlock {
		if(!this.mRankingTxt_Internal&&this.uiWidgetBase) {
			this.mRankingTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList/mRankingTxt') as mw.TextBlock
		}
		return this.mRankingTxt_Internal
	}
	private mSelfNameTxt_Internal: mw.TextBlock
	public get mSelfNameTxt(): mw.TextBlock {
		if(!this.mSelfNameTxt_Internal&&this.uiWidgetBase) {
			this.mSelfNameTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList/mSelfNameTxt') as mw.TextBlock
		}
		return this.mSelfNameTxt_Internal
	}
	private mMaxHeightTxt_Internal: mw.TextBlock
	public get mMaxHeightTxt(): mw.TextBlock {
		if(!this.mMaxHeightTxt_Internal&&this.uiWidgetBase) {
			this.mMaxHeightTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList/mMaxHeightTxt') as mw.TextBlock
		}
		return this.mMaxHeightTxt_Internal
	}
	private mKillCountTxt_Internal: mw.TextBlock
	public get mKillCountTxt(): mw.TextBlock {
		if(!this.mKillCountTxt_Internal&&this.uiWidgetBase) {
			this.mKillCountTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList/mKillCountTxt') as mw.TextBlock
		}
		return this.mKillCountTxt_Internal
	}
	private mScoreTxt_Internal: mw.TextBlock
	public get mScoreTxt(): mw.TextBlock {
		if(!this.mScoreTxt_Internal&&this.uiWidgetBase) {
			this.mScoreTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSelfList/mScoreTxt') as mw.TextBlock
		}
		return this.mScoreTxt_Internal
	}
	private mClose_btn_Internal: mw.StaleButton
	public get mClose_btn(): mw.StaleButton {
		if(!this.mClose_btn_Internal&&this.uiWidgetBase) {
			this.mClose_btn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mClose_btn') as mw.StaleButton
		}
		return this.mClose_btn_Internal
	}
	private mRankTypeText_Internal: mw.TextBlock
	public get mRankTypeText(): mw.TextBlock {
		if(!this.mRankTypeText_Internal&&this.uiWidgetBase) {
			this.mRankTypeText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/RightCanvas/RankTypeCanvas/mRankTypeText') as mw.TextBlock
		}
		return this.mRankTypeText_Internal
	}
	private mMaxHeightBtn_Internal: mw.Button
	public get mMaxHeightBtn(): mw.Button {
		if(!this.mMaxHeightBtn_Internal&&this.uiWidgetBase) {
			this.mMaxHeightBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/RightCanvas/RankMaxHeightCanvas/mMaxHeightBtn') as mw.Button
		}
		return this.mMaxHeightBtn_Internal
	}
	private mKillCountBtn_Internal: mw.Button
	public get mKillCountBtn(): mw.Button {
		if(!this.mKillCountBtn_Internal&&this.uiWidgetBase) {
			this.mKillCountBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/RightCanvas/RankKillCountCanvas/mKillCountBtn') as mw.Button
		}
		return this.mKillCountBtn_Internal
	}
	private mScoreBtn_Internal: mw.Button
	public get mScoreBtn(): mw.Button {
		if(!this.mScoreBtn_Internal&&this.uiWidgetBase) {
			this.mScoreBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/RightCanvas/RankScoreCanvas/mScoreBtn') as mw.Button
		}
		return this.mScoreBtn_Internal
	}


	protected onAwake() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		this.initButtons();
	}
	protected initButtons() {
		//按钮添加点击
		
		this.mClose_btn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClose_btn");
		});
		this.initLanguage(this.mClose_btn);
		this.mClose_btn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮添加点击
		
		this.mMaxHeightBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mMaxHeightBtn");
		});
		this.mMaxHeightBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mKillCountBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mKillCountBtn");
		});
		this.mKillCountBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mScoreBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mScoreBtn");
		});
		this.mScoreBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTitle_txt)
		
	
		this.initLanguage(this.mField1_txt)
		
	
		this.initLanguage(this.mField2_txt)
		
	
		this.initLanguage(this.mField3_txt)
		
	
		this.initLanguage(this.mField4_txt)
		
	
		this.initLanguage(this.mField5_txt)
		
	
		this.initLanguage(this.mRankingTxt)
		
	
		this.initLanguage(this.mSelfNameTxt)
		
	
		this.initLanguage(this.mMaxHeightTxt)
		
	
		this.initLanguage(this.mKillCountTxt)
		
	
		this.initLanguage(this.mScoreTxt)
		
	
		this.initLanguage(this.mRankTypeText)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/RightCanvas/RankTypeCanvas/RankTypeText") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/RightCanvas/RankMaxHeightCanvas/mMaxHeightBtn/MaxHieghtText") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/RightCanvas/RankKillCountCanvas/mKillCountBtn/KillCountText") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/RightCanvas/RankScoreCanvas/mScoreBtn/ScoreText") as any);
		
	
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
 