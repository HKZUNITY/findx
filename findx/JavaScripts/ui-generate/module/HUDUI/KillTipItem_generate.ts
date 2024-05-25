/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/HUDUI/KillTipItem.ui
 * TIME: 2024.05.25-14.47.28
 */
 
@UIBind('UI/module/HUDUI/KillTipItem.ui')
export default class KillTipItem_Generate extends UIScript {
		private mBgImage_Internal: mw.Image
	public get mBgImage(): mw.Image {
		if(!this.mBgImage_Internal&&this.uiWidgetBase) {
			this.mBgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBgImage') as mw.Image
		}
		return this.mBgImage_Internal
	}
	private mMainCanvas_Internal: mw.Canvas
	public get mMainCanvas(): mw.Canvas {
		if(!this.mMainCanvas_Internal&&this.uiWidgetBase) {
			this.mMainCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainCanvas') as mw.Canvas
		}
		return this.mMainCanvas_Internal
	}
	private mKillerTextBlock_Internal: mw.TextBlock
	public get mKillerTextBlock(): mw.TextBlock {
		if(!this.mKillerTextBlock_Internal&&this.uiWidgetBase) {
			this.mKillerTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainCanvas/KillerCanvas/mKillerTextBlock') as mw.TextBlock
		}
		return this.mKillerTextBlock_Internal
	}
	private mKilledTextBlock_Internal: mw.TextBlock
	public get mKilledTextBlock(): mw.TextBlock {
		if(!this.mKilledTextBlock_Internal&&this.uiWidgetBase) {
			this.mKilledTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainCanvas/KilledCanvas/mKilledTextBlock') as mw.TextBlock
		}
		return this.mKilledTextBlock_Internal
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
		
		this.initLanguage(this.mKillerTextBlock)
		
	
		this.initLanguage(this.mKilledTextBlock)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mMainCanvas/KillCanvas/KillTextBlock") as any);
		
	
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
 