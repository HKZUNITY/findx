/*
 * @Author       : sen.yu sen.yu@appshahe.com
 * @Date         : 2022-10-24 18:52:08
 * @LastEditors: xin.zhang xin.zhang@appshahe.com
 * @LastEditTime: 2022-12-06 11:54:33
 * @FilePath: \commonprefab\Prefabs\PF_AIManager\Script\AIManager.ts
 * @Description  : 
 */

import Console from '../../../Tools/Console';
import BaseAI from '../../AI敌人/Script/BaseAI';
import { PrefabEvent } from "../../PrefabEvent";


const AIPrefabGuid: string = "11CFF9E44EAAA56D8D152D83A1927DE2";

export namespace AIManagerSpace {

	export var Instance: AIManager = null;

}

export class AIAttr {
	hp: number;
	mp: number;
	jump: number;
	walkSpeed: number;
	aggressivity: number;
	appearanceData: string;
	attackRange: number;
	detectionRange: number;
	attackDistance: number;
	weaponGuid: string;
	animationGuid: string;
	animationTime: number;
	damageFrame: number;
	canRevive: boolean;
	reviveTime: number;
	runSpeed: number;
	maxRunDistance: number;
	pathArray: Vector[];

}

/**
 * 预声明
 */
export abstract class AIManagerPreDef extends mw.Script {

}

/**
 * 共享层
 */
export abstract class AIManagerData extends AIManagerPreDef {

	// assets: string = "4EC9D7E7487E73C101F5198DD08D4D8A"
	/**
	 * 未激活的ai
	 */
	protected negativeAi: BaseAI[] = [];
	/**
	 * 激活的ai
	 */
	protected activeAi: BaseAI[] = [];

	protected onStart(): void {
		super.onStart();
		//双端逻辑
		//GameEvent_Reg.regEvent(GameEvent_Reg.Event_CreateAI, this.server_addAI.bind(this));
		// Utils.downloadAsset(this.assets);
	}

	public registerNegativeAI(obj: BaseAI) {
		this.negativeAi.push(obj);
	}

	public registerActiveAI(obj: BaseAI) {
		this.activeAi.push(obj);
	}

	public getAI() {
		if (this.negativeAi.length != 0) {
			return this.negativeAi.pop();
		}
		return null;
	}

	protected onUpdate(dt: number): void {

		super.onUpdate(dt);
		//双端逻辑

	}

}

/**
 * 客户端处理器
 */
export abstract class AIManagerClient extends AIManagerData {

	protected onStart(): void {

		super.onStart();

		if (mw.SystemUtil.isClient()) {
			//客户端逻辑

		}

	}

	protected onUpdate(dt: number): void {

		super.onUpdate(dt);

		if (mw.SystemUtil.isClient()) {

			//客户端逻辑

		}

	}
}

export class AITargetInfo {
	public targetGuid: string;
	public state: AITargetState;
}

export enum AITargetState {
	/** 有效的 */
	Valid = 0,
	/** 以下都是无效的 */
	InValid = 10,
	/** 死亡的 */
	Dead = 11
}

/**
 * 服务器处理器
 */
export class AIManagerServer extends AIManagerClient {
	/**
	 * 敌人攻击列表的索引
	 */
	private targetMap: Map<string, AITargetInfo> = new Map();


	protected onStart(): void {

		super.onStart();

		if (mw.SystemUtil.isServer()) {
			//服务端逻辑
			Player.onPlayerJoin.add((player: mw.Player) => {
				let newInfo = new AITargetInfo();
				newInfo.targetGuid = player.character.gameObjectId;
				newInfo.state = AITargetState.Valid;
				this.targetMap.set(newInfo.targetGuid, newInfo);
				Player.onPlayerDisconnect.add(() => {
					if (!this.targetMap.has(player.character.gameObjectId)) {
						return;
					}
					this.targetMap.delete(player.character.gameObjectId);
				});
			})
			PrefabEvent.PrefabEvtFight.onDie((guid: string) => {
				if (!this.targetMap.has(guid)) {
					return;
				}
				let target = this.targetMap.get(guid);
				target.state = AITargetState.Dead;
			})
			PrefabEvent.PrefabEvtFight.onRevive((guid: string) => {
				if (!this.targetMap.has(guid)) {
					return;
				}
				let target = this.targetMap.get(guid);
				target.state = AITargetState.Valid;
			})

		}

	}

	public getTargetInfo(targetGuid: string) {
		if (!this.targetMap.has(targetGuid)) {
			Console.error("在索敌列表中不存在指定guid" + targetGuid)
			return null;
		}
		return this.targetMap.get(targetGuid);
	}

	protected onUpdate(dt: number): void {
		super.onUpdate(dt);
		if (mw.SystemUtil.isServer()) {

			//客户端逻辑

		}

	}
}

/**
 * 导出脚本
 */
export default class AIManager extends AIManagerServer {

	protected onStart(): void {

		super.onStart();

		AIManagerSpace.Instance = this;

	}



	protected onUpdate(dt: number): void {

		super.onUpdate(dt);

	}

}
