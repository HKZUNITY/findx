import Console from "../../../../../../Tools/Console";

/*
 * @Author: 侯凯召
 * @QQ邮箱: 3046916186@qq.com
 * @Date: 2023-01-29 16:42:52
 * @LastEditors: 穿迷彩服的鲨鱼
 * @LastEditTime: 2023-01-29 16:43:29
 * @Description: 蹦床UI
 * @FilePath: \Demo\JavaScripts\prefab\Trampoline\ui\P_Game_Trampoline.ts
 */
export default class P_Game_Trampoline extends mw.UIScript {
    /**当前客户端玩家 */
    private player: mw.Player = null;

    /**------------------ 【UI控件】 ------------------ */
    private mRecordMaxHeightCanvas: mw.Canvas = null;
    private mRecordMaxHeightText: mw.TextBlock = null;
    private mCurrentHeightCanvas: mw.Canvas = null;
    private mCurrentHeightTxt: mw.TextBlock = null;
    /**------------------ 【UI控件】 ------------------ */

    /**------------------ 【数据】 ------------------ */
    private showUITween1: mw.Tween<any> = null;
    private showUITween2: mw.Tween<any> = null;

    private readonly recordMaxHeightCanvasPos: mw.Vector2 = new mw.Vector2(1900, 200);
    private readonly currentHeightCanvasPos: mw.Vector2 = new mw.Vector2(1900, 350);

    /**记录的最大高度 */
    private recordMaxHight: number = 0;
    /**起始高度 */
    private planeHeight: number = 0;

    private isStart: boolean = false;

    private isChange: boolean = false;
    /**------------------ 【数据】 ------------------ */

    protected async onStart(): Promise<void> {
        //设置能否每帧触发onUpdate
        this.canUpdate = true;
        this.layer = mw.UILayerMiddle;
        await this.initData();
        this.initTween();
        this.getComponentUI();
        this.registerListener();
    }

    /**初始化数据 */
    private async initData(): Promise<void> {
        this.player = await Player.asyncGetLocalPlayer();
        Console.error("[player:]" + this.player.character);
    }

    private initTween(): void {
        this.showUITween1 = new mw.Tween({ time: 0 })
            .to({ time: 1 }, 1000)
            .onStart(() => {
                this.mRecordMaxHeightCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            })
            .onUpdate((obj) => {
                let pos = new mw.Vector2(this.recordMaxHeightCanvasPos.x - this.backEaseIn(obj.time) * 500, this.recordMaxHeightCanvasPos.y);
                this.mRecordMaxHeightCanvas.position = pos
            });

        this.showUITween2 = new mw.Tween({ time: 0 })
            .to({ time: 1 }, 1000)
            .onStart(() => {
                this.mCurrentHeightCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            })
            .onUpdate((obj) => {
                let pos = new mw.Vector2(this.currentHeightCanvasPos.x - this.backEaseIn(obj.time) * 500, this.currentHeightCanvasPos.y);
                this.mCurrentHeightCanvas.position = pos
            })
            .delay(200);
    }

    /**获取UI组件 */
    private getComponentUI(): void {
        let rootCanvas = this.uiObject as mw.UserWidget;

        this.mRecordMaxHeightCanvas = rootCanvas.findChildByPath("RootCanvas/mRecordMaxHeightCanvas") as mw.Canvas;
        this.mRecordMaxHeightText = rootCanvas.findChildByPath("RootCanvas/mRecordMaxHeightCanvas/mRecordMaxHeightText") as mw.TextBlock;

        this.mCurrentHeightCanvas = rootCanvas.findChildByPath("RootCanvas/mCurrentHeightCanvas") as mw.Canvas;
        this.mCurrentHeightTxt = rootCanvas.findChildByPath("RootCanvas/mCurrentHeightCanvas/mCurrentHeightTxt") as mw.TextBlock;
    }

    /**注册监听 */
    private registerListener(): void {
        Event.addServerListener(ListenerEventsType.ServerToAllClient_ShowJumpRecordUI, this.showUI.bind(this));
        Event.addServerListener(ListenerEventsType.ServerToAllClient_HideJumpRecordUI, this.hideUI.bind(this));
        Event.addLocalListener("SyncMaxHeight", (maxHeight: number) => {
            this.recordMaxHight = maxHeight;
        });
    }

    protected onUpdate(dt: number): void {
        if (!this.isStart) return;
        let height = Math.ceil(this.player.character.worldTransform.position.z - this.planeHeight);
        height = Math.max(height, 0);
        this.refreshUI(height);
    }

    /**刷新数据 */
    private refreshUI(height: number) {
        let t = Math.min(1 - (height / this.recordMaxHight), 1);
        this.mCurrentHeightTxt.contentColor = new mw.LinearColor(1, t, t);
        this.mCurrentHeightTxt.text = height + " M"
        if (height > this.recordMaxHight) {
            this.recordMaxHight = height;
            this.mRecordMaxHeightText.text = this.recordMaxHight + "M"
            if (!this.isChange) return;
            this.mCurrentHeightTxt.renderScale = (mw.Vector2.one.multiply(1.25));
            this.mRecordMaxHeightText.renderScale = (mw.Vector2.one.multiply(1.25));
            this.isChange = false;
        } else {
            if (this.isChange) return;
            Event.dispatchToServer("RefreshMaxHeight", this.recordMaxHight);
            Event.dispatchToLocal("achMaxHight", this.recordMaxHight);
            this.initNomalUI();
            this.isChange = true;
        }
    }

    /**显示UI */
    private showUI(planeHeight: number): void {
        if (this.mRecordMaxHeightCanvas.visible) return;
        this.planeHeight = Math.ceil(planeHeight);
        this.mRecordMaxHeightText.text = this.recordMaxHight + " M"
        this.initNomalUI();
        this.isStart = true;
        this.showUITween1.start();
        this.showUITween2.start();
        Event.dispatchToLocal("IsCanFly", false);
    }

    /**初始化UI */
    private initNomalUI() {
        this.mCurrentHeightTxt.renderScale = mw.Vector2.one;
        this.mRecordMaxHeightText.renderScale = mw.Vector2.one;
        this.mRecordMaxHeightText.contentColor = mw.LinearColor.red;
    }

    /**隐藏UI */
    private hideUI(): void {
        this.isStart = false;
        this.mCurrentHeightCanvas.visibility = mw.SlateVisibility.Collapsed;
        this.mRecordMaxHeightCanvas.visibility = mw.SlateVisibility.Collapsed;
        Event.dispatchToLocal("IsCanFly", true);
    }

    /**缓入 超过范围的三次方缓动 */
    private backEaseIn(time: number): number {
        return Math.pow(time, 5) + 1.7 * time * Math.sin(Math.PI * time);
    }
}

/**客户端&服务端发送的事件类型 */
export enum ListenerEventsType {
    /**服务端发给指定客户端（显示JumpRecordUI） */
    ServerToAllClient_ShowJumpRecordUI = "ServerToAllClient_ShowJumpRecordUI",
    /**服务端发给所有客户端（隐藏JumpRecordUI） */
    ServerToAllClient_HideJumpRecordUI = "ServerToAllClient_HideJumpRecordUI",
}
