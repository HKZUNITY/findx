/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/MallTab3.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/MallTab3.ui')
export default class MallTab3_Generate extends UIScript {
		private mTab3Canvas_Internal: mw.Canvas
	public get mTab3Canvas(): mw.Canvas {
		if(!this.mTab3Canvas_Internal&&this.uiWidgetBase) {
			this.mTab3Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab3Canvas') as mw.Canvas
		}
		return this.mTab3Canvas_Internal
	}
	private mTab3Button_Internal: mw.Button
	public get mTab3Button(): mw.Button {
		if(!this.mTab3Button_Internal&&this.uiWidgetBase) {
			this.mTab3Button_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab3Canvas/mTab3Button') as mw.Button
		}
		return this.mTab3Button_Internal
	}
	private mTab3TextBlock_Internal: mw.TextBlock
	public get mTab3TextBlock(): mw.TextBlock {
		if(!this.mTab3TextBlock_Internal&&this.uiWidgetBase) {
			this.mTab3TextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab3Canvas/mTab3TextBlock') as mw.TextBlock
		}
		return this.mTab3TextBlock_Internal
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
		
		this.mTab3Button.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mTab3Button");
		});
		this.mTab3Button.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTab3TextBlock)
		
	
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
 