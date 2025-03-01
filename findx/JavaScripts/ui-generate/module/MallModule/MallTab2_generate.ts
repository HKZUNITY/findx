/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/MallTab2.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/MallTab2.ui')
export default class MallTab2_Generate extends UIScript {
		private mTab2Canvas_Internal: mw.Canvas
	public get mTab2Canvas(): mw.Canvas {
		if(!this.mTab2Canvas_Internal&&this.uiWidgetBase) {
			this.mTab2Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab2Canvas') as mw.Canvas
		}
		return this.mTab2Canvas_Internal
	}
	private mTab2Button_Internal: mw.Button
	public get mTab2Button(): mw.Button {
		if(!this.mTab2Button_Internal&&this.uiWidgetBase) {
			this.mTab2Button_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab2Canvas/mTab2Button') as mw.Button
		}
		return this.mTab2Button_Internal
	}
	private mTab2TextBlock_Internal: mw.TextBlock
	public get mTab2TextBlock(): mw.TextBlock {
		if(!this.mTab2TextBlock_Internal&&this.uiWidgetBase) {
			this.mTab2TextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab2Canvas/mTab2TextBlock') as mw.TextBlock
		}
		return this.mTab2TextBlock_Internal
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
		
		this.mTab2Button.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mTab2Button");
		});
		this.mTab2Button.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTab2TextBlock)
		
	
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
 