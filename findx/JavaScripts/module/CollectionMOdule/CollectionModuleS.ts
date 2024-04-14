import RankingModuleS from "../RankingModule/RankingModuleS";
import CollectionData from "./CollectionData";
import CollectionModuleC from "./CollectionModuleC";

export default class CollectionModuleS extends ModuleS<CollectionModuleC, CollectionData> {
    /**排行榜模块 */
    private rankingModuleS: RankingModuleS = null;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initData();
    }

    /**初始化数据 */
    private initData(): void {
        this.rankingModuleS = ModuleService.getModule(RankingModuleS);
    }

    /**保存获得的Item */
    @Decorator.noReply()
    public net_saveAcquiredItem(id: number): void {
        this.saveAcquiredItem(this.currentPlayer, id);
    }

    /**保存获得的Item */
    public saveAcquiredItem(player: mw.Player, id: number): void {
        DataCenterS.getData(player, CollectionData).saveItemList(id);
        this.rankingModuleS.refreshScore(player, 1);
    }
}