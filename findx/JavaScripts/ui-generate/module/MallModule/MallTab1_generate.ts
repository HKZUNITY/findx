/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/MallTab1.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/MallTab1.ui')
export default class MallTab1_Generate extends UIScript {
		private mTab1Canvas_Internal: mw.Canvas
	public get mTab1Canvas(): mw.Canvas {
		if(!this.mTab1Canvas_Internal&&this.uiWidgetBase) {
			this.mTab1Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab1Canvas') as mw.Canvas
		}
		return this.mTab1Canvas_Internal
	}
	private mTab1Button_Internal: mw.Button
	public get mTab1Button(): mw.Button {
		if(!this.mTab1Button_Internal&&this.uiWidgetBase) {
			this.mTab1Button_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab1Canvas/mTab1Button') as mw.Button
		}
		return this.mTab1Button_Internal
	}
	private mTab1TextBlock_Internal: mw.TextBlock
	public get mTab1TextBlock(): mw.TextBlock {
		if(!this.mTab1TextBlock_Internal&&this.uiWidgetBase) {
			this.mTab1TextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab1Canvas/mTab1TextBlock') as mw.TextBlock
		}
		return this.mTab1TextBlock_Internal
	}
	private mSelectTab1Canvas_Internal: mw.Canvas
	public get mSelectTab1Canvas(): mw.Canvas {
		if(!this.mSelectTab1Canvas_Internal&&this.uiWidgetBase) {
			this.mSelectTab1Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab1Canvas/mSelectTab1Canvas') as mw.Canvas
		}
		return this.mSelectTab1Canvas_Internal
	}
	private mSelectTab1BgImage_Internal: mw.Image
	public get mSelectTab1BgImage(): mw.Image {
		if(!this.mSelectTab1BgImage_Internal&&this.uiWidgetBase) {
			this.mSelectTab1BgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mTab1Canvas/mSelectTab1Canvas/mSelectTab1BgImage') as mw.Image
		}
		return this.mSelectTab1BgImage_Internal
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
		
		this.mTab1Button.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mTab1Button");
		});
		this.mTab1Button.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTab1TextBlock)
		
	
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
 