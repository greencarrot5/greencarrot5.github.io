function Cube(cx, cy, cz, z, update=function(obj) {}) {

    this.center = new Vector3(cx, cy, cz);

    this.obj = new Object3D([
        //Voorkant
        new Face3D([
            [cx - z/2, cy - z/2, cz - z/2],
            [cx - z/2, cy + z/2, cz - z/2],
            [cx + z/2, cy + z/2, cz - z/2],
            [cx + z/2, cy - z/2, cz - z/2]
        ]),

        //Achterkant
        new Face3D([
            [cx - z/2, cy - z/2, cz + z/2],
            [cx - z/2, cy + z/2, cz + z/2],
            [cx + z/2, cy + z/2, cz + z/2],
            [cx + z/2, cy - z/2, cz + z/2]
        ]),

        //Linkerkant
        new Face3D([
            [cx - z/2, cy - z/2, cz - z/2],
            [cx - z/2, cy - z/2, cz + z/2],
            [cx - z/2, cy + z/2, cz + z/2],
            [cx - z/2, cy + z/2, cz - z/2]
        ]),

        //Rechterkant
        new Face3D([
            [cx + z/2, cy - z/2, cz - z/2],
            [cx + z/2, cy - z/2, cz + z/2],
            [cx + z/2, cy + z/2, cz + z/2],
            [cx + z/2, cy + z/2, cz - z/2]
        ]),

        //Bovenkant
        new Face3D([
            [cx - z/2, cy + z/2, cz - z/2],
            [cx - z/2, cy + z/2, cz + z/2],
            [cx + z/2, cy + z/2, cz + z/2],
            [cx + z/2, cy + z/2, cz - z/2]
        ]),

        //Onderkant
        new Face3D([
            [cx - z/2, cy - z/2, cz - z/2],
            [cx - z/2, cy - z/2, cz + z/2],
            [cx + z/2, cy - z/2, cz + z/2],
            [cx + z/2, cy - z/2, cz - z/2]
        ])
    ]);

    this.obj.update = update;

    this.obj.apply();

    this.rotate = function(rx, ry, rz) {

        this.obj.rotate(rx, ry, rz, this.center);

    }

}