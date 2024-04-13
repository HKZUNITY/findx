
@Component
export default class SkyWheel extends mw.Script {
    /**旋转速度 */
    public speed: number = 2;

    /**所有座位 */
    private items: mw.GameObject[];
    private skyWheelRotation: mw.Rotation;
    private itemRotation: mw.Rotation;
    private itemLocs: mw.Vector[];

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (mw.SystemUtil.isClient()) return;
        this.itemLocs = [];

        this.items = this.gameObject.getChildren();
        for (let i of this.items) {
            this.itemLocs.push(i.localTransform.position);
        }

        this.itemRotation = new mw.Rotation(0, 0, 90);
        this.skyWheelRotation = this.gameObject.worldTransform.rotation;

        this.useUpdate = true;
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) return;

        this.skyWheelRotation.y += dt * this.speed;
        if (this.skyWheelRotation.y >= 360) {
            this.skyWheelRotation.y = 0;
        }
        this.gameObject.worldTransform.rotation = this.skyWheelRotation;
        this.items.forEach((item) => {
            item.worldTransform.rotation = this.itemRotation;
        });

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].worldTransform.rotation = this.itemRotation;
            this.items[i].localTransform.position = (this.itemLocs[i]);
        }
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}