
export default class ShopData extends Subdata {

    /**保存最大高度 */
    @Decorator.persistence()
    public maxHeight: number = 0;
    /**等级 */
    @Decorator.persistence()
    public level: number = 0;
    /**击杀人数 */
    @Decorator.persistence()
    public killCount: number = 0;

    /**是否第一次游戏 */
    @Decorator.persistence()
    public isFirstGame: boolean = true;

    protected initDefaultData(): void {
        this.maxHeight = 0;
        this.level = 0;
        this.killCount = 0;
        this.isFirstGame = true;
    }

    /**保存最大高度 */
    public saveMaxHeight(maxHeight: number): void {
        this.maxHeight = maxHeight;
        this.save(true);
    }

    /**保存等级 */
    public saveLevel(level: number): void {
        this.level = level;
        this.save(true);
    }

    /**保存击杀人数 */
    public saveKillCount(killCount: number): void {
        this.killCount = killCount;
        this.save(true);
    }

    /**保存完成游戏引导 */
    public completeGameGuide(): void {
        this.isFirstGame = false;
        this.save(true);
    }
}