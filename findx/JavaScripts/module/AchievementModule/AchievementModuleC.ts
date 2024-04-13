import Console from "../../Tools/Console";
import { IAchievementsElement } from "../../config/Achievements";
import { GameConfig } from "../../config/GameConfig";
import { AchievementType } from "../../const/Enum";
import HUDModuleC from "../HUDModule/HUDModuleC";
import ShopModuleC from "../ShopModule/ShopModuleC";
import AchievementData, { Achievement } from "./AchievementData";
import AchievementModuleS from "./AchievementModuleS";
import AchievementPanel from "./ui/AchievementPanel";
import CompletedPanel from "./ui/CompletedPanel";

export default class AchievementModuleC extends ModuleC<AchievementModuleS, AchievementData> {
    private hudModuleC: HUDModuleC = null;
    private achievementpanel: AchievementPanel = null;
    private completedPanel: CompletedPanel = null;
    /**执行成就（参数成就类型-对应次数） */
    public onExecuteAchievementAction: Action2<AchievementType, number> = new Action2<AchievementType, number>();
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initDatas();
        this.bindActions();
    }

    /**初始化数据 */
    private initDatas(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.achievementpanel = mw.UIService.getUI(AchievementPanel);
        this.completedPanel = mw.UIService.getUI(CompletedPanel);
        this.initAchievements();
    }

    protected onEnterScene(sceneType: number): void {
        TimeUtil.delaySecond(12).then(() => {
            if (this.data.isFirstAch) {
                let num = ModuleService.getModule(ShopModuleC).getLevel();
                this.ach(num);
                this.onExecuteAchievementAction.call(1, num);
                this.server.net_saveFirstAch(false);
            }
        });
    }

    /**时间绑定 */
    private bindActions(): void {
        this.hudModuleC.onOpenAchAction.add(() => {
            this.achievementpanel.show();
        })
        Event.addLocalListener("achMaxHight", (value: number) => {
            this.onExecuteAchievementAction.call(6, value);
        });
        Event.addLocalListener("dianji", (value: number) => {
            this.onExecuteAchievementAction.call(8, value);
        });
        Event.addLocalListener("achSit", (value: number) => {
            this.onExecuteAchievementAction.call(11, value);
        });
        Event.addLocalListener("achDance", (value: number) => {
            this.onExecuteAchievementAction.call(10, value);
        });
        Event.addLocalListener("RaffAch", (value: number) => {
            this.onExecuteAchievementAction.call(17, value);
        });
        Event.addLocalListener("achUse", (value: number) => {
            this.onExecuteAchievementAction.call(18, value);
        });
        this.onExecuteAchievementAction.add(this.executeAchievementAction.bind(this));
    }

    /**成就表数据 */
    private achievements: IAchievementsElement[] = [];
    /**根据难易程度分类 */
    private achievementGradeMap: Map<number, Achievement[]> = new Map<number, Achievement[]>();
    /**根据成就类型分类 */
    private achievementJudgeMap: Map<number, IAchievementsElement> = new Map<number, IAchievementsElement>();
    /**初始化成就数据 */
    private initAchievements(): void {
        this.achievements = GameConfig.Achievements.getAllElement();
        for (let i = 0; i < this.achievements.length; ++i) {
            let judge = this.achievements[i].Judge;
            if (this.achievementJudgeMap.has(judge)) continue;
            if (this.data.achievementStage[judge]) {
                let achId = this.data.achievementStage[judge].achId;
                this.achievementJudgeMap.set(judge, this.achievements[achId - 1]);
            }
            else {
                this.achievementJudgeMap.set(judge, this.achievements[i]);
            }
        }
        // oTraceError("[AchievementModuleC--initAchievements] achievementJudgeMap.size = ", this.achievementJudgeMap.size);
    }

    /**获取成就数据 */
    public getAchievementGradeMap(): Map<number, Achievement[]> {
        this.achievementGradeMap.clear();
        for (let [key, value] of this.achievementJudgeMap) {
            let grade = value.Grade;
            let arr: Achievement[] = [];
            if (this.achievementGradeMap.has(grade)) {
                arr = this.achievementGradeMap.get(grade);
            }
            if (this.data.achievementStage[key]) {
                arr.push(this.data.achievementStage[key]);
            }
            else {
                arr.push(new Achievement(value.id, 0, false, [false, false, false, false]));
            }
            this.achievementGradeMap.set(grade, arr);
        }
        this.sortAchievementGradeMap();
        return this.achievementGradeMap;
    }

    /**排序 */
    private sortAchievementGradeMap(): void {
        for (let [key, value] of this.achievementGradeMap) {
            value.sort((a, b) => {
                return b.progress - a.progress;
            });
        }
        let arrayObj = Array.from(this.achievementGradeMap);
        arrayObj.sort((a, b) => {
            return a[0] - b[0];
        });
        this.achievementGradeMap = new Map<number, Achievement[]>(arrayObj);
    }

    /**执行成就 */
    private executeAchievementAction(achievementType: AchievementType, num: number): void {
        this.saveAchievementStage(achievementType, num);
    }

    /**保存成就数据 */
    private async saveAchievementStage(achievementType: AchievementType, num: number): Promise<void> {
        let progress = 0;
        let tragetNum = 0;
        let achievementId = 0;
        let isOnComplete = false;
        if (this.data.achievementStage[achievementType]) {
            let achievement = this.data.achievementStage[achievementType];
            if (achievement.isOnComplete) {
                Console.error("[成就ID为" + achievement.achId + "的成就已完成]");
                return;
            }
            else {
                progress = achievement.progress + num;
                tragetNum = GameConfig.Achievements.getElement(achievement.achId).TragetNum;
                achievementId = achievement.achId;
                isOnComplete = (progress >= tragetNum) ? true : false;
                if (isOnComplete) progress = 0;
            }
        }
        else {
            if (!this.achievementJudgeMap.has(achievementType)) {
                Console.error("[成就类型为" + achievementType + "的成就不存在]");
                return;
            }
            let achievementsElement = this.achievementJudgeMap.get(achievementType);
            progress = num;
            tragetNum = achievementsElement.TragetNum;
            achievementId = achievementsElement.id;
            isOnComplete = (progress >= tragetNum) ? true : false;
            if (isOnComplete) progress = 0;
        }
        await this.server.net_saveAchievementStage(achievementId, achievementType, progress, isOnComplete);
        await this.achievementTips(achievementId, achievementType, progress, tragetNum, isOnComplete);
    }

    /**成就提示 */
    private async achievementTips(achievementId: number, achievementType: AchievementType, progress: number, tragetNum: number, isOnComplete: boolean): Promise<void> {
        Console.error("[成就ID为" + achievementId + "的成就进度为" + progress + "/" + tragetNum + "]");
        let currentValue = Number((progress / tragetNum).toFixed(2));
        if (isOnComplete) {
            this.completedPanel.showCompletedTips(achievementId, isOnComplete, progress, tragetNum, currentValue);
            let achE = GameConfig.Achievements.getElement(achievementId);
            switch (achE.RewardType) {
                case 1:
                    this.hudModuleC.addLv(achE.RewardNum);
                    break;
                case 2:
                    this.hudModuleC.setMaxHp(achE.RewardNum);
                    break;
                case 3:
                    this.hudModuleC.setCurAttackValue(achE.RewardNum);
                    break;
                default:
                    break;
            }
        }
        else {
            let isTips: boolean = true;
            let isTipsIndex: number = -1;
            let achievement = this.data.achievementStage[achievementType];
            if (currentValue >= 0.25 && currentValue < 0.5) {
                isTips = achievement.isTips[0];
                isTipsIndex = 0;
            }
            else if (currentValue >= 0.5 && currentValue < 0.75) {
                isTips = achievement.isTips[1];
                isTipsIndex = 1;
            }
            else if (currentValue >= 0.75 && currentValue < 0.9) {
                isTips = achievement.isTips[2];
                isTipsIndex = 2;
            }
            else if (currentValue >= 0.9 && currentValue < 1) {
                isTips = achievement.isTips[3];
                isTipsIndex = 3;
            }
            if (isTips || isTipsIndex == -1) return;
            await this.server.net_saveAchievementTipStage(achievementType, isTipsIndex);
            this.completedPanel.showCompletedTips(achievementId, isOnComplete, progress, tragetNum, currentValue);
        }
    }

    public ach(num: number): void {
        this.onExecuteAchievementAction.call(2, num);
        this.onExecuteAchievementAction.call(20, num);
        this.onExecuteAchievementAction.call(21, num);
        this.onExecuteAchievementAction.call(22, num);
        this.onExecuteAchievementAction.call(23, num);
        this.onExecuteAchievementAction.call(24, num);
        this.onExecuteAchievementAction.call(25, num);
        this.onExecuteAchievementAction.call(26, num);
        this.onExecuteAchievementAction.call(27, num);
        this.onExecuteAchievementAction.call(28, num);
        this.onExecuteAchievementAction.call(29, num);
    }
}