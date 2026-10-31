/*:
 * @plugindesc ダッシュ/歩行を固定し、SHIFTキーによる切り替えを無効化。状態をセーブデータに保存します。
 * @help
 *
 * ■プラグインコマンド
 *
 * DashMode dash
 * → ダッシュ固定
 *
 * DashMode walk
 * → 歩行固定
 *
 * DashMode reset
 * → ダッシュ固定に戻す
 *
 * SHIFTキーを押してもダッシュ/歩行は切り替わりません。
 *
 * ダッシュ/歩行状態はセーブデータに保存され、
 * ロード後も同じ状態が維持されます。
 */

(function() {

    'use strict';


    //==========================================================
    // 新規ゲーム時の初期状態
    //==========================================================

    var _DataManager_setupNewGame =
        DataManager.setupNewGame;

    DataManager.setupNewGame = function() {

        _DataManager_setupNewGame.call(this);

        // 新規ゲームはダッシュ
        $gameSystem._forceDash = true;
    };


    //==========================================================
    // オプション画面から
    // 「常時ダッシュ」
    // 「コマンド記憶」
    // を削除
    //==========================================================

    Window_Options.prototype.addGeneralOptions = function() {

        // 何も追加しない

    };


    //==========================================================
    // 常時ダッシュ設定
    //==========================================================

    ConfigManager.alwaysDash = true;


    //==========================================================
    // 設定保存時
    //==========================================================

    var _ConfigManager_makeData =
        ConfigManager.makeData;

    ConfigManager.makeData = function() {

        var config =
            _ConfigManager_makeData.call(this);

        // 常時ダッシュ設定はON
        config.alwaysDash = true;

        return config;
    };


    //==========================================================
    // 設定読み込み時
    //==========================================================

    var _ConfigManager_applyData =
        ConfigManager.applyData;

    ConfigManager.applyData = function(config) {

        _ConfigManager_applyData.call(
            this,
            config
        );

        // 常時ダッシュ設定を強制ON
        this.alwaysDash = true;
    };


    //==========================================================
    // ダッシュ判定
    //==========================================================

    var _Game_Player_isDashing =
        Game_Player.prototype.isDashing;

    Game_Player.prototype.isDashing = function() {

        // セーブデータに保存されている状態を使用
        if ($gameSystem) {

            // 念のため未設定ならダッシュ
            if ($gameSystem._forceDash === undefined) {
                $gameSystem._forceDash = true;
            }

            return $gameSystem._forceDash;
        }

        // $gameSystemが存在しない場合
        return true;
    };


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
            // DashMode
            //==================================================

            if (command === 'DashMode') {

                if (!args[0]) {
                    return;
                }


                //==============================================
                // ダッシュ
                //==============================================

                if (args[0].toLowerCase() === 'dash') {

                    $gameSystem._forceDash = true;

                }


                //==============================================
                // 歩行
                //==============================================

                else if (args[0].toLowerCase() === 'walk') {

                    $gameSystem._forceDash = false;

                }


                //==============================================
                // 初期状態に戻す
                //==============================================

                else if (args[0].toLowerCase() === 'reset') {

                    $gameSystem._forceDash = true;

                }

            }

        };

})();