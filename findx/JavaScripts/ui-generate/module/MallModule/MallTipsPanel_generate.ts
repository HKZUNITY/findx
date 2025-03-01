/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/MallModule/MallTipsPanel.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/MallModule/MallTipsPanel.ui')
export default class MallTipsPanel_Generate extends UIScript {
		private mMainImage_Internal: mw.Image
	public get mMainImage(): mw.Image {
		if(!this.mMainImage_Internal&&this.uiWidgetBase) {
			this.mMainImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage') as mw.Image
		}
		return this.mMainImage_Internal
	}
	private mTipsTextBlock_Internal: mw.TextBlock
	public get mTipsTextBlock(): mw.TextBlock {
		if(!this.mTipsTextBlock_Internal&&this.uiWidgetBase) {
			this.mTipsTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mTipsTextBlock') as mw.TextBlock
		}
		return this.mTipsTextBlock_Internal
	}
	private mContentTextBlock_Internal: mw.TextBlock
	public get mContentTextBlock(): mw.TextBlock {
		if(!this.mContentTextBlock_Internal&&this.uiWidgetBase) {
			this.mContentTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mContentTextBlock') as mw.TextBlock
		}
		return this.mContentTextBlock_Internal
	}
	private mCancelButton_Internal: mw.Button
	public get mCancelButton(): mw.Button {
		if(!this.mCancelButton_Internal&&this.uiWidgetBase) {
			this.mCancelButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mCancelButton') as mw.Button
		}
		return this.mCancelButton_Internal
	}
	private mCancelTextBlock_Internal: mw.TextBlock
	public get mCancelTextBlock(): mw.TextBlock {
		if(!this.mCancelTextBlock_Internal&&this.uiWidgetBase) {
			this.mCancelTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mCancelButton/mCancelTextBlock') as mw.TextBlock
		}
		return this.mCancelTextBlock_Internal
	}
	private mSureButton_Internal: mw.Button
	public get mSureButton(): mw.Button {
		if(!this.mSureButton_Internal&&this.uiWidgetBase) {
			this.mSureButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mSureButton') as mw.Button
		}
		return this.mSureButton_Internal
	}
	private mSureTextBlock_Internal: mw.TextBlock
	public get mSureTextBlock(): mw.TextBlock {
		if(!this.mSureTextBlock_Internal&&this.uiWidgetBase) {
			this.mSureTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMainImage/mSureButton/mSureTextBlock') as mw.TextBlock
		}
		return this.mSureTextBlock_Internal
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
		
		this.mCancelButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCancelButton");
		});
		this.mCancelButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mSureButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSureButton");
		});
		this.mSureButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTipsTextBlock)
		
	
		this.initLanguage(this.mContentTextBlock)
		
	
		this.initLanguage(this.mCancelTextBlock)
		
	
		this.initLanguage(this.mSureTextBlock)
		
	
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
 