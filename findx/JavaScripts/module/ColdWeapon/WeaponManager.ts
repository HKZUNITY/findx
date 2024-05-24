import { PlayerManagerExtesion } from "../../Modified027Editor/ModifiedPlayer";
import { SpawnManager } from "../../Modified027Editor/ModifiedSpawn";
import Weapon from "./Weapon";

/** 冷兵器管理器预定义数据 */
abstract class WeaponManagerPreDefine {

    /** 网络事件id，区分返回值使用 */
    protected netActionId: number = 1;

    /** 网络事件返回监听 */
    protected netEventRet: Map<number, (v: Weapon) => void> = new Map();

    /** PrefabGuid */
    protected prefabGuid: string = "";

    /** 初始化函数 */
    protected abstract init();

    /**
     * 获取一个冷兵器
     * @param prefabGuid 
     * @param char 
     * @param reqPlayer 
     * @param netActionId 
     */
    public abstract client_AsyncGetWeapon(prefabGuid: string, char: mw.Character | mw.Character, reqPlayer: mw.Player, netActionId: number): Promise<Weapon>;

    /**
     * 客户端请求服务器返回一个冷兵器
     * @param player 
     * @param netActionId 
     * @param charGuid 
     * @param prefabId 
     */
    protected abstract onClientGetWeapon(player: mw.Player, netActionId: number, charGuid: string, prefabId: string);

}

/** 冷兵器管理器客户端实现 */
abstract class WeaponManagerCli extends WeaponManagerPreDefine {
    protected init() {

        if (mw.SystemUtil.isClient()) {

            /** 监听服务器初始化冷兵器完成 */
            Event.addServerListener(this.onServerInitWeaponCompalte.name, this.onServerInitWeaponCompalte.bind(this));

        }

    }

    /**
     * 服务器初始化冷兵器完成
     * @param netActionId 网络事件id
     * @param objGuid 对象guid
     * @param scriptGuid 脚本guid
     * @param charGuid 角色guid
     * @returns 
     */
    protected async onServerInitWeaponCompalte(netActionId: number, objGuid: string, scriptGuid: string, charGuid: string) {
        if (this.netEventRet.has(netActionId)) {
            if (objGuid == "" || scriptGuid == "") {
                this.netEventRet.get(netActionId)(null);
                return;
            }
            let script = await mw.ScriptManager.asyncFindScript(scriptGuid);
            let charObj = await GameObject.asyncFindGameObjectById(charGuid);
            let char: mw.Character | mw.Character = null;
            if (PlayerManagerExtesion.isCharacter(charObj)) {
                char = charObj as mw.Character;
            } else if (PlayerManagerExtesion.isNpc(charObj)) {
                char = charObj as mw.Character;
            }
            if (script != null) {
                let weapon = script as Weapon;
                weapon.initCharacter(char, () => {
                    this.netEventRet.get(netActionId)(weapon);
                    this.netEventRet.delete(netActionId);
                })
            }
        }

    }

    /**
     * 客户端请求获取一个冷兵器
     * @param player 玩家类
     * @param netActionId 网络事件id
     * @param charGuid 角色guid
     * @param prefabId 预制件id
     * @returns 
     */
    public client_AsyncGetWeapon(prefabGuid: string, char: mw.Character | mw.Character, reqPlayer: mw.Player, netActionId: number = 0): Promise<Weapon> {

        if (mw.SystemUtil.isClient()) {
            return new Promise((resolve, reject) => {
                let actionId = this.netActionId++;
                this.netEventRet.set(actionId, resolve);
                Event.dispatchToServer(this.onClientGetWeapon.name, actionId, char.gameObjectId, this.prefabGuid);
            });
        }

    }
}

/** 冷兵器管理器服务端实现 */
class WeaponManagerSvr extends WeaponManagerCli {

    /** 缓存玩家绑定的冷兵器 */
    protected cacheWeapon: Map<string, Weapon> = new Map();

    protected init() {

        super.init();

        if (mw.SystemUtil.isServer()) {
            Player.onPlayerLeave.add(this.server_OnDeleteWeapon.bind(this));
            Event.addClientListener(this.onClientGetWeapon.name, this.onClientGetWeapon.bind(this));
            Event.addClientListener(this.server_OnDeleteWeaponByGuid.name, this.server_OnDeleteWeaponByGuid.bind(this));
        }

    }

    /**
     * 服务器删除一个冷兵器
     * @param player 玩家
     */
    private server_OnDeleteWeapon(player: mw.Player) {

        let charGuid = player.character.gameObjectId;
        if (this.cacheWeapon.has(charGuid)) {
            let weapon = this.cacheWeapon.get(charGuid);
            let go = weapon.gameObject;
            weapon.destroy();
            go.destroy();
            this.cacheWeapon.delete(charGuid);
        }

    }

    /**
     * 服务器删除一个冷兵器
     * @param weaponGuid 冷兵器guid
     */
    protected async server_OnDeleteWeaponByGuid(weaponGuid: string) {

        let weapon: Weapon = await mw.ScriptManager.asyncFindScript(weaponGuid) as Weapon;
        if (weapon) {
            let go = weapon.gameObject;
            this.cacheWeapon.delete(weapon["charGuid"]);
            weapon.destroy();
            go.destroy();
        }

    }

    /**
     * 客户端请求获取一个冷兵器
     * @param player 玩家类
     * @param netActionId 网络事件id
     * @param charGuid 角色guid
     * @param prefabId 预制件id
     * @returns 
     */
    protected async onClientGetWeapon(player: mw.Player, netActionId: number, charGuid: string, prefabId: string) {

        let char = await GameObject.asyncFindGameObjectById(charGuid);
        if (char == null) {
            Event.dispatchToClient(player, this.onServerInitWeaponCompalte.name, netActionId, "", "");
            return;
        }

        if (PlayerManagerExtesion.isCharacter(char)) {
            this.client_AsyncGetWeapon(prefabId, char as mw.Character, player, netActionId);
        } else if (PlayerManagerExtesion.isNpc(char)) {
            this.client_AsyncGetWeapon(prefabId, char as mw.Character, player, netActionId);
        }

    }

    /**
     * 获取一个冷兵器
     * @param prefabGuid 冷兵器预制件id
     * @param char 角色对象
     * @param reqPlayer 玩家对象
     * @param netActionId 网络事件id
     * @returns 
     */
    public async client_AsyncGetWeapon(prefabGuid: string, char: mw.Character | mw.Character, reqPlayer: mw.Player, netActionId: number): Promise<Weapon> {

        if (mw.SystemUtil.isClient()) {
            return super.client_AsyncGetWeapon(prefabGuid, char, reqPlayer, netActionId);
        }

        if (mw.SystemUtil.isServer()) {

            let test = await SpawnManager.wornAsyncSpawn(this.prefabGuid, true);
            let script = await test.getScriptByName("Weapon");
            let testWeapon = script as Weapon;
            testWeapon.initCharacter(char, (() => {
                this.cacheWeapon.set(char.gameObjectId, testWeapon);
                Event.dispatchToClient(reqPlayer, this.onServerInitWeaponCompalte.name, netActionId, test.gameObjectId, testWeapon.guid, char.gameObjectId);
            }).bind(this));
            return null;

        }

        return null;
    }

}

/**
 * 冷兵器管理器
 */
export class WeaponManager extends WeaponManagerSvr {

    private static _Instance: WeaponManager = null;

    /** 获取冷兵器管理实例 */
    public static GetInstance(): WeaponManager {
        if (WeaponManager._Instance == null) {
            this._Instance = new WeaponManager();
            this._Instance.init();
        }
        return this._Instance;
    }

    protected init() {
        super.init();
    }

    /**
     * 获取一个冷兵器
     * @param prefabGuid 冷兵器预制件Guid
     * @param char 绑定角色对象
     * @param reqPlayer 请求玩家
     * @returns 
     */
    public async client_AsyncGetWeapon(prefabGuid: string, char: mw.Character | mw.Character, reqPlayer: mw.Player, netActionId: number = 0): Promise<Weapon> {
        this.prefabGuid = prefabGuid;
        return super.client_AsyncGetWeapon(prefabGuid, char, reqPlayer, netActionId);
    }

    /**
     * 销毁一个冷兵器实例
     * @param weapon 实例
     */
    public client_DestroyWeapon(weapon: Weapon) {
        weapon.stopPlay();
        Event.dispatchToServer(this.server_OnDeleteWeaponByGuid.name, weapon.guid);
    }



}

WeaponManager.GetInstance();