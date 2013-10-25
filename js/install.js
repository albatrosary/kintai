// This is a JavaScript file
/* Copyright&copy;2013 System Lab, Ltd. All Rights Reserved. */

//** Application Update **
if (navigator.onLine) {
    var appCache = window.applicationCache;
    //最新キャッシュマニフェストを取得
    appCache.update();
    appCache.addEventListener("updateready", function() {
                              try{
                                if(window.confirm('アプリケーションが最新ではありません。\n再起動を行い最新にしますか？')){
                                    window.location.reload(); //更新
                                }
                              //appCache.swapCache();
                              }catch (exception) {
                                alert(exception.toString());
                              }
                              });
}

//** Hosted App **
if(navigator.mozApps) {
    var url = location.href;
    //マニフェスト取得
    var manifestUrl = url.substring(0, url.lastIndexOf('/')) + '/manifest.webapp';
    //インストールされているかチェック
    var checkInstalled = navigator.mozApps.checkInstalled(manifestUrl);
    //チェック処理に成功
    checkInstalled.addEventListener('success', function() {
                                    if(!checkInstalled.result){
                                    var install = navigator.mozApps.install(manifestUrl);
                                    install.addEventListener('success', function() {
                                                             alert('インストールに成功しました。');
                                                             }, false);
                                    install.addEventListener('error', function() {
                                                             alert('インストールに失敗しました。 ' + install.error.name);
                                                             }, false);
                                    }
                                    }, false);
    //チェック処理に失敗
    checkInstalled.addEventListener('error', function() {
                                    alert('Checking installation failed. :' + this.error.message);
                                    }, false);
}
