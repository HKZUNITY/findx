import { GameConfig } from "../../config/GameConfig";
import { AchievementType } from "../../const/Enum";

export class Achievement {
    /**成就id */
    achId: number;
    /**进度 */
    progress: number;
    /**是否完成 */
    isOnComplete: boolean;
    /**是提示 */
    isTips: boolean[];

    constructor(achId: number, progress: number, isOnComplete: boolean, isTips: boolean[]) {
        this.achId = achId;
        this.progress = progress;
        this.isOnComplete = isOnComplete;
        this.isTips = isTips;
    }
}

export default class AchievementData extends Subdata {
    /**成就状态 （key-成就类型）*/
    @Decorator.persistence()
    public achievementStage: { [key: number]: Achievement };
    @Decorator.persistence()
    public isFirstAch: boolean = true;
    protected initDefaultData(): void {
        this.achievementStage = {};
        this.isFirstAch = true;
    }

    /**
     * 保存成就数据
     */
    public async saveAchievementStage(achievementId: number, achievementType: AchievementType, progress: number, isOnComplete: boolean): Promise<void> {
        let nextId = GameConfig.Achievements.getElement(achievementId).NextId;
        let achievement: Achievement = null;
        if (this.achievementStage[achievementType]) {
            achievement = this.achievementStage[achievementType];
            if (isOnComplete) {
                if (nextId != 0) {
                    achievement.achId = nextId;
                    achievement.progress = progress;
                    achievement.isOnComplete = false;
                    achievement.isTips = [false, false, false, false];
                }
                else {
                    achievement.isOnComplete = true;
                }
            }
            else {
                achievement.progress = progress;
            }
        }
        else {
            if (isOnComplete) {
                if (nextId != 0) {
                    achievement = new Achievement(nextId, progress, false, [false, false, false, false]);
                }
                else {
                    achievement = new Achievement(achievementId, progress, true, [true, true, true, true]);
                }
            }
            else {
                achievement = new Achievement(achievementId, progress, false, [false, false, false, false]);
            }
        }
        this.achievementStage[achievementType] = achievement;
        await this.save(true);
    }

    /**
     * 保存成就提示
     * @param achievementType 成就类型
     * @param isTipsIndex 提示索引
     */
    public async saveAchievementTipStage(achievementType: AchievementType, isTipsIndex: number): Promise<void> {
        if (this.achievementStage[achievementType]) {
            let achievement = this.achievementStage[achievementType];
            achievement.isTips[isTipsIndex] = true;
            this.achievementStage[achievementType] = achievement;
            await this.save(true);
        }
    }

    public saveFirstAch(value: boolean): void {
        this.isFirstAch = value;
        this.save(true);
    }
}