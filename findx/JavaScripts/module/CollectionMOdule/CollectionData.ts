export default class CollectionData extends Subdata {

    /**保存已拥有的item */
    @Decorator.persistence()
    public itemList: number[] = [];

    protected initDefaultData(): void {
        this.itemList = [];
    }

    /**保存Item */
    public saveItemList(item: number): void {
        this.itemList.push(item)
        this.save(true);
    }
}