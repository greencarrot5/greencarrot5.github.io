//Definieer eerst de punten voor gemak bij het ingeven
const A = [0, 0, 0, 0];
const B = [4, 0, 0, 0];
const C = [2, 0, 2*Math.sqrt(3), 0];
const D = [2, (4*Math.sqrt(6))/3, (2*Math.sqrt(3))/3, 0];
const E = [2, Math.sqrt(6)/3, (2*Math.sqrt(3))/3, Math.sqrt(10)];

var hyperpiramide = new Object4D([

    new Face4D([A, B, C]),
    new Face4D([A, B, D]),
    new Face4D([A, B, E]),
    new Face4D([A, C, D]),
    new Face4D([A, C, E]),
    new Face4D([A, D, E]),
    new Face4D([B, C, D]),
    new Face4D([B, C, E]),
    new Face4D([B, D, E]),
    new Face4D([C, D, E])

]);

hyperpiramide.apply();