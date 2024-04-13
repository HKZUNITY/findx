/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/Prefabs/可弹跳的交互物/UI/Prefab/Trampoline/JumpRecordUI.ui
 * TIME: 2023.10.21-10.15.16
 */
 
@UIBind('UI/Prefabs/可弹跳的交互物/UI/Prefab/Trampoline/JumpRecordUI.ui')
export default class JumpRecordUI_Generate extends UIScript {
		private mRecordMaxHeightText_Internal: mw.TextBlock
	public get mRecordMaxHeightText(): mw.TextBlock {
		if(!this.mRecordMaxHeightText_Internal&&this.uiWidgetBase) {
			this.mRecordMaxHeightText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mRecordMaxHeightCanvas/mRecordMaxHeightText') as mw.TextBlock
		}
		return this.mRecordMaxHeightText_Internal
	}
	private mRecordMaxHeightCanvas_Internal: mw.Canvas
	public get mRecordMaxHeightCanvas(): mw.Canvas {
		if(!this.mRecordMaxHeightCanvas_Internal&&this.uiWidgetBase) {
			this.mRecordMaxHeightCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mRecordMaxHeightCanvas') as mw.Canvas
		}
		return this.mRecordMaxHeightCanvas_Internal
	}
	private mCurrentHeightTxt_Internal: mw.TextBlock
	public get mCurrentHeightTxt(): mw.TextBlock {
		if(!this.mCurrentHeightTxt_Internal&&this.uiWidgetBase) {
			this.mCurrentHeightTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCurrentHeightCanvas/mCurrentHeightTxt') as mw.TextBlock
		}
		return this.mCurrentHeightTxt_Internal
	}
	private mCurrentHeightCanvas_Internal: mw.Canvas
	public get mCurrentHeightCanvas(): mw.Canvas {
		if(!this.mCurrentHeightCanvas_Internal&&this.uiWidgetBase) {
			this.mCurrentHeightCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mCurrentHeightCanvas') as mw.Canvas
		}
		return this.mCurrentHeightCanvas_Internal
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
		
		this.initLanguage(this.mRecordMaxHeightText)
		
	
		this.initLanguage(this.mCurrentHeightTxt)
		
	
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
 