export default function makeGUIFolder(gui, vector3, name, callback, min = -10, max = 10) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', min, max).onChange(callback);
    folder.add(vector3, 'y', min, max).onChange(callback);
    folder.add(vector3, 'z', min, max).onChange(callback);
    folder.open();
}