import { AchievementType } from "../../const/Enum";
import AchievementData from "./AchievementData";
import AchievementModuleC from "./AchievementModuleC";

export default class AchievementModuleS extends ModuleS<AchievementModuleC, AchievementData> {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

    }


    /**
     * 保存成就数据
     * @param achievementType 成就类型 
     * @param progress 进度
     * @param isOnComplete 是否完成
     */
    public async net_saveAchievementStage(achievementId: number, achievementType: AchievementType, progress: number, isOnComplete: boolean): Promise<void> {
        await this.currentData.saveAchievementStage(achievementId, achievementType, progress, isOnComplete);
    }

    /**
     * 保存成就提示
     * @param achievementType 成就类型 
     * @param isTipsIndex 提示索引
     */
    public async net_saveAchievementTipStage(achievementType: AchievementType, isTipsIndex: number): Promise<void> {
        await this.currentData.saveAchievementTipStage(achievementType, isTipsIndex);
    }

    @Decorator.noReply()
    public net_saveFirstAch(value: boolean): void {
        this.currentData.saveFirstAch(value);
    }
}