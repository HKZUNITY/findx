/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/common/notice/SecondNoticeItem.ui
 * TIME: 2024.05.19-23.41.25
 */
 
@UIBind('UI/common/notice/SecondNoticeItem.ui')
export default class SecondNoticeItem_Generate extends UIScript {
		private txt_context_Internal: mw.TextBlock
	public get txt_context(): mw.TextBlock {
		if(!this.txt_context_Internal&&this.uiWidgetBase) {
			this.txt_context_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/txt_context') as mw.TextBlock
		}
		return this.txt_context_Internal
	}
	private icon_Internal: mw.Image
	public get icon(): mw.Image {
		if(!this.icon_Internal&&this.uiWidgetBase) {
			this.icon_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/icon') as mw.Image
		}
		return this.icon_Internal
	}
	private effect_Internal: mw.Image
	public get effect(): mw.Image {
		if(!this.effect_Internal&&this.uiWidgetBase) {
			this.effect_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/effect') as mw.Image
		}
		return this.effect_Internal
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
		
		this.initLanguage(this.txt_context)
		
	
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
 