import * as dat from 'dat.gui';

type AddEntityToFolderParams = {
  excludeX?: boolean;
  excludeY?: boolean;
  excludeZ?: boolean;
  folderName: string;
  min?: number;
  max?: number;
  step?: number;
  target: { x: number; y: number; z: number };
  name?: string;
};

export class Gui {
  private _gui = new dat.GUI();

  private _CheckIfFolderExists(folderName: string) {
    return !!this._gui.__folders[folderName];
  }

  private _CreateGUIFolder(name: string) {
    this._gui.addFolder(name);
    this._gui.__folders[name].open();
  }

  public AddEntityToFolder(params: AddEntityToFolderParams) {
    if (!this._CheckIfFolderExists(params.folderName)) this._CreateGUIFolder(params.folderName);
    const folder = this._gui.__folders[params.folderName];

    if (!params.excludeX)
      folder.add(params.target, 'x', params.min, params.max, params.step).name(`${params.name} X`).listen();
    if (!params.excludeY)
      folder.add(params.target, 'y', params.min, params.max, params.step).name(`${params.name} Y`).listen();
    if (!params.excludeZ)
      folder.add(params.target, 'z', params.min, params.max, params.step).name(`${params.name} Z`).listen();
  }
}
