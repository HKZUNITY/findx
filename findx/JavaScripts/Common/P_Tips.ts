// import Tips_Generate from "../ui-generate/common/Tips_generate";

// /**
//  * 系统提示
//  * 一个顶一个向上跳动，然后消失，最多三条
//  */
// export default class P_Tips extends Tips_Generate {
//     private static readonly Y_START = 400;
//     private static readonly Y_OVER = 150;
//     private static readonly MOVE_SPEED = 500;
//     private static readonly KEEP_TIME = 0.5;
//     private static _instance: P_Tips;
//     private freeCellArr: Array<mw.Canvas> = [];//当前空闲的条目
//     private activeCellArr: Array<mw.Canvas> = [];//当前激活的条目
//     private overCellArr: Array<mw.Canvas> = [];//已经完成的条目

//     private static get instance(): P_Tips {
//         if (this._instance == null) {
//             this._instance = mw.UIService.create(P_Tips);
//         }
//         return this._instance;
//     }

//     protected onAwake(): void {
//         this.layer = mw.UILayerTop;
//     }

//     public onShow(...params: any[]): void {
//         this.canUpdate = true;
//     }

//     onStart() {
//         this.freeCellArr = [this.mCell1, this.mCell2, this.mCell3];
//         for (let i = 0; i < this.freeCellArr.length; i++) {
//             this.freeCellArr[i].visibility = (mw.SlateVisibility.Collapsed);
//         }
//     }

//     /**
//      * 显示系统提示 (Client Only)
//      * @param content 提示内容
//      */
//     public static show(content: string) {
//         mw.UIService.showUI(this.instance);
//         P_Tips.instance.showMsg(content);
//     }

//     private showMsg(content: string) {
//         let cell: mw.Canvas = null;
//         if (this.freeCellArr.length > 0) {
//             cell = this.freeCellArr.shift();
//         } else {
//             cell = this.activeCellArr.shift();
//         }
//         let text: mw.TextBlock = cell.findChildByPath('Content_txt') as mw.TextBlock;
//         text.text = (content);
//         cell["state"] = 0;
//         cell["stopTime"] = 0;
//         this.activeCellArr.push(cell);
//     }

//     onUpdate(dt: number) {
//         if (this.activeCellArr.length == 0) return;
//         let pos: mw.Vector2 = null;
//         for (let i = 0; i < this.activeCellArr.length; i++) {
//             let cell = this.activeCellArr[i];
//             switch (cell["state"]) {
//                 case 0:
//                     cell.visibility = (mw.SlateVisibility.Visible);
//                     pos = cell.position;
//                     pos.y = P_Tips.Y_START;
//                     cell.position = (pos);
//                     cell["state"]++;
//                     break;
//                 case 1:
//                     pos = cell.position;
//                     pos.y -= P_Tips.MOVE_SPEED * dt;
//                     if (i == 0) {
//                         if (pos.y <= P_Tips.Y_OVER) {
//                             pos.y = P_Tips.Y_OVER;
//                             cell["state"]++;
//                         }
//                     } else {
//                         let lastCellPos = this.activeCellArr[i - 1].position;
//                         if (pos.y <= lastCellPos.y + 60) {
//                             pos.y = lastCellPos.y + 60;
//                             cell["stopTime"] += dt;
//                             if (cell["stopTime"] >= P_Tips.KEEP_TIME) {
//                                 cell["state"] += 2;
//                             }
//                         }
//                     }
//                     cell.position = (pos);
//                     break;
//                 case 2:
//                     cell["stopTime"] += dt;
//                     if (cell["stopTime"] >= P_Tips.KEEP_TIME) {
//                         cell["state"]++;
//                     }
//                     break;
//                 case 3:
//                     cell.visibility = (mw.SlateVisibility.Collapsed);
//                     this.overCellArr.push(cell);
//                     break;
//             }
//         }
//         while (this.overCellArr.length > 0) {
//             let cell = this.overCellArr.shift();
//             let index = this.activeCellArr.indexOf(cell);
//             this.activeCellArr.splice(index, 1);
//             this.freeCellArr.push(cell);
//         }
//     }
//     onDestroy() {
//         P_Tips._instance = null;
//     }
// }