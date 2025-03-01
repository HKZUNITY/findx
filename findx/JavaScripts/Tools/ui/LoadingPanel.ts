import LoadingPanel_Generate from "../../ui-generate/tools/LoadingPanel_generate";

export default class LoadingPanel extends LoadingPanel_Generate {

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerTop;
	}

	/**
	* 每一帧调用
	* 通过canUpdate可以开启关闭调用
	* dt 两帧调用的时间差，毫秒
	*/
	protected onUpdate(dt: number) {
		this.mLoadingImage.renderTransformAngle = this.mLoadingImage.renderTransformAngle + 180 * dt
		if (this.mLoadingImage.renderTransformAngle > 180) this.mLoadingImage.renderTransformAngle = -180 + this.mLoadingImage.renderTransformAngle - 180
	}

	public setLock(isLock: boolean): void {
		if (isLock) {
			this.canUpdate = true;
			this.rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		} else {
			this.canUpdate = false;
			this.rootCanvas.visibility = mw.SlateVisibility.Collapsed
		}
	}

	public show(...param): void {
		mw.UIService.showUI(this, this.layer, ...param);
	}

	public hide(): void {
		mw.UIService.hideUI(this);
	}
}
