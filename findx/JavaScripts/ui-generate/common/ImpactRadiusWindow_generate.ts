/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/common/ImpactRadiusWindow.ui
 * TIME: 2024.05.24-23.38.06
 */
 
@UIBind('UI/common/ImpactRadiusWindow.ui')
export default class ImpactRadiusWindow_Generate extends UIScript {
		private img_Internal: mw.Image
	public get img(): mw.Image {
		if(!this.img_Internal&&this.uiWidgetBase) {
			this.img_Internal = this.uiWidgetBase.findChildByPath('MWCanvas_2147482460/img') as mw.Image
		}
		return this.img_Internal
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
 