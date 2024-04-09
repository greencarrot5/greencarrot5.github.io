var keys = {
    w: false,
    z: false,
    a: false,
    q: false,
    s: false,
    d: false,
    shift: false,
    space: false,
    plus: false,
    minus: false
};

window.addEventListener("keydown", function (e) {

    if (e.key == "w") {
        keys.w = true;
    }

    if (e.key == "z") {
        keys.z = true;
    }

    if (e.key == "a") {
        keys.a = true;
    }

    if (e.key == "q") {
        keys.q = true;
    }

    if (e.key == "s") {
        keys.s = true;
    }

    if (e.key == "d") {
        keys.d = true;
    }

    if (e.key == "Shift") {
        keys.shift = true;
    }

    if (e.code == "Space") {
        keys.space = true;
    }

    if (e.key == "+") {
        keys.plus = true;
    }

    if (e.key == "-") {
        keys.minus = true;
    }

});

window.addEventListener("keyup", function (e) {

    if (e.key == "w") {
        keys.w = false;
    }

    if (e.key == "z") {
        keys.z = false;
    }

    if (e.key == "a") {
        keys.a = false;
    }

    if (e.key == "q") {
        keys.q = false;
    }

    if (e.key == "s") {
        keys.s = false;
    }

    if (e.key == "d") {
        keys.d = false;
    }

    if (e.key == "Shift") {
        keys.shift = false;
    }

    if (e.code == "Space") {
        keys.space = false;
    }

    if (e.key == "+") {
        keys.plus = false;
    }

    if (e.key == "-") {
        keys.minus = false;
    }

});

const CAMERA_ROTATION_SPEED = 0.01;
const CAMERA_MOVEMENT_SPEED = 0.1;

document.body.addEventListener("click", async () => {
    if (!document.pointerLockElement) {

        await document.body.requestPointerLock({unadjustedMovement: true});

    }
});

document.addEventListener("pointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === document.body) {
    document.addEventListener("mousemove", updateCamera, false);
  } else {
    document.removeEventListener("mousemove", updateCamera, false);
  }
}

const camera_rotation = {
    x: 0,
    y: 0
}

function updateCamera(e) {

    var deltaX = e.movementX;
    var deltaY = e.movementY;

    camera.rotation.order = "YXZ";

    camera_rotation.y -= deltaX * CAMERA_ROTATION_SPEED;

    camera_rotation.x -= deltaY * CAMERA_ROTATION_SPEED;

    if (camera_rotation.x > Math.PI/2) {

        camera_rotation.x = Math.PI/2;

    } else if (camera_rotation.x < -Math.PI/2) {

        camera_rotation.x = -Math.PI/2;

    }

    camera.rotation.set(camera_rotation.x, camera_rotation.y, 0);

}

function handleControls() {

    var forward = new THREE.Vector3(0, 0, -CAMERA_MOVEMENT_SPEED);
    var left = new THREE.Vector3(-CAMERA_MOVEMENT_SPEED, 0, 0);

    forward.applyEuler(new THREE.Euler(0, camera_rotation.y, 0, "YXZ"));
    left.applyEuler(new THREE.Euler(0, camera_rotation.y, 0, "YXZ"));

    if (keys.w || keys.z) {
        camera.position.add(forward);
    }

    if (keys.a || keys.q) {
        camera.position.add(left);
    }

    if (keys.s) {
        camera.position.add(forward.negate());
    }

    if (keys.d) {
        camera.position.add(left.negate());
    }

    if (keys.shift) {
        camera.position.add(new THREE.Vector3(0, -CAMERA_MOVEMENT_SPEED, 0));
    }

    if (keys.space) {
        camera.position.add(new THREE.Vector3(0, CAMERA_MOVEMENT_SPEED, 0));
    }

    if (keys.plus) {
        camera_w += CAMERA_MOVEMENT_SPEED;
    }

    if (keys.minus) {
        camera_w -= CAMERA_MOVEMENT_SPEED;
    }

}