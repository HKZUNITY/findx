
/** 
 * AUTHOR: 爱玩游戏的小胖子
 * TIME: 2023.05.31-17.50.28
 */

import Console from "../Tools/Console";
import { OnClickType } from "../const/Enum";
import GlobalData from "../const/GlobalData";
import { DanceModuleC } from "../module/DanceModule";
import HUDModuleC from "../module/HUDModule/HUDModuleC";
import OnClickPanel_Generate from "../ui-generate/common/OnClickPanel_generate";

export default class OnClickPanel extends OnClickPanel_Generate {
    private hudModuleC: HUDModuleC = null;

    private id: number = -1;
    private onClickType: number = -1;
    private offset: mw.Vector = new mw.Vector(0, 0, 0);
    private obj: mw.GameObject = null;

    /** 
     * 构造UI文件成功后，在合适的时机最先初始化一次 
     */
    protected onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerMiddle;

        this.initData();
        this.bindButtons();
        this.registerActions();
        Console.error("[OnClickPanel-onStart]");
    }

    /**初始化数据 */
    private initData(): void {
        // this.offset = new mw.Vector(0, 0, 0);
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
    }

    /**按钮绑定 */
    private bindButtons(): void {
        this.mClickBtn.onClicked.add(this.onClickButtons.bind(this));
    }

    /**注册事件 */
    private registerActions(): void {
        this.hudModuleC.onJumpAction.add(() => {
            if (this.onClickType == OnClickType.Sit) {
                Event.dispatchToServer("Sit", false, this.id);
            }

            if (this.onClickType == OnClickType.Dance) {
                Event.dispatchToLocal("Dance", false, this.id);
            }
        });
    }

    private onClickButtons(): void {
        if (!this.id) return;
        Console.error("OnClickPanel-this.id = " + this.id);
        this.canUpdate = false;
        this.hide();
        if (this.id == -1) return;
        if (this.onClickType == OnClickType.Sit) {
            Console.error("[Sit] = " + this.id);
            Event.dispatchToServer("Sit", true, this.id);
            Event.dispatchToLocal("achSit", 1);
        }
        else if (this.onClickType == OnClickType.Shake) {
            Console.error("[Shake] = " + this.id);
            this.hudModuleC.onMusicAction.call();
        }
        else if (this.onClickType == OnClickType.Dance) {
            Console.error("[Dance] = " + this.id);
            Event.dispatchToLocal("Dance", true, this.id);
            Event.dispatchToLocal("achDance", 1);
        }
    }

    /**显示NPC按钮 */
    public showBtn(id: number, obj: mw.GameObject, onClickType: OnClickType): void {
        this.id = id;
        this.onClickType = onClickType;
        this.canUpdate = true;
        this.obj = obj;
        let pos = InputUtil.projectWorldPositionToWidgetPosition(this.obj.worldTransform.position.add(this.offset), false).screenPosition;
        this.rootCanvas.position = pos.subtract(this.rootCanvas.size.multiply(0.5));
        this.rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.show();
    }

    /**隐藏NPC按钮 */
    public hideBtn(): void {
        this.canUpdate = false;
        this.hide();
    }

    protected onShow(...params: any[]): void {
        Console.error("[OnClickPanel-onShow]");
        let imageGuid: string = "";
        if (this.onClickType == OnClickType.Sit) {
            imageGuid = GlobalData.sitIconGuid;
        }
        else if (this.onClickType == OnClickType.Shake) {
            imageGuid = GlobalData.shakeIconGuid;
        }
        else if (this.onClickType == OnClickType.Dance) {
            imageGuid = GlobalData.danceIconGuid;
        }
        this.mClickBtn.normalImageGuid = imageGuid;
        this.mClickBtn.pressedImageGuid = imageGuid;
        this.mClickBtn.disableImageGuid = imageGuid;
    }

    protected onHide(...params: any[]): void {
        Console.error("[OnClickPanel-onHide]");
    }

    /**
    * 每一帧调用
    * 通过canUpdate可以开启关闭调用
    * dt 两帧调用的时间差，毫秒
    */
    protected onUpdate(dt: number) {
        if (!this.obj) return;
        let pos: mw.Vector2 = mw.InputUtil.projectWorldPositionToWidgetPosition(this.obj.worldTransform.position.add(this.offset), false).screenPosition;
        this.rootCanvas.position = pos.subtract(this.rootCanvas.size.multiply(0.5));
    }
}
