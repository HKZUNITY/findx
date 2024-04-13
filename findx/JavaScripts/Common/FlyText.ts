export class FlyText {
    // 单例模式
    private static _instance: FlyText
    public static get instance() {
        if (FlyText._instance == null) {
            FlyText._instance = new FlyText()
        }
        return FlyText._instance
    }

    private _uiWidget: mw.UserWidget = null;
    private _rootCanvas: mw.Canvas = null;
    private _textPools: mw.TextBlock[] = [];

    /**默认文本框大小（由于开启了自适应，所以文本框有多大，文本就有多大） */
    private _defaultTextSize: Vector2 = new Vector2(200, 100);
    /**默认文本颜色 */
    private _defaultFontColor: LinearColor = LinearColor.white;
    /**默认文本描边颜色 */
    private _defaultOutlineColor: LinearColor = new mw.LinearColor(1, 0, 1, 1);

    /**
     * 展示飘字
     * @param content 内容
     * @param worldLocation 世界坐标
     * @param fontColor 颜色（可选）
     */
    public showFlyText(content: string, worldLocation: mw.Vector, fontColor?: LinearColor, outlineColor?: LinearColor): void {
        // 将世界坐标转换为屏幕坐标
        let vec2 = mw.InputUtil.projectWorldPositionToWidgetPosition(worldLocation, true).screenPosition;
        // 对象池处理
        let textBlock: mw.TextBlock = null;
        if (this._textPools.length == 0) {
            textBlock = this.createText();
        } else {
            textBlock = this._textPools.pop();
        }
        // 给一点初始偏移，方便做动画
        vec2.x -= 120;
        vec2.y -= 160;
        let toX = this.getRandomIntInclusive(100, 300);
        Math.random() < 0.5 ? toX = -toX : toX = toX;
        let toY = this.getRandomIntInclusive(-300, 100);
        // 用Tween，并结合PI来做曲线动画
        let animator = new mw.Tween({ a: 0 }).to({ a: Math.PI }, 1000).onUpdate((object) => {
            textBlock.position = vec2.clone().add(new mw.Vector2(toX * object.a / Math.PI, toY * Math.sin(object.a)));
            textBlock.renderScale = new mw.Vector2(Math.sin(object.a));
        }).onStart(() => {
            textBlock.fontColor = fontColor ? fontColor : this._defaultFontColor;
            textBlock.outlineColor = outlineColor ? outlineColor : this._defaultOutlineColor;
            textBlock.text = content;
            textBlock.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        }).onComplete(() => {
            textBlock.visibility = mw.SlateVisibility.Hidden;
            this._textPools.push(textBlock);
        })
        animator.start();
    }

    /**创建一个文本框 */
    private createText(): mw.TextBlock {
        // 首次创建，如果没有UI对象，就创建一个
        if (!this._uiWidget) {
            // 创建一个UI对象
            this._uiWidget = mw.UserWidget.newObject();
            this._uiWidget.addToViewport(1);
            // 首次创建，如果没有rootCanvas，就创建一个
            if (!this._rootCanvas) {
                this._rootCanvas = mw.Canvas.newObject();
                this._rootCanvas.size = new mw.Vector2(1920, 1080);
                this._rootCanvas.position = mw.Vector2.zero;
                this._uiWidget.rootContent = this._rootCanvas;
            }
        }
        // 创建一个文本框，并添加到画布上
        let textBlock = mw.TextBlock.newObject(this._rootCanvas);
        textBlock.size = this._defaultTextSize;
        // 开启文本自适应
        textBlock.fontSize = 60;
        textBlock.fontLetterSpace = 1;
        textBlock.textHorizontalLayout = mw.UITextHorizontalLayout.NoClipping;
        textBlock.autoAdjust = false;
        textBlock.outlineSize = 8;
        textBlock.glyph = mw.UIFontGlyph.Light;
        return textBlock;
    }

    /**得到一个两数之间的随机整数，包括两个数在内 */
    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
    }
}