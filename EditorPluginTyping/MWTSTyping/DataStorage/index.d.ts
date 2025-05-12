declare namespace mw {
    /**
     * @description 数据储存返回代码
     * @author xiangkun.sun
     * @groups 数据处理
     */
    enum DataStorageResultCode {
        /** 操作成功 */
        Success = 200,
        /** 未知错误失败 */
        Failure = 400,
        /** 非法调用 只可服务端调用 */
        OnlyServerCall = 402,
        /** 非法调用 只可客户端调用 */
        OnlyClientCall = 403,
        /** 请求超时未回调 */
        TimeOut = 408,
        /** 某条key获取数据异常时数据被锁定，再次获取此key的数据正常时会解锁 */
        DataLock = 410,
        /** 请求间隔错误 */
        RequestIntervalTooClose = 423,
        /** 请求频率过高 */
        RequestTooFrequent = 424,
        /** key或者value格式错误(或后端参数校验失败)，key大小不能大于50字节，value大小不能大于64kb，且本地存储的总数据大小不可以超过5mb */
        KeyValueError = 1010,
        /** gameId格式错误或后端传参错误 */
        GameIdError = 1011,
        /** 系统异常 */
        SystemException = 1999,
        /** 服务端调用的远程服务异常 */
        ServerException = 1964,
        /** 没有访问对应资源的权限 */
        ResourceException = 1400,
        /** 参数不符合业务所需参数格式 */
        ParametersException = 1012,
        /** 请求Method错误 */
        RequestMethodNotSupported = 405,
        /** 数据不存在,服务端通用异常状态码，在数据存储中常见于没有授权数据 */
        DataNotExist = 1016
    }
    /**
     * @description 数据储存返回值
     * @author xiangkun.sun
     * @groups 数据处理
     */
    interface DataStorageResult {
        /**
         * @description 数据储存返回代码
         */
        code: DataStorageResultCode;
        /**
         * @description 数据储存的数据值
         */
        data: any;
    }
    /**
     * @author xiangkun.sun
     * @groups 数据处理
     * @description 数据存储
     * @precautions 在调用DataStorage相关接口时，每一个Key的对应值在数据服务器的读取和修改都有频率限制，主要表现在：接口调用时至一分钟前的时间区间内，某个Key的对应值在后端数据服务器上被获取Get、改写Set、删除Remove的总次数不能超过 (60+游戏设定的最大人数×10)次，不管它是在哪个服务器被操作的；如果时间区间内超限，请求会失败，然后Set、Remove会返回 FREQUENCY_OVERRUN(操作失败：请求频率超限) 而Get会catch到error timeout。
     * 1. 这些限制是数据服务器层面针对单个Key来的，每个Key之间的限制互相独立，和游戏服务器无关。
     * 2. Player相关的接口其实也算是一个Key，只不过是和玩家信息强相关的Key，也会受到上述限制；建议用 asyncSetData(属性名+玩家id+其他描述, 要存的值)来分存玩家相关的需要经常存取数据，以免堵塞。
     * 3. 对于玩家相关的信息，建议在ts层建立数据缓存，进行一定的数据托管；即通过ts脚本逻辑让DS服务器临时缓存玩家数据，只在初始化的时候进行get，在离线或其他必要时set，以减轻对后端数据服务器的压力，保证稳定性
     * @networkStatus usage:双端
     */
    class DataStorage {
        /**
         * @description 返回data的当前大小。单位为byte（字节）。
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 调用端生效
         * @param data usage: 数据键值对对象。
         * @returns 数据大小
         */
        static getDataSize(data: any): number;
        /**
         * @description 异步设置自定义数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:字符串类型的键，用来唯一标识存储的数据。<br> range: 字符串长度不做限制，但请设置合适的标识。
         * @param value usage:要保存的数据，不支持 map 类型及数据结构中包含 map，且无法还原 function
         * @returns 数据储存状态
         */
        static asyncSetData(key: string, value: any): Promise<DataStorageResultCode>;
        /**
         * @description 异步获取自定义数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:字符串类型键，用来查找唯一标识存储的数据 <br> range: 字符串长度依据 asyncSetData 设置的而定。
         * @returns 之前保存的自定义数据
         */
        static asyncGetData(key: string): Promise<DataStorageResult>;
        /**
         * @description 异步删除自定义数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:字符串类型键，用来查找唯一标识存储的数据 <br> range: 字符串长度依据 asyncSetData 设置的而定。
         * @returns 数据删除状态
         */
        static asyncRemoveData(key: string): Promise<DataStorageResultCode>;
        /**
         * @description 设置数据存储环境是否是临时的
         * @deprecated info:该接口已废弃，在该接口被删除前会仍保持可用，请尽快使用替换方案以免出现问题 since:037 reason:接口废弃 replacement:客户端本地存储请使用LocalData相关接口,接口移除后，服务端将默认为永久存储。
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param isTemporary usage:true代表临时存储，数据在游戏服务器进程中，游戏退出时数据被删除。false为永久存储，数据存储在专用服务器，游戏退出时数据不会被删除。
         */
        static setTemporaryStorage(isTemporary: boolean): void;
        /**
         * @description 异步获取其他游戏保存的数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param gameId usage:开发者后台其他游戏的 gameId。<br> range: 字符串长度依据 gameId 长度而定。
         * @param key usage:字符串类型键，用来查找唯一标识存储的数据。 <br> range: 字符串长度依据设置长度而定。
         * @returns 其他游戏保存的数据
         */
        static asyncGetOtherGameData(gameId: string, key: string): Promise<DataStorageResult>;
        /**
         * @description 异步设置其他游戏保存的数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param gameId usage:开发者后台其他游戏的 gameId <br> range: 字符串长度依据 gameId 长度而定。
         * @param key usage:字符串类型键，用来查找唯一标识存储的数据  <br> range: 字符串长度依据设置长度而定。
         * @param value usage:要保存的数据，不支持 map 类型及数据结构中包含 map，且无法还原 function
         * @returns 设置其他游戏的数据状态码
         */
        static asyncSetOtherGameData(gameId: string, key: string, value: any): Promise<DataStorageResultCode>;
        /**
         * @description 设置本地数据
         * @precautions 每条数据最多存储64kb的编码数据且本地存储的总数据大小不可以超过5mb，超过此限制的数据都不能被存储。
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在客户端调用生效
         * @param key usage:字符串类型的键，用来唯一标识存储的数据。<br> range: 字符串长度不做限制，但请设置合适的标识。
         * @param value usage:要保存的数据，不支持 map 类型及数据结构中包含 map，且无法还原 function
         * @returns 数据储存状态
         */
        static asyncSetLocalData(key: string, value: any): Promise<DataStorageResultCode>;
        /**
         * @description 获取本地数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在客户端调用生效
         * @param key usage:字符串类型的键，用来唯一标识存储的数据。<br> range: 字符串长度不做限制，但请设置合适的标识。
         * @returns 数据获取结果
         */
        static asyncGetLocalData(key: string): Promise<DataStorageResult>;
        /**
         * @description 删除本地数据
         * @author xiangkun.sun
         * @groups 数据处理
         * @effect 只在客户端调用生效
         * @param key usage:字符串类型的键，用来唯一标识存储的数据。<br> range: 字符串长度不做限制，但请设置合适的标识。
         * @returns 数据删除状态
         */
        static asyncRemoveLocalData(key: string): Promise<DataStorageResultCode>;
    }
}

/**
 * @author zhaoyang.hou
 * @groups 数据处理
 * @description 数据存储
 * @description MemoryStorage
 */
declare namespace mw {
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description 内存存储结果状态码
     */
    enum MemoryStorageResultCode {
        /** API请求速率超出限制 */
        RateLimitExceeded = 100,
        /** 单个数据结构kv数量超出上限 */
        StructureKeyCountLimitExceeded = 101,
        /** 单个数据结构占用内存超出上限 */
        StructureTotalSizeLimitExceeded = 102,
        /** 游戏创建的数据结构数量超出上限 */
        GameStuctureCountLimitExceeded = 103,
        /** 操作成功 */
        Success = 200,
        /** 未知错误失败 */
        Failure = 400,
        /** 没有找到该键 */
        KeyNotFound = 401,
        /** 该接口只允许服务端调用 */
        OnlyServerCall = 402,
        /** 调用过早，MemoryStorage未初始化完成 */
        TooEarlyCall = 403,
        /** 请求超时 */
        TimeOut = 408,
        /** 请求过于频繁 */
        RequestTooFrequent = 424,
        /** 不允许lisenServer调用 */
        LisenServerNotAvailable = 603,
        /** key或者value格式错误，或者大小超出限制，key大小不能大于128字节，value大小不能大于32kb */
        KeyValueError = 1010,
        /** 设置超时超过了3888000秒 */
        SetTimeoutError = 1070
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description 排序映射数据结果
     */
    interface SortedMapGetDataResult {
        /**
         * @description 状态码
         */
        code: MemoryStorageResultCode;
        /**
         * @description 值
         */
        value: any;
        /**
         * @description 排序键
         */
        sortKey: string | number;
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description 范围排序映射数据回调函数结果
     */
    interface SortedMapGetRangeDataResult {
        /**
         * @description 状态码
         */
        code: MemoryStorageResultCode;
        /**
         * @description 一个符合条件的数据的数组，数组每个项有所有符合标准的键、值、排序键
         */
        array: Array<{
            key: string;
            value: any;
            sortKey: string | number;
        }>;
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description SortedMapGetRankResult
     */
    interface SortedMapGetRankResult {
        /**
         * @description 状态码
         */
        code: MemoryStorageResultCode;
        /**
         * @description 位置数据,如果rank不存在就返回-1
         */
        rank: number;
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description 队列数据结果
     */
    interface QueueReadDataResult {
        /**
         * @description 状态码
         */
        code: MemoryStorageResultCode;
        /**
         * @description 用于给 asyncRemoveData 调用的字符串id，用于指向读取出来的队列项
         */
        id: string;
        /**
         * @description 读取出来的队列项的值的数组
         */
        values: any[];
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description MemoryStorageSortedMap
     * @networkStatus usage:服务端
     */
    class MemoryStorageSortedMap {
        /**
         * @description 添加项或覆盖项
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:键名称 <br> range: max:128Byte
         * @param value usage:值 <br> range: max:32KB
         * @param sortKey usage:用于排序的键，必须为数字或者字符串 <br> range: max:128Byte
         * @param expiration usage:该项的过期时间，以秒为单位，过期后该项自动从排序映射中删除 <br> default: 259200 range: max:2592000 type: number
         * @returns 状态码
         */
        asyncSetData(key: string, value: any, sortKey: string | number, expiration?: number): Promise<MemoryStorageResultCode>;
        /**
         * @description 获得键对应项的值和排序键
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:键名称 <br>.SaveStringToFile range: max:128Byte
         * @returns 排序映射数据结果
         */
        asyncGetData(key: string): Promise<SortedMapGetDataResult>;
        /**
         * @description 获得键和排序键范围内的项的值和排序键
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param isAscending usage:输出数据的排序方向，为true时升序排列，为false时倒序排列
         * @param count usage:获得数据的量 <br> range: <max:200> type: number
         * @param lowerSortKey usage:区间的下限，可以限定sortKey  <br> default:""
         * @param upperSortKey usage:区间的上限，可以限定sortKey  <br> default:""
         * @returns 范围排序映射数据结果
         */
        asyncGetRangeData(isAscending: boolean, count: number, lowerSortKey?: string | number, upperSortKey?: string | number): Promise<SortedMapGetRangeDataResult>;
        /**
         * @description 删除项
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:键名称 <br> range: max:128Byte
         * @returns 状态码
         */
        asyncRemoveData(key: string): Promise<MemoryStorageResultCode>;
        /**
         * @description 获取键在排序映射中的位置
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param key usage:键名称 <br> range: max:128Byte
         * @param isAscending usage:输出数据的排序方向，为true时升序排列，为false时倒序排列
         * @returns 键在排序映射中的位置结果
         */
        asyncGetRank(key: string, isAscending: boolean): Promise<SortedMapGetRankResult>;
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description MemoryStorageQueue
     * @networkStatus usage:服务端
     */
    class MemoryStorageQueue {
        /**
         * @description 添加项
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param value usage:值 <br> range: max:32KB
         * @param expiration usage:该项的过期时间，以秒为单位，过期后该项自动从排序映射中删除 <br> default: 259200, range: max:2592000 type: number
         * @param priority usage:队列项的优先级。<br> default:0 range:无限制 type: number
         * @returns 状态码
         */
        asyncAddData(value: any, expiration?: number, priority?: number): Promise<MemoryStorageResultCode>;
        /**
         * @description 从队首读出固定数量的项
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param count usage:需要读出的项数量 range:(0, 50000] type: number
         * @param allOrNothing usage:当count数量大于队列剩余数量时，如果allOrNothing为true，则不返回任何值；如果为false，则返回剩余的所有项。 default:false
         * @returns 队列项数据结果
         */
        asyncReadData(count: number, allOrNothing?: boolean): Promise<QueueReadDataResult>;
        /**
         * @description 删除项
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param id usage:由asyncReadData得到的指向要删除的数据的指针 range: 无限制
         * @returns 状态码
         */
        asyncRemoveData(id: string): Promise<MemoryStorageResultCode>;
    }
    /**
     * @author zhaoyang.hou
     * @groups 数据处理
     * @description 数据存储
     * @description MemoryStorage
     * @networkStatus usage:服务端
     */
    class MemoryStorage {
        /**
         * @description 创建或获取排序映射
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param name usage:排序映射名 <br> range: 字符串长度不做限制，但请设置合适的标识。
         * @returns 排序映射
         */
        static getSortedMap(name: string): MemoryStorageSortedMap;
        /**
        * @description 删除排序映射
        * @author zhaoyang.hou
        * @groups 数据处理
        * @effect 只在服务端调用生效
        * @param sortMap usage:想要删除的排序映射
        * @returns 状态码
        */
        static asyncRemoveSortedMap(sortMap: MemoryStorageSortedMap): Promise<MemoryStorageResultCode>;
        /**
         * @description 创建或获取队列
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param name usage:队列名 <br> range: 字符串长度不做限制，但请设置合适的标识。
         * @param invisibilityTimeout usage:读取操作的可见性超时时间，以秒为单位。 default:30 range:(0, 600) type: number
         * @returns 队列
         * @networkStatus usage:服务端
         */
        static getQueue(name: string, invisibilityTimeout?: number): MemoryStorageQueue;
        /**
         * @description 检查value大小
         * @author zhaoyang.hou
         * @groups 数据处理
         * @effect 只在服务端调用生效
         * @param value usage:任何值
         * @returns value的大小（如果做压缩了就是压缩后的大小），单位是字节
         */
        static getDataSize(value: any): number;
    }
}
