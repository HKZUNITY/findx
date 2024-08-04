/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/CollectionUI/CollectItem.ui
 * TIME: 2024.08.04-18.39.53
 */
 
@UIBind('UI/module/CollectionUI/CollectItem.ui')
export default class CollectItem_Generate extends UIScript {
		private mBgImage_Internal: mw.Image
	public get mBgImage(): mw.Image {
		if(!this.mBgImage_Internal&&this.uiWidgetBase) {
			this.mBgImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mBgImage') as mw.Image
		}
		return this.mBgImage_Internal
	}
	private mIconBtn_Internal: mw.Button
	public get mIconBtn(): mw.Button {
		if(!this.mIconBtn_Internal&&this.uiWidgetBase) {
			this.mIconBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mIconBtn') as mw.Button
		}
		return this.mIconBtn_Internal
	}
	private mAdsTipBtn_Internal: mw.Button
	public get mAdsTipBtn(): mw.Button {
		if(!this.mAdsTipBtn_Internal&&this.uiWidgetBase) {
			this.mAdsTipBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mAdsTipCanvas/mAdsTipBtn') as mw.Button
		}
		return this.mAdsTipBtn_Internal
	}
	private mAdsTipImg_Internal: mw.Image
	public get mAdsTipImg(): mw.Image {
		if(!this.mAdsTipImg_Internal&&this.uiWidgetBase) {
			this.mAdsTipImg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mAdsTipCanvas/mAdsTipImg') as mw.Image
		}
		return this.mAdsTipImg_Internal
	}
	private mAdsTipCanvas_Internal: mw.Canvas
	public get mAdsTipCanvas(): mw.Canvas {
		if(!this.mAdsTipCanvas_Internal&&this.uiWidgetBase) {
			this.mAdsTipCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mAdsTipCanvas') as mw.Canvas
		}
		return this.mAdsTipCanvas_Internal
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
		
	
		this.mAdsTipBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mAdsTipBtn");
		});
		this.mAdsTipBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mAdsTipCanvas/AdsTextBlock") as any);
		
	
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
 