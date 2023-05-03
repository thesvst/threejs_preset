enum ControllerActions {
	FORWARD = 'FORWARD',
	BACKWARD = 'BACKWARD',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
}

const actionsInitialState = {
	[ControllerActions.FORWARD]: false,
	[ControllerActions.BACKWARD]: false,
	[ControllerActions.LEFT]: false,
	[ControllerActions.RIGHT]: false,
};

export class EntityControllerInputClass {
	_actions = actionsInitialState;
}

