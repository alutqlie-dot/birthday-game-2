/*:
 * @plugindesc 一定時間だけ表示される非ブロッキングメッセージ
 * @author
 *
 * @help
 * プラグインコマンド：
 *
 * AutoMessage 文章
 *
 * 例：
 * AutoMessage オートセーブされました
 *
 * デフォルトで120フレーム（約2秒）表示します。
 */

(function() {

    var MESSAGE_DURATION = 120;

    //--------------------------------------------------------------------------
    // 一時メッセージウィンドウ
    //--------------------------------------------------------------------------

    function Window_AutoMessage() {
        this.initialize.apply(this, arguments);
    }

    Window_AutoMessage.prototype =
        Object.create(Window_Base.prototype);

    Window_AutoMessage.prototype.constructor =
        Window_AutoMessage;


    Window_AutoMessage.prototype.initialize = function(text) {

        var width = 500;
        var height = this.fittingHeight(1);

        // 左上
        var x = 0;
        var y = 0;

        Window_Base.prototype.initialize.call(
            this,
            x,
            y,
            width,
            height
        );

        this._text = text;
        this._duration = MESSAGE_DURATION;

        // ウィンドウ背景を完全に透明
        this.opacity = 0;

        // 文字は表示
        this.contentsOpacity = 255;

        this.refresh();
    };


    //--------------------------------------------------------------------------
    // メッセージ描画
    //--------------------------------------------------------------------------

    Window_AutoMessage.prototype.refresh = function() {

        this.contents.clear();

        this.drawTextEx(
            this._text,
            this.textPadding(),
            0
        );
    };


    //--------------------------------------------------------------------------
    // 更新
    //--------------------------------------------------------------------------

    Window_AutoMessage.prototype.update = function() {

        Window_Base.prototype.update.call(this);

        this._duration--;

        // 最後の30フレームだけ文字をフェードアウト
        if (this._duration <= 30) {

            this.contentsOpacity =
                Math.max(
                    0,
                    this._duration * 255 / 30
                );
        }

        // 時間切れで削除
        if (this._duration <= 0) {

            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
    };


    //--------------------------------------------------------------------------
    // Scene_Map
    //--------------------------------------------------------------------------

    var _Scene_Map_createAllWindows =
        Scene_Map.prototype.createAllWindows;

    Scene_Map.prototype.createAllWindows = function() {

        _Scene_Map_createAllWindows.call(this);

        this._autoMessageWindow = null;
    };


    Scene_Map.prototype.showAutoMessage = function(text) {

        // 既に表示されていたら削除
        if (this._autoMessageWindow) {

            if (this._autoMessageWindow.parent) {

                this._autoMessageWindow.parent.removeChild(
                    this._autoMessageWindow
                );
            }

            this._autoMessageWindow = null;
        }

        var window =
            new Window_AutoMessage(text);

        this.addChild(window);

        this._autoMessageWindow = window;
    };


    //--------------------------------------------------------------------------
    // Plugin Command
    //--------------------------------------------------------------------------

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {

        _Game_Interpreter_pluginCommand.call(
            this,
            command,
            args
        );

        if (command === 'AutoMessage') {

            var text = args.join(' ');

            if (SceneManager._scene instanceof Scene_Map) {

                SceneManager._scene.showAutoMessage(text);
            }
        }
    };

})();