import Console from "./Console";

export class InputManagers {
	private name: string;
	private static _instance = null;
	/**单例 */
	public static get getInstance(): InputManagers {
		if (this._instance == null && !this._isDestroy) {
			this._instance = new InputManagers("Singleton-HKZ");
		}
		return this._instance;
	}
	private static _isDestroy: boolean;

	/**存放点击屏幕位置的物体 */
	private _onTouch: Action1<Array<mw.HitResult>>;
	/**键位集合 */
	private keyDownActionMap: Map<mw.Keys, Action1<mw.Keys>>;

	/**按压 */
	public onPressTouch: mw.Action1<TouchData> = new mw.Action1<TouchData>();
	/**抬起 */
	public onReleaseTouch: mw.Action1<TouchData> = new mw.Action1<TouchData>();

	/**玩家从可触摸设备获取的数据信息，包含触摸手指数量，触摸位置(屏幕像素)和当前触摸状态(点击/滑动/离开) */
	private touch: mw.TouchInput;
	private beginMulFun: () => void;

	private constructor(name: string) {
		this.name = name;
		this.initAndBind();
	}

	/**初始化和绑定 */
	private initAndBind(): void {
		if (mw.SystemUtil.isClient()) {
			if (this.touch == null) {
				this.initTouch();
			}
			this.touch.onTouchBegin.add(this.beginMulFun);
			this.touch.onTouchEnd.add(this.beginMulFun);
			this.touch.onTouch.add(this.beginMulFun);
			this.keyDownActionMap = new Map();
		}
	}

	/**
	 * 鼠标点击触发，返回点击的所有结果
	 */
	public get onTouch(): Action1<Array<mw.HitResult>> {
		if (this._onTouch == null) this._onTouch = new Action1();
		return this._onTouch;
	}

	/**初始化触摸数据 */
	private initTouch(): void {
		if (this.touch != null) return;
		this.touch = new mw.TouchInput();
		this.beginMulFun = this.touchControl.bind(this);
		Player.asyncGetLocalPlayer().then(player => {
			this.touch.onTouchBegin.add(this.touchHandler.bind(this));
		});
	}

	/**屏幕触摸控制 */
	private touchControl(index: number, loc: mw.Vector, touchType: mw.TouchInputType): void {
		let touchArr = this.touch.getTouchVectorArray();
		if (touchType == mw.TouchInputType.TouchEnd) {
			this.onReleaseTouch.call(new TouchData(touchType, loc.x, loc.y));
		} else {
			for (let i = 0; i < touchArr.length; i++) {
				if (touchArr[i].z > 0) {
					this.onPressTouch.call(new TouchData(touchType, touchArr[i].x, touchArr[i].y));
				}
			}
		}
	}

	/**获取点击屏幕位置的物体 */
	private touchHandler(index: number, location: mw.Vector2, state): void {
		if (this.onTouch.count == 0) return;
		location = this.touch.getTouchVectorArray()[0];
		let list: Array<mw.HitResult> = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y, 50000, true, false);
		let arr: Array<mw.HitResult> = [];
		for (let i = 0; list != null && i < list.length; i++) {
			if (arr.includes(list[i])) continue;
			arr.push(list[i]);
		}
		if (list.length > 0) {
			this.onTouch.call(arr);
		}
	}

	/**
	 * 按下键盘事件(增加了重复监听的判断，还可以移除监听方法)
	 * @param key 按键类型
	 * @returns 监听的Action方法
	 */
	public onKeyDown(key: mw.Keys): Action1<mw.Keys> {
		if (!this.keyDownActionMap.has(key)) {
			this.keyDownActionMap.set(key, new Action1());
			InputUtil.onKeyDown(key, () => {
				this.keyDownActionMap.get(key).call(key);
			})
		}
		let action: Action1<mw.Keys> = this.keyDownActionMap.get(key);
		if (action.count > 0) {
			Console.error("重复的键盘事件监听 key=" + key);
			return null;
		}
		return action;
	}

	/**Test */
	private log(list: Array<mw.HitResult>): void {
		Console.error("------------Mouse Click……");
		for (let i = 0; list != null && i < list.length; i++) {
			Console.error("List: " + list[i].gameObject.name);
		}
	}

	/**
	 * 获取屏幕手指点击屏幕的坐标
	 * @param index 第几个点击
	 * @returns 
	 */
	public getTouchPos(index: number): mw.Vector2 {
		let pos = this.touch.getTouchVectorArray()[index];
		return new mw.Vector2(pos.x, pos.y);
	}

	/**回收 */
	public clearTouch(): void {
		this.onReleaseTouch.clear();
		this.onPressTouch.clear();
	}

	/**回收 */
	public static destroy(): void {
		this._isDestroy = true;
		InputManagers._instance = null;
	}
}

export class TouchData {
	event: mw.TouchInputType;
	x: number;
	y: number;

	constructor(event: mw.TouchInputType, x: number, y: number) {
		this.event = event;
		this.x = x;
		this.y = y;
	}
}