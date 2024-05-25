/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/HUDUI/Lifebar.ui
 * TIME: 2024.05.25-14.47.28
 */
 
@UIBind('UI/module/HUDUI/Lifebar.ui')
export default class Lifebar_Generate extends UIScript {
		private mLevelText_Internal: mw.TextBlock
	public get mLevelText(): mw.TextBlock {
		if(!this.mLevelText_Internal&&this.uiWidgetBase) {
			this.mLevelText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mLevelText') as mw.TextBlock
		}
		return this.mLevelText_Internal
	}
	private mNameText_Internal: mw.TextBlock
	public get mNameText(): mw.TextBlock {
		if(!this.mNameText_Internal&&this.uiWidgetBase) {
			this.mNameText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mNameText') as mw.TextBlock
		}
		return this.mNameText_Internal
	}
	private mLifebar_Internal: mw.ProgressBar
	public get mLifebar(): mw.ProgressBar {
		if(!this.mLifebar_Internal&&this.uiWidgetBase) {
			this.mLifebar_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/mLifebar') as mw.ProgressBar
		}
		return this.mLifebar_Internal
	}
	private mLifeText_Internal: mw.TextBlock
	public get mLifeText(): mw.TextBlock {
		if(!this.mLifeText_Internal&&this.uiWidgetBase) {
			this.mLifeText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/Canvas_1/mLifeText') as mw.TextBlock
		}
		return this.mLifeText_Internal
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
		
		this.initLanguage(this.mLevelText)
		
	
		this.initLanguage(this.mNameText)
		
	
		this.initLanguage(this.mLifeText)
		
	
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
 