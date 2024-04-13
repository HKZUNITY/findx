
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.06.03-14.37.42
 */

import { GameConfig } from "../config/GameConfig";
import Test_Generate from "../ui-generate/common/Test_generate";

export default class Test extends Test_Generate {
	private player: mw.Player = null;
	/**玩家身上的相机 */
	private camera: Camera = null;
	/**拿到相机 */
	private get getCamera(): Camera {
		if (this.camera == null) {
			this.camera = Camera.currentCamera;
		}
		return this.camera;
	}
	/** 
	 * 构造UI文件成功后，在合适的时机最先初始化一次 
	 */
	protected async onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerMiddle;

		this.player = await Player.asyncGetLocalPlayer();
		this.setCameraTransform();
	}
	/**设置玩家摄像机偏移、旋转 */
	private setCameraTransform(): void {
		this.mButton.onClicked.add(() => {
			let transform = new mw.Transform();
			let a = this.mInputBox.text.split('|');
			let pos = new mw.Vector(Number(a[0]), Number(a[1]), Number(a[2]));
			transform.position = pos;
			let b = this.mInputBox_1.text.split('|');
			let rot = new mw.Rotation(Number(b[0]), Number(b[1]), Number(b[2]));
			transform.rotation = rot;
			this.getCamera.localTransform = transform;
		});
	}

}
