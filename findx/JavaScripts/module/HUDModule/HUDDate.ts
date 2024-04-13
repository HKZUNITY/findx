
export default class HUDDate extends Subdata {
    /**保存最大血量 */
    @Decorator.persistence()
    public maxHp: number = 100;
    /**攻击力 */
    @Decorator.persistence()
    public hurt: number = 0;

    protected initDefaultData(): void {
        this.maxHp = 100;
        this.hurt = 0;
    }

    /**保存最大血量 */
    public saveMaxHp(value: number): void {
        this.maxHp = value;
        this.save(true);
    }

    /**保存攻击力 */
    public saveHurt(value: number): void {
        this.hurt = value;
        this.save(true);
    }
}