import { EntityControllerInputClass } from '@core/controllers/EntityControllerInputClass';

export class AIControllerInput extends EntityControllerInputClass {
	get actions() {
		return this._actions;
	}
}