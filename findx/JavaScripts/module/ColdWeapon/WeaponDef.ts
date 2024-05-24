import Console from "../../Tools/Console";

/** 冷兵器节点类型 */
export enum NodeType {

    /** 动画 */
    Animation = 1,
    /** 特效 */
    Eff = 2,
    /** 移动 */
    Move = 3,
    /** 音效 */
    Audio = 4,
    /** 技能判定区域 */
    SkillRect = 5,
}

/** 节点信息 */
export class NodeInfo {

    /** 节点类型 */
    public type: string = "";
    /** 节点Guid */
    public guid: string = "";
    /** 持续时间 */
    public duration: string = "";
    /** 击打时间 */
    public hitLength: string = "";
    /** 前摇时间  */
    public frontRockLength: string = "";
    /** 是否蓄力 */
    public isCharge: string = "0";
    /** 是否自动播放 */
    public isAutoPlay: string = "0";

    /** 延迟播放时间 */
    public delayPlayTime: string = "";
    /** 插槽位置 */
    public slotIndex: string = "-1";
    /** 停止时间 */
    public stopTime: string = "";
    /** 偏移坐标 */
    public offsetPos: Array<string> = ["0", "0", "0"];
    /** 偏移旋转 */
    public offsetRotation: Array<string> = ["0", "0", "0"];
    /** 偏移缩放 */
    public offsetScale: Array<string> = ["0", "0", "0"];
    /** 特效颜色偏移 */
    public colorHex: string = "";

    /** 移动参数 */
    /** 是否瞬移 1 瞬移 其它 插值 */
    public isToPos: string = "";
    /** 移动朝向 1 前 -1 后*/
    public moveDir: string = "";
    /** 移动距离 */
    public moveDistance: string = "";

    /** 技能判定参数 */
    /** 角度 */
    public skillAngle: string = "0";
    /** 偏移距离 */
    public skillOffsetDis: string = "0";
    /** 半径 */
    public skillRadius: string = "0";
    /** 高度 */
    public skillHeight: string = "0";
    /** 长度 */
    public skillLength: string = "0";
    /** 宽度 */
    public skillWidth: string = "0";


}

/**
 * 所有节点信息
 */
export class AnimationInfo {

    /** 战斗待机动画 */
    public charFightIdelAniId: string = "";

    /** 动画信息 */
    public infos: NodeInfo[] = [];
}

/** 冷兵器预定义类 */
export abstract class WeaponPreDefine extends mw.Script {

    /** 所有需要更新的回调 */
    protected allUpdateCallback: ((dt: number) => boolean)[] = [];

    /** 客户端播放特效 */
    protected abstract client_PlayEffect(guid: string, stopTime: number, slotIndex: number,
        offsetPos: mw.Vector, offsetRotate: mw.Rotation, offsetScale: mw.Vector, colorHex: string)

    /** 服务器停止所有时间 */
    protected abstract server_StopAllTimer();

    /** 服务器设置指定对象坐标 */
    protected abstract server_setCharPos(guid: string, pos: mw.Vector);

    /** 服务器设置对象位移到指定位置 */
    protected abstract server_setCharToPos(guid: string, startPos: mw.Vector, pos: mw.Vector, time: number)

    /** 服务器播放特效中继函数 */
    protected abstract server_playEffectProxy(guid: string, stopTime: number, slotIndex: number,
        offsetPos: mw.Vector, offsetRotate: mw.Rotation, offsetScale: mw.Vector, colorHex: string)

    /** 服务器停止所有特效 */
    protected abstract server_StopAllEffectProxy();

    /** 服务器穿戴装备 */
    protected abstract server_EquipWeapon(guid: string, isRight: boolean);

    /** 服务器设置角色guid */
    protected abstract server_setChar(guid: string);

}

/** 冷兵器数据层 */
export abstract class WeaponData extends WeaponPreDefine {

    /** 预加载资源 */
    // @mw.Property({ displayName: "预加载资源" })
    // public preloadAssets: string = "";

    /** 动画json */
    @mw.Property({ displayName: "动作数据", arrayDefault: ["{\"infos\":[{\"type\":\"1\",\"guid\":\"85955\",\"duration\":\"2000\",\"hitLength\":\"600\",\"frontRockLength\":\"600\",\"delayPlayTime\":\"\",\"slotIndex\":\"-1\",\"stopTime\":\"\",\"offsetPos\":[\"0\",\"0\",\"0\"],\"offsetRotation\":[\"0\",\"0\",\"0\"],\"offsetScale\":[\"0\",\"0\",\"0\"]},{\"type\":\"1\",\"guid\":\"85960\",\"duration\":\"2000\",\"hitLength\":\"600\",\"frontRockLength\":\"600\",\"delayPlayTime\":\"\",\"slotIndex\":\"-1\",\"stopTime\":\"\",\"offsetPos\":[\"0\",\"0\",\"0\"],\"offsetRotation\":[\"0\",\"0\",\"0\"],\"offsetScale\":[\"0\",\"0\",\"0\"]},{\"type\":\"1\",\"guid\":\"85959\",\"duration\":\"2000\",\"hitLength\":\"600\",\"frontRockLength\":\"600\",\"delayPlayTime\":\"\",\"slotIndex\":\"-1\",\"stopTime\":\"\",\"offsetPos\":[\"0\",\"0\",\"0\"],\"offsetRotation\":[\"0\",\"0\",\"0\"],\"offsetScale\":[\"0\",\"0\",\"0\"]},{\"type\":\"1\",\"guid\":\"85957\",\"duration\":\"2000\",\"hitLength\":\"600\",\"frontRockLength\":\"600\",\"delayPlayTime\":\"\",\"slotIndex\":\"-1\",\"stopTime\":\"\",\"offsetPos\":[\"0\",\"0\",\"0\"],\"offsetRotation\":[\"0\",\"0\",\"0\"],\"offsetScale\":[\"0\",\"0\",\"0\"]}]}"] })
    protected animationJsons: string[] = [];

    /** 动画信息 */
    protected animationInfo: AnimationInfo[] = [];

    /** timer */
    protected allTimer: any[] = [];

    /** 宿主角色 */
    @mw.Property({ replicated: true, onChanged: "client_OnChangeCharGuid" })
    protected charGuid: string = "";
    protected char: mw.Character | mw.Character;

    /** 初始化完成回调 */
    protected _onInitComplateCall: () => void;

    /** 是否初始化完成 */
    protected _isInit: boolean = false;

    /** 启动所有需要更新的回调 */
    protected startUpdateInterval(callback: (dt: number) => boolean) {
        this.allUpdateCallback.push(callback);
    }

    /** 停止所有定时器 */
    protected stopAllTimer() {
        this.allTimer.forEach(e => {
            clearTimeout(e);
            clearInterval(e);
        })
        this.server_StopAllTimer();
        this.allTimer = [];
        this.allUpdateCallback = [];
    }

    /**
     * 初始化角色对象
     * @param character 角色
     * @param onInitComplateCall 初始化完成回调
     * @returns 
     */
    public initCharacter(character: mw.Character | mw.Character, onInitComplateCall: () => void): boolean {
        this.char = character;
        this.server_setChar(this.char.gameObjectId);
        this._onInitComplateCall = onInitComplateCall;
        if (this._isInit) {
            this._onInitComplateCall();
        }
        return true;
    }

    onStart() {
        super.onStart();

        //Console.error("创建完成 weapon");
        this.animationInfo = [];

        this.animationJsons.forEach(e => {

            let info = JSON.parse(e) as AnimationInfo;
            let newInfo = new AnimationInfo();

            if (info) {

                Object.keys(info).forEach(e => {

                    if (info[e] instanceof Object) {
                        return;
                    }
                    newInfo[e] = info[e];

                })

                info.infos.forEach(e => {
                    let nodeInfo = new NodeInfo();
                    Object.keys(e).forEach(k => {
                        nodeInfo[k] = e[k]
                    })
                    Console.error(nodeInfo);
                    newInfo.infos.push(nodeInfo);
                })
                this.animationInfo.push(newInfo);
            } else {
                Console.error("解析json错误 : " + e);
            }
        })

        if (this.animationInfo.length != this.animationJsons.length) {
            Console.error("解析json错误 : 动画数量和解析数量不一致");
        }
        Console.error(this.animationInfo);
        if (!this._isInit) {
            this._isInit = true;
            if (this._onInitComplateCall)
                this._onInitComplateCall();
        }

    }

    onUpdate(dt: number) {
        super.onUpdate(dt);

        let newList = [];
        let updateList = false;

        this.allUpdateCallback.forEach(e => {
            let res = e(dt);
            if (res) {
                newList.push(e);
            } else {
                updateList = true;
            }
        })

        if (updateList)
            this.allUpdateCallback = newList;
    }

}