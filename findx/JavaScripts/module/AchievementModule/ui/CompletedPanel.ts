import { GameConfig } from "../../../config/GameConfig";
import Completed_Generate from "../../../ui-generate/module/Achievement/Completed_generate";

export default class CompletedPanel extends Completed_Generate {

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initDatas();
	}
	private topVector2: mw.Vector2 = new mw.Vector2(0, 0);
	private downVector2: mw.Vector2 = new mw.Vector2(0, 0);
	private topToDownTween: mw.Tween<any> = null;
	private downToTopTween: mw.Tween<any> = null;
	/**初始化数据 */
	private initDatas(): void {
		let positionX = this.rootCanvas.size.x / 2 - this.mCanvas.size.x / 2;
		this.topVector2 = new mw.Vector2(positionX, -this.mCanvas.size.y);
		this.downVector2 = new mw.Vector2(positionX, 0);
	}

	protected onShow(...params: any[]): void {
		if (this.topToDownTween != null) this.topToDownTween.stop();
		if (this.downToTopTween != null) this.downToTopTween.stop();
		this.mCanvas.position = this.topVector2;
		this.topToDownTween = new mw.Tween({ x: this.topVector2.x, y: this.topVector2.y })
			.to({ x: this.downVector2.x, y: this.downVector2.y }, 0.3 * 1000)
			.onUpdate((v) => {
				this.mCanvas.position = new mw.Vector2(v.x, v.y);
			})
			.onComplete(() => {
				TimeUtil.delaySecond(2).then(() => {
					this.downToTopTween = new mw.Tween({ x: this.downVector2.x, y: this.downVector2.y }).
						to({ x: this.topVector2.x, y: this.topVector2.y }, 0.3 * 1000)
						.onUpdate((v) => {
							this.mCanvas.position = new mw.Vector2(v.x, v.y);
						})
						.onComplete(() => {
							this.hide();
						})
						.start();
				});
			})
			.start();
	}

	/**
	 * 达到条件提示25% 50% 75% 100%
	 * @param achId 成就
	 * @param isOnComplete 是否完成 
	 * @param progress 进度
	 * @param tragetNum 目标数
	 * @param currentValue 当前值
	 */
	public showCompletedTips(achId: number, isOnComplete: boolean, progress: number = 0, tragetNum: number = 0, currentValue: number): void {
		let achievementsElement = GameConfig.Achievements.getElement(achId);
		this.mText_AMname.text = achievementsElement.Name;
		if (isOnComplete) {
			this.mProgressBar.visibility = mw.SlateVisibility.Collapsed;
			this.mText_Target.visibility = mw.SlateVisibility.Collapsed;
			this.mText_Finish.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
		else {
			this.mProgressBar.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.mText_Target.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.mText_Finish.visibility = mw.SlateVisibility.Collapsed;
			this.mProgressBar.currentValue = currentValue;
			this.mText_Target.text = progress + "/" + tragetNum;
		}
		this.show();
	}
}
