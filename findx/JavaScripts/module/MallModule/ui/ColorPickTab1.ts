import ColorPickTab1_Generate from "../../../ui-generate/module/MallModule/ColorPickTab1_generate";

export default class ColorPickTab1 extends ColorPickTab1_Generate {

	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = UILayerMiddle;
	}

	public refreshColorPickTab1(text: string): void {
		this.mTitleTextBlock.text = text;
	}
}
