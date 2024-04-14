/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/common/Test.ui
 * TIME: 2024.04.14-22.02.13
 */
 
@UIBind('UI/common/Test.ui')
export default class Test_Generate extends UIScript {
		private mInputBox_Internal: mw.InputBox
	public get mInputBox(): mw.InputBox {
		if(!this.mInputBox_Internal&&this.uiWidgetBase) {
			this.mInputBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mInputBox') as mw.InputBox
		}
		return this.mInputBox_Internal
	}
	private mButton_Internal: mw.Button
	public get mButton(): mw.Button {
		if(!this.mButton_Internal&&this.uiWidgetBase) {
			this.mButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mButton') as mw.Button
		}
		return this.mButton_Internal
	}
	private mInputBox_1_Internal: mw.InputBox
	public get mInputBox_1(): mw.InputBox {
		if(!this.mInputBox_1_Internal&&this.uiWidgetBase) {
			this.mInputBox_1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mInputBox_1') as mw.InputBox
		}
		return this.mInputBox_1_Internal
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
		
		this.mButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mButton");
		});
		this.mButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
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
 