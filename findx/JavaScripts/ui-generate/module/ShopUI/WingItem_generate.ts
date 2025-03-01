/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/ShopUI/WingItem.ui
 * TIME: 2025.03.01-12.24.17
 */
 
@UIBind('UI/module/ShopUI/WingItem.ui')
export default class WingItem_Generate extends UIScript {
		private mSelectImg_Internal: mw.Image
	public get mSelectImg(): mw.Image {
		if(!this.mSelectImg_Internal&&this.uiWidgetBase) {
			this.mSelectImg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCanvas/mSelectImg') as mw.Image
		}
		return this.mSelectImg_Internal
	}
	private mIAAImg_Internal: mw.Image
	public get mIAAImg(): mw.Image {
		if(!this.mIAAImg_Internal&&this.uiWidgetBase) {
			this.mIAAImg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCanvas/mIAAImg') as mw.Image
		}
		return this.mIAAImg_Internal
	}
	private mIconBtn_Internal: mw.Button
	public get mIconBtn(): mw.Button {
		if(!this.mIconBtn_Internal&&this.uiWidgetBase) {
			this.mIconBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCanvas/mIconBtn') as mw.Button
		}
		return this.mIconBtn_Internal
	}
	private mCanvas_Internal: mw.Canvas
	public get mCanvas(): mw.Canvas {
		if(!this.mCanvas_Internal&&this.uiWidgetBase) {
			this.mCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCanvas') as mw.Canvas
		}
		return this.mCanvas_Internal
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
		
		this.mIconBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mIconBtn");
		});
		this.mIconBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
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
 