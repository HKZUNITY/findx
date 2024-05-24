/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * AUTHOR: 爱玩游戏的小胖子
 * UI: UI/module/HUDUI/HUDPanel.ui
 * TIME: 2024.05.24-23.38.06
 */
 
@UIBind('UI/module/HUDUI/HUDPanel.ui')
export default class HUDPanel_Generate extends UIScript {
		private mJoystick_Internal: mw.VirtualJoystickPanel
	public get mJoystick(): mw.VirtualJoystickPanel {
		if(!this.mJoystick_Internal&&this.uiWidgetBase) {
			this.mJoystick_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mJoystick') as mw.VirtualJoystickPanel
		}
		return this.mJoystick_Internal
	}
	private mTouchPad_Internal: mw.TouchPad
	public get mTouchPad(): mw.TouchPad {
		if(!this.mTouchPad_Internal&&this.uiWidgetBase) {
			this.mTouchPad_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MainCanvas/mTouchPad') as mw.TouchPad
		}
		return this.mTouchPad_Internal
	}
	private mFlyCanvas_Internal: mw.Canvas
	public get mFlyCanvas(): mw.Canvas {
		if(!this.mFlyCanvas_Internal&&this.uiWidgetBase) {
			this.mFlyCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mFlyCanvas') as mw.Canvas
		}
		return this.mFlyCanvas_Internal
	}
	private mFlyMaskBtn_Internal: mw.MaskButton
	public get mFlyMaskBtn(): mw.MaskButton {
		if(!this.mFlyMaskBtn_Internal&&this.uiWidgetBase) {
			this.mFlyMaskBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mFlyCanvas/mFlyMaskBtn') as mw.MaskButton
		}
		return this.mFlyMaskBtn_Internal
	}
	private mFlyText_Internal: mw.TextBlock
	public get mFlyText(): mw.TextBlock {
		if(!this.mFlyText_Internal&&this.uiWidgetBase) {
			this.mFlyText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mFlyCanvas/mFlyText') as mw.TextBlock
		}
		return this.mFlyText_Internal
	}
	private mJumpCanvas_Internal: mw.Canvas
	public get mJumpCanvas(): mw.Canvas {
		if(!this.mJumpCanvas_Internal&&this.uiWidgetBase) {
			this.mJumpCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mJumpCanvas') as mw.Canvas
		}
		return this.mJumpCanvas_Internal
	}
	private mJumpBtn_Internal: mw.Button
	public get mJumpBtn(): mw.Button {
		if(!this.mJumpBtn_Internal&&this.uiWidgetBase) {
			this.mJumpBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mJumpCanvas/mJumpBtn') as mw.Button
		}
		return this.mJumpBtn_Internal
	}
	private mAttackCanvas_Internal: mw.Canvas
	public get mAttackCanvas(): mw.Canvas {
		if(!this.mAttackCanvas_Internal&&this.uiWidgetBase) {
			this.mAttackCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mAttackCanvas') as mw.Canvas
		}
		return this.mAttackCanvas_Internal
	}
	private mAttackButton_Internal: mw.Button
	public get mAttackButton(): mw.Button {
		if(!this.mAttackButton_Internal&&this.uiWidgetBase) {
			this.mAttackButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightDownCanvas/mAttackCanvas/mAttackButton') as mw.Button
		}
		return this.mAttackButton_Internal
	}
	private mTimeText_Internal: mw.TextBlock
	public get mTimeText(): mw.TextBlock {
		if(!this.mTimeText_Internal&&this.uiWidgetBase) {
			this.mTimeText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/ClockCanvas/mTimeText') as mw.TextBlock
		}
		return this.mTimeText_Internal
	}
	private mRaffleButton_Internal: mw.Button
	public get mRaffleButton(): mw.Button {
		if(!this.mRaffleButton_Internal&&this.uiWidgetBase) {
			this.mRaffleButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/RaffleCanvas/mRaffleButton') as mw.Button
		}
		return this.mRaffleButton_Internal
	}
	private mAchButton_Internal: mw.Button
	public get mAchButton(): mw.Button {
		if(!this.mAchButton_Internal&&this.uiWidgetBase) {
			this.mAchButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/AdsCanvas/mAchButton') as mw.Button
		}
		return this.mAchButton_Internal
	}
	private mAdsButton_Internal: mw.Button
	public get mAdsButton(): mw.Button {
		if(!this.mAdsButton_Internal&&this.uiWidgetBase) {
			this.mAdsButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/AchCanvas/mAdsButton') as mw.Button
		}
		return this.mAdsButton_Internal
	}
	private mSignInBtn_Internal: mw.Button
	public get mSignInBtn(): mw.Button {
		if(!this.mSignInBtn_Internal&&this.uiWidgetBase) {
			this.mSignInBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/SignInCanvas/mSignInBtn') as mw.Button
		}
		return this.mSignInBtn_Internal
	}
	private mRankBtn_Internal: mw.Button
	public get mRankBtn(): mw.Button {
		if(!this.mRankBtn_Internal&&this.uiWidgetBase) {
			this.mRankBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/RankCanvas/mRankBtn') as mw.Button
		}
		return this.mRankBtn_Internal
	}
	private mMusicBtn_Internal: mw.Button
	public get mMusicBtn(): mw.Button {
		if(!this.mMusicBtn_Internal&&this.uiWidgetBase) {
			this.mMusicBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/MusicCanvas/mMusicBtn') as mw.Button
		}
		return this.mMusicBtn_Internal
	}
	private mLevelBtn_Internal: mw.Button
	public get mLevelBtn(): mw.Button {
		if(!this.mLevelBtn_Internal&&this.uiWidgetBase) {
			this.mLevelBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/LevelCanvas/mLevelBtn') as mw.Button
		}
		return this.mLevelBtn_Internal
	}
	private mShopBtn_Internal: mw.Button
	public get mShopBtn(): mw.Button {
		if(!this.mShopBtn_Internal&&this.uiWidgetBase) {
			this.mShopBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/ShopCanvas/mShopBtn') as mw.Button
		}
		return this.mShopBtn_Internal
	}
	private mHomeBtn_Internal: mw.Button
	public get mHomeBtn(): mw.Button {
		if(!this.mHomeBtn_Internal&&this.uiWidgetBase) {
			this.mHomeBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/RightTopCanvas/HomeCanvas/mHomeBtn') as mw.Button
		}
		return this.mHomeBtn_Internal
	}
	private mMusicCanvas_Internal: mw.Canvas
	public get mMusicCanvas(): mw.Canvas {
		if(!this.mMusicCanvas_Internal&&this.uiWidgetBase) {
			this.mMusicCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas') as mw.Canvas
		}
		return this.mMusicCanvas_Internal
	}
	private mCloseMusicBtn_Internal: mw.Button
	public get mCloseMusicBtn(): mw.Button {
		if(!this.mCloseMusicBtn_Internal&&this.uiWidgetBase) {
			this.mCloseMusicBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas/mCloseMusicBtn') as mw.Button
		}
		return this.mCloseMusicBtn_Internal
	}
	private mMusicText_Internal: mw.TextBlock
	public get mMusicText(): mw.TextBlock {
		if(!this.mMusicText_Internal&&this.uiWidgetBase) {
			this.mMusicText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas/Canvas/mMusicText') as mw.TextBlock
		}
		return this.mMusicText_Internal
	}
	private mLeftMusicBtn_Internal: mw.Button
	public get mLeftMusicBtn(): mw.Button {
		if(!this.mLeftMusicBtn_Internal&&this.uiWidgetBase) {
			this.mLeftMusicBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas/Canvas/mLeftMusicBtn') as mw.Button
		}
		return this.mLeftMusicBtn_Internal
	}
	private mOnOffMusicBtn_Internal: mw.Button
	public get mOnOffMusicBtn(): mw.Button {
		if(!this.mOnOffMusicBtn_Internal&&this.uiWidgetBase) {
			this.mOnOffMusicBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas/Canvas/mOnOffMusicBtn') as mw.Button
		}
		return this.mOnOffMusicBtn_Internal
	}
	private mRightMusicBtn_Internal: mw.Button
	public get mRightMusicBtn(): mw.Button {
		if(!this.mRightMusicBtn_Internal&&this.uiWidgetBase) {
			this.mRightMusicBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mMusicCanvas/Canvas/mRightMusicBtn') as mw.Button
		}
		return this.mRightMusicBtn_Internal
	}
	private mBeFlyingText_Internal: mw.TextBlock
	public get mBeFlyingText(): mw.TextBlock {
		if(!this.mBeFlyingText_Internal&&this.uiWidgetBase) {
			this.mBeFlyingText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MiddleBottomCanvas/mBeFlyingText') as mw.TextBlock
		}
		return this.mBeFlyingText_Internal
	}
	private mExpProgressBar_Internal: mw.ProgressBar
	public get mExpProgressBar(): mw.ProgressBar {
		if(!this.mExpProgressBar_Internal&&this.uiWidgetBase) {
			this.mExpProgressBar_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/MiddleBottomCanvas/mExpProgressBar') as mw.ProgressBar
		}
		return this.mExpProgressBar_Internal
	}
	private mHpText_Internal: mw.TextBlock
	public get mHpText(): mw.TextBlock {
		if(!this.mHpText_Internal&&this.uiWidgetBase) {
			this.mHpText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mHpText') as mw.TextBlock
		}
		return this.mHpText_Internal
	}
	private mAttackText_Internal: mw.TextBlock
	public get mAttackText(): mw.TextBlock {
		if(!this.mAttackText_Internal&&this.uiWidgetBase) {
			this.mAttackText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mAttackText') as mw.TextBlock
		}
		return this.mAttackText_Internal
	}
	private mMoveSpeedText_Internal: mw.TextBlock
	public get mMoveSpeedText(): mw.TextBlock {
		if(!this.mMoveSpeedText_Internal&&this.uiWidgetBase) {
			this.mMoveSpeedText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mMoveSpeedText') as mw.TextBlock
		}
		return this.mMoveSpeedText_Internal
	}
	private mFlySpeedText_Internal: mw.TextBlock
	public get mFlySpeedText(): mw.TextBlock {
		if(!this.mFlySpeedText_Internal&&this.uiWidgetBase) {
			this.mFlySpeedText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mFlySpeedText') as mw.TextBlock
		}
		return this.mFlySpeedText_Internal
	}
	private mJumpHeightText_Internal: mw.TextBlock
	public get mJumpHeightText(): mw.TextBlock {
		if(!this.mJumpHeightText_Internal&&this.uiWidgetBase) {
			this.mJumpHeightText_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mJumpHeightText') as mw.TextBlock
		}
		return this.mJumpHeightText_Internal
	}
	private mPetButton_Internal: mw.Button
	public get mPetButton(): mw.Button {
		if(!this.mPetButton_Internal&&this.uiWidgetBase) {
			this.mPetButton_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/LeftCanvas/mPetButton') as mw.Button
		}
		return this.mPetButton_Internal
	}
	private mKillTipCanvas_Internal: mw.Canvas
	public get mKillTipCanvas(): mw.Canvas {
		if(!this.mKillTipCanvas_Internal&&this.uiWidgetBase) {
			this.mKillTipCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/mKillTipCanvas') as mw.Canvas
		}
		return this.mKillTipCanvas_Internal
	}
	private mKillTipCountCanvas_Internal: mw.Canvas
	public get mKillTipCountCanvas(): mw.Canvas {
		if(!this.mKillTipCountCanvas_Internal&&this.uiWidgetBase) {
			this.mKillTipCountCanvas_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/KillStreakCanvas/mKillTipCountCanvas') as mw.Canvas
		}
		return this.mKillTipCountCanvas_Internal
	}
	private mKillTipTextBlock1_Internal: mw.TextBlock
	public get mKillTipTextBlock1(): mw.TextBlock {
		if(!this.mKillTipTextBlock1_Internal&&this.uiWidgetBase) {
			this.mKillTipTextBlock1_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/KillStreakCanvas/mKillTipCountCanvas/mKillTipTextBlock1') as mw.TextBlock
		}
		return this.mKillTipTextBlock1_Internal
	}
	private mKillTipTextBlock2_Internal: mw.TextBlock
	public get mKillTipTextBlock2(): mw.TextBlock {
		if(!this.mKillTipTextBlock2_Internal&&this.uiWidgetBase) {
			this.mKillTipTextBlock2_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/KillStreakCanvas/mKillTipCountCanvas/mKillTipTextBlock2') as mw.TextBlock
		}
		return this.mKillTipTextBlock2_Internal
	}
	private mKillTipTextBlock3_Internal: mw.TextBlock
	public get mKillTipTextBlock3(): mw.TextBlock {
		if(!this.mKillTipTextBlock3_Internal&&this.uiWidgetBase) {
			this.mKillTipTextBlock3_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/KillStreakCanvas/mKillTipTextBlock3') as mw.TextBlock
		}
		return this.mKillTipTextBlock3_Internal
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
		
		this.mJumpBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mJumpBtn");
		});
		this.mJumpBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mAttackButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mAttackButton");
		});
		this.mAttackButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mRaffleButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mRaffleButton");
		});
		this.mRaffleButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mAchButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mAchButton");
		});
		this.mAchButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mAdsButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mAdsButton");
		});
		this.mAdsButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mSignInBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mSignInBtn");
		});
		this.mSignInBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mRankBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mRankBtn");
		});
		this.mRankBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mMusicBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mMusicBtn");
		});
		this.mMusicBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mLevelBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mLevelBtn");
		});
		this.mLevelBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mShopBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mShopBtn");
		});
		this.mShopBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mHomeBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mHomeBtn");
		});
		this.mHomeBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mCloseMusicBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mCloseMusicBtn");
		});
		this.mCloseMusicBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mLeftMusicBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mLeftMusicBtn");
		});
		this.mLeftMusicBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mOnOffMusicBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mOnOffMusicBtn");
		});
		this.mOnOffMusicBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mRightMusicBtn.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mRightMusicBtn");
		});
		this.mRightMusicBtn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		this.mPetButton.onClicked.add(()=>{
			Event.dispatchToLocal("PlayButtonClick", "mPetButton");
		});
		this.mPetButton.touchMethod = (mw.ButtonTouchMethod.PreciseTap);
		
	
		//按钮多语言
		
		//文本多语言
		
		this.initLanguage(this.mFlyText)
		
	
		this.initLanguage(this.mTimeText)
		
	
		this.initLanguage(this.mMusicText)
		
	
		this.initLanguage(this.mBeFlyingText)
		
	
		this.initLanguage(this.mHpText)
		
	
		this.initLanguage(this.mAttackText)
		
	
		this.initLanguage(this.mMoveSpeedText)
		
	
		this.initLanguage(this.mFlySpeedText)
		
	
		this.initLanguage(this.mJumpHeightText)
		
	
		this.initLanguage(this.mKillTipTextBlock1)
		
	
		this.initLanguage(this.mKillTipTextBlock2)
		
	
		this.initLanguage(this.mKillTipTextBlock3)
		
	
		//文本多语言
		
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/RaffleCanvas/TextBlock") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/AdsCanvas/TextBlock") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/AchCanvas/TextBlock") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/SignInCanvas/TextBlock_6") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/RankCanvas/TextBlock_5") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/MusicCanvas/TextBlock_4") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/LevelCanvas/TextBlock_3") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/ShopCanvas/TextBlock_2") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/RightTopCanvas/HomeCanvas/TextBlock_1") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/MiddleBottomCanvas/TextBlock_8") as any);
		
	
		this.initLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/LeftCanvas/mPetButton/TextBlock_7") as any);
		
	
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
 