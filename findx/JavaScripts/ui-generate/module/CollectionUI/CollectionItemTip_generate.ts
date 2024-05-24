/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/CollectionUI/CollectionItemTip.ui
 * TIME: 2024.05.24-23.38.06
 */
 
@UIBind('UI/module/CollectionUI/CollectionItemTip.ui')
export default class CollectionItemTip_Generate extends UIScript {
		private mCloseButton_Internal: mw.Button
	public get mCloseButton(): mw.Button {
		if(!this.mCloseButton_Internal&&this.uiWidgetBase) {
			this.mCloseButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCloseButton') as mw.Button
		}
		return this.mCloseButton_Internal
	}
	private mIconImage_Internal: mw.Image
	public get mIconImage(): mw.Image {
		if(!this.mIconImage_Internal&&this.uiWidgetBase) {
			this.mIconImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/IconCanvas/mIconImage') as mw.Image
		}
		return this.mIconImage_Internal
	}
	private mOwnText_Internal: mw.TextBlock
	public get mOwnText(): mw.TextBlock {
		if(!this.mOwnText_Internal&&this.uiWidgetBase) {
			this.mOwnText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mOwnText') as mw.TextBlock
		}
		return this.mOwnText_Internal
	}
	private mNameText_Internal: mw.TextBlock
	public get mNameText(): mw.TextBlock {
		if(!this.mNameText_Internal&&this.uiWidgetBase) {
			this.mNameText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mNameText') as mw.TextBlock
		}
		return this.mNameText_Internal
	}
	private mUseText_Internal: mw.TextBlock
	public get mUseText(): mw.TextBlock {
		if(!this.mUseText_Internal&&this.uiWidgetBase) {
			this.mUseText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mUseCanvas/mUseButton/mUseText') as mw.TextBlock
		}
		return this.mUseText_Internal
	}
	private mUseButton_Internal: mw.Button
	public get mUseButton(): mw.Button {
		if(!this.mUseButton_Internal&&this.uiWidgetBase) {
			this.mUseButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mUseCanvas/mUseButton') as mw.Button
		}
		return this.mUseButton_Internal
	}
	private mUseCanvas_Internal: mw.Canvas
	public get mUseCanvas(): mw.Canvas {
		if(!this.mUseCanvas_Internal&&this.uiWidgetBase) {
			this.mUseCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mUseCanvas') as mw.Canvas
		}
		return this.mUseCanvas_Internal
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
		
		this.mCloseButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCloseButton");
		});
		this.mCloseButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mUseButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mUseButton");
		});
		this.mUseButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mOwnText)
		
	
		this.initLanguage(this.mNameText)
		
	
		this.initLanguage(this.mUseText)
		
	
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
 