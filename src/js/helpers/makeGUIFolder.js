export default function makeGUIFolder(gui, vector3, name, callback) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(callback);
    folder.add(vector3, 'y', -10, 10).onChange(callback);
    folder.add(vector3, 'z', -10, 10).onChange(callback);
    folder.open();
}