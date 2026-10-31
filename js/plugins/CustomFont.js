/*:
 * @plugindesc イベントからゲーム内フォントを切り替えます。
 * @help
 *
 * ■プラグインコマンド
 *
 * Font GameFont
 * → 標準フォント
 *
 * Font JF-Dot-Shinonome14
 * → JF-Dot-Shinonome14フォント
 *
 * ■初期状態
 *
 * 新規ゲーム開始時は GameFont になります。
 *
 * ■セーブ
 *
 * 現在のフォント設定はセーブデータに保存されます。
 * ロード後も同じフォントが使用されます。
 *
 * ■フォントの登録
 *
 * fonts/gamefont.css に ＠font-face を追加してください。
 *
 * 例：
 *
 * ＠font-face {
 *     font-family: GameFont;
 *     src: url("mplus-1m-regular.ttf");
 * }
 *
 * ＠font-face {
 *     font-family: JF-Dot-Shinonome14;
 *     src: url("JF-Dot-Shinonome14.ttf");
 * }
 */

(function() {

    'use strict';


    //==========================================================
    // 初期フォント
    //==========================================================

    var DEFAULT_FONT = 'GameFont';


    //==========================================================
    // 新規ゲーム
    //==========================================================

    var _DataManager_setupNewGame =
        DataManager.setupNewGame;

    DataManager.setupNewGame = function() {

        _DataManager_setupNewGame.call(this);

        // 新規ゲームはGameFont
        $gameSystem._uiFontName = DEFAULT_FONT;
    };


    //==========================================================
    // 標準フォントを変更
    //==========================================================

    var _Window_Base_standardFontFace =
        Window_Base.prototype.standardFontFace;

    Window_Base.prototype.standardFontFace = function() {

        //======================================================
        // タイトル画面では必ず標準フォント
        //======================================================

        if (
            SceneManager._scene instanceof Scene_Title
        ) {

            return DEFAULT_FONT;
        }


        //======================================================
        // ゲーム中は現在設定されているフォント
        //======================================================

        if (
            $gameSystem &&
            $gameSystem._uiFontName
        ) {

            return $gameSystem._uiFontName;
        }


        //======================================================
        // その他
        //======================================================

        return _Window_Base_standardFontFace.call(
            this
        );
    };

    //==========================================================
    // フォント変更
    //==========================================================

    function changeFont(fontName) {

        if (!$gameSystem) {
            return;
        }

        if (!fontName) {
            return;
        }


        //======================================================
        // フォント名を保存
        //======================================================

        $gameSystem._uiFontName = fontName;


        //======================================================
        // 現在表示されているウィンドウを更新
        //======================================================

        if (!SceneManager._scene) {
            return;
        }

        var windowLayer =
            SceneManager._scene._windowLayer;

        if (!windowLayer ||
            !windowLayer.children) {
            return;
        }


        var children =
            windowLayer.children;

        for (var i = 0; i < children.length; i++) {

            var window = children[i];

            if (window instanceof Window_Base) {

                // フォント設定を再適用
                window.resetFontSettings();

                // 文字を再描画
                if (window.refresh) {
                    window.refresh();
                }

            }

        }

    }


    //==========================================================
    // プラグインコマンド
    //==========================================================

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {

            _Game_Interpreter_pluginCommand.call(
                this,
                command,
                args
            );


            //==================================================
            // Font
            //==================================================

            if (command.toLowerCase() === 'font') {

                if (!args || args.length === 0) {
                    return;
                }


                // 複数単語のフォント名にも対応
                var fontName =
                    args.join(' ');


                changeFont(fontName);

            }

        };

})();