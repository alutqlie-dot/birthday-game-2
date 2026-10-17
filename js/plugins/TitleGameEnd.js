/*:ja
 * @plugindesc タイトル画面に「ゲーム終了」を追加します。
 * @author
 *
 * @help
 * タイトル画面にゲーム終了コマンドを追加します。
 */

(function() {
    'use strict';

    // タイトルコマンドに「ゲーム終了」を追加
    var _makeCommandList =
        Window_TitleCommand.prototype.makeCommandList;

    Window_TitleCommand.prototype.makeCommandList = function() {
        _makeCommandList.call(this);

        this.addCommand('ゲーム終了', 'gameEnd');
    };


    // 「ゲーム終了」が選択されたときの処理を登録
    var _createCommandWindow =
        Scene_Title.prototype.createCommandWindow;

    Scene_Title.prototype.createCommandWindow = function() {
        _createCommandWindow.call(this);

        this._commandWindow.setHandler(
            'gameEnd',
            this.commandGameEnd.bind(this)
        );
    };


    // ゲームを終了
    Scene_Title.prototype.commandGameEnd = function() {
        SceneManager.exit();
    };

})();