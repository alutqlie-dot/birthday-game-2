/*:
 * @plugindesc イベントからWindowskinを自由に切り替えます。
 * @author
 *
 * @help
 *
 * ■プラグインコマンド
 *
 * UI Window
 * UI undertaleWindow
 *
 * .pngは付けても付けなくてもOKです。
 *
 * 例：
 *
 * UI Window
 * UI undertaleWindow
 * UI Horror
 *
 * 現在のWindowskinはセーブデータに保存されます。
 *
 * 新規ゲーム開始時はWindow.pngです。
 *
 * ■背景透明度
 *
 * Window.png
 * → 通常の192
 *
 * Window.png以外
 * → 255（完全不透明）
 *
 */

(function() {

    'use strict';


    //==================================================
    // 設定
    //==================================================

    var DEFAULT_WINDOWSKIN = 'Window';


    //==================================================
    // 背景透明度
    //==================================================

    Window_Base.prototype.standardBackOpacity = function() {

        //==================================================
        // タイトル画面は標準
        //==================================================

        if (
            SceneManager._scene instanceof Scene_Title
        ) {

            return 192;
        }


        //==================================================
        // ゲーム中
        //==================================================

        if (
            $gameSystem &&
            $gameSystem._uiWindowskinName &&
            $gameSystem._uiWindowskinName !== 'Window'
        ) {

            return 255;
        }


        return 192;
    };

    //==================================================
    // Windowskin読み込み
    //==================================================

    Window_Base.prototype.loadWindowskin = function() {

        var filename =
            DEFAULT_WINDOWSKIN;


        //==================================================
        // タイトル画面
        // 必ず標準の Window.png
        //==================================================

        if (
            SceneManager._scene instanceof Scene_Title
        ) {

            filename =
                DEFAULT_WINDOWSKIN;

        }

        //==================================================
        // ゲーム中
        // 保存されているWindowskinを使用
        //==================================================

        else if (
            $gameSystem &&
            $gameSystem._uiWindowskinName
        ) {

            filename =
                $gameSystem._uiWindowskinName;
        }


        this.windowskin =
            ImageManager.loadSystem(
                filename
            );
    };


    //==================================================
    // 新規ゲーム
    //==================================================

    var _DataManager_setupNewGame =
        DataManager.setupNewGame;

    DataManager.setupNewGame = function() {

        _DataManager_setupNewGame.call(this);

        $gameSystem._uiWindowskinName =
            DEFAULT_WINDOWSKIN;
    };


    //==================================================
    // Windowskin変更
    //==================================================

    function changeWindowskin(filename) {

        if (!$gameSystem) {
            return;
        }

        if (!filename) {
            return;
        }


        //==================================================
        // .pngを削除
        //==================================================

        filename =
            filename.replace(/\.png$/i, '');


        //==================================================
        // セーブデータに保存
        //==================================================

        $gameSystem._uiWindowskinName =
            filename;


        //==================================================
        // 現在のシーン
        //==================================================

        var scene =
            SceneManager._scene;

        if (!scene) {
            return;
        }


        //==================================================
        // WindowLayer
        //==================================================

        var windowLayer =
            scene._windowLayer;

        if (!windowLayer ||
            !windowLayer.children) {

            return;
        }


        //==================================================
        // 新しいWindowskinを読み込む
        //==================================================

        var newWindowskin =
            ImageManager.loadSystem(filename);


        //==================================================
        // 読み込み完了後にUIを更新
        //==================================================

        newWindowskin.addLoadListener(function() {


            //==================================================
            // 現在のシーンが変わっていたら終了
            //==================================================

            if (!SceneManager._scene) {
                return;
            }


            //==================================================
            // 現在のWindowLayer
            //==================================================

            var currentLayer =
                SceneManager._scene._windowLayer;

            if (!currentLayer ||
                !currentLayer.children) {

                return;
            }


            var children =
                currentLayer.children;


            //==================================================
            // 全ウィンドウを変更
            //==================================================

            for (var i = 0; i < children.length; i++) {

                var window =
                    children[i];


                if (!(window instanceof Window_Base)) {
                    continue;
                }


                //==================================================
                // Windowskinを設定
                //==================================================

                window.windowskin =
                    newWindowskin;


                //==================================================
                // 背景透明度を更新
                //==================================================

                window.updateBackOpacity();


                //==================================================
                // 文字色をリセット
                //==================================================

                window.resetTextColor();


                //==================================================
                // フォント設定をリセット
                //==================================================

                window.resetFontSettings();


                //==================================================
                // Windowskin再描画
                //==================================================

                if (window._refreshAllParts) {

                    window._refreshAllParts();

                }


                //==================================================
                // 内容を再描画
                //==================================================

                if (window.refresh) {

                    window.refresh();

                }

            }

        });

    }


    //==================================================
    // プラグインコマンド
    //==================================================

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {


            // 元のプラグインコマンド
            _Game_Interpreter_pluginCommand.call(
                this,
                command,
                args
            );


            //==================================================
            // UIコマンド
            //==================================================

            if (command.toLowerCase() !== 'ui') {
                return;
            }


            if (!args ||
                !args[0]) {

                return;
            }


            changeWindowskin(args[0]);

        };

})();