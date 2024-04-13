import Console from "../Tools/Console";
import HUDModuleC from "../module/HUDModule/HUDModuleC";

@Component
export default class MyClearDayNight extends mw.Script {
    private hudModuleC: HUDModuleC = null;
    private get getHUDModuleC(): HUDModuleC {
        if (this.hudModuleC == null) {
            this.hudModuleC = ModuleService.getModule(HUDModuleC);
        }
        return this.hudModuleC;
    }
    // @Core.Property({ displayName: "预加载" })
    // preloadAssets: string = "95623,108338,59832";

    /** S&C */
    /**时钟Count，每现实秒+1 */
    public CountGo: number = 0;
    /**日夜功能时间膨胀系数，默认1，>1变慢，<1变快，
     * 推荐取值
     * 1 - 24分钟过完一天(慢，mc类似)；
     * 0.5 - 12分钟过完一天(较慢)；
     * 0.25 - 6分钟过完一天(较快)；
     * 0.04 - 快速预览日夜循环功能(快)；
     */
    public DayNightTimeScale: number = 0.25;
    /**距离下一阶段还要多少Count，用于连接后、重连后的时间同步，客户端==0已经和服务器同步过了，客户端>0则需要同步 */
    public NextStageTime: number = -1;
    /**下一个阶段是什么 */
    // @Core.Property({ replicated: true, onChanged: "onNextStageChange" })
    public NextStage: string = "清晨";

    /** Only C */

    /**实例，使用MyClearDayNight.instance.xxxx 调用方法 */
    public static instance: MyClearDayNight;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart() {
        MyClearDayNight.instance = this;
        this.useUpdate = true;
        if (SystemUtil.isServer()) {
            setInterval(() => {
                /**清晨 */
                if (this.CountGo == Math.round(360 * this.DayNightTimeScale)) {
                    //     console.log("由清晨到中午的过程，上午");
                    this.NextStage = "中午";
                }
                /**中午 */
                if (this.CountGo == Math.round(720 * this.DayNightTimeScale)) {
                    //     console.log("由中午到傍晚的过程，下午");
                    this.NextStage = "傍晚";
                }
                /**傍晚 */
                if (this.CountGo == Math.round(1080 * this.DayNightTimeScale)) {
                    //     console.log("由傍晚到凌晨的过程，晚上");
                    this.NextStage = "凌晨";
                }
                /**凌晨*/
                if (this.CountGo >= Math.round(1440 * this.DayNightTimeScale)) {
                    // 重置服务器计时器
                    this.CountGo = 0;
                    // console.log("由凌晨进入清晨的过程，凌晨");
                    this.NextStage = "清晨";
                    // 进行全图时间校准
                    Player.getAllPlayers().forEach((player: mw.Player) => {
                        this.SyncTimeToClient(player, this.CountGo, this.NextStage);
                    });
                }
                Console.log("[CurTime] " + this.getCurTime());

                // 时钟，每秒+1
                this.CountGo++;
            }, 1000)

            // 玩家进游戏，同步下发当前服务器时间并改天换日
            Player.onPlayerJoin.add((player: mw.Player) => {
                setTimeout(() => {
                    this.SyncTimeToClient(player, this.CountGo, this.NextStage);
                }, 2000);
            });
            // 玩家从后台切回游戏，同步下发当前服务器时间并改天换日
            Event.addClientListener("I'm back, Sync time pls", (player: mw.Player) => {
                setTimeout(() => {
                    this.SyncTimeToClient(player, this.CountGo, this.NextStage);
                }, 2000);
            })

        }
        if (SystemUtil.isClient()) {
            // this.CheckWorldObj();
            Skybox.moonTextureID = "95623";

            setInterval(() => {
                /**清晨 */
                if (this.CountGo == Math.round(360 * this.DayNightTimeScale)) {
                    // console.log("由清晨到中午的过程，上午");
                    this.ChangeSky(-80, -90, 8, true, 1.2, 1.57);
                    Skybox.skyDomeTextureID = "108338";
                    this.NextStage = "中午";
                }
                /**中午 */
                if (this.CountGo == Math.round(720 * this.DayNightTimeScale)) {
                    // console.log("由中午到傍晚的过程，下午");
                    this.ChangeSky(100, 0, 2, true, 0.3, 0.3);
                    this.NextStage = "傍晚";
                }
                /**傍晚 */
                if (this.CountGo == Math.round(1080 * this.DayNightTimeScale)) {
                    // console.log("由傍晚到凌晨的过程，晚上");
                    this.ChangeSky(-80, -90, 0.5, false, 0.05, 0.4);
                    Skybox.skyDomeTextureID = "59832";
                    this.NextStage = "凌晨";
                }
                /**凌晨*/
                if (this.CountGo >= Math.round(1440 * this.DayNightTimeScale)) {
                    // 重置计时器
                    this.CountGo = 0;
                    // console.log("由凌晨进入清晨的过程，凌晨");
                    this.ChangeSky(100, 0, 1, false, 0.2, 0.2);
                    this.NextStage = "清晨";
                }
                this.getHUDModuleC.showTime(this.getCurTime());
                Console.log("[CurTime] " + this.getCurTime());

                // 时钟，每秒+1
                this.CountGo++;
            }, 1000);

            // 客户端重连回来，向服务器报道
            Player.onPlayerReconnect.add(() => {
                Event.dispatchToServer("I'm back, Sync time pls");
            });
        }
    }


    ////////////////////////////////////
    //    实用的方法
    ////////////////////////////////////

    /**[双端可用] 获取当前时间 HH:MM */
    public getCurTime(): string {
        return this.CountToTime(this.CountGo);
    }

    ////////////////////////////////////
    //    开发时用到的接口
    ////////////////////////////////////

    /**[双端] 根据现在的countgo，更新下一个状态 */
    public UpdateNextStage() {
        if (this.CountGo >= Math.round(720 * this.DayNightTimeScale)) {
            if (this.CountGo >= Math.round(1080 * this.DayNightTimeScale)) {
                this.NextStage = "凌晨";
            }
            else {
                this.NextStage = "傍晚";
            }
        }
        else {
            if (this.CountGo >= Math.round(360 * this.DayNightTimeScale)) {
                this.NextStage = "中午";
            }
            else {
                this.NextStage = "清晨";
            }
        }
    }

    /**[服务端→客户端]服务端向指定客户端同步时间
     * @param player 指定客户端玩家
     * @param count count时间
     */
    @mw.RemoteFunction(mw.Client)
    public SyncTimeToClient(player: mw.Player, count: number, nextStage: string) {
        if (SystemUtil.isClient()) {
            // 将count数同步到当前客户端
            this.CountGo = count;
            // 计算要到下一个阶段的时间count数
            this.NextStageTime = Math.round(Math.round(360 * this.DayNightTimeScale) - (this.CountGo % Math.round(360 * this.DayNightTimeScale)));
            // 同步改天换日
            if (nextStage == "中午") {
                this.ChangeSky(100, 0, 1, false, 0.2, 0.2, 0.02);
                setTimeout(() => {
                    this.ChangeSky(-80, -90, 8, true, 1.2, 1.57, this.NextStageTime);
                }, 60);
            }
            if (nextStage == "傍晚") {
                this.ChangeSky(-80, -90, 8, true, 1.2, 1.57, 0.02);
                setTimeout(() => {
                    this.ChangeSky(100, 0, 2, true, 0.3, 0.3, this.NextStageTime);
                }, 60);
            }
            if (nextStage == "凌晨") {
                this.ChangeSky(100, 0, 2, true, 0.3, 0.3, 0.02);
                setTimeout(() => {
                    this.ChangeSky(-80, -90, 0.5, false, 0.05, 0.4, this.NextStageTime);
                }, 60);
            }
            if (nextStage == "清晨") {
                this.ChangeSky(-80, -90, 0.5, false, 0.05, 0.4, 0.02);
                setTimeout(() => {
                    this.ChangeSky(100, 0, 1, false, 0.2, 0.2, this.NextStageTime);
                }, 60);
            }
        }
    }

    /** [客户端]改天换日的核心方法，使用Tween动画实现，纯客户端调用
     * @param yawAngle [瞬变] 日月朝向角度
     * @param pitchAngle [渐变] 俯仰角度
     * @param Dir_intensity [渐变] 日月光照强度
     * @param ChangeIntoSun [瞬变] 切换太阳和月亮，T=切换进太阳，F=切换进月亮
     * @param skyDomeIntensity [渐变] 天空盒亮度
     * @param Sky_intensity [渐变] 全局光照
     * @param time [可选] 改天换日所用Count，不带则用默认的时间360*scale
     */
    // @Core.Function(Core.Client, Core.Multicast)
    public ChangeSky(yawAngle: number, pitchAngle: number, Dir_intensity: number, ChangeIntoSun: boolean, skyDomeIntensity: number, Sky_intensity: number, time?: number) {
        if (SystemUtil.isServer()) { return; }

        if (time == undefined) {
            time = 360 * this.DayNightTimeScale;
        }
        time *= 1000;
        // this.CheckWorldObj();
        Lighting.yawAngle = yawAngle;
        Skybox.sunVisible = ChangeIntoSun;
        Skybox.moonVisible = !ChangeIntoSun;
        new Tween({
            a: Lighting.brightness,
            b: Lighting.pitchAngle,
            c: Skybox.skyDomeIntensity,
            d: Lighting.brightness
        }).to({
            a: Dir_intensity,
            b: pitchAngle,
            c: skyDomeIntensity,
            d: Sky_intensity
        }, time).onUpdate((obj) => {
            Lighting.brightness = obj.a;
            Lighting.pitchAngle = obj.b;
            Skybox.skyDomeIntensity = obj.c;
            Lighting.brightness = obj.d;
        }).start();
    }



    ////////////////////////////////////
    //    开发时用到的工具
    ///////////////////////////////////

    /**转换一个整数为分：秒格式
     * @param int 传入的整数，没做容错，别传负数啦
     * @param add0 [可选] 是否补零
     * @returns 返回规整后的分：秒 如12：05
     */
    public CountToTime(int: number, add0?: boolean): string {
        int = int / this.DayNightTimeScale;
        let mm = parseInt(int / 60 + "") + "";
        let ss = Math.round(int - 60 * parseInt(int / 60 + "")) + "";
        if (add0 == null || add0 == true) {
            if (mm.length == 1) {
                mm = "0" + mm;
            }
            if (ss.length == 1) {
                ss = "0" + ss;
            }
        }
        return mm + ":" + ss + "";
    }

    /**将分：秒格式的字符串转换为整数
     * @param timeStr 传入的字符串，格式为 "mm:ss"
     * @returns 返回相同时间的整数
     */
    public TimeToCount(timeStr: string): number {
        // 将字符串分解为分和秒
        let [mm, ss] = timeStr.split(":").map(Number);
        // 转换时间为总秒数
        let time = mm * 60 + ss;
        // 返回转换后的整数，需要注意的是如果在CountToTime中使用了DayNightTimeScale来缩放，这里也需要相应的缩放
        return time * this.DayNightTimeScale;
    }

    /**周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        TweenUtil.TWEEN.update();
    }
}