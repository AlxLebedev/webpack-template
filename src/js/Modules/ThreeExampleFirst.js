import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';
import ColorGUIHelper from "../helpers/ColorGUIHelper";
import makeGUIFolder from "../helpers/makeGUIFolder";
import DegRadHelper from "../helpers/DegRadHelper";
import MinMaxGUIHelper from "../helpers/MinMaxGUIHelper";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    TextureLoader,
    RepeatWrapping,
    NearestFilter,
    PlaneGeometry,
    MeshPhongMaterial,
    DoubleSide,
    BoxGeometry,
    Mesh,
    SphereGeometry,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    PointLight,
    PointLightHelper,
    SpotLight,
    SpotLightHelper,
    CameraHelper
} from 'three';

export default class ThreeExampleFirst {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.view1Elem = document.getElementById('view1');
        this.view2Elem = document.getElementById('view2');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.cameraHelper = new CameraHelper(this.camera);
        this.controls = new OrbitControls(this.camera, this.view1Elem);
        this.additionalCamera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
        this.additionalControls = new OrbitControls(this.additionalCamera, this.view2Elem);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.gui = new GUI();
        this.minMaxGUIHelper = new MinMaxGUIHelper(this.camera, 'near', 'far', 0.1);
        this.light = null;
        this.lightHelper = null;
    }

    init() {
        this.configurateEquipment();
        this.createPlaneTexture();

        this.createCube();
        this.createSphere();

        // this.addAmbientLight();
        // this.addHemisphereLight();
        // this.addDirectionalLight();
        this.addPointLight();
        // this.addSpotLight();
        
        this.updateLight();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        requestAnimationFrame(this.renderScene.bind(this));
    }

    configurateEquipment() {
        this.camera.position.set(0, 10, 35);
        this.gui.add(this.camera, 'fov', 1, 180).name('Camera FOV');
        this.gui.add(this.minMaxGUIHelper, 'min', 0.1, 150, 0.1).name('Camera near');
        this.gui.add(this.minMaxGUIHelper, 'max', 0.1, 150, 0.1).name('Camera far');

        this.controls.target.set(0, 5, 0);
        this.controls.update();

        this.additionalCamera.position.set(40, 10, 60);
        this.additionalCamera.lookAt(0, 5, 0);

        this.additionalControls.target.set(0, 5, 0);
        this.additionalControls.update();

        this.scene.add(this.cameraHelper);
    }

    createPlaneTexture() {
        const planeSize = 40;
        const repeats = planeSize / 2;
        const loader = new TextureLoader();
        const planeTexture = loader.load('./src/static/checker.png');
        planeTexture.wrapS = RepeatWrapping;
        planeTexture.wrapT = RepeatWrapping;
        planeTexture.magFilter = NearestFilter;
        planeTexture.repeat.set(repeats, repeats);

        const planeGeometry = new PlaneGeometry(planeSize, planeSize)
        const planeMaterial = new MeshPhongMaterial({ map: planeTexture, side: DoubleSide});
        const mesh = new Mesh(planeGeometry, planeMaterial);
        mesh.rotation.x = Math.PI * -.5;

        this.scene.add(mesh);
    }

    createCube() {
        const cubeSize = 4;
        const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new MeshPhongMaterial({ color: '#8AC'});
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(cubeSize + 1, cubeSize / 2, 0);

        this.scene.add(cube);
    }

    createSphere() {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;

        const sphereGeometry = new SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMaterial = new MeshPhongMaterial({ color: '#CA8'});
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);

        this.scene.add(sphere);
    }

    addAmbientLight() {
        const color = '#ffffff';
        const intensity = 1;
        this.light = new AmbientLight(color, intensity);

        this.scene.add(this.light);

        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('Light color');
        this.gui.add(this.light, 'intensity', 0, 2, 0.01).name('Light intensity');
    }

    addHemisphereLight() {
        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = 1;

        this.light = new HemisphereLight(skyColor, groundColor, intensity);

        this.scene.add(this.light);

        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('Sky color');
        this.gui.addColor(new ColorGUIHelper(this.light, 'groundColor'), 'value').name('Ground Color');
        this.gui.add(this.light, 'intensity', 0, 2, 0.01).name('Light intensity');
    }

    addDirectionalLight() {
        const color = '#ffffff';
        const intensity = 1;

        this.light = new DirectionalLight(color, intensity);
        this.light.position.set(0, 10, 0);
        this.light.target.position.set(-5, 0, 0);

        this.scene.add(this.light);
        this.scene.add(this.light.target);

        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('Light color');
        this.gui.add(this.light, 'intensity', 0, 2, 0.01).name('Light intensity');

        makeGUIFolder(this.gui, this.light.position, 'position', this.updateLight.bind(this));
        makeGUIFolder(this.gui, this.light.target.position, 'target', this.updateLight.bind(this));
    }

    addPointLight() {
        const color = '#ffffff';
        const intensity = 1;

        this.light = new PointLight(color, intensity);
        this.light.position.set(0, 10, 0);

        this.scene.add(this.light);

        this.lightHelper = new PointLightHelper(this.light);
        this.scene.add(this.lightHelper);

        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('Light color');
        this.gui.add(this.light, 'intensity', 0, 2, 0.01).name('Light intensity');
        this.gui.add(this.light, 'distance', 0, 40).name('Light distance').onChange(this.updateLight.bind(this));

        makeGUIFolder(this.gui, this.light.position, 'position', this.updateLight.bind(this));
    }

    addSpotLight() {
        const color = '#ffffff';
        const intensity = 1;
        this.light = new SpotLight(color, intensity);
        this.light.position.set(0, 10, 0);
        this.light.target.position.set(-5, 0, 0);

        this.scene.add(this.light);
        this.scene.add(this.light.target);

        this.lightHelper = new SpotLightHelper(this.light);
        this.scene.add(this.lightHelper);

        this.gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('Light color');
        this.gui.add(this.light, 'intensity', 0, 2, 0.01).name('Light intensity');
        this.gui.add(new DegRadHelper(this.light, 'angle'), 'value', 0, 90).name('Light angle').onChange(this.updateLight.bind(this));
        this.gui.add(this.light, 'penumbra', 0, 1, 0.01).name('Light penumbra');

        makeGUIFolder(this.gui, this.light.position, 'position', this.updateLight.bind(this));
        makeGUIFolder(this.gui, this.light.target.position, 'target', this.updateLight.bind(this));
    }

    updateLight() {
        if (this.light.type === 'DirectionalLight' || this.light.type === 'SpotLight') {
            this.light.target.updateMatrixWorld();
        }
        
        this.lightHelper && this.lightHelper.update();
    }

    setScissorForElement(elem) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();
       
        // вычисляем относительный прямоугольник холста
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);
       
        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);
       
        //  установка области отсечения для рендеринга только на эту часть холста
        this.renderer.setScissor(left, top, width, height);
        this.renderer.setViewport(left, top, width, height);
       
        // return aspect
        return width / height;
    }

    renderScene() {
        this.renderer.setScissorTest(true);

        const mainAspect = this.setScissorForElement(this.view1Elem);
        this.camera.aspect = mainAspect;
        this.camera.updateProjectionMatrix();
        this.cameraHelper.update();
        this.cameraHelper.visible = false;
        

        this.renderer.render(this.scene, this.camera);

        const additionalAspect = this.setScissorForElement(this.view2Elem);
        this.additionalCamera.aspect = additionalAspect;
        this.additionalCamera.updateProjectionMatrix();
        this.cameraHelper.visible = true;

        this.renderer.render(this.scene, this.additionalCamera);

        requestAnimationFrame(this.renderScene.bind(this));
    }
};