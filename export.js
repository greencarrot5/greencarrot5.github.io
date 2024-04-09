var THREE;

var scripts = [
    "controls.js",
    "render.js",
    "objects.js",
    "presets.js",
    "world.js"
];

function loadPages(i) {

    if (i >= scripts.length) {

        return;

    }

    var el = document.createElement("script");

    el.setAttribute("src", scripts[i]);

    document.body.appendChild(el);

    el.addEventListener("load", function() {

        console.log("Imported " + scripts[i]);

        loadPages(i+1);

    })

}

function shareVariable(value) {

    THREE = value;

    loadPages(0);

}