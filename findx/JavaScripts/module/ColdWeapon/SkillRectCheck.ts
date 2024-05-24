import { GeneralManager } from "../../Modified027Editor/ModifiedStaticAPI";
import { NodeInfo, NodeType } from "./WeaponDef";

/** 技能区域检测 */
export class SkillRectCheck {

    public static showRect: boolean = true;

    /** 检测节点标识区域信息 */
    public static checkNodes(char: mw.Character | mw.Character, nodeInfo: NodeInfo[]): mw.GameObject[] {

        let res = [];

        nodeInfo.forEach(e => {

            if (e.type != NodeType.SkillRect.toString()) {
                return;
            }

            let angle = parseInt(e.skillAngle);
            let offsetDis = parseInt(e.skillOffsetDis);
            let radius = parseInt(e.skillRadius);
            let height = parseInt(e.skillHeight);
            let length = parseInt(e.skillLength);
            let width = parseInt(e.skillWidth);
            let charLocation = mw.Vector.add(mw.Vector.zero, char.worldTransform.position);
            let dir = char.worldTransform.getForwardVector();

            if (offsetDis != 0) {
                charLocation.add(mw.Vector.multiply(dir, offsetDis));
            }

            if (radius > 0 && height > 0) {
                //radius check
                res = this.checkRadius(char, charLocation, radius, height);

            } else if (height > 0 && length > 0 && width > 0) {
                //box check
                let endLocation = mw.Vector.add(charLocation, mw.Vector.multiply(dir, length));
                res = this.checkBox(char, charLocation, endLocation, width, height);
            }

            if (angle > 0) {
                //angle check
                res = this.checkAngle(charLocation, dir, angle, res);
            }

            res = res.filter(e => { return e.guid != char.gameObjectId });

        })

        return res;

    }

    /**
     * 角度检测
     * @param charLocation 
     * @param dir 
     * @param angle 
     * @param targets 
     * @returns 
     */
    private static checkAngle(charLocation: mw.Vector, dir: mw.Vector, angle: number, targets: mw.GameObject[]): mw.GameObject[] {
        let res = [];
        targets.forEach(e => {
            if (MathUtil.angleCheck(charLocation, dir, e.worldTransform.position, angle)) {
                res.push(e);
            }
        })

        return res;
    }

    /** 半径检查 */
    private static checkRadius(char: mw.GameObject, charLocation: mw.Vector, radius: number, height: number): mw.GameObject[] {

        let res = QueryUtil.capsuleOverlap(charLocation, radius, height, SkillRectCheck.showRect);
        return res;

    }

    /** 矩形盒子检测 */
    private static checkBox(char: mw.GameObject, charLocation: mw.Vector, endLocation: mw.Vector, width: number, height: number): mw.GameObject[] {

        let res = GeneralManager.modifyboxOverlapInLevel(charLocation, endLocation, width, height, SkillRectCheck.showRect);
        return res;

    }

}