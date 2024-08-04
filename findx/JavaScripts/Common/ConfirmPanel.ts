import ConfirmPanel_Generate from "../ui-generate/common/ConfirmPanel_generate";

export default class ConfirmPanel extends ConfirmPanel_Generate {
    private callback: () => void = null;
    /** 
     * 构造UI文件成功后，在合适的时机最先初始化一次 
     */
    protected onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = UILayerMiddle;
        this.bindButton();
    }

    private bindButton(): void {
        this.mSureButton.onClicked.add(() => {
            this.hide();
            if (this.callback) this.callback();
        });
        this.mCancleButton.onClicked.add(() => {
            this.hide();
        });
    }

    public confirmTips(callback: () => void, contentText: string, yesText: string = "购买", noText: string = "取消", titleText: string = "提示"): void {
        this.mSureTextBlock.text = yesText;
        this.mCancleTextBlock.text = noText;
        this.mTitleTextBlock.text = titleText;
        this.mContentTextBlock.text = contentText;
        this.callback = callback;
        this.show();
    }
}
