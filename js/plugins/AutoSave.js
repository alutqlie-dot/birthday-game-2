/*:ja
 * @plugindesc オートセーブ機能
 *
 * @help
 * セーブスロット1をオートセーブ専用にし、
 * 表示名を「オートセーブ」にします。
 *
 * セーブスロット2以降は
 * セーブ1、セーブ2、セーブ3...
 * と表示します。
 *
 * プラグインコマンド:
 * AutoSave
 */

(function() {
    'use strict';


    //==================================================
    // セーブファイル名を変更
    //==================================================

    var _drawFileId =
        Window_SavefileList.prototype.drawFileId;

    Window_SavefileList.prototype.drawFileId =
        function(id, x, y) {

            var name;

            if (id === 1) {
                name = 'オートセーブ';
            } else {
                name = 'セーブ' + (id - 1);
            }

            this.drawText(name, x, y, 180);
        };


    //==================================================
    // スロット1を手動セーブできないようにする
    //==================================================

    var _isCurrentItemEnabled =
        Window_SavefileList.prototype.isCurrentItemEnabled;

    Window_SavefileList.prototype.isCurrentItemEnabled =
        function() {

            var id = this.index() + 1;

            // セーブ画面でスロット1を無効化
            if (SceneManager._scene instanceof Scene_Save &&
                id === 1) {
                return false;
            }

            return _isCurrentItemEnabled.call(this);
        };


    //==================================================
    // オートセーブ
    //==================================================

    var _pluginCommand =
        Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {

            _pluginCommand.call(this, command, args);

            if (command === 'AutoSave') {

                // セーブ前処理
                $gameSystem.onBeforeSave();

                // BGMがnullなら空のBGM情報を入れる
                if (!$gameSystem._bgmOnSave) {
                    $gameSystem._bgmOnSave = {
                        name: '',
                        volume: 0,
                        pitch: 100,
                        pan: 0
                    };
                }

                // BGSがnullなら空のBGS情報を入れる
                if (!$gameSystem._bgsOnSave) {
                    $gameSystem._bgsOnSave = {
                        name: '',
                        volume: 0,
                        pitch: 100,
                        pan: 0
                    };
                }

                DataManager.saveGame(1);
            }
        };

})();