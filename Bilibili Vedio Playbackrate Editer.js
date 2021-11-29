// ==UserScript==
// @name:        B站视频回放速率调整
// @name:zh-TW   B站視頻回放速率調節
// @name:en      Bilibili Vedio Playbackrate Editer
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  哔哩哔哩（bilibili）一键调节视频播放倍速，倍速可自主调节。
// @author       FarstarD
// @match        *.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-body
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      BSD
// ==/UserScript==

var config = {
    biliplayer: {
        upPlayBackRate: "F3",
        downPlayBackRate: "F4",
        //Shift按逗号和句号变速默认倍率
        rate: 0.15,
    },
    vesiter: {
        //左下角消息栏宽度，px为像素单位
        meaasge_width: "200px",
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//视频调倍速主体
var video = $('.bilibili-player-video video')[0];

var csslist = "";
csslist += "#vesiter-msg {position:fixed; z-index:5000; bottom:0; left:0; width:10px; padding: 10px;}";
csslist += ".vesiter-msg-bar {width:" + config.vesiter.meaasge_width + "; font-size:14px; color:#FFF; background:rgba(0,0,0,0.5); padding:6px 10px 8px 10px; border-radius:4px; margin-top:10px}";

$('head').append('<style type="text/css" id="vesiter">' + csslist + '</style>');

$('body').ready(function () {
    setTimeout(function () {
        if (video == undefined) {
            video = $('.bilibili-player-video video')[0];
        }
    });

    document.onkeydown = function (event) {
        var key = event.key;
        if (key == config.biliplayer.upPlayBackRate) { video.playbackRate -= config.biliplayer.rate; logMsg("[↓] 降速：" + video.playbackRate); }
        if (key == config.biliplayer.downPlayBackRate) { video.playbackRate += config.biliplayer.rate; logMsg("[↑] 提速：" + video.playbackRate); }
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////
//弹窗消息主体
$('body').append('<div id="vesiter-msg"></div>');

function logMsg(text, type = "msg", times = "auto") {
    try {
        $('.vesiter-msg-bar[style*=none]').remove();
    } catch (err) { }

    var classtype;

    switch (type) {
        case 'msg':
            classtype = '';
            break;
        case 'err':
            classtype = 'red';
            break;
        case 'rit':
            classtype = 'green';
            break;
    }

    var outPrintMsg = $('<div class="vesiter-msg-bar ' + classtype + '"></div>');

    $('#vesiter-msg').append(outPrintMsg);
    outPrintMsg.text(text);

    var timeout;
    if (times == 'auto') {
        timeout = text.length * 1000 / 8;
        if (timeout < 3000) { timeout = 3000; }
    } else if (!isNaN(times)) {
        timeout = times;
    } else {
        timeout = 3000;
    }
    setTimeout(function () {
        outPrintMsg.fadeOut(1000);
    }, timeout);
}