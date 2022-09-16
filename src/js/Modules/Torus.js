import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, TorusGeometry, MeshPhongMaterial, SpotLight } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Torus {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.spotLight1 = new SpotLight(0xeeeece);
        this.spotLight2 = new SpotLight(0xffffff);
        this.torusGeometry = new TorusGeometry(10, 3, 16, 100);
        this.torusMaterial = new MeshPhongMaterial({ color: 0xdaa520, specular: 0xbcbcbc });
        this.torus = new Mesh(this.torusGeometry, this.torusMaterial);
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.spotLight1.position.set(1000, 1000, 1000);
        this.spotLight2.position.set(-200, -200, -200);

        this.scene.add(this.spotLight1);
        this.scene.add(this.spotLight2);
        this.scene.add(this.torus);

        this.camera.position.z = 45;

        this.controls.target.set(0, 5, 0);
        this.controls.update();

        this.renderTorus();
    }

    renderTorus() {
        requestAnimationFrame(this.renderTorus.bind(this));
        this.torus.rotation.x += 0.01;
        this.torus.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
};