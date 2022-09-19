import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';
import { ColorGUIHelper, MinMaxGUIHelper, makeGUIFolder } from '../helpers/GUIHelpers';
import DegRadHelper from "../helpers/DegRadHelper";
import setScissorHelper from "../helpers/setScissorHelper";
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
    DirectionalLightHelper,
    PointLight,
    PointLightHelper,
    SpotLight,
    SpotLightHelper,
    CameraHelper,
    Color
} from 'three';

export default class ThreeExampleFirst {
    constructor(lights) {
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
        this.lights = lights;
    }

    init() {
        this.configurateEquipment();
        this.createPlaneTexture();

        this.createCube();
        this.createSphere();

        this.addLights();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
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

        this.scene.background = new Color('black');
        this.scene.add(this.cameraHelper);
    }

    createPlaneTexture() {
        const planeSize = 40;
        const repeats = planeSize / 2;
        const loader = new TextureLoader();
        const planeTexture = loader.load('./src/static/ground.jpg');
        planeTexture.wrapS = RepeatWrapping;
        planeTexture.wrapT = RepeatWrapping;
        planeTexture.magFilter = NearestFilter;
        planeTexture.repeat.set(repeats, repeats);

        const planeGeometry = new PlaneGeometry(planeSize, planeSize)
        const planeMaterial = new MeshPhongMaterial({ map: planeTexture, side: DoubleSide});
        const mesh = new Mesh(planeGeometry, planeMaterial);
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI * -.5;

        this.scene.add(mesh);
    }

    createCube() {
        const cubeSize = 4;
        const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new MeshPhongMaterial({ color: '#62B62E' });
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.set(cubeSize + 1, cubeSize / 2, 0);

        this.scene.add(cube);
    }

    createSphere() {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;

        const sphereGeometry = new SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMaterial = new MeshPhongMaterial({ color: '#F2720C' });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.set(-sphereRadius - 1, sphereRadius + 2, 0);

        this.scene.add(sphere);
    }

    addLights() {
        this.lights.forEach(light => {
            if (this[`add${light}`]) {
                this[`add${light}`]();
            } else {
                console.log(`${light} is not exist in this release`);
            }
        });
    }

    addAmbientLight() {
        const color = '#ffffff';
        const intensity = 1;
        this.ambientLight = new AmbientLight(color, intensity);

        this.scene.add(this.ambientLight);

        this.gui.addColor(new ColorGUIHelper(this.ambientLight, 'color'), 'value').name('Light color');
        this.gui.add(this.ambientLight, 'intensity', 0, 2, 0.01).name('intensity');
    }

    addHemisphereLight() {
        const skyColor = 0xB1E1FF;
        const groundColor = 0xB97A20;
        const intensity = .5;

        this.hemisphereLight = new HemisphereLight(skyColor, groundColor, intensity);

        this.scene.add(this.hemisphereLight);

        this.gui.addColor(new ColorGUIHelper(this.hemisphereLight, 'color'), 'value').name('Sky color');
        this.gui.addColor(new ColorGUIHelper(this.hemisphereLight, 'groundColor'), 'value').name('Ground Color');
        this.gui.add(this.hemisphereLight, 'intensity', 0, 2, 0.01).name('intensity');
    }

    addDirectionalLight() {
        const color = '#ffffff';
        const intensity = 1;

        this.directionalLight = new DirectionalLight(color, intensity);
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set(0, 10, 0);
        this.directionalLight.target.position.set(-5, 0, 0);

        this.scene.add(this.directionalLight);
        this.scene.add(this.directionalLight.target);

        this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight);
        this.scene.add(this.directionalLightHelper);

        this.updateLight();

        this.gui.addColor(new ColorGUIHelper(this.directionalLight, 'color'), 'value').name('Light color');
        this.gui.add(this.directionalLight, 'intensity', 0, 2, 0.01).name('intensity');

        makeGUIFolder(this.gui, this.directionalLight.position, 'Directional light position', this.updateLight.bind(this));
        makeGUIFolder(this.gui, this.directionalLight.target.position, 'Directional light target', this.updateLight.bind(this));
    }

    addPointLight() {
        const color = '#ffffff';
        const intensity = 1;

        this.pointLight = new PointLight(color, intensity);
        this.pointLight.castShadow = true;
        this.pointLight.position.set(0, 15, 0);

        this.scene.add(this.pointLight);

        this.pointLightHelper = new PointLightHelper(this.pointLight);
        this.scene.add(this.pointLightHelper);

        this.updateLight();

        this.gui.addColor(new ColorGUIHelper(this.pointLight, 'color'), 'value').name('Light color');
        this.gui.add(this.pointLight, 'intensity', 0, 2, 0.01).name('intensity');
        this.gui.add(this.pointLight, 'distance', 0, 40).name('distance').onChange(this.updateLight.bind(this));

        makeGUIFolder(this.gui, this.pointLight.position, 'Point Light position', this.updateLight.bind(this), 0, 30);
    }

    addSpotLight() {
        const color = '#ffffff';
        const intensity = 1;
        this.spotLight = new SpotLight(color, intensity);
        this.spotLight.castShadow = true;
        this.spotLight.position.set(0, 15, 0);
        this.spotLight.target.position.set(-5, 0, 0);

        this.scene.add(this.spotLight);
        this.scene.add(this.spotLight.target);

        this.spotLightHelper = new SpotLightHelper(this.spotLight);
        this.scene.add(this.spotLightHelper);

        this.updateLight();

        this.gui.addColor(new ColorGUIHelper(this.spotLight, 'color'), 'value').name('Light color');
        this.gui.add(this.spotLight, 'intensity', 0, 2, 0.01).name('intensity');
        this.gui.add(new DegRadHelper(this.spotLight, 'angle'), 'value', 0, 90).name('Light angle').onChange(this.updateLight.bind(this));
        this.gui.add(this.spotLight, 'penumbra', 0, 1, 0.01).name('Light penumbra');

        makeGUIFolder(this.gui, this.spotLight.position, 'Spot Light position', this.updateLight.bind(this), 0, 30);
        makeGUIFolder(this.gui, this.spotLight.target.position, 'Spot Light target', this.updateLight.bind(this));
    }

    updateLight() {
        if (this.directionalLight) {
            this.directionalLight.target.updateMatrixWorld();
            this.directionalLightHelper.update();
        }
        if (this.spotLight) {
            this.spotLight.target.updateMatrixWorld();
            this.spotLightHelper.update();
        }
        if (this.pointLight) {
            this.pointLightHelper.update();
        }
        
        // this.lightHelper && this.lightHelper.update();
    }

    renderScene() {
        this.renderer.setScissorTest(true);

        const mainAspect = setScissorHelper(this.view1Elem, this.canvas, this.renderer);
        this.camera.aspect = mainAspect;
        this.camera.updateProjectionMatrix();
        this.cameraHelper.update();
        this.cameraHelper.visible = false;
        
        this.scene.background.set('#000000');
        this.renderer.render(this.scene, this.camera);

        const additionalAspect = setScissorHelper(this.view2Elem, this.canvas, this.renderer);
        this.additionalCamera.aspect = additionalAspect;
        this.additionalCamera.updateProjectionMatrix();
        this.cameraHelper.visible = true;

        this.scene.background.set('#3B5998');
        this.renderer.render(this.scene, this.additionalCamera);

        requestAnimationFrame(this.renderScene.bind(this));
    }
};