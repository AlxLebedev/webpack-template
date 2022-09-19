class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }

    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }

    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
};

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
    }
    get min() {
        return this.obj[this.minProp];
    }
    set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
        return this.obj[this.maxProp];
    }
    set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;
    }
};

function makeGUIFolder(gui, vector3, name, callback, min = -10, max = 10) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', min, max).onChange(callback);
    folder.add(vector3, 'y', min, max).onChange(callback);
    folder.add(vector3, 'z', min, max).onChange(callback);
    folder.open();
};

export { ColorGUIHelper, MinMaxGUIHelper, makeGUIFolder }