/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/MallItem_Big.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/MallItem_Big.ui')
export default class MallItem_Big_Generate extends UIScript {
		private mBgImage_Internal: mw.Image
	public get mBgImage(): mw.Image {
		if(!this.mBgImage_Internal&&this.uiWidgetBase) {
			this.mBgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mBgImage') as mw.Image
		}
		return this.mBgImage_Internal
	}
	private mIconImage_Internal: mw.Image
	public get mIconImage(): mw.Image {
		if(!this.mIconImage_Internal&&this.uiWidgetBase) {
			this.mIconImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mIconImage') as mw.Image
		}
		return this.mIconImage_Internal
	}
	private mSelectButton_Internal: mw.Button
	public get mSelectButton(): mw.Button {
		if(!this.mSelectButton_Internal&&this.uiWidgetBase) {
			this.mSelectButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mSelectButton') as mw.Button
		}
		return this.mSelectButton_Internal
	}
	private mCoinCanvas_Internal: mw.Canvas
	public get mCoinCanvas(): mw.Canvas {
		if(!this.mCoinCanvas_Internal&&this.uiWidgetBase) {
			this.mCoinCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCoinCanvas') as mw.Canvas
		}
		return this.mCoinCanvas_Internal
	}
	private mCoinIconImage_Internal: mw.Image
	public get mCoinIconImage(): mw.Image {
		if(!this.mCoinIconImage_Internal&&this.uiWidgetBase) {
			this.mCoinIconImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCoinCanvas/mCoinIconImage') as mw.Image
		}
		return this.mCoinIconImage_Internal
	}
	private mPriceTextBlock_Internal: mw.TextBlock
	public get mPriceTextBlock(): mw.TextBlock {
		if(!this.mPriceTextBlock_Internal&&this.uiWidgetBase) {
			this.mPriceTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCoinCanvas/mPriceTextBlock') as mw.TextBlock
		}
		return this.mPriceTextBlock_Internal
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
		
		this.mSelectButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSelectButton");
		});
		this.mSelectButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mPriceTextBlock)
		
	
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
 