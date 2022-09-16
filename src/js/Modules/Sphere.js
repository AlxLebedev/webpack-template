import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, SphereGeometry, MeshPhongMaterial, DirectionalLight } from 'three';

export default class Sphere {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.sphereGeometry = new SphereGeometry(1, 32, 32);
        this.sphereMaterial = new MeshPhongMaterial({ color: '#F2720C', flatShading: true, shininess: 150 });
        this.light = new DirectionalLight('#ffffff', 1);
        this.sphere = new Mesh(this.sphereGeometry, this.sphereMaterial);
    }

    init() {
        this.light.position.set(-1, 2, 4);
        this.scene.add(this.light);

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene.add(this.sphere);
        this.camera.position.z = 3;

        this.renderSphere();
    }

    renderSphere() {
        requestAnimationFrame(this.renderSphere.bind(this));
        this.sphere.rotation.x += 0.01;
        this.sphere.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
};