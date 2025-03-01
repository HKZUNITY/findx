import LoadingPanel from "./ui/LoadingPanel";

interface IFExecutor {
    execute(): void;
}

class ExecutorBase implements IFExecutor {
    public arg: any;
    /**是否记录数据 */
    public record: boolean;
    /**数据恢复的操作 */
    public resetFunc: Function;
    public generator: Generator;
    public execute(): void { }
}

class Executor extends ExecutorBase {
    /**命令操作 */
    public func: Function;

    public execute(): void {
        this.func(this.arg);
    }
}

class AsyncExecutor extends ExecutorBase {
    public asyncFunc: (arg: any) => Promise<any>;
    public isAwait: boolean;
    /**锁定输入 */
    public lockInput: boolean = true;
    public async execute(): Promise<void> {
        await this.asyncFunc(this.arg);
    }
}

export default class ExecutorManager {
    private static _instance: ExecutorManager = undefined;
    private executorList: Array<ExecutorBase> = new Array();
    private running: boolean = false;
    private index: number = 0;
    public doneCb: Action = new Action();

    public static get instance(): ExecutorManager {
        if (ExecutorManager._instance == undefined)
            ExecutorManager._instance = new ExecutorManager();
        return ExecutorManager._instance;
    }

    public pushExecutor(func: Function, arg: any = undefined, record: boolean = false, resetFunc: Function = undefined): void {
        let executor = new Executor();
        executor.func = func;
        executor.arg = arg;
        executor.record = record;
        executor.resetFunc = resetFunc;
        this.push(executor);
    }

    /** 添加异步命令 
     * @param asyncFunc 异步函数
     * @param arg 函数参数
     * @param isAwait 是否等待(默认等待)
     * @param record 记录角色数据
     * @param resetFunc 恢复角色数据的操作
     */
    public pushAsyncExecutor(asyncFunc: (arg: any) => Promise<any>, arg: any = undefined, isAwait: boolean = true, record: boolean = false, resetFunc: Function = undefined, lockInput: boolean = true): void {
        let asyncExecutor = new AsyncExecutor()
        asyncExecutor.asyncFunc = asyncFunc;
        asyncExecutor.arg = arg;
        asyncExecutor.isAwait = isAwait;
        asyncExecutor.record = record;
        asyncExecutor.lockInput = lockInput;
        asyncExecutor.resetFunc = resetFunc;
        this.push(asyncExecutor)
    }

    private push(executor: ExecutorBase): void {
        this.executorList.push(executor)
        this.run();
    }

    private async run(): Promise<void> {
        if (this.running) return;

        this.running = true;
        let executor: ExecutorBase = this.executorList[this.index];
        UIService.getUI(LoadingPanel).show();
        while (executor) {
            try {
                if (executor instanceof Executor) {
                    (executor as Executor).execute();
                } else {
                    let asyncExecutor = (executor as AsyncExecutor);
                    UIService.getUI(LoadingPanel).setLock(asyncExecutor.lockInput);
                    if (asyncExecutor.isAwait) {
                        await this.runExecute(asyncExecutor.execute.bind(asyncExecutor));
                    } else {
                        asyncExecutor.execute();
                    }
                }
                // if (executor.record) Event.dispatchToLocal(EventType.Event_Record, executor.resetFunc);
            } catch (error) {
                console.error(`命令执行异常:${error}`)
            }
            this.index++;
            executor = this.executorList[this.index];
        }
        UIService.getUI(LoadingPanel).hide();
        this.running = false;
        this.doneCb.call();
    }

    //执行命令，10秒超时
    private runExecute(exeFunc: () => Promise<void>): Promise<void> {
        return new Promise<void>(async (resolve: () => void) => {
            let timeOut = setTimeout(() => {
                console.error(`命令执行10秒超时`);
                return resolve();
            }, 10 * 1000);
            await exeFunc();
            clearTimeout(timeOut);
            return resolve();
        })
    }

    /**等待执行完毕 */
    public awaitDone(): Promise<void> {
        return new Promise<void>((resolve: () => void) => {
            if (!this.running) return resolve();
            const doneFunc = () => {
                this.doneCb.remove(doneFunc, this);
                return resolve();
            }
            this.doneCb.add(doneFunc, this);
        });
    }
}