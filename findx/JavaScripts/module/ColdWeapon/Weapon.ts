import { WeaponServer } from "./WeaponServer";

/** 冷兵器类 */
@Component
export default class Weapon extends WeaponServer {

    onStart() {
        super.onStart();
        this.useUpdate = true;
    }

    onUpdate(dt: number) {
        super.onUpdate(dt);
    }

}