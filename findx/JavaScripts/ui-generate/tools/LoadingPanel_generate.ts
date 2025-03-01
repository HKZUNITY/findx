/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/tools/LoadingPanel.ui
 * TIME: 2025.03.01-12.24.15
 */
 
@UIBind('UI/tools/LoadingPanel.ui')
export default class LoadingPanel_Generate extends UIScript {
		private mMainCanvas_Internal: mw.Canvas
	public get mMainCanvas(): mw.Canvas {
		if(!this.mMainCanvas_Internal&&this.uiWidgetBase) {
			this.mMainCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mMainCanvas') as mw.Canvas
		}
		return this.mMainCanvas_Internal
	}
	private mLoadingImage_Internal: mw.Image
	public get mLoadingImage(): mw.Image {
		if(!this.mLoadingImage_Internal&&this.uiWidgetBase) {
			this.mLoadingImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mMainCanvas/mLoadingImage') as mw.Image
		}
		return this.mLoadingImage_Internal
	}
	private mLoadingTextblock_Internal: mw.TextBlock
	public get mLoadingTextblock(): mw.TextBlock {
		if(!this.mLoadingTextblock_Internal&&this.uiWidgetBase) {
			this.mLoadingTextblock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mMainCanvas/mLoadingTextblock') as mw.TextBlock
		}
		return this.mLoadingTextblock_Internal
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
		
		this.initLanguage(this.mLoadingTextblock)
		
	
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
 