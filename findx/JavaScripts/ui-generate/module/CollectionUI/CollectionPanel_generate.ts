/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/CollectionUI/CollectionPanel.ui
 * TIME: 2025.03.01-12.24.16
 */
 
@UIBind('UI/module/CollectionUI/CollectionPanel.ui')
export default class CollectionPanel_Generate extends UIScript {
		private mCollectionBtn1_Internal: mw.Button
	public get mCollectionBtn1(): mw.Button {
		if(!this.mCollectionBtn1_Internal&&this.uiWidgetBase) {
			this.mCollectionBtn1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn1') as mw.Button
		}
		return this.mCollectionBtn1_Internal
	}
	private mCollectionBtn2_Internal: mw.Button
	public get mCollectionBtn2(): mw.Button {
		if(!this.mCollectionBtn2_Internal&&this.uiWidgetBase) {
			this.mCollectionBtn2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn2') as mw.Button
		}
		return this.mCollectionBtn2_Internal
	}
	private mCollectionBtn3_Internal: mw.Button
	public get mCollectionBtn3(): mw.Button {
		if(!this.mCollectionBtn3_Internal&&this.uiWidgetBase) {
			this.mCollectionBtn3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn3') as mw.Button
		}
		return this.mCollectionBtn3_Internal
	}
	private mCollectionBtn4_Internal: mw.Button
	public get mCollectionBtn4(): mw.Button {
		if(!this.mCollectionBtn4_Internal&&this.uiWidgetBase) {
			this.mCollectionBtn4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn4') as mw.Button
		}
		return this.mCollectionBtn4_Internal
	}
	private mScrollBox_Internal: mw.ScrollBox
	public get mScrollBox(): mw.ScrollBox {
		if(!this.mScrollBox_Internal&&this.uiWidgetBase) {
			this.mScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/mScrollBox') as mw.ScrollBox
		}
		return this.mScrollBox_Internal
	}
	private mContentCanvas_Internal: mw.Canvas
	public get mContentCanvas(): mw.Canvas {
		if(!this.mContentCanvas_Internal&&this.uiWidgetBase) {
			this.mContentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/MiddleCanvas/mScrollBox/mContentCanvas') as mw.Canvas
		}
		return this.mContentCanvas_Internal
	}
	private mCloseBtn_Internal: mw.Button
	public get mCloseBtn(): mw.Button {
		if(!this.mCloseBtn_Internal&&this.uiWidgetBase) {
			this.mCloseBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mCloseBtn') as mw.Button
		}
		return this.mCloseBtn_Internal
	}
	private mRecycleCanvas_Internal: mw.Canvas
	public get mRecycleCanvas(): mw.Canvas {
		if(!this.mRecycleCanvas_Internal&&this.uiWidgetBase) {
			this.mRecycleCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRecycleCanvas') as mw.Canvas
		}
		return this.mRecycleCanvas_Internal
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
		
		this.mCollectionBtn1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCollectionBtn1");
		});
		this.mCollectionBtn1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCollectionBtn2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCollectionBtn2");
		});
		this.mCollectionBtn2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCollectionBtn3.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCollectionBtn3");
		});
		this.mCollectionBtn3.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCollectionBtn4.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCollectionBtn4");
		});
		this.mCollectionBtn4.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCloseBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
		});
		this.mCloseBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn1/TextBlock") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn2/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn3/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/MiddleCanvas/CollectionTypeCanvas/mCollectionBtn4/TextBlock_3") as any);
		
	
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
 