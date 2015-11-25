var fs = require('fs');
var textArea = null;
var wlHistory = '';
var winChar = '○';
var loseChar = '☓';
var winCount = 0;
var loseCount = 0;
var counterPath = './counter.txt'
var historyPath = './history.txt'

var Menu = require('remote').require('menu');


// Windowを開く
openWindow();

function openWindow() {
    // ウィンドウのオブジェクトを取得
    var win = require("remote").getCurrentWindow();

    // ウィンドウ位置を復元
    if (localStorage.getItem("windowPosition")) {
        var pos = JSON.parse(localStorage.getItem("windowPosition"));
        win.setPosition(pos[0], pos[1]);
    }

    // クローズ時にウィンドウ位置・勝敗データを保存
    win.on("close", function() {
        saveDataToLocalStorage(win);
    });

    // 勝敗履歴の読み込み
    loadHistoryFromLocalStorage();

    // textAreaへの参照を取得
    textArea = document.getElementById("textArea");

    // テキストデータの更新
    updateText();

    // アプリケーションメニューの設定
    //setupApplicationMenu(win);
    win.setMenu(null);

    setupContextMenu(win);

    // ウィンドウを表示
    win.show();
}

function saveDataToLocalStorage(win){
        localStorage.setItem("windowPosition", JSON.stringify(win.getPosition()));
        localStorage.setItem("wlHistory", JSON.stringify(wlHistory));

}

function loadHistoryFromLocalStorage(){
    if(localStorage.getItem("wlHistory")){
        wlHistory = JSON.parse(localStorage.getItem("wlHistory"));
    }
}

function setupApplicationMenu(win){
    var template = [
        { label: 'メニュー', submenu: [
            {label:'リセット', click: function() {resetMenuClick();}},
            {label: '終了', click: function() {win.close();}}
        ]}
    ];
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);


}

function setupContextMenu(win){
    var template = [
            {label:'リセット', click: function() {resetMenuClick();}},
            {label: '終了', click: function() {win.close();}}
    ];
    var menu = Menu.buildFromTemplate(template);

    textArea.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.popup(win);
    }, false);
}

function winButtonClick() {
    wlHistory += winChar;
    updateText();
}

function loseButtonClick() {
    wlHistory += loseChar;
    updateText();
}

function undoButtonClick() {
    wlHistory = wlHistory.slice(0, -1);
    updateText();
}

function resetMenuClick() {
    wlHistory = '';
    localStorage.clear();
    updateText();
}


// 勝敗履歴から勝敗数をカウントする
function historyToWinLose(){
    var counter = function(str,seq){
        return str.split(seq).length - 1;
    }
    winCount = counter(wlHistory, winChar);
    loseCount = counter(wlHistory, loseChar);

}

function writeHistoryText(){
    fs.writeFileSync(historyPath, wlHistory);
}

function writeCounterText(){
    var counterText = winCount + "勝" + loseCount + "敗";
    textArea.innerHTML = counterText;
    fs.writeFileSync(counterPath, counterText);
}

function updateText(){
    historyToWinLose();   // 勝敗履歴から勝敗数を計算
    writeHistoryText();  // 勝敗履歴をテキストに出力
    writeCounterText();   // 勝敗数をテキストに出力
}
