
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.19-19.56.33
 */

import CollectionTip_Generate from "../../../ui-generate/module/CollectionUI/CollectionTip_generate";

export default class CollectionTipPanel extends CollectionTip_Generate {

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;
		this.initDatas();
		this.bindButtons();
	}

	/**初始化数据 */
	private initDatas(): void {

	}

	/**按钮绑定 */
	private bindButtons(): void {
		this.mCloseBtn.onClicked.add(() => {
			this.hide();
		});
	}

	/**显示 */
	public showCollectionTip(icon: string, name: string): void {
		this.mIconImage.imageGuid = icon;
		this.mNameText.text = name;
		this.show();
	}
}
