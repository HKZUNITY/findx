/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/PlayerModule/LevelPanel.ui
 * TIME: 2024.08.04-18.39.54
 */
 
@UIBind('UI/module/PlayerModule/LevelPanel.ui')
export default class LevelPanel_Generate extends UIScript {
		private mTextBlock_Internal: mw.TextBlock
	public get mTextBlock(): mw.TextBlock {
		if(!this.mTextBlock_Internal&&this.uiWidgetBase) {
			this.mTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTextBlock') as mw.TextBlock
		}
		return this.mTextBlock_Internal
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
		
		this.initLanguage(this.mTextBlock)
		
	
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
 