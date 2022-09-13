import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight } from 'three';

export default class Cube {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.cubeGeometry = new BoxGeometry(5, 5, 5);
        this.cubeMaterial = new MeshPhongMaterial({ color: '#F2720C' });
        this.light = new DirectionalLight('#ffffff', 1);
        this.cube = new Mesh(this.cubeGeometry, this.cubeMaterial);
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene.add(this.cube);

        this.light.position.set(-1, 2, 4);
        this.scene.add(this.light);

        this.camera.position.z = 25;

        this.renderCube();
    }

    renderCube() {
        requestAnimationFrame(this.renderCube.bind(this));
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
};