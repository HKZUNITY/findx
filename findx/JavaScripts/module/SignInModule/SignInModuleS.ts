import SignInData from "./SignInData";
import SignInModuleC from "./SignInModuleC";

export default class SignInModuleS extends ModuleS<SignInModuleC, SignInData> {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

    }

    /**
     * 保存当天是否已经签到
     * @param day 当天
     */
    @Decorator.noReply()
    public net_saveIsSignIns(day: number): void {
        this.currentData.saveIsSignIns(day);
    }

    /**重置签到 */
    @Decorator.noReply()
    public net_resetIsSignIns(): void {
        this.currentData.resetIsSignIns();
    }

    /**
     * 记录今天是那一天
     * @param whatDay 那一天
     */
    @Decorator.noReply()
    public net_saveLastDay(whatDay: string): void {
        this.currentData.saveLastDay(whatDay);
    }
}