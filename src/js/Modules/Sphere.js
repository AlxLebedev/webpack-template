import { Scene, PerspectiveCamera, WebGLRenderer, Mesh, SphereGeometry, MeshNormalMaterial } from 'three';

export default class Sphere {
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.sphereGeometry = new SphereGeometry(1, 32, 32);
        this.sphereMaterial = new MeshNormalMaterial();
        this.sphere = new Mesh(this.sphereGeometry, this.sphereMaterial);
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

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