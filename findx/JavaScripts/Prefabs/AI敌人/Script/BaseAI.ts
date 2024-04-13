import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/*
* @Author       : sen.yu sen.yu@appshahe.com
* @Date         : 2022-10-13 14:55:27
* @LastEditors: Please set LastEditors
* @LastEditTime: 2022-12-21 15:41:31
* @FilePath: \commonprefab\Prefabs\PF_BaseAI\Script\BaseAI.ts
* @Description  : 
*/

import { AIAttr, AIManagerSpace, AITargetState } from "../../AI管理器/Script/AIManager";
import { PrefabEvent } from "../../PrefabEvent";
import { Utils } from '../../../Tools/utils';
import Console from '../../../Tools/Console';

export class BaseAIDataDef extends mw.Script {
	assets: string = "29747,29764,8350,14013,21615,58694,58700,63544,60990,66299,63301,70618,122956"

	@mw.Property({ displayName: "是否自动启动", group: "敌人配置" })
	autoStart: boolean = false;
	//============================AI基础属性=======================================//
	@mw.Property({ displayName: "血量", group: "敌人配置" })
	hp: number = 100
	@mw.Property({ displayName: "蓝量", group: "敌人配置" })
	mp: number = 100
	@mw.Property({ displayName: "跳跃高度", group: "敌人配置" })
	jump: number = 100
	@mw.Property({ displayName: "移动速度", group: "敌人配置" })
	walkSpeed: number = 200
	@mw.Property({ displayName: "攻击力", group: "敌人配置" })
	aggressivity: number = 10
	//============================================================================//
	// @mw.Property({ displayName: "性别(0:女性，1：男性)" })
	// gender: number = 0
	//====================================换装==================================//
	// @mw.Property({ displayName: "上半身", group: "装扮配置" })
	// bodyUpper: string = "58694"
	// @mw.Property({ displayName: "下半身", group: "装扮配置" })
	// bodyLower: string = "58700"
	// @mw.Property({ displayName: "头发", group: "装扮配置" })
	// hair: string = "63544"
	// @mw.Property({ displayName: "脸部", group: "装扮配置" })
	// face: string = "66299"
	// @mw.Property({ displayName: "身体", group: "装扮配置" })
	// body: string = "63301"
	@mw.Property({ displayName: "外观信息(keep则不变)", group: "敌人配置" })
	appearanceData: string = "keep";
	//============================================================================//
	@mw.Property({ displayName: "识敌范围(角度)", group: "敌人配置" })
	attackRange: number = 60

	@mw.Property({ displayName: "识敌范围(半径)", group: "敌人配置" })
	detectionRange: number = 300

	@mw.Property({ displayName: "攻击距离", group: "敌人配置" })
	attackDistance: number = 150

	@mw.Property({ displayName: "武器模型ID", group: "敌人配置" })
	weaponGuid: string = "122956"

	@mw.Property({ displayName: "攻击动画ID", group: "敌人配置" })
	animationGuid: string = "21615"

	@mw.Property({ displayName: "动画时长(秒)", group: "敌人配置" })
	animationTime: number = 1

	@mw.Property({ displayName: "伤害帧（秒）", group: "敌人配置" })
	damageFrame: number = 0.5

	@mw.Property({ displayName: "可否复活", group: "敌人配置" })
	canRevive: boolean = true;

	@mw.Property({ displayName: "复活等待时间(秒)", group: "敌人配置" })
	reviveTime: number = 10;

	// @mw.Property({ displayName: "移动行为:1.指定寻路,2.范围随机移动" })
	// moveModel: number = 1;

	@mw.Property({ displayName: "追击速度", group: "敌人配置" })
	runSpeed: number = 400

	@mw.Property({ displayName: "最大追击距离", group: "敌人配置" })
	maxRunDistance: number = 1000

	@mw.Property({ displayName: "寻路路径", group: "敌人配置" })
	pathArray: Vector[] = [Vector.zero];

	@mw.Property({ displayName: "启用寻路", group: "敌人配置" })
	enableFind: boolean = false;
}


@Component
export default class BaseAI extends BaseAIDataDef {

	/**
	 * 状态机
	 */
	machine: StateMachine<BaseState>;

	/**
	 * 寻路坐标数组 
	 */
	pathVector: mw.Vector[] = [];

	/**
	 * 寻路索引
	 */
	index: number = 0;

	/**
	 * 角色对象
	 */
	role: mw.Character;

	/**
	 * 移动方向标记
	 */
	pathFlag = true;

	/**
	 * 伤害帧 控制变量
	 */
	damageTimer: number = null;

	/**
	 * 造成伤害标记 避免多次伤害
	 */
	flag: boolean = true;

	/**
	 * 动画播放时间控制变量
	 */
	animationTimer: number = 0;

	/**
	 * 出生点
	 */
	birthplace: mw.Vector;

	/**
	 * 当前朝向
	 */
	curDir: mw.Vector;


	/**
	 * 轮询定时器
	 */
	inter: number;

	private isInit: boolean = false;

	private _curHp: number = 0;

	/** 当脚本被实例后，会在第一帧更新前调用此函数 */
	protected async onStart(): Promise<void> {

		// let assetStr = this.assets.split(',');
		// for (let i = 0; i < assetStr.length; ++i) {
		// 	await Utils.downloadAsset(assetStr[i]);
		// }

		this.isInit = false;
		await TimeUtil.delaySecond(3);
		if (!this.gameObject) return;

		this.gameObject.asyncReady().then(() => {
			this.machine = new StateMachine(this);
			this.machine.register(StateType.PATROL, new PatrolState(this.machine));//注册巡逻状态
			this.machine.register(StateType.PURSUIT, new PursuitState(this.machine));//注册追击状态
			this.machine.register(StateType.ATTACK, new AttackState(this.machine));//注册攻击状态
			this.machine.register(StateType.DEAD, new DeadState(this.machine));//注册死亡状态
			this.initData();//解析配置数据
			this.useUpdate = true;
			//注册死亡监听事件
			PrefabEvent.PrefabEvtFight.onDie((charId: string) => {
				if (charId == this.role.gameObjectId) {
					if (this.machine) {
						this.machine.changeState(StateType.DEAD);
						this.machine.curState.Target = null;
					}
				}
			});
			let inter = setInterval(() => {
				if (AIManagerSpace.Instance) {
					clearInterval(inter);
					inter = null;
					if (this.autoStart) {
						AIManagerSpace.Instance.registerActiveAI(this);
					} else {
						AIManagerSpace.Instance.registerNegativeAI(this);
					}
				}
			}, 30)
		});
	}

	start() {
		this.autoStart = true;
	}

	stop(): void {
		this.autoStart = false;
	}

	/**
	 * 解析配置数据
	 */
	public initData(attr?: AIAttr, _location?: mw.Vector) {
		Console.log("FFFFFFFFFFFFF", _location, JSON.stringify(attr));
		if (attr) {
			this.hp = attr.hp;
			this.mp = attr.mp;
			this.jump = attr.jump;
			this.walkSpeed = attr.walkSpeed;
			this.aggressivity = attr.aggressivity;
			// this.gender = attr.gender;
			this.appearanceData = attr.appearanceData;
			this.attackRange = attr.attackRange;
			this.detectionRange = attr.detectionRange;
			this.attackDistance = attr.attackDistance;
			this.weaponGuid = attr.weaponGuid;
			this.animationGuid = attr.animationGuid;
			this.animationTime = attr.animationTime;
			this.damageFrame = attr.damageFrame;
			this.canRevive = attr.canRevive;
			this.reviveTime = attr.reviveTime;
			// this.moveModel = attr.moveModel;
			this.runSpeed = attr.runSpeed;
			this.maxRunDistance = attr.maxRunDistance;
			this.pathArray = attr.pathArray;
		}
		if (_location) {
			this.birthplace = _location;
		}
		this.animationTimer = this.animationTime;
		if (this.pathArray.length != 0 && this.enableFind) {
			for (let i = 0; i < this.pathArray.length; i++) {
				let pos = this.pathArray[i].clone();
				this.pathVector.push(pos);
			}
		}
		this.initBaseAttr();
	}

	/**
	 * 巡逻
	 */
	patrol() {
		if (this.pathVector.length != 0) {
			let targetPos = new mw.Vector(
				this.pathVector[this.index].x,
				this.pathVector[this.index].y,
				this.pathVector[this.index].z)
			let tempLocation = new mw.Vector(
				this.role.worldTransform.position.x,
				this.role.worldTransform.position.y,
				this.role.worldTransform.position.z);
			this.curDir = tempLocation.clone().add(targetPos.clone().subtract(this.role.worldTransform.position.clone()))
			this.role.lookAt(this.curDir);
			this.role.addMovement(mw.Vector.forward);
			let distance = Math.sqrt(
				Math.pow(this.role.worldTransform.position.x - this.pathVector[this.index].x, 2) +
				Math.pow(this.role.worldTransform.position.y - this.pathVector[this.index].y, 2)
			)
			//到达寻路点
			if (distance <= 50) {
				if (this.pathFlag && this.index < this.pathVector.length - 1) {
					this.index++
					if (this.index == this.pathVector.length - 1) this.pathFlag = false;
				} else if (!this.pathFlag && this.index > 0) {
					this.index--
					if (this.index == 0) this.pathFlag = true;
				}
			}
		}
		//检测攻击对象
		//遍历所有玩家的位置是否在识敌范围内
		let result = QueryUtil.sphereOverlap(this.role.worldTransform.position, this.detectionRange, false);
		for (let i = 0; i < result.length; ++i) {
			if (result[i] instanceof mw.Character) {
				if (this.role == result[i]) continue;
				let cha = result[i] as mw.Character
				let isInRange = MathUtil.angleCheck(this.role.worldTransform.position, this.role.worldTransform.getForwardVector().clone(), cha.worldTransform.position, this.attackRange);
				let targetInfo = AIManagerSpace.Instance.getTargetInfo(cha.gameObjectId);
				if (isInRange && targetInfo && targetInfo.state < AITargetState.InValid) {
					this.role.lookAt(this.curDir.clone().add(this.role.worldTransform.position.clone()));
					this.machine.changeState(StateType.PURSUIT);
					this.machine.curState.Target = cha.player;
					break;
				}
			}
		}
	}

	/**
	 * 追击
	 * @param target 追击目标
	 */
	pursuit(target: mw.Player) {
		let targetPos = new mw.Vector(
			target.character.worldTransform.position.x,
			target.character.worldTransform.position.y,
			target.character.worldTransform.position.z);
		let aiPos = new mw.Vector(
			this.role.worldTransform.position.x,
			this.role.worldTransform.position.y,
			this.role.worldTransform.position.z);
		this.curDir = targetPos.clone().subtract(this.role.worldTransform.position).normalized;
		this.role.lookAt(aiPos.add(this.curDir));
		this.role.addMovement(mw.Vector.forward);
	}

	/**
	 * 发起攻击
	 * @param target 攻击对象
	 * @param dt 帧间隔 用来计算伤害帧 
	 */
	attack(target: mw.Player, dt: number) {

		let targetPos = new mw.Vector(target.character.worldTransform.position.x, target.character.worldTransform.position.y, target.character.worldTransform.position.z);
		let aiPos = new mw.Vector(this.role.worldTransform.position.x, this.role.worldTransform.position.y, this.role.worldTransform.position.z);
		this.curDir = targetPos.clone().subtract(this.role.worldTransform.position);
		this.role.lookAt(aiPos.add(this.curDir));

		if (this.animationTimer == this.animationTime) {
			PlayerManagerExtesion.rpcPlayAnimation(this.role, this.animationGuid, this.animationTime)
		}
		this.animationTimer -= dt;
		if (this.animationTimer < this.animationTime - this.damageFrame && this.flag) {
			this.flag = false
			// let attr = GameEvent_API.getPlayerAttr(target.character.guid);
			let targetInfo = AIManagerSpace.Instance.getTargetInfo(target.character.gameObjectId);
			// //attr.curHp -= this.aggressivity;
			// let change = new PlayerAttrDB();
			// change.curHp = -this.aggressivity;
			// GameEvent_API.addPlayerAttr(target.character.guid, change);
			PrefabEvent.PrefabEvtFight.hurt(this.gameObject.gameObjectId, target.character.gameObjectId, this.aggressivity);
			//GameEvent_API.updatePlayerAttr(target.character.guid, attr);
			//TODO:提前置空？
			// if (attr.curHp - this.aggressivity <= 0) {
			// 	this.machine.curState.Target = null;//置空攻击目标
			// 	this.machine.changeState(StateType.PATROL);//切换到巡逻状态
			// }
		}
		if (this.animationTimer <= 0) {
			this.animationTimer = this.animationTime
			this.flag = true;
		}
	}


	/**
	 * 初始化角色基础属性
	 */
	private initBaseAttr() {
		Console.log("DDDDDDDDDDDDDDDDDDDDDD");
		this.role = this.gameObject as mw.Character;
		this.role.maxWalkSpeed = this.walkSpeed;
		this.machine.changeState(StateType.PATROL);//初始为巡逻状态
		if (this.birthplace) {
			this.role.worldTransform.position = this.birthplace.clone();
		} else {
			this.birthplace = this.role.worldTransform.position.clone();
		}
		this.curDir = this.gameObject.worldTransform.getForwardVector();
		//装备武器
		if (mw.SystemUtil.isServer()) {
			if ("" != this.weaponGuid && this.weaponGuid.length != 0) {
				SpawnManager.wornAsyncSpawn(this.weaponGuid).then(obj => {
					obj.setCollision(mw.PropertyStatus.Off)
					this.role.attachToSlot(obj, mw.HumanoidSlotType.RightHand);
				});
			}
			//GameEvent_Server_API.loginCharacter(this.role.guid)
			//AIManagerSpace.Instance.
		}

		//换装
		if (this.role && this.appearanceData != "keep") {
			this.role.clearDescription();
			this.role.setDescription([this.appearanceData]);
			this.role.syncDescription();

			//换装逻辑
			PrefabEvent.PrefabEvtCloth.loadRole(this.gameObject.gameObjectId, this.gameObject.gameObjectId, [this.appearanceData]);
			// v
			// v1.face.setMesh(this.face, true);
			// v1.hair.setMesh(this.hair, true);
			// v1.trunk.setMesh(this.body, true);
		}
		//更新血量
		this._curHp = this.hp;

		PrefabEvent.PrefabEvtFight.onHurt((sender, target, damage) => {
			if (this.gameObject == null || this.gameObject == undefined) return;
			if (this.gameObject.gameObjectId == null || this.gameObject.gameObjectId == undefined) return;
			if (target != this.gameObject.gameObjectId) {
				return;
			}
			if (this._curHp <= 0) {
				return;
			}
			this._curHp -= damage;
			if (this._curHp <= 0) {
				PrefabEvent.PrefabEvtFight.die(this.gameObject.gameObjectId);
			}
		})

		PrefabEvent.PrefabEvtFight.onHit((sender, target, damage, point) => {
			if (target != this.gameObject.gameObjectId) {
				return;
			}
			if (this._curHp <= 0) {
				return;
			}
			this._curHp -= damage;
			if (this._curHp <= 0) {
				PrefabEvent.PrefabEvtFight.die(this.gameObject.gameObjectId);
			}
		})

		this.isInit = true;

		// let v2 = new mw.HumanoidV2(this.role);
		// v2.description.advance.clothing.upperCloth.style = this.bodyUpper, true;
		// v2.description.advance.clothing.lowerCloth.style = this.bodyLower, true;

		// this.role.setCloth(mw.BodyPartType.E_UpperHalf, this.bodyUpper);
		// this.role.setCloth(mw.BodyPartType.E_LowerHalf, this.bodyLower);
		// this.role.setCloth(mw.BodyPartType.E_Hair, this.hair);
		// this.role.setCloth(mw.BodyPartType.E_Face, this.face);
		// this.role.setCloth(mw.BodyPartType.E_Body, this.body);
	}

	/**
	 * 复活函数
	 */
	revive() {
		//let attr = GameEvent_Server_API.getPlayerAttr(this.role.guid);
		//attr.curHp = attr.hp
		//this.hp = attr.hp;
		this._curHp = this.hp;
		this.role.worldTransform.position = this.birthplace.clone();
		//GameEvent_Server_API.updatePlayerAttr(this.role.guid, attr);
		this.machine.changeState(StateType.PATROL);//复活后切换到巡逻状态
	}

	/** 
	 * 每帧被执行,与上一帧的延迟 dt 秒
	 * 此函数执行需要将this.useUpdate赋值为true
	 */
	protected onUpdate(dt: number): void {
		if (!this.autoStart) return;
		if (mw.SystemUtil.isClient()) return;
		if (this.isInit == false) return;
		if (this.machine) {
			this.machine.update(dt);
		}
	}

	/** 脚本被销毁时最后一帧执行完调用此函数 */
	protected onDestroy(): void {
		if (this.machine) {
			this.machine.destroy();
		}
	}

}

//===============================================状态机====================================================/
/**
 * 状态枚举
 */
enum StateType {
	/**巡逻 */
	PATROL,
	/**追击 */
	PURSUIT,
	/**攻击 */
	ATTACK,
	/**死亡 */
	DEAD
}

/**
 * 状态机
 */
class StateMachine<T extends BaseState> {

	/**当前状态 */
	curState: BaseState;
	/**状态缓存 */
	stateMap: Map<StateType, T> = new Map();
	/**状态机持有者 */
	owner: BaseAI;

	constructor(_owner) {
		this.owner = _owner;
	}
	/**
	 * 切换状态
	 * @param type 状态枚举
	 * @returns 
	 */
	changeState(type: StateType) {
		let tempTarget = null;
		//先退出当前状态
		if (this.curState) {
			tempTarget = this.curState.Target;
			this.curState.onStateLeave();
			this.curState = null;
		}
		if (this.stateMap.has(type)) {
			let state = this.stateMap.get(type);
			state.onStateEnter(this.owner);
			this.curState = state;
			this.curState.Target = tempTarget
		} else {
			return null;
		}
	}

	/**
	 * 注册状态
	 * @param type 
	 * @param newState 
	 */
	register(type: StateType, newState: T) {
		if (!this.stateMap.has(type)) {
			this.stateMap.set(type, newState);
		}
	}

	update(dt: number) {
		if (this.curState) {
			this.curState.onUpdate(dt);
		}
	}

	destroy() {
		this.owner = null;
		this.curState = null;
		this.stateMap.clear()
	}

}


/**
 * 基础状态类
 */
class BaseState {

	/**
	 * 状态机
	 */
	protected machine: StateMachine<BaseState>;

	/**
	 * 对象实体
	 */
	protected holder: BaseAI;

	/**
	 * 攻击目标
	 */
	protected target: mw.Player;

	constructor(_machine: StateMachine<BaseState>) {
		this.machine = _machine;
	}

	/**
	 * 攻击目标是否存活
	 * @param playerId 
	 * @returns 
	 */
	public isAlive(charId: string): boolean {
		let targetInfo = AIManagerSpace.Instance.getTargetInfo(charId);
		//let attr = GameEvent_API.getPlayerAttr(charId);
		if (!targetInfo || targetInfo.state === AITargetState.Dead) {
			this.machine.changeState(StateType.PATROL);
			return false
		}
		return true;
	}
	/**
	 * 进入状态
	 * @param obj 状态机持有者
	 */
	public onStateEnter(obj: BaseAI) {
		if (obj) this.holder = obj
		Console.log("<AI>进入:" + this.constructor.name + "状态");

	};

	/**
	 * 离开状态
	 */
	public onStateLeave() {

	};

	public onUpdate(dt: number) {

	};

	public onDestroy() {
		this.machine = null;
		this.holder = null;
	}

	set Target(_target: mw.Player) {
		this.target = _target;
	}
	get Target() {
		return this.target;
	}

}

/**
 * 巡逻状态
 */
class PatrolState extends BaseState {

	constructor(_machine: StateMachine<BaseState>) {
		super(_machine);
	}

	public override onStateEnter(obj) {
		super.onStateEnter(obj);
		this.holder.role.movementEnabled = true;
		this.holder.role.maxWalkSpeed = this.holder.walkSpeed;
	};

	public override onStateLeave() {

	};

	public override onUpdate(dt: number) {
		//角色移动并检测攻击目标
		this.holder.patrol()
	};
}

/**
 * 追击状态
 */
class PursuitState extends BaseState {

	/**
	 * 开始追击的位置 用来计算追击的距离
	 */
	startPos: mw.Vector;

	constructor(_machine: StateMachine<BaseState>) {
		super(_machine);
	}

	public override onStateEnter(obj) {
		super.onStateEnter(obj);
		this.holder.role.movementEnabled = true;
		//修改移动速度
		this.holder.role.maxWalkSpeed = this.holder.runSpeed;
		this.startPos = this.holder.role.worldTransform.position.clone();
	};

	public override onStateLeave() {
		//恢复移动速度
		this.holder.role.maxWalkSpeed = this.holder.walkSpeed;
	};

	public override onUpdate(dt: number) {
		if (!this.target.character.worldTransform.position) {
			this.machine.changeState(StateType.PATROL);
			return;
		}
		if (this.isAlive(this.target.character.gameObjectId)) {
			//追击
			this.holder.pursuit(this.target);
			//判断追击距离
			let pDistance = Math.pow(this.holder.role.worldTransform.position.x - this.startPos.x, 2) + Math.pow(this.holder.role.worldTransform.position.y - this.startPos.y, 2);
			//大于最大追击距离放弃追击 切换到巡逻状态
			if (pDistance > Math.pow(this.holder.maxRunDistance, 2)) {
				this.machine.changeState(StateType.PATROL);
				return;
			}
			let distance = Math.pow(this.holder.role.worldTransform.position.x - this.target.character.worldTransform.position.x, 2) + Math.pow(this.holder.role.worldTransform.position.y - this.target.character.worldTransform.position.y, 2);
			//进入攻击范围 切换到攻击状态
			if (distance <= Math.pow(this.holder.attackDistance, 2)) {
				this.machine.changeState(StateType.ATTACK);
			}
		}
	};
}

/**
 * 攻击状态
 */
class AttackState extends BaseState {

	constructor(_machine: StateMachine<BaseState>) {
		super(_machine);
	}

	public override onStateEnter(obj) {
		super.onStateEnter(obj);
		this.holder.role.movementEnabled = false;
	};

	public override onStateLeave() {
		//停止攻击动画
		PlayerManagerExtesion.rpcStopAnimation(this.holder.role, this.holder.animationGuid)
		//重置动画控制变量
		this.holder.animationTimer = this.holder.animationTime;
		this.holder.flag = true;
	};

	public override onUpdate(dt: number) {
		if (!this.target.character.worldTransform.position) {
			this.machine.changeState(StateType.PATROL);
			return;
		}
		if (this.isAlive(this.target.character.gameObjectId)) {
			let distance = Math.pow(this.holder.role.worldTransform.position.x - this.target.character.worldTransform.position.x, 2) + Math.pow(this.holder.role.worldTransform.position.y - this.target.character.worldTransform.position.y, 2);
			//超出攻击范围 进入到追击状态
			if (distance > Math.pow(this.holder.attackDistance, 2)) {
				this.machine.changeState(StateType.PURSUIT);
			} else {
				this.holder.attack(this.target, dt);
			}
		}

	};

}


/**死亡状态 */
class DeadState extends BaseState {

	reviveTime: number = 0;

	constructor(_machine: StateMachine<BaseState>) {
		super(_machine);
	}

	public override onStateEnter(obj) {
		super.onStateEnter(obj);
		this.holder.role.movementEnabled = false;
		this.holder.role.maxWalkSpeed = this.holder.walkSpeed;
		this.reviveTime = this.holder.reviveTime;
		this.holder.role.ragdollEnabled = (true);
	};

	public override onStateLeave() {
		this.holder.role.ragdollEnabled = (false);
	};

	public override onUpdate(dt: number) {
		if (this.holder.canRevive) {
			this.reviveTime -= dt;
			if (this.reviveTime <= 0) {
				this.holder.revive();
			}
		}
	};

}
