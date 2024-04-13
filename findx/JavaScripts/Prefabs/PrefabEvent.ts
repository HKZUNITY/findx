import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
/*
 * @Description: Prefab 通用协议
 */

import Console from "../Tools/Console";

export namespace PrefabEvent {

    /**
     * 网络事件key
     */
    var _onEventNetKey = "PrefabEventNeyKey";
    /**
     * 本地事件key
     */
    var _onEventKey = "PrefabEvetKey";

    /**
     * 重新提交数据保存
     */
    var _retrySetCustomDataList: Array<{ key: string, val: string }> = [];

    /**
     * 初始化事件监听器
     */
    function initEvent() {
        if (mwext["PrefabEvent"]) {
            return;
        }
        mwext["PrefabEvent"] = true;

        if (SystemUtil.isServer()) {
            DataStorage.setTemporaryStorage(mw.SystemUtil.isPIE);

            Event.addLocalListener("__setCustomDataCache", (k: string, v: string) => {
                _retrySetCustomDataList.push({ key: k, val: v })
            })

            setInterval(() => {
                let keyMap = new Map();
                _retrySetCustomDataList.forEach(e => {
                    keyMap.set(e.key, e.val);
                })
                _retrySetCustomDataList = [];
                keyMap.forEach((v, k, maps) => {
                    _retrySetCustomDataList.push({ key: k, val: v });
                })
                while (_retrySetCustomDataList.length > 0) {
                    let data = _retrySetCustomDataList.shift();
                    if (data) {
                        DataStorage.asyncSetData(data.key, data.val).then((res) => {
                            if (res != mw.DataStorageResultCode.Success) {
                                _retrySetCustomDataList.push(data);
                            }
                        }).catch((err) => {
                            _retrySetCustomDataList.push(data);
                        })
                    }
                }

            }, 6500);
        }

        var call = (clazzName: string, funcName: string, ...params: any[]) => {
            if (!PrefabEvent[clazzName]) {
                Console.error("无效协议 : " + clazzName);
                return;
            }
            if (!PrefabEvent[clazzName][funcName]) {
                Console.error("无效协议 : " + clazzName + ":" + funcName);
                return;
            }
            Console.log("调用 : " + _onEventKey + ":" + clazzName + ":" + funcName);
            Event.dispatchToLocal(_onEventKey + ":" + clazzName + ":" + funcName, ...params);
        }

        if (mw.SystemUtil.isServer()) {
            Event.addClientListener(_onEventNetKey, (player: mw.Player, clazzName: string, funcName: string, ...params: any[]) => {
                call(clazzName, funcName, ...params);
            });
        }
        if (mw.SystemUtil.isClient()) {
            Event.addServerListener(_onEventNetKey, (clazzName: string, funcName: string, ...params: any[]) => {
                call(clazzName, funcName, ...params);
            });
        }
    }

    /**
     * 回调客户端事件
     * @param clazzName 
     * @param funcName 
     * @param params 
     */
    function callClientFunc(clazzName: string, funcName: string, ...params: any[]) {
        Event.dispatchToLocal(_onEventKey + ":" + clazzName + ":" + funcName, ...params);

    }

    /**
     * 回调事件
     * @param clazzName 
     * @param funcName 
     * @param params 
     */
    function callFunc(clazzName: string, funcName: string, ...params: any[]) {

        if (mw.SystemUtil.isClient()) {
            Event.dispatchToServer(_onEventNetKey, clazzName, funcName, ...params);
        }
        if (mw.SystemUtil.isServer()) {
            Event.dispatchToAllClient(_onEventNetKey, clazzName, funcName, ...params);
        }

        Event.dispatchToLocal(_onEventKey + ":" + clazzName + ":" + funcName, ...params);

    }

    /**
     * 监听事件
     * @param clazzName 
     * @param funcName 
     * @param callback 
     */
    function onFunc(clazzName: string, funcName: string, callback: any): mw.EventListener {
        Console.log("注册 : " + _onEventKey + ":" + clazzName + ":" + funcName);
        return Event.addLocalListener(_onEventKey + ":" + clazzName + ":" + funcName, callback);
    }

    /**
     * 存档工具
     */

    class DBSaveBase {
        public value: any;
    }

    /**
 * 存档工具
 */
    export class DBServerTool {

        /**
         * 获取玩家数据缓存
         * @param playerId 
         * @returns 
         */
        private static getPlayerDataCache(playerId: string): any {
            let dataCache = null;

            if (mwext["PrefabEventDataCache"]) {
                dataCache = mwext["PrefabEventDataCache"];
            } else {
                mwext["PrefabEventDataCache"] = {};
                dataCache = mwext["PrefabEventDataCache"];
            }

            if (!dataCache[playerId]) {
                dataCache[playerId] = {};
            }
            return dataCache[playerId];
        }

        /**
         * (服务端)获取存档
         * @param playerId 
         * @param key 
         * @returns 
         */
        public static async asyncGetValue<T>(playerId: string, key: string): Promise<T> {
            //Console.error("asyncGetValue : 获取存档数据开始");
            return new Promise<T>((resolve: (v: T) => void, reject: (reason: any) => void) => {

                let playerDataCache = this.getPlayerDataCache(playerId);
                let dataKey = key + "_" + playerId + "_key";
                let dataVal = null;

                let keys = Object.keys(playerDataCache);
                keys.forEach((v, i, arr) => {
                    if (v == dataKey) {
                        dataVal = playerDataCache[dataKey];
                    }
                })

                if (dataVal) {
                    let res: DBSaveBase = null;
                    let db = dataVal as string;
                    if (!db) {
                        resolve(null);
                        return
                    }
                    res = JSON.parse(db) as DBSaveBase;
                    resolve(res.value);
                    return;
                }

                GeneralManager.asyncRpcGetData(dataKey).then((v) => {

                    let res: DBSaveBase = null;
                    let db = v as string;
                    if (!db) {
                        resolve(null);
                    }
                    res = JSON.parse(db) as DBSaveBase;
                    playerDataCache[dataKey] = db;
                    //Console.error("asyncGetValue : 获取存档数据成功");
                    resolve(res.value);

                }).catch(err => {

                    Console.log(err);
                    reject("不存在这份存档，可能是新玩家");

                })

            });

        }

        /**
         * (服务端)设置存档
         * @param playerId 
         * @param key 
         * @param val 
         */
        public static async asyncSetValue(playerId: string, key: string, val: any): Promise<void> {

            return new Promise((resolve: () => void, reject: (reason: any) => void) => {

                let data = new DBSaveBase();
                data.value = val;
                let dataStr = JSON.stringify(data);

                let playerDataCache = this.getPlayerDataCache(playerId);

                let dataKey = key + "_" + playerId + "_key";

                if (playerDataCache[dataKey] == dataStr) {
                    resolve();
                    return;
                }

                playerDataCache[dataKey] = dataStr;

                Event.dispatchToLocal("__setCustomDataCache", key + "_" + playerId + "_key", dataStr)
                resolve();



            });
        }

    }

    /**
     * 属性类型
     */
    export enum AttrType {

        /** 最大血量  */
        MaxHp,
        /** 最大蓝量 */
        MaxMp,
        /** 攻击力 */
        Attack,
        /** 魔法力 */
        Magic,
        /** 防御力 */
        Def,
        /** 魔法防御力 */
        MDef,
        /** 速度 */
        Speed,
        /** 跳跃力 */
        Jump,
        /** 攻击速度 */
        AttackSpeed,
        /** 攻击距离 */
        AttackDistance,

    }

    /**
     * 属性协议
     */
    export class PrefabEvtAttr {

        /**
         * (双端)添加属性
         * @param senderGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param val 值
         * @param attrType 属性类型
         */
        public static addAttrVal(senderGuid: string, targetGuid: string, val: number, attrType: AttrType) {
            callFunc(this.name, this.onAddAttrVal.name, senderGuid, targetGuid, val, attrType);
        }

        /**
         * (双端)监听属性改变
         * @param callback 回调
         * @returns 
         */
        public static onAddAttrVal(callback: (senderGuid: string, targetGuid: string, val: number, attrType: AttrType) => void) {
            return onFunc(this.name, this.onAddAttrVal.name, callback);
        }

    }

    /**
     * 装备槽位
     */
    export enum EquipSlot {

        /** 武器 */
        Weapon = 1,

    }

    /**
     * 装备协议
     */
    export class PrefabEvtEquip {

        /**
         * (双端) 穿戴装备
         * @param targetGuid 对象Guid
         * @param slot 槽位
         * @param equipGuid 装备Guid
         */
        public static equip(targetGuid: string, slot: EquipSlot, equipGuid: string) {
            callFunc(this.name, this.onEquip.name, targetGuid, slot, equipGuid);
        }

        /**
         * (双端)监听装备改变
         * @param callback 
         * @returns 
         */
        public static onEquip(callback: (targetGuid: string, slot: EquipSlot, equipGuid: string) => void): mw.EventListener {
            return onFunc(this.name, this.onEquip.name, callback);
        }

    }

    /**
     * 玩家信息类型
     */
    export enum PlayerInfoType {

        /** 名字 */
        Name,
        /** 等级 */
        Level,
        /** 经验 */
        Exp,
        /** 金币 */
        Gold,
        /** 积分 */
        Score,
        /** 关卡 */
        Stage,
        /** 人气 */
        Popularity,

    }

    /**
     * 玩家信息协议
     */
    export class PrefabEvtPlayerInfo {

        /**
         * (双端)设置属性
         * @param senderGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param val 值
         * @param infoType 信息类型
         */
        public static setPlayerInfo(senderGuid: string, targetGuid: string, val: number, infoType: PlayerInfoType) {
            callFunc(this.name, this.onSetPlayerInfo.name, senderGuid, targetGuid, val, infoType);
        }

        /**
         * (双端)监听属性改变
         * @param callback 回调
         * @returns 
         */
        public static onSetPlayerInfo(callback: (senderGuid: string, targetGuid: string, val: number, infoType: PlayerInfoType) => void) {
            return onFunc(this.name, this.onSetPlayerInfo.name, callback);
        }

        /**
         * (双端)添加属性
         * @param senderGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param val 值
         * @param infoType 信息类型
         */
        public static addPlayerInfo(senderGuid: string, targetGuid: string, val: number, attrType: PlayerInfoType) {
            callFunc(this.name, this.onAddPlayerInfo.name, senderGuid, targetGuid, val, PlayerInfoType);
        }

        /**
         * (双端)监听属性改变
         * @param callback 回调
         * @returns 
         */
        public static onAddPlayerInfo(callback: (senderGuid: string, targetGuid: string, val: number, infoType: PlayerInfoType) => void) {
            return onFunc(this.name, this.onAddPlayerInfo.name, callback);
        }

        /**
         * (双端) 设置玩家名字
         * @param senderGuid 发起者Guid
         * @param targetGuid 目标对象Guid (玩家character)
         * @param name 名字
         */
        public static setPlayerName(senderGuid: string, targetGuid: string, name: string) {
            callFunc(this.name, this.onSetPlayerName.name, senderGuid, targetGuid, name);
        }

        /**
         * (双端)监听玩家名字改变
         * @param callback 回调
         * @returns 
         */
        public static onSetPlayerName(callback: (senderGuid: string, targetGuid: string, name: string) => void): mw.EventListener {
            return onFunc(this.name, this.onSetPlayerName.name, callback);
        }

    }

    /**
     * 攻击协议
     */
    export class PrefabEvtFight {

        /**
         * (双端)击中目标
         * @param attackerGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param damage 伤害
         * @param hitPoint 击中点
         */
        public static hit(senderGuid: string, targetGuid: string, damage: number, hitPoint: mw.Vector) {
            callFunc(this.name, this.onHit.name, senderGuid, targetGuid, damage, hitPoint);
        }

        /**
         * (双端)监听击中目标
         * @param callback 回调
         * @returns 
         */
        public static onHit(callback: (senderGuid: string, targetGuid: string, damage: number, hitPoint: mw.Vector) => void): mw.EventListener {
            return onFunc(this.name, this.onHit.name, callback);
        }

        /**
         * (双端)发起伤害
         * @param attackerGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param damage 伤害
         */
        public static hurt(senderGuid: string, targetGuid: string, damage: number) {
            callFunc(this.name, this.onHurt.name, senderGuid, targetGuid, damage);
        }

        /**
         * (双端)监听受到伤害
         * @param callback 回调
         * @returns 
         */
        public static onHurt(callback: (senderGuid: string, targetGuid: string, damage: number) => void): mw.EventListener {
            return onFunc(this.name, this.onHurt.name, callback);
        }

        /**
         * (双端)发起治疗
         * @param attackerGuid 发起对象Guid
         * @param targetGuid 目标对象Guid
         * @param cureVal 治疗数值
         */
        public static cure(senderGuid: string, targetGuid: string, cureVal: number) {
            callFunc(this.name, this.onCure.name, senderGuid, targetGuid, cureVal);
        }

        /**
         * (双端)监听受到治疗
         * @param callback 回调
         * @returns 
         */
        public static onCure(callback: (senderGuid: string, targetGuid: string, cureVal: number) => void): mw.EventListener {
            return onFunc(this.name, this.onCure.name, callback);
        }

        /**
         * (双端)发起死亡
         * @param targetGuid 
         */
        public static die(targetGuid: string) {
            callFunc(this.name, this.onDie.name, targetGuid)
        }

        /**
         * (双端)监听对象死亡
         * @param callback 
         * @returns 
         */
        public static onDie(callback: (targetGuid: string) => void): mw.EventListener {
            return onFunc(this.name, this.onDie.name, callback);
        }

        /**
         * (双端)通知复活
         * @param targetGuid 对象id
         */
        public static revive(targetGuid: string) {
            callFunc(this.name, this.onRevive.name, targetGuid);
        }

        /**
         * (双端)监听复活
         * @param callback 回调
         * @returns 
         */
        public static onRevive(callback: (targetGuid: string) => void): mw.EventListener {
            return onFunc(this.name, this.onRevive.name, callback);
        }

    }

    /**
     * 记录点协议
     */
    export class PrefabEvtRecordPoint {

        /**
         * (双端)设置关卡
         * @param senderGuid 发送者Guid
         * @param targetGuid 目标Guid
         * @param recordPointId 记录点id
         */
        public static setRecordPoint(senderGuid: string, targetGuid: string, recordPointId: number) {
            callFunc(this.name, this.onSetRecordPoint.name, senderGuid, targetGuid, recordPointId);
        }

        /**
         * (双端)监听设置关卡
         * @param callback 回调
         * @returns 
         */
        public static onSetRecordPoint(callback: (senderGuid: string, targetGuid: string, recordPointId: number) => void) {
            return onFunc(this.name, this.onSetRecordPoint.name, callback);
        }

        /**
         * (双端)返回存档记录点
         * @param senderGuid 发送者guid 
         */
        public static backCurrentRecordPoint(senderGuid: string) {
            callFunc(this.name, this.onBackCurrentRecordPoint.name, senderGuid);
        }

        /**
         * (双端)监听回到存档记录点
         * @param callback 回调
         */
        public static onBackCurrentRecordPoint(callback: (senderGuid: string) => void) {
            return onFunc(this.name, this.onBackCurrentRecordPoint.name, callback);
        }

        /**
         * (双端)返回记录点
         * @param senderGuid 发送者guid 
         * @param recordPointId 记录点id
         */
        public static backRecordPoint(senderGuid: string, recordPointId: number) {
            callFunc(this.name, this.onBackRecordPoint.name, senderGuid, recordPointId);
        }

        /**
         * (双端)监听回到记录点
         * @param callback 回调
         */
        public static onBackRecordPoint(callback: (senderGuid: string, recordPointId: number) => void) {
            return onFunc(this.name, this.onBackRecordPoint.name, callback);
        }

    }

    /**
     * 通知协议
     */
    export class PrefabEvtNotify {

        /**
         * (客户端)本地通知
         * @param text 
         */
        public static notifyLocal(text: string) {
            callClientFunc(this.name, this.onNotify.name, text);
        }

        /**
         * (双端)全局通知
         * @param text 信息
         */
        public static notify(text: string) {
            callFunc(this.name, this.onNotify.name, text);
        }

        /**
         * (双端)监听通知
         * @param callback 
         * @returns 
         */
        public static onNotify(callback: (text: string) => void): mw.EventListener {
            return onFunc(this.name, this.onNotify.name, callback);
        }

    }

    /**
     * 排行榜协议
     */
    export class PrefabEvtRank {

        /**
         * (客户端)打开排行榜UI
         */
        public static openRank() {
            callClientFunc(this.name, this.onOpenRank.name);
        }

        /**
         * (客户端)监听打开排行榜UI
         * @param callback 回调
         * @returns 
         */
        public static onOpenRank(callback: () => void): mw.EventListener {
            return onFunc(this.name, this.onOpenRank.name, callback);
        }

        /**
         * (双端)设置排行榜数据
         * @param senderGuid 
         * @param score 
         * @param typeName 
         */
        public static setRankData(senderGuid: string, name: string, score: number, typeName: string) {
            callFunc(this.name, this.onSetRankData.name, senderGuid, name, score, typeName);
        }

        /**
         * (双端)监听设置排行榜数据
         * @param callback 
         * @returns 
         */
        public static onSetRankData(callback: (senderGuid: string, name: string, score: number, typeName: string) => void): mw.EventListener {
            return onFunc(this.name, this.onSetRankData.name, callback);
        }

        /**
         * (双端)删除排行榜数据
         * @param senderGuid 
         */
        public static delRankData(senderGuid: string) {
            callFunc(this.name, this.onDelRankData.name, senderGuid);
        }

        /**
         * (双端)监听删除排行榜数据
         * @param callback 
         * @returns 
         */
        public static onDelRankData(callback: (senderGuid: string) => void): mw.EventListener {
            return onFunc(this.name, this.onDelRankData.name, callback);
        }

    }

    /**
     * 换装协议
     */
    export class PrefabEvtCloth {


        /**
         * (客户端)加载角色体型
         * @param senderGuid 发送者Guid
         * @param targetGuid 目标对象Guid
         * @param dressResGuid 装扮资源Guid
         */
        public static loadRole(senderGuid: string, targetGuid: string, dressResGuid: string[]) {
            callClientFunc(this.name, this.onLoadRole.name, senderGuid, targetGuid, dressResGuid);
        }

        /**
         * (客户端)监听加载角色体型协议
         * @param callback 回调
         * @returns 
         */
        public static onLoadRole(callback: (senderGuid: string, targetGuid: string, dressResGuid: string[]) => void): mw.EventListener {
            return onFunc(this.name, this.onLoadRole.name, callback);
        }

        /**
         * (客户端)加载装扮
         * @param senderGuid 发送者Guid
         * @param targetGuid 目标对象Guid
         * @param dressResGuid 装扮资源Guid
         */
        public static loadCloth(senderGuid: string, targetGuid: string, dressResGuid: string[]) {
            callClientFunc(this.name, this.onLoadCloth.name, senderGuid, targetGuid, dressResGuid);
        }

        /**
         * (客户端)监听加载装扮
         * @param callback 
         * @returns 
         */
        public static onLoadCloth(callback: (senderGuid: string, targetGuid: string, dressResGuid: string[]) => void): mw.EventListener {
            return onFunc(this.name, this.onLoadCloth.name, callback);
        }

        /**
         * (客户端)加载插槽资源
         * @param senderGuid 发送者Guid
         * @param targetGuid 目标对象Guid
         * @param slotResGuid 插槽资源Guid
         */
        public static loadSlot(senderGuid: string, targetGuid: string, slotResGuid: string) {
            callClientFunc(this.name, this.onLoadSlot.name, senderGuid, targetGuid, slotResGuid);
        }

        /**
         * (客户端)监听加载插槽资源
         * @param callback 
         * @returns 
         */
        public static onLoadSlot(callback: (senderGuid: string, targetGuid: string, slotResGuid: string) => void): mw.EventListener {
            return onFunc(this.name, this.onLoadSlot.name, callback);
        }


    }

    /**
     * 收集物协议
     */
    export class PrefabEvtCollection {

        /**
         * (客户端)打开收集物UI
         */
        public static openCollectionUI() {
            callClientFunc(this.name, this.onOpenCollectionUI.name);
        }

        /**
         * (客户端)监听收集物UI被打开
         * @param callback 
         * @returns 
         */
        public static onOpenCollectionUI(callback: () => void): mw.EventListener {
            return onFunc(this.name, this.onOpenCollectionUI.name, callback);
        }

        /**
         * (双端)获得收集物
         * @param senderGuid 
         * @param targetGuid 
         * @param atlasId 
         */
        public static addCollection(atlasId: string, playerId: number) {
            callFunc(this.name, this.onAddCollection.name, atlasId, playerId);
        }

        /**
         * (双端)监听获得收集物
         * @param callback 回调
         * @returns 
         */
        public static onAddCollection(callback: (atlasId: string, playerId: number) => void): mw.EventListener {
            return onFunc(this.name, this.onAddCollection.name, callback);
        }

    }

    initEvent();

}