/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/common/ConfirmPanel.ui
 * TIME: 2024.12.31-21.32.41
 */
 
@UIBind('UI/common/ConfirmPanel.ui')
export default class ConfirmPanel_Generate extends UIScript {
		private mTitleTextBlock_Internal: mw.TextBlock
	public get mTitleTextBlock(): mw.TextBlock {
		if(!this.mTitleTextBlock_Internal&&this.uiWidgetBase) {
			this.mTitleTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mTitleTextBlock') as mw.TextBlock
		}
		return this.mTitleTextBlock_Internal
	}
	private mContentTextBlock_Internal: mw.TextBlock
	public get mContentTextBlock(): mw.TextBlock {
		if(!this.mContentTextBlock_Internal&&this.uiWidgetBase) {
			this.mContentTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mContentTextBlock') as mw.TextBlock
		}
		return this.mContentTextBlock_Internal
	}
	private mSureButton_Internal: mw.Button
	public get mSureButton(): mw.Button {
		if(!this.mSureButton_Internal&&this.uiWidgetBase) {
			this.mSureButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSureButton') as mw.Button
		}
		return this.mSureButton_Internal
	}
	private mSureTextBlock_Internal: mw.TextBlock
	public get mSureTextBlock(): mw.TextBlock {
		if(!this.mSureTextBlock_Internal&&this.uiWidgetBase) {
			this.mSureTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mSureButton/mSureTextBlock') as mw.TextBlock
		}
		return this.mSureTextBlock_Internal
	}
	private mCancleButton_Internal: mw.Button
	public get mCancleButton(): mw.Button {
		if(!this.mCancleButton_Internal&&this.uiWidgetBase) {
			this.mCancleButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mCancleButton') as mw.Button
		}
		return this.mCancleButton_Internal
	}
	private mCancleTextBlock_Internal: mw.TextBlock
	public get mCancleTextBlock(): mw.TextBlock {
		if(!this.mCancleTextBlock_Internal&&this.uiWidgetBase) {
			this.mCancleTextBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mCancleButton/mCancleTextBlock') as mw.TextBlock
		}
		return this.mCancleTextBlock_Internal
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
		
		this.mSureButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSureButton");
		});
		this.mSureButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCancleButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCancleButton");
		});
		this.mCancleButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mTitleTextBlock)
		
	
		this.initLanguage(this.mContentTextBlock)
		
	
		this.initLanguage(this.mSureTextBlock)
		
	
		this.initLanguage(this.mCancleTextBlock)
		
	
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
 