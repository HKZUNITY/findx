import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
﻿export namespace ObjectPoolServices {
    interface IPool {
        getSize(): number;
        clear(): void;
        spawn(): any;
        return(instance: any): void;
    }
    export class ObjectPool<T> implements IPool {
        private spawnFun: () => T;
        private pool: Array<T>;
        private oPool: Array<T>;
        public constructor(spawn: () => T, initNum: number = 3) {
            this.spawnFun = spawn;
            this.pool = new Array<T>(initNum);
            this.oPool = new Array<T>();
            for (let index = 0; index < initNum; index++) {
                this.pool[index] = this.spawnFun();
            }
        }
        public spawn(): T {
            if (this.pool.length > 0) {
                let a = this.pool.pop();
                this.oPool.push(a);
                return a;
            }
            let a = this.spawnFun();
            this.oPool.push(a);
            return a;
        }
        public return(instance: T): void {
            if (instance == null) {
                return;
            }
            this.pool.push(instance);
        }
        public getSize(): number {
            return this.pool.length;
        }
        public clear(): void {
            this.pool.length = 0;
        }
        public oPoolClear(): void {
            this.oPool.length = 0;
        }
        public getAll(): Array<T> {
            return this.pool;
        }
        public getOPool(): Array<T> {
            return this.oPool;
        }
    }

    const poolMap: Map<string, IPool> = new Map<string, IPool>();
    type Class<T> = { new(...arg): T }
    export function getPool<T>(cls: Class<T>, autoCreat: boolean = true): ObjectPool<T> {
        let pool = poolMap.get(cls.name);
        if (pool === undefined && autoCreat) {
            initPool(cls, () => new cls())
        }
        return poolMap.get(cls.name) as ObjectPool<T>;
    }
    export function initPool<T>(cls: Class<T>, spawn: () => T, initNum: number = 3): ObjectPool<T> {
        let pool = poolMap.get(cls.name);
        if (pool === undefined) {
            pool = new ObjectPool<T>(spawn, initNum);
            poolMap.set(cls.name, pool);
        }
        return pool as ObjectPool<T>;
    }
    export function destroyPool<T>(cls: Class<T>): void {
        let pool = poolMap.get(cls.name);
        if (pool !== undefined) {
            pool.clear();
        }
        poolMap.delete(cls.name);
    }
    export function clear() {
        for (const [key, pool] of poolMap) {
            pool.clear();
        }
        poolMap.clear();
    }
}

enum SourceType {
    Error = 0,//错误源类型
    Asset = 1,//资源
    GameObject = 2,//场景对象
    Prefab = 3//预制体
}

export class ObjPool {
    public static instance: ObjPool;
    public constructor() { }
    public destroy() {
        ObjPool.instance = null;
    }

    private readonly POOL_RES_GUID: string = 'poolResGuid';//原始对象的guid，还对象的时候使用
    private sourceTypeMap: Map<string, SourceType> = new Map();
    private sceneSource: Map<string, mw.GameObject> = new Map();
    private subPoolMap: Map<string, Array<mw.GameObject>> = new Map();
    /**
     * 生成一个对象
     * @param guid 场景对象的guid | 资源的guid | prefab的guid
     * @returns 对象
     */
    public spawn<T extends mw.GameObject>(guid: string): T {
        if (this.subPoolMap.has(guid) && this.subPoolMap.get(guid).length > 0) {
            let obj = this.subPoolMap.get(guid).pop();
            obj.setVisibility(mw.PropertyStatus.On);
            return obj as T;
        }
        if (!this.sourceTypeMap.has(guid)) {
            this.sourceTypeMap.set(guid, this.getSourceType(guid));
        }
        let obj = null;
        switch (this.sourceTypeMap.get(guid)) {
            case SourceType.Asset:
                obj = SpawnManager.wornSpawn(guid);
                break;
            case SourceType.GameObject:
                obj = this.sceneSource.get(guid).clone();
                break;
            case SourceType.Prefab:
                obj = SpawnManager.wornSpawn(guid);
                break;
            default:
                break;
        }
        if (obj == null) {
            this.sourceTypeMap.set(guid, SourceType.Error);
        } else {
            obj.setVisibility(mw.PropertyStatus.On);
            obj.worldTransform.position = mw.Vector.zero;
            obj[this.POOL_RES_GUID] = guid;
        }
        return obj;
    }
    //根据资源的guid获取资源的类型
    private getSourceType(guid: string): SourceType {
        if (guid.length > 18) {
            let source = GameObject.findGameObjectById(guid);
            if (source != null) {//场景里的
                source.parent = null;
                source.setVisibility(mw.PropertyStatus.Off);
                this.sceneSource.set(guid, source);
                return SourceType.GameObject;
            } else {//预制体
                return SourceType.Prefab;
            }
        } else {//库里的
            return SourceType.Asset;
        }
    }
    /**
     * 归还一个对象
     * @param obj 对象
     */
    public despawn(obj: mw.GameObject) {
        let guid: string = obj[this.POOL_RES_GUID];
        if (guid == null) return;
        if (!this.subPoolMap.has(guid)) this.subPoolMap.set(guid, []);
        if (this.subPoolMap.get(guid).includes(obj)) return;
        this.subPoolMap.get(guid).push(obj);
        // obj.parent = null;
    }
    /**
     * 清除对象池中所以guid对应的对象
     * @param guid 清除对象的guid
     */
    public clear(guid: string) {
        if (!this.subPoolMap.has(guid) && this.subPoolMap.get(guid).length == 0) {
            return;
        }
        let arr = this.subPoolMap.get(guid);
        for (let i = 0; i < arr.length; i++) {
            arr[i].destroy();
        }
        arr.length = 0;
    }
}