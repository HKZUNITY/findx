/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/Achievement/AchievementItem.ui
 * TIME: 2024.12.31-21.32.41
 */
 
@UIBind('UI/module/Achievement/AchievementItem.ui')
export default class AchievementItem_Generate extends UIScript {
		private mBgImage_1_Internal: mw.Image
	public get mBgImage_1(): mw.Image {
		if(!this.mBgImage_1_Internal&&this.uiWidgetBase) {
			this.mBgImage_1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/DetailCanvas/mBgImage_1') as mw.Image
		}
		return this.mBgImage_1_Internal
	}
	private mText_AMdetial_Internal: mw.TextBlock
	public get mText_AMdetial(): mw.TextBlock {
		if(!this.mText_AMdetial_Internal&&this.uiWidgetBase) {
			this.mText_AMdetial_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/DetailCanvas/mText_AMdetial') as mw.TextBlock
		}
		return this.mText_AMdetial_Internal
	}
	private mImage_GradeBG_Internal: mw.Image
	public get mImage_GradeBG(): mw.Image {
		if(!this.mImage_GradeBG_Internal&&this.uiWidgetBase) {
			this.mImage_GradeBG_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mImage_GradeBG') as mw.Image
		}
		return this.mImage_GradeBG_Internal
	}
	private mProgressBar_Internal: mw.ProgressBar
	public get mProgressBar(): mw.ProgressBar {
		if(!this.mProgressBar_Internal&&this.uiWidgetBase) {
			this.mProgressBar_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mProgressBar') as mw.ProgressBar
		}
		return this.mProgressBar_Internal
	}
	private mText_Grade_Internal: mw.TextBlock
	public get mText_Grade(): mw.TextBlock {
		if(!this.mText_Grade_Internal&&this.uiWidgetBase) {
			this.mText_Grade_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mText_Grade') as mw.TextBlock
		}
		return this.mText_Grade_Internal
	}
	private mText_AMname_Internal: mw.TextBlock
	public get mText_AMname(): mw.TextBlock {
		if(!this.mText_AMname_Internal&&this.uiWidgetBase) {
			this.mText_AMname_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mText_AMname') as mw.TextBlock
		}
		return this.mText_AMname_Internal
	}
	private mCanvas_Pointto_Internal: mw.Canvas
	public get mCanvas_Pointto(): mw.Canvas {
		if(!this.mCanvas_Pointto_Internal&&this.uiWidgetBase) {
			this.mCanvas_Pointto_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mCanvas_Pointto') as mw.Canvas
		}
		return this.mCanvas_Pointto_Internal
	}
	private mText_NextLevel_Internal: mw.TextBlock
	public get mText_NextLevel(): mw.TextBlock {
		if(!this.mText_NextLevel_Internal&&this.uiWidgetBase) {
			this.mText_NextLevel_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mCanvas_Pointto/mText_NextLevel') as mw.TextBlock
		}
		return this.mText_NextLevel_Internal
	}
	private mImage_Point_Internal: mw.Image
	public get mImage_Point(): mw.Image {
		if(!this.mImage_Point_Internal&&this.uiWidgetBase) {
			this.mImage_Point_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mCanvas_Pointto/mImage_Point') as mw.Image
		}
		return this.mImage_Point_Internal
	}
	private mText_lording_Internal: mw.TextBlock
	public get mText_lording(): mw.TextBlock {
		if(!this.mText_lording_Internal&&this.uiWidgetBase) {
			this.mText_lording_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mText_lording') as mw.TextBlock
		}
		return this.mText_lording_Internal
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
		
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mText_AMdetial)
		
	
		this.initLanguage(this.mText_Grade)
		
	
		this.initLanguage(this.mText_AMname)
		
	
		this.initLanguage(this.mText_NextLevel)
		
	
		this.initLanguage(this.mText_lording)
		
	
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
 