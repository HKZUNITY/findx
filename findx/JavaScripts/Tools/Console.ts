import GlobalData from "../const/GlobalData";

export default class Console {

    /**普通日志 */
    public static log(...data: any[]): void {
        if (GlobalData.logLevel < 1) return;
        console.log(data);
    }

    /**警告日志 */
    public static warn(...data: any[]): void {
        if (GlobalData.logLevel < 2) return;
        console.warn(data);
    }

    /**报错日志 */
    public static error(...data: any[]): void {
        if (GlobalData.logLevel < 3) return;
        console.error(data);
    }
}