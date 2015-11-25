var app = require("app");
var BrowserWindow = require("browser-window");

var mainWindow = null;

app.on("window-all-closed", function() {
    if (process.platform != "darwin") {
        app.quit();
    }
});

app.on("ready", function() {
    mainWindow = new BrowserWindow({
        "width": 300,
        "height": 180,
        "transparent": false,
        "frame": true,
        "resizable": false,
        "show": false
    });

    // index.html を開く
    mainWindow.loadUrl("file://" + __dirname + "/index.html");

    // devtoolsを表示する
    // mainWindow.toggleDevTools();
    
    
    


    mainWindow.on("closed", function() {
        mainWindow = null;
    });

});

