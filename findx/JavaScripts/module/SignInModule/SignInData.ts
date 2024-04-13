import { Utils } from "../../Tools/utils";

export default class SignInData extends Subdata {
    /**是否已经签到 */
    @Decorator.persistence()
    public isSignIns: boolean[] = [];
    /**上次登录时间 */
    @Decorator.persistence()
    public lastDay: string = "";

    protected initDefaultData(): void {
        for (let i = 0; i < 7; ++i) {
            this.isSignIns.push(false);
        }
        this.lastDay = Utils.getDay();
    }

    /**
     * 保存当天是否已经签到
     * @param day 当天
     */
    public saveIsSignIns(day: number): void {
        this.isSignIns[day] = true;
        this.save(true);
    }

    /**重置签到 */
    public resetIsSignIns(): void {
        for (let i = 0; i < 7; ++i) {
            this.isSignIns[i] = false;
        }
        this.save(true);
    }

    /**
     * 记录今天是那一天
     * @param whatDay 那一天
     */
    public saveLastDay(whatDay: string): void {
        this.lastDay = whatDay;
        this.save(true);
    }
}