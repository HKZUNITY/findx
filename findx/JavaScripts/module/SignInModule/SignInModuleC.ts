import { Utils } from "../../Tools/utils";
import P_Tips from "../../Common/P_Tips";
import HUDModuleC from "../HUDModule/HUDModuleC";
import SignInData from "./SignInData";
import SignInModuleS from "./SignInModuleS";
import SignInPanel from "./ui/SignInPanel";

export default class SignInModuleC extends ModuleC<SignInModuleS, SignInData> {
    private hudModuleC: HUDModuleC = null;
    private signInPanel: SignInPanel = null;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initData();
        this.registerAction();
    }

    /**初始化数据 */
    private initData(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.signInPanel = mw.UIService.getUI(SignInPanel);
    }

    /**注册事件 */
    private registerAction(): void {
        this.hudModuleC.onOpenSignInAction.add(() => {
            this.signInPanel.show();
        });
        this.hudModuleC.onOpenSignInAction1.add(() => {
            this.isMonday();
        });
    }

    protected onEnterScene(sceneType: number): void {
        // TimeUtil.delaySecond(5).then(() => {
        //     this.isMonday();
        // });
    }

    private isSignIns: boolean[] = [];
    /**是否是星期一 */
    private isMonday(): void {
        let curWhatDay = Utils.getDay();
        this.isSignIns = this.data.isSignIns;
        this.resetDays();
        if (this.data.lastDay != curWhatDay) {
            this.resetDay();
            this.saveLastDay(curWhatDay);
            if (Utils.getWhatDay() == "1") {
                this.resetIsSignIns();
            }
        }
        this.signInPanel.show();
    }

    private resetDay(): void {
        let j = Number(Utils.getWhatDay()) - 1;
        for (let i = j; i < 7; ++i) {
            if (this.isSignIns[i]) {
                this.isSignIns[i] = false;
            }
        }
    }

    private resetDays(): void {
        let j = Number(Utils.getWhatDay()) - 1;
        for (let i = j + 1; i < 7; ++i) {
            if (this.isSignIns[i]) {
                this.isSignIns[i] = false;
            }
        }
    }

    /**得到是否已经签到的数组 */
    public getIsSignIns(): boolean[] {
        return this.isSignIns;
    }

    /**
     * 保存当天是否已经签到
     * @param day 当天
     */
    public saveIsSignIns(day: number): void {
        this.getSignInReward(day);
        this.isSignIns[day] = true;
        this.server.net_saveIsSignIns(day);
    }

    /**重置签到 */
    public resetIsSignIns(): void {
        for (let i = 0; i < 7; ++i) {
            this.isSignIns[i] = false;
        }
        this.server.net_resetIsSignIns();
    }

    /**
     * 记录今天是那一天
     * @param whatDay 那一天
     */
    public saveLastDay(whatDay: string): void {
        this.server.net_saveLastDay(whatDay);
    }

    /**得到签到奖励 */
    private getSignInReward(day: number): void {
        this.signInPanel.hide();
        switch (day) {
            case 0:
                this.hudModuleC.setCurAttackValue(100);
                this.hudModuleC.setMaxHp(1000);
                P_Tips.show("得到奖励攻击力+100生命值+1000");
                break;
            case 1:
                this.hudModuleC.setCurAttackValue(200);
                this.hudModuleC.setMaxHp(2000);
                P_Tips.show("得到奖励攻击力+200生命值+2000");
                break;
            case 2:
                this.hudModuleC.setCurAttackValue(300);
                this.hudModuleC.setMaxHp(3000);
                P_Tips.show("得到奖励攻击力+300生命值+3000");
                break;
            case 3:
                this.hudModuleC.setCurAttackValue(400);
                this.hudModuleC.setMaxHp(4000);
                P_Tips.show("得到奖励攻击力+400生命值+4000");
                break;
            case 4:
                this.hudModuleC.setCurAttackValue(500);
                this.hudModuleC.setMaxHp(5000);
                P_Tips.show("得到奖励攻击力+500生命值+5000");
                break;
            case 5:
                this.hudModuleC.setCurAttackValue(600);
                this.hudModuleC.setMaxHp(6000);
                P_Tips.show("得到奖励攻击力+600生命值+6000");
                break;
            case 6:
                this.hudModuleC.firstGame2();
                this.hudModuleC.setCurAttackValue(700);
                this.hudModuleC.setMaxHp(7000);
                P_Tips.show("得到奖励攻击力+700生命值+7000");
                break;
            default:
                break;
        }
    }
}