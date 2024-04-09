function Hypercube(center, size) {

    this.center = center;
    this.size = size;

    this.corners = [];

    axis = [-1, -1, -1, -1];

    for (var i=0;i<16;i++) {

        this.corners.push(new Vector4(center.x + axis[0]*size/2, center.y + axis[1]*size/2, center.z + axis[2]*size/2, center.w + axis[3]*size/2));

        var q = 0;

        axis[q] = -axis[q];

        while (q < 4 && axis[q] == 1) {

            q++;

            axis[q] = -axis[q];

        }

    }

    this.faces = [];

    //Save a vector for each of the axis directions
    var directionalVectors = [
        new Vector4(size, 0, 0, 0),
        new Vector4(0, size, 0, 0),
        new Vector4(0, 0, size, 0),
        new Vector4(0, 0, 0, size)
    ];

    //Starting from (center - size/2), take each face
    var startingPoint = new Vector4(center.x - size/2, center.y - size/2, center.z - size/2, center.w - size/2);

    for (var axis = 0; axis < 4; axis++) {

        var facePoints = [startingPoint];

        var nextPoint = startingPoint.add(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.add(directionalVectors[(axis+1)%4]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[(axis+1)%4]);

        this.faces.push(new Face4D(facePoints));

    }

    //Now we have the combinations:
    // XX00 0XX0 00XX X00X

    //We're still missing:
    // X0X0 0X0X

    //Cover missing faces
    for (var axis = 0; axis < 2; axis++) {

        var facePoints = [startingPoint];

        var nextPoint = startingPoint.add(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.add(directionalVectors[(axis+2)%4]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[(axis+2)%4]);

        this.faces.push(new Face4D(facePoints));

    }

    //Do the exact same thing for (center + size/2)
    startingPoint = new Vector4(center.x + size/2, center.y + size/2, center.z + size/2, center.w + size/2);

    for (var axis = 0; axis < 4; axis++) {

        var facePoints = [startingPoint];

        var nextPoint = startingPoint.add(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.add(directionalVectors[(axis+1)%4]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[(axis+1)%4]);

        this.faces.push(new Face4D(facePoints));

    }

    for (var axis = 0; axis < 2; axis++) {

        var facePoints = [startingPoint];

        var nextPoint = startingPoint.add(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.add(directionalVectors[(axis+2)%4]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[axis]);

        facePoints.push(nextPoint);

        nextPoint = nextPoint.subtract(directionalVectors[(axis+2)%4]);

        this.faces.push(new Face4D(facePoints));

    }

    this.object4D = new Object4D(this.faces);

    this.object4D.apply();

}

function Object4D(faces) {

    this.faces = faces;

    this.apply = function() {

        fourDimensionalObjects.push(this);

    }

    this.render = function() {

        for (var i=0;i<this.faces.length;i++) {

            this.faces[i].render();

        }

    }

}

function Face4D(points) {

    this.points = [];

    this.components = [];

    for (var i=0;i<points.length;i++) {

        if (typeof points[i] == typeof []) {

            this.points.push(new Vector4(points[i][0], points[i][1], points[i][2], points[i][3]));

        } else {

            this.points.push(points[i]);

        }

    }

    this.render = function() {

        //Remove components from the scene
        if (this.component) scene.remove(this.component);

        //Get current components and add them to scene
        //Optie 1: Het volledige vlak valt binnen de ruimte
        if (this.allInCurrentSpace()) {

            //Maak driedimensionale versie van de punten
            var points3D = [];

            for (var i=0;i<this.points.length;i++) {

                var point = this.points[i];

                points3D.push(new THREE.Vector3(point.x, point.y, point.z));

            }

            //Verbind eindpunt met beginpunt
            points3D.push(points3D[0]);

            this.lineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframeLinewidth: 4});

            this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points3D);

            this.component = new THREE.Line(this.lineGeometry, this.lineMaterial);

            scene.add(this.component);

        } else {

            foundPoints = [];

            for (var i=0;i<this.points.length;i++) {

                var pointA = this.points[i];
                var pointB = this.points[(i+1) % this.points.length];

                if (pointA.w == pointB.w) {
                    
                    //Sla het lijnstuk over
                    continue;

                }

                var k = (camera_w - pointA.w) / (pointB.w - pointA.w);

                //Controleer of k tussen 0 en 1 ligt
                if (k >= 0 && k <= 1) {

                    var x = pointA.x + k*(pointB.x - pointA.x);
                    var y = pointA.y + k*(pointB.y - pointA.y);
                    var z = pointA.z + k*(pointB.z - pointA.z);

                    foundPoints.push(new THREE.Vector3(x, y, z));

                }

            }

            if (foundPoints.length == 2) {

                //Toon de lijn op het scherm
                this.lineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframeLinewidth: 4});

                this.lineGeometry = new THREE.BufferGeometry().setFromPoints(foundPoints);

                this.component = new THREE.Line(this.lineGeometry, this.lineMaterial);

                scene.add(this.component);

            }

        }

    }

    this.allInCurrentSpace = function() {

        for (var i=0;i<this.points.length;i++) {

            if (this.points[i].w != camera_w) {

                return false;

            }

        }

        return true;

    }

}

function Vector3(x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

    this.add = function(other) {

        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);

    }

    this.subtract = function(other) {

        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);

    }

}

function Vector4(x, y, z, w) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.add = function(other) {

        return new Vector4(this.x + other.x, this.y + other.y, this.z + other.z, this.w + other.w);

    }

    this.subtract = function(other) {

        return new Vector4(this.x - other.x, this.y - other.y, this.z - other.z, this.w - other.w);

    }

}

function Object3D(faces, update=function(obj) {}) {

    this.faces = faces;

    this.update = update;

    this.apply = function() {

        for (var i=0;i<this.faces.length;i++) {

            this.faces[i].apply();

        }

        threeDimensionalObjects.push(this);

    }

    this.move = function(dx, dy, dz) {

        for (var i=0;i<this.faces.length;i++) {

            this.faces[i].move(dx, dy, dz);

        }

    }

    this.rotate = function(rx, ry, rz, pivot) {

        for (var i=0;i<this.faces.length;i++) {

            this.faces[i].rotate(rx, ry, rz, pivot);

        }

    }

}

function Face3D(points) {

    this.points = [];

    for (var i=0;i<points.length;i++) {

        if (typeof points[i] == typeof []) {

            this.points.push(new THREE.Vector3(points[i][0], points[i][1], points[i][2]));

        } else {

            this.points.push(points[i]);

        }

    }

    //Connect end to start
    this.points.push(this.points[0]);

    this.apply = function() {

        if (this.line) {

            scene.remove(this.line);

        }

        this.lineMaterial = new THREE.MeshBasicMaterial({color: 0x000000, wireframeLinewidth: 4});

        this.lineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);

        scene.add(this.line);

    }

    this.move = function(dx, dy, dz) {

        for (var i=0;i<this.points.length;i++) {

            this.points[i] = new THREE.Vector3(this.points[i].x + dx, this.points[i].y + dy, this.points[i].z + dz);

        }

        this.apply();

    }

    this.rotate = function(rx, ry, rz, pivot) {

        for (var i=0;i<this.points.length;i++) {

            var point = this.points[i];

            //Order: YXZ

            var distance_y = Math.sqrt((pivot.x - point.x)**2 + (pivot.z - point.z)**2);

            var theta_y = Math.acos((point.x - pivot.x) / distance_y);

            if (point.z < pivot.z) {

                theta_y = -theta_y;

            }

            theta_y -= ry;

            point = new THREE.Vector3(pivot.x + distance_y * Math.cos(theta_y), point.y, pivot.z + distance_y * Math.sin(theta_y));



            var distance_x = Math.sqrt((pivot.y - point.y)**2 + (pivot.z - point.z)**2);

            var theta_x = Math.acos((point.z - pivot.z) / distance_x);

            if (point.y < pivot.y) {

                theta_x = -theta_x;

            }

            theta_x -= rx;

            point = new THREE.Vector3(point.x, pivot.y + distance_x * Math.sin(theta_x), pivot.z + distance_x * Math.cos(theta_x));



            var distance_z = Math.sqrt((pivot.x - point.x)**2 + (pivot.y - point.y)**2);

            var theta_z = Math.acos((point.x - pivot.x) / distance_z);

            if (point.y < pivot.y) {

                theta_z = -theta_z;

            }

            theta_z -= rz;

            point = new THREE.Vector3(pivot.x + distance_z * Math.cos(theta_z), pivot.y + distance_z * Math.sin(theta_z), point.z);



            this.points[i] = point;

        }

        this.apply();

    }

}