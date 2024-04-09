const scene = new THREE.Scene();

scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;
camera.position.y = 1;

var camera_w = 0;

var threeDimensionalObjects = [];
var fourDimensionalObjects = [];

function animate() {

    handleControls();

    for (var i=0;i<threeDimensionalObjects.length;i++) {

        var obj = threeDimensionalObjects[i];

        obj.update(obj);

    }

    for (var i=0;i<fourDimensionalObjects.length;i++) {

        var obj = fourDimensionalObjects[i];

        obj.render();

    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();