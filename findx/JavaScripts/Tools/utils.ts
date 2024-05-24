import Console from "./Console";

export class Tween<T> extends mw.Tween<T> { }
export class Utils {

    /**
      * 随机获取指定范围内的整数
      * @param Min 起始值
      * @param Max 最大值
      * @returns 随机整数[min, max]
      */
    public static getRandomInteger(min: number, max: number): number {
        let Range = max - min;
        let Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }

    /**
     * 获取指定范围内的随机数, decimalNum指小数保留多少位
     * @param maxNum 最大值
     * @param minNum 最小值
     * @param decimalNum 保留几位数
     * @returns 随机数[min, max]
     */
    public static getRandomDecimals(maxNum: number = 0, minNum: number = 0, decimalNum: number = 0): number {
        let max = 0;
        let min = 0;
        minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * (max + 1));
                break;
            case 2:
                return Math.floor(Math.random() * (max - min + 1) + min);
                break;
            case 3:
                return Number((Math.random() * (max - min) + min).toFixed(decimalNum));
                break;
            default:
                return Math.random();
                break;
        }
    }

    /**
     * 获取贝塞尔曲线的点的集合
     * @param points 点的集合, 至少包含起点和终点
     * @param num 想要生成多少点
     * @returns 
     */
    public static getCurvePointsInNum(points: Array<mw.Vector>, num: number): Array<mw.Vector> {
        let result: Array<mw.Vector> = new Array<mw.Vector>();
        for (let i: number = 0; i < num; i++) {
            let t: number = i / (num - 1);
            let point = this.getKeyPoint(points, t);
            result.push(point);
        }
        return result;
    }

    private static getKeyPoint(points: Array<mw.Vector>, t: number): mw.Vector {
        if (points.length > 1) {
            let dirs: Array<mw.Vector> = new Array<mw.Vector>();
            for (let i: number = 0; i < points.length - 1; i++) {
                dirs.push(new mw.Vector(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y, points[i + 1].z - points[i].z));
            }
            let points2: Array<mw.Vector> = new Array<mw.Vector>();
            for (let j: number = 0; j < dirs.length; j++) {
                points2.push(new mw.Vector(points[j].x + dirs[j].x * t, points[j].y + dirs[j].y * t, points[j].z + dirs[j].z * t));
            }
            return this.getKeyPoint(points2, t);
        }
        else {
            return new mw.Vector(points[0].x, points[0].y, points[0].z);
        }
    }

    /**
     * 震荡函数
     * @param x 
     * @param speed 震荡衰减/增益的速度
     * @param frequency 震荡的频率
     * @param amplitude 震荡的幅度
     * @returns 
     */
    public static shakeFunc(x: number, speed: number, frequency: number, amplitude: number): number {
        return (Math.pow(speed, -x) * Math.sin(2 * frequency * Math.PI * x)) / amplitude;
    }

    /**
     * 获取三维向量的夹角(点乘 - dot product)
     * @param center 夹角中心点
     * @param start 起始点
     * @param end 结束点
     * @returns 返回夹角
     */
    public static getTdAngle(center: mw.Vector, start: mw.Vector, end: mw.Vector): number {
        let x1 = start.x - center.x, y1 = start.y - center.y, z1 = start.z - center.z;
        let x2 = end.x - center.x, y2 = end.y - center.y, z2 = end.z - center.z;
        let vectorDot = x1 * x2 + y1 * y2 + z1 * z2;
        let vectorMold1 = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2));
        let vectorMold2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2) + Math.pow(z2, 2));
        let cosAngle = vectorDot / (vectorMold1 * vectorMold2);
        let radian = Math.acos(cosAngle);

        return (180 / Math.PI * radian);
    }

    /**
    * 获取两个向量围成的面积（叉乘 - multiplication cross）
    * @param center 夹角中心点
    * @param start 起始点
    * @param end 结束点
    * @returns 面积
    */
    public static getmsArea(center: mw.Vector, start: mw.Vector, end: mw.Vector): number {
        let x1 = start.x - center.x, y1 = start.y - center.y, z1 = start.z - center.z;
        let x2 = end.x - center.x, y2 = end.y - center.y, z2 = end.z - center.z;
        let vectorMultiplication = new mw.Vector(y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2);
        Console.error("[叉乘 - vectorMultiplication]" + vectorMultiplication);
        let area = Math.sqrt(Math.pow(vectorMultiplication.x, 2) + Math.pow(vectorMultiplication.y, 2) + Math.pow(vectorMultiplication.z, 2));
        return area;
    }

    /**得到今天日期 */
    public static getDay(): string {
        let day: string = "";
        day += new Date().getFullYear();
        day += (new Date().getMonth() + 1);
        day += new Date().getDate();
        return day;
    }

    /**今天是星期几 */
    public static getWhatDay(): string {
        let whatDay = "7123456".charAt(new Date().getDay());
        Console.error("whatDay = [" + whatDay + "]");
        return whatDay;
    }

    /**
     * 随机从数组中取出num个数据
     * @param arr 数组
     * @param num 多少个
     * @returns 数组
     */
    public static getRandomArr(arr: number[], num: number): number[] {
        let len = arr.length;
        for (let i = len - 1; i >= 0; --i) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            let itemIndex = arr[randomIndex];
            arr[randomIndex] = arr[i];
            arr[i] = itemIndex;
        }
        let arrList: number[] = [];
        for (let i = 0; i < num; ++i) {
            arrList.push(arr[i]);
        }
        return arrList;
    }

    /**随机两个不一样的颜色 */
    public static randomColor(): mw.LinearColor[] {
        let colors: mw.LinearColor[] = [mw.LinearColor.red, mw.LinearColor.green, mw.LinearColor.blue,
        mw.LinearColor.yellow, new mw.LinearColor(1, 0, 1, 1), new mw.LinearColor(0, 1, 1, 1), mw.LinearColor.white];
        let fontColor = colors[this.getRandomInteger(0, colors.length - 1)];
        let outlineColor = colors[this.getRandomInteger(0, colors.length - 1)];
        while (fontColor.a == outlineColor.a && fontColor.r == outlineColor.r
            && fontColor.g == outlineColor.g && fontColor.b == outlineColor.b) {
            outlineColor = colors[this.getRandomInteger(0, colors.length - 1)];
            Console.error("颜色重复");
        }
        return [fontColor, outlineColor];
    }

    public static circularRandomCoordinates(point: mw.Vector, radius: number, centerZ: number): mw.Vector {
        const u = Math.random();
        const theta = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(u);
        return new mw.Vector(point.x + r * Math.cos(theta) * radius, point.y + r * Math.sin(theta) * radius, centerZ);
    }

    /**资源下载 */
    // public static async downloadAsset(guid: string): Promise<void> {
    //     if (!mw.AssetUtil.assetLoaded(guid)) {
    //         await mw.AssetUtil.asyncDownloadAsset(guid);
    //     }
    // }

    public static bossWeapons: string[] = [
        "122952",
        "29054",
        "29047",
        "218730",
        "31728"
    ];

    public static getWeapon(): string {
        return this.bossWeapons[this.getRandomInteger(0, this.bossWeapons.length - 1)];
    }

    private static npcString: string[] = ["162971", "163330", "136183", "142879", "141623", "136298", "137837", "141926", "141927", "141928", "142184", "142188", "142191", "142192", "142258", "142260", "142922", "142926", "142923", "142928", "142927", "142136", "142137", "142138", "142261", "142257", "142925", "143236", "143227", "142914", "142913", "143234", "141618", "142193", "142194", "142915", "142916", "142917", "142918", "142919", "142920", "142924", "142929", "142930", "143226", "143228", "143229", "143230", "143231", "143233", "142907", "142888", "142900", "142889", "142884", "142885", "142886", "142887", "142890", "142891", "142892", "142893", "142894", "142895", "142896", "142898", "142901", "142272", "142903", "142904", "142905", "142906", "142899"];
    public static getBoss(): string {
        return this.npcString[this.getRandomInteger(0, this.npcString.length - 1)];
    }

    public static setWidgetVisibility(ui: mw.Widget, visibility: mw.SlateVisibility): void {
        if (ui.visibility != visibility) ui.visibility = visibility;
    }

    private static npcNames: string[] = ["张吉惟", "林国瑞", "林玫书", "林雅南", "江奕云", "刘柏宏", "阮建安", "林子帆", "夏志豪", "吉茹定", "李中冰", "谢彦文", "傅智翔", "洪振霞", "刘姿婷", "荣姿康", "吕致盈", "方一强", "黎芸贵", "郑伊雯", "雷进宝", "吴美隆", "吴心真", "王美珠", "郭芳天", "李雅惠", "陈文婷", "曹敏侑", "王依婷", "陈婉璇", "吴美玉", "蔡依婷", "郑昌梦", "林家纶", "黄丽昆", "李育泉", "黄芸欢", "吴韵如", "李肇芬", "卢木仲", "李成白", "方兆玉", "刘翊惠", "丁汉臻", "吴佳瑞", "舒绿珮", "周白芷", "张姿妤", "张虹伦", "周琼玫", "倪怡芳", "郭贵妃", "杨佩芳", "黄盛玫", "郑丽青", "许智云", "张孟涵", "李小爱", "王恩龙", "朱政廷", "邓诗涵", "陈政倩", "吴俊伯", "阮馨学", "翁惠珠", "吴思翰", "林佩玲", "邓海来", "陈翊依", "李建智", "武淑芬", "金雅琪", "赖怡宜", "黄育霖", "张仪湖", "王俊民", "张诗刚", "林慧颖", "沈俊君", "陈淑妤", "李姿伶", "高咏钰", "黄彦宜", "周孟儒", "潘欣臻", "李祯韵", "叶洁启", "梁哲宇", "黄晓萍", "杨雅萍", "卢志铭", "张茂以", "林婉婷", "蔡宜芸", "林珮瑜", "黄柏仪", "周逸珮", "夏雅惠", "王采珮", "林孟霖", "林竹水", "王怡乐", "王爱乐", "金佳蓉", "韩健毓", "李士杰", "陈董珍", "苏姿婷", "张政霖", "李志宏", "陈素达", "陈虹荣", "何美玲", "李仪琳", "张俞幸", "黄秋萍", "潘吉维"];
    public static randomNpcName(): string {
        return this.npcNames[this.getRandomInteger(0, this.npcNames.length - 1)];
    }

    private static tens: string[] = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    private static digitalUnits: string[] = ["", '十', '百', '千', '万', '亿', '十', '百', '千'];

    /**根据数字获取汉字*/
    public static numChangeToCN(num: number): string {
        if (this.tens[num]) {
            return this.tens[num];
        } else if (num > 10 && num < 20) {
            let numStr = num.toString();
            let n = numStr.substring(1, 2);
            let result = this.digitalUnits[1] + this.tens[n];
            return result;
        } else if (num > 10) {
            let result = "";
            let numStr = num.toString();
            for (var i = 0; i < numStr.length; ++i) {
                let n = numStr.substring(i, i + 1);
                let m = numStr.length - i - 1;
                result += this.tens[n] + this.digitalUnits[m];
            }
            return result;
        }
        else return "零";
    }

    private static assetIconDataMap: Map<string, mw.AssetIconData> = new Map<string, mw.AssetIconData>();
    public static setImageByAssetIconData(image: mw.Image, icon: string): void {
        if (this.assetIconDataMap.has(icon)) {
            image.setImageByAssetIconData(this.assetIconDataMap.get(icon));
        } else {
            mw.assetIDChangeIconUrlRequest([icon]).then(() => {
                try {
                    let assetIconData = mw.getAssetIconDataByAssetID(icon);
                    image.setImageByAssetIconData(assetIconData);
                    this.assetIconDataMap.set(icon, assetIconData);
                } catch (error) { }
            });
        }
    }
}

/**贝塞尔曲线 */
export function cubicBezier(p1x, p1y, p2x, p2y) {
    const ZERO_LIMIT = 1e-6;
    const ax = 3 * p1x - 3 * p2x + 1;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;
    const ay = 3 * p1y - 3 * p2y + 1;
    const by = 3 * p2y - 6 * p1y;
    const cy = 3 * p1y;

    function sampleCurveDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx;
    }
    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
    }
    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }
    function solveCurveX(x) {
        let t2 = x;
        let derivative;
        let x2;
        for (let i = 0; i < 8; i++) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }
            t2 -= x2 / derivative;
        }
        let t1 = 1;
        let t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            } else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
        return t2;
    }
    function solve(x) {
        return sampleCurveY(solveCurveX(x));
    }
    return solve;
}