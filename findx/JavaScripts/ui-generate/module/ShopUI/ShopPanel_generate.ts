/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/ShopUI/ShopPanel.ui
 * TIME: 2024.05.25-14.47.29
 */
 
@UIBind('UI/module/ShopUI/ShopPanel.ui')
export default class ShopPanel_Generate extends UIScript {
		private mLeftCanvas_Internal: mw.Canvas
	public get mLeftCanvas(): mw.Canvas {
		if(!this.mLeftCanvas_Internal&&this.uiWidgetBase) {
			this.mLeftCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas') as mw.Canvas
		}
		return this.mLeftCanvas_Internal
	}
	private mShopBtn1_Internal: mw.Button
	public get mShopBtn1(): mw.Button {
		if(!this.mShopBtn1_Internal&&this.uiWidgetBase) {
			this.mShopBtn1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_1/mShopBtn1') as mw.Button
		}
		return this.mShopBtn1_Internal
	}
	private mShopBtn2_Internal: mw.Button
	public get mShopBtn2(): mw.Button {
		if(!this.mShopBtn2_Internal&&this.uiWidgetBase) {
			this.mShopBtn2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_2/mShopBtn2') as mw.Button
		}
		return this.mShopBtn2_Internal
	}
	private mShopBtn3_Internal: mw.Button
	public get mShopBtn3(): mw.Button {
		if(!this.mShopBtn3_Internal&&this.uiWidgetBase) {
			this.mShopBtn3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_3/mShopBtn3') as mw.Button
		}
		return this.mShopBtn3_Internal
	}
	private mShopBtn4_Internal: mw.Button
	public get mShopBtn4(): mw.Button {
		if(!this.mShopBtn4_Internal&&this.uiWidgetBase) {
			this.mShopBtn4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_4/mShopBtn4') as mw.Button
		}
		return this.mShopBtn4_Internal
	}
	private mClothesCanvas_Internal: mw.Canvas
	public get mClothesCanvas(): mw.Canvas {
		if(!this.mClothesCanvas_Internal&&this.uiWidgetBase) {
			this.mClothesCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas') as mw.Canvas
		}
		return this.mClothesCanvas_Internal
	}
	private mClothesBtn1_Internal: mw.Button
	public get mClothesBtn1(): mw.Button {
		if(!this.mClothesBtn1_Internal&&this.uiWidgetBase) {
			this.mClothesBtn1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/HairCanvas/mClothesBtn1') as mw.Button
		}
		return this.mClothesBtn1_Internal
	}
	private mClothesBtn2_Internal: mw.Button
	public get mClothesBtn2(): mw.Button {
		if(!this.mClothesBtn2_Internal&&this.uiWidgetBase) {
			this.mClothesBtn2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/UpperClothCanvas/mClothesBtn2') as mw.Button
		}
		return this.mClothesBtn2_Internal
	}
	private mClothesBtn3_Internal: mw.Button
	public get mClothesBtn3(): mw.Button {
		if(!this.mClothesBtn3_Internal&&this.uiWidgetBase) {
			this.mClothesBtn3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/LowerClothCanvas/mClothesBtn3') as mw.Button
		}
		return this.mClothesBtn3_Internal
	}
	private mClothesBtn4_Internal: mw.Button
	public get mClothesBtn4(): mw.Button {
		if(!this.mClothesBtn4_Internal&&this.uiWidgetBase) {
			this.mClothesBtn4_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/GlovesCanvas/mClothesBtn4') as mw.Button
		}
		return this.mClothesBtn4_Internal
	}
	private mClothesBtn5_Internal: mw.Button
	public get mClothesBtn5(): mw.Button {
		if(!this.mClothesBtn5_Internal&&this.uiWidgetBase) {
			this.mClothesBtn5_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/ShoeCanvas/mClothesBtn5') as mw.Button
		}
		return this.mClothesBtn5_Internal
	}
	private mClothesBtn6_Internal: mw.Button
	public get mClothesBtn6(): mw.Button {
		if(!this.mClothesBtn6_Internal&&this.uiWidgetBase) {
			this.mClothesBtn6_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/BodyCanvas/mClothesBtn6') as mw.Button
		}
		return this.mClothesBtn6_Internal
	}
	private mScrollBox_Internal: mw.ScrollBox
	public get mScrollBox(): mw.ScrollBox {
		if(!this.mScrollBox_Internal&&this.uiWidgetBase) {
			this.mScrollBox_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mScrollBox') as mw.ScrollBox
		}
		return this.mScrollBox_Internal
	}
	private mContentCanvas_Internal: mw.Canvas
	public get mContentCanvas(): mw.Canvas {
		if(!this.mContentCanvas_Internal&&this.uiWidgetBase) {
			this.mContentCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mLeftCanvas/mScrollBox/mContentCanvas') as mw.Canvas
		}
		return this.mContentCanvas_Internal
	}
	private mRightCanvas_Internal: mw.Canvas
	public get mRightCanvas(): mw.Canvas {
		if(!this.mRightCanvas_Internal&&this.uiWidgetBase) {
			this.mRightCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRightCanvas') as mw.Canvas
		}
		return this.mRightCanvas_Internal
	}
	private mCloseBtn_Internal: mw.Button
	public get mCloseBtn(): mw.Button {
		if(!this.mCloseBtn_Internal&&this.uiWidgetBase) {
			this.mCloseBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRightCanvas/RightBottomCanvas/CloseCanvas/mCloseBtn') as mw.Button
		}
		return this.mCloseBtn_Internal
	}
	private mSaveBtn_Internal: mw.Button
	public get mSaveBtn(): mw.Button {
		if(!this.mSaveBtn_Internal&&this.uiWidgetBase) {
			this.mSaveBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRightCanvas/RightBottomCanvas/SaveCanvas/mSaveBtn') as mw.Button
		}
		return this.mSaveBtn_Internal
	}
	private mSaveText_Internal: mw.TextBlock
	public get mSaveText(): mw.TextBlock {
		if(!this.mSaveText_Internal&&this.uiWidgetBase) {
			this.mSaveText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRightCanvas/RightBottomCanvas/SaveCanvas/mSaveText') as mw.TextBlock
		}
		return this.mSaveText_Internal
	}
	private mIAAImg_Internal: mw.Image
	public get mIAAImg(): mw.Image {
		if(!this.mIAAImg_Internal&&this.uiWidgetBase) {
			this.mIAAImg_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mRightCanvas/RightBottomCanvas/SaveCanvas/mIAAImg') as mw.Image
		}
		return this.mIAAImg_Internal
	}
	private mRecycleCanvas_Internal: mw.Canvas
	public get mRecycleCanvas(): mw.Canvas {
		if(!this.mRecycleCanvas_Internal&&this.uiWidgetBase) {
			this.mRecycleCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mRecycleCanvas') as mw.Canvas
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
		
		this.mShopBtn1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mShopBtn1");
		});
		this.mShopBtn1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mShopBtn2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mShopBtn2");
		});
		this.mShopBtn2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mShopBtn3.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mShopBtn3");
		});
		this.mShopBtn3.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mShopBtn4.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mShopBtn4");
		});
		this.mShopBtn4.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn1.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn1");
		});
		this.mClothesBtn1.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn2.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn2");
		});
		this.mClothesBtn2.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn3.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn3");
		});
		this.mClothesBtn3.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn4.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn4");
		});
		this.mClothesBtn4.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn5.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn5");
		});
		this.mClothesBtn5.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mClothesBtn6.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mClothesBtn6");
		});
		this.mClothesBtn6.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCloseBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
		});
		this.mCloseBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mSaveBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSaveBtn");
		});
		this.mSaveBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mSaveText)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_1/TextBlock") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_2/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_3/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/ShopCanvas/ShopCanvas_4/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/HairCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/UpperClothCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/LowerClothCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/GlovesCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/ShoeCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mLeftCanvas/mClothesCanvas/BodyCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MainCanvas/mRightCanvas/RightBottomCanvas/CloseCanvas/CloseText") as any);
		
	
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
 