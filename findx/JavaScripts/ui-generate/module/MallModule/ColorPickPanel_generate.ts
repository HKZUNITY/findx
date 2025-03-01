/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/ColorPickPanel.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/ColorPickPanel.ui')
export default class ColorPickPanel_Generate extends UIScript {
		private mSaveCanvas_Internal: mw.Canvas
	public get mSaveCanvas(): mw.Canvas {
		if(!this.mSaveCanvas_Internal&&this.uiWidgetBase) {
			this.mSaveCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mSaveCanvas') as mw.Canvas
		}
		return this.mSaveCanvas_Internal
	}
	private mSaveButton_Internal: mw.Button
	public get mSaveButton(): mw.Button {
		if(!this.mSaveButton_Internal&&this.uiWidgetBase) {
			this.mSaveButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mSaveCanvas/SaveCanvas/mSaveButton') as mw.Button
		}
		return this.mSaveButton_Internal
	}
	private mSaveTextBlock_Internal: mw.TextBlock
	public get mSaveTextBlock(): mw.TextBlock {
		if(!this.mSaveTextBlock_Internal&&this.uiWidgetBase) {
			this.mSaveTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mSaveCanvas/SaveCanvas/mSaveTextBlock') as mw.TextBlock
		}
		return this.mSaveTextBlock_Internal
	}
	private mListBgImage_Internal: mw.Image
	public get mListBgImage(): mw.Image {
		if(!this.mListBgImage_Internal&&this.uiWidgetBase) {
			this.mListBgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListBgImage') as mw.Image
		}
		return this.mListBgImage_Internal
	}
	private mListCanvas_Internal: mw.Canvas
	public get mListCanvas(): mw.Canvas {
		if(!this.mListCanvas_Internal&&this.uiWidgetBase) {
			this.mListCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas') as mw.Canvas
		}
		return this.mListCanvas_Internal
	}
	private mTab1Canvas_Internal: mw.Canvas
	public get mTab1Canvas(): mw.Canvas {
		if(!this.mTab1Canvas_Internal&&this.uiWidgetBase) {
			this.mTab1Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab1Canvas') as mw.Canvas
		}
		return this.mTab1Canvas_Internal
	}
	private mTab1ScrollBox_Internal: mw.ScrollBox
	public get mTab1ScrollBox(): mw.ScrollBox {
		if(!this.mTab1ScrollBox_Internal&&this.uiWidgetBase) {
			this.mTab1ScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab1Canvas/mTab1ScrollBox') as mw.ScrollBox
		}
		return this.mTab1ScrollBox_Internal
	}
	private mTab1ContentCanvas_Internal: mw.Canvas
	public get mTab1ContentCanvas(): mw.Canvas {
		if(!this.mTab1ContentCanvas_Internal&&this.uiWidgetBase) {
			this.mTab1ContentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab1Canvas/mTab1ScrollBox/mTab1ContentCanvas') as mw.Canvas
		}
		return this.mTab1ContentCanvas_Internal
	}
	private mTab2Canvas_Internal: mw.Canvas
	public get mTab2Canvas(): mw.Canvas {
		if(!this.mTab2Canvas_Internal&&this.uiWidgetBase) {
			this.mTab2Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab2Canvas') as mw.Canvas
		}
		return this.mTab2Canvas_Internal
	}
	private mTab2ScrollBox_Internal: mw.ScrollBox
	public get mTab2ScrollBox(): mw.ScrollBox {
		if(!this.mTab2ScrollBox_Internal&&this.uiWidgetBase) {
			this.mTab2ScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab2Canvas/mTab2ScrollBox') as mw.ScrollBox
		}
		return this.mTab2ScrollBox_Internal
	}
	private mTab2ContentCanvas_Internal: mw.Canvas
	public get mTab2ContentCanvas(): mw.Canvas {
		if(!this.mTab2ContentCanvas_Internal&&this.uiWidgetBase) {
			this.mTab2ContentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab2Canvas/mTab2ScrollBox/mTab2ContentCanvas') as mw.Canvas
		}
		return this.mTab2ContentCanvas_Internal
	}
	private mTab3Canvas_Internal: mw.Canvas
	public get mTab3Canvas(): mw.Canvas {
		if(!this.mTab3Canvas_Internal&&this.uiWidgetBase) {
			this.mTab3Canvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab3Canvas') as mw.Canvas
		}
		return this.mTab3Canvas_Internal
	}
	private mTab3ScrollBox_Internal: mw.ScrollBox
	public get mTab3ScrollBox(): mw.ScrollBox {
		if(!this.mTab3ScrollBox_Internal&&this.uiWidgetBase) {
			this.mTab3ScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab3Canvas/mTab3ScrollBox') as mw.ScrollBox
		}
		return this.mTab3ScrollBox_Internal
	}
	private mTab3ContentCanvas_Internal: mw.Canvas
	public get mTab3ContentCanvas(): mw.Canvas {
		if(!this.mTab3ContentCanvas_Internal&&this.uiWidgetBase) {
			this.mTab3ContentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab3Canvas/mTab3ScrollBox/mTab3ContentCanvas') as mw.Canvas
		}
		return this.mTab3ContentCanvas_Internal
	}
	private mColorPickCanvas_Internal: mw.Canvas
	public get mColorPickCanvas(): mw.Canvas {
		if(!this.mColorPickCanvas_Internal&&this.uiWidgetBase) {
			this.mColorPickCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab3Canvas/mColorPickCanvas') as mw.Canvas
		}
		return this.mColorPickCanvas_Internal
	}
	private mColorPick_Internal: mw.ColorPick
	public get mColorPick(): mw.ColorPick {
		if(!this.mColorPick_Internal&&this.uiWidgetBase) {
			this.mColorPick_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mListCanvas/mTab3Canvas/mColorPickCanvas/mColorPick') as mw.ColorPick
		}
		return this.mColorPick_Internal
	}
	private mCloseButton_Internal: mw.Button
	public get mCloseButton(): mw.Button {
		if(!this.mCloseButton_Internal&&this.uiWidgetBase) {
			this.mCloseButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mCloseButton') as mw.Button
		}
		return this.mCloseButton_Internal
	}
	private mCloseImage_Internal: mw.Image
	public get mCloseImage(): mw.Image {
		if(!this.mCloseImage_Internal&&this.uiWidgetBase) {
			this.mCloseImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/ListCanvas/mCloseButton/mCloseImage') as mw.Image
		}
		return this.mCloseImage_Internal
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
		
		this.mSaveButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSaveButton");
		});
		this.mSaveButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCloseButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCloseButton");
		});
		this.mCloseButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mSaveTextBlock)
		
	
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
 