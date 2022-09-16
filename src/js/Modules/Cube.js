import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshPhongMaterial, Mesh, DirectionalLight } from 'three';

export default class Cube {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer({ canvas: this.canvas });
        this.cubeGeometry = new BoxGeometry(5, 5, 5);
        this.light = new DirectionalLight('#ffffff', 1);
        this.cubesParams = [{ color: '#F2720C', position: { x: 0, y: 0, z: 0 }}, { color: '#3B5998', position: { x: 10, y: 10, z: -10 }}, { color: '#62B62E', position: { x: -10, y: -10, z: 0 }}];
        this.cubes = [];
    }

    init() {
        this.light.position.set(-1, 2, 4);
        this.scene.add(this.light);

        this.camera.position.z = 25;

        this.cubesParams.forEach(param => {
            const cube = this.createCube(this.cubeGeometry, param.color, param.position);
            this.cubes.push(cube);
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        requestAnimationFrame(this.renderCube.bind(this));
    }

    createCube(geometry, color, position) {
        const {x, y, z} = position;
        const material = new MeshPhongMaterial({ color });
        const cube = new Mesh(geometry, material);
        cube.position.set(x, y, z);
        this.scene.add(cube);

        return cube;
    }

    renderCube(time) {
        time *= 0.001;

        this.cubes.forEach((cube, index) => {
            const speed = 1 + index * .1;
            const rot = time + speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.renderCube.bind(this));
    }
};