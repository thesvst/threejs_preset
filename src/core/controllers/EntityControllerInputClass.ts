enum ControllerActions {
	FORWARD = 'FORWARD',
	BACKWARD = 'BACKWARD',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
}

export class EntityControllerInputClass {
	_actions = {
		[ControllerActions.FORWARD]: false,
		[ControllerActions.BACKWARD]: false,
		[ControllerActions.LEFT]: false,
		[ControllerActions.RIGHT]: false,
	};
}

