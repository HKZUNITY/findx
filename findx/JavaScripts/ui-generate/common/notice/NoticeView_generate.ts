/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/common/notice/NoticeView.ui
 * TIME: 2024.12.31-21.32.41
 */
 
@UIBind('UI/common/notice/NoticeView.ui')
export default class NoticeView_Generate extends UIScript {
		private con_top_notice_Internal: mw.Canvas
	public get con_top_notice(): mw.Canvas {
		if(!this.con_top_notice_Internal&&this.uiWidgetBase) {
			this.con_top_notice_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/con_top_notice') as mw.Canvas
		}
		return this.con_top_notice_Internal
	}
	private con_second_notice_Internal: mw.Canvas
	public get con_second_notice(): mw.Canvas {
		if(!this.con_second_notice_Internal&&this.uiWidgetBase) {
			this.con_second_notice_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/con_second_notice') as mw.Canvas
		}
		return this.con_second_notice_Internal
	}
	private con_top_notice_2_Internal: mw.Canvas
	public get con_top_notice_2(): mw.Canvas {
		if(!this.con_top_notice_2_Internal&&this.uiWidgetBase) {
			this.con_top_notice_2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/con_top_notice_2') as mw.Canvas
		}
		return this.con_top_notice_2_Internal
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
 