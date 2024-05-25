import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import GlobalData from "../../const/GlobalData";
import ShopData from "./ShopData";
import ShopModuleC from "./ShopModuleC";

export default class ShopModuleS extends ModuleS<ShopModuleC, ShopData> {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

    }

    /**保存完成游戏引导 */
    @Decorator.noReply()
    public net_completeGameGuide(): void {
        this.currentData.completeGameGuide();
    }

    /**升级&换装特效音效播放 */
    @Decorator.noReply()
    public net_playEffectAndSoundToPlayer(playType: number): void {
        let effectId: string = "";
        if (playType == 0) {
            effectId = GlobalData.playerAddEffectGuid;
        }
        else if (playType == 1) {
            effectId = GlobalData.upgradeEffectGuid;
        }
        else if (playType == 2) {
            effectId = GlobalData.portalEffectGuid;
        }
        else if (playType == 3) {
            effectId = GlobalData.playerAddEffectGuid;
        }
        GeneralManager.rpcPlayEffectOnPlayer(
            effectId,
            this.currentPlayer,
            mw.HumanoidSlotType.Root,
            1,
            new mw.Vector(0, 0, 0),
            mw.Rotation.zero,
            mw.Vector.one
        );
    }
}