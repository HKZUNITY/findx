/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/HUDUI/GuidePanel.ui
 * TIME: 2024.05.25-14.47.28
 */
 
@UIBind('UI/module/HUDUI/GuidePanel.ui')
export default class GuidePanel_Generate extends UIScript {
		private mRoleBgImage_Internal: mw.Image
	public get mRoleBgImage(): mw.Image {
		if(!this.mRoleBgImage_Internal&&this.uiWidgetBase) {
			this.mRoleBgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mRoleBgImage') as mw.Image
		}
		return this.mRoleBgImage_Internal
	}
	private mTipsText_Internal: mw.TextBlock
	public get mTipsText(): mw.TextBlock {
		if(!this.mTipsText_Internal&&this.uiWidgetBase) {
			this.mTipsText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mTipsText') as mw.TextBlock
		}
		return this.mTipsText_Internal
	}
	private mNextBtn_Internal: mw.Button
	public get mNextBtn(): mw.Button {
		if(!this.mNextBtn_Internal&&this.uiWidgetBase) {
			this.mNextBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mNextBtn') as mw.Button
		}
		return this.mNextBtn_Internal
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
		
		this.mNextBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mNextBtn");
		});
		this.mNextBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTipsText)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/TextBlock") as any);
		
	
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
 