/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/PetUI/PetItem.ui
 * TIME: 2024.04.14-22.02.14
 */
 
@UIBind('UI/module/PetUI/PetItem.ui')
export default class PetItem_Generate extends UIScript {
		private mIconButton_Internal: mw.Button
	public get mIconButton(): mw.Button {
		if(!this.mIconButton_Internal&&this.uiWidgetBase) {
			this.mIconButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mIconButton') as mw.Button
		}
		return this.mIconButton_Internal
	}
	private mSelectImage_Internal: mw.Image
	public get mSelectImage(): mw.Image {
		if(!this.mSelectImage_Internal&&this.uiWidgetBase) {
			this.mSelectImage_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mSelectImage') as mw.Image
		}
		return this.mSelectImage_Internal
	}
	private mOwnTxt_Internal: mw.TextBlock
	public get mOwnTxt(): mw.TextBlock {
		if(!this.mOwnTxt_Internal&&this.uiWidgetBase) {
			this.mOwnTxt_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/Canvas/mOwnTxt') as mw.TextBlock
		}
		return this.mOwnTxt_Internal
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
		
		this.mIconButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mIconButton");
		});
		this.mIconButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mOwnTxt)
		
	
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
 