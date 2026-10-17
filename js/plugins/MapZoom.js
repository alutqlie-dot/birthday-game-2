/*:
 * @plugindesc マップズームアウト・描画範囲拡張＋アニメーション位置修正＋ズーム倍率セーブ
 *
 * @help
 * プラグインコマンド：
 *
 * MapZoom 1
 * MapZoom 1.5
 * MapZoom 2
 *
 * 1    = 通常表示
 * 1.5  = 1.5倍広く表示
 * 2    = 2倍広く表示
 *
 * ニューゲーム開始時は1倍になります。
 *
 * セーブ時には現在のズーム倍率が保存され、
 * ロードすると保存時の倍率が復元されます。
 *
 * RPGツクールMV用
 */

(function() {

    'use strict';


    //==================================================
    // 設定
    //==================================================

    var MAX_ZOOM = 2.0;

    var currentZoom = 1.0;


    //==================================================
    // Tilemapの描画範囲を拡張
    //==================================================

    var _ShaderTilemap_createLayers =
        ShaderTilemap.prototype._createLayers;


    ShaderTilemap.prototype._createLayers =
        function() {

        var originalWidth =
            this._width;

        var originalHeight =
            this._height;


        // 最大ズーム時に必要なサイズ
        this._width =
            Graphics.width * MAX_ZOOM;

        this._height =
            Graphics.height * MAX_ZOOM;


        // 標準処理
        _ShaderTilemap_createLayers.call(this);


        // 元サイズを保存
        this._zoomOriginalWidth =
            originalWidth;

        this._zoomOriginalHeight =
            originalHeight;
    };


    //==================================================
    // Tilemapのmarginを拡張
    //==================================================

    var _ShaderTilemap_initialize =
        ShaderTilemap.prototype.initialize;


    ShaderTilemap.prototype.initialize =
        function() {

        _ShaderTilemap_initialize.apply(
            this,
            arguments
        );


        this._margin =
            Math.max(
                this._margin,
                Graphics.width *
                (MAX_ZOOM - 1) / 2
            );
    };


    //==================================================
    // Tilemapズーム
    //==================================================

    function updateMapZoom() {

        if (!(SceneManager._scene instanceof Scene_Map)) {
            return;
        }


        var spriteset =
            SceneManager._scene._spriteset;


        if (!spriteset) {
            return;
        }


        var tilemap =
            spriteset._tilemap;


        if (!tilemap) {
            return;
        }


        //================================================
        // ズーム倍率
        //================================================

        var scale =
            1 / currentZoom;


        //================================================
        // Tilemapを縮小
        //================================================

        tilemap.scale.x =
            scale;

        tilemap.scale.y =
            scale;


        //================================================
        // 画面中央に配置
        //================================================

        tilemap.x =
            Graphics.width *
            (1 - scale) / 2;

        tilemap.y =
            Graphics.height *
            (1 - scale) / 2;


        //================================================
        // 再描画
        //================================================

        tilemap._needsRepaint = true;
    };


    //==================================================
    // マップ上のアニメーション位置修正
    //==================================================

    var _Sprite_Animation_updatePosition =
        Sprite_Animation.prototype.updatePosition;


    Sprite_Animation.prototype.updatePosition =
        function() {

        //================================================
        // 対象がマップキャラクターか確認
        //================================================

        if (this._target &&
            this._target instanceof Sprite_Character) {


            //============================================
            // 通常のMV処理
            //============================================

            _Sprite_Animation_updatePosition.call(this);


            //============================================
            // 対象キャラクターの位置を直接使用
            //============================================

            var target =
                this._target;


            this.x =
                target.x;

            this.y =
                target.y;


            //============================================
            // アニメーション位置
            //============================================

            if (this._animation) {

                if (this._animation.position === 0) {

                    this.y -=
                        target.height;

                } else if (this._animation.position === 1) {

                    this.y -=
                        target.height / 2;
                }
            }


            return;
        }


        //================================================
        // マップキャラクター以外
        //================================================

        _Sprite_Animation_updatePosition.call(this);
    };


    //==================================================
    // Tilemap生成
    //==================================================

    var _Spriteset_Map_createTilemap =
        Spriteset_Map.prototype.createTilemap;


    Spriteset_Map.prototype.createTilemap =
        function() {

        _Spriteset_Map_createTilemap.call(this);

        updateMapZoom();
    };


    //==================================================
    // プラグインコマンド
    //==================================================

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;


    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {

        _Game_Interpreter_pluginCommand.call(
            this,
            command,
            args
        );


        if (command === 'MapZoom') {

            var zoom =
                Number(args[0]);


            //============================================
            // 不正な値
            //============================================

            if (isNaN(zoom) ||
                zoom <= 0) {

                zoom = 1;
            }


            //============================================
            // 最大値
            //============================================

            if (zoom > MAX_ZOOM) {

                zoom =
                    MAX_ZOOM;
            }


            //============================================
            // 現在の倍率を変更
            //============================================

            currentZoom =
                zoom;


            //============================================
            // ゲームシステムにも保存
            //============================================

            if ($gameSystem) {

                $gameSystem._mapZoom =
                    currentZoom;
            }


            //============================================
            // ズーム適用
            //============================================

            updateMapZoom();
        }
    };


    //==================================================
    // マップ開始時
    //==================================================

    var _Scene_Map_start =
        Scene_Map.prototype.start;


    Scene_Map.prototype.start =
        function() {

        _Scene_Map_start.call(this);

        updateMapZoom();
    };


    //==================================================
    // マップ更新
    //==================================================

    var _Scene_Map_update =
        Scene_Map.prototype.update;


    Scene_Map.prototype.update =
        function() {

        _Scene_Map_update.call(this);

        updateMapZoom();
    };


    //==================================================
    // ★ニューゲーム
    //
    // ニューゲームでは必ず1倍から開始
    //==================================================

    var _DataManager_setupNewGame =
        DataManager.setupNewGame;


    DataManager.setupNewGame =
        function() {

        //===============================================
        // ズーム倍率を初期化
        //===============================================

        currentZoom = 1.0;


        //===============================================
        // 標準のニューゲーム処理
        //===============================================

        _DataManager_setupNewGame.call(this);


        //===============================================
        // ゲームシステムに保存
        //===============================================

        if ($gameSystem) {

            $gameSystem._mapZoom =
                1.0;
        }
    };


    //==================================================
    // ★ロード
    //
    // セーブデータに保存されている倍率を復元
    //==================================================

    var _DataManager_extractSaveContents =
        DataManager.extractSaveContents;


    DataManager.extractSaveContents =
        function(contents) {

        //===============================================
        // 標準のロード処理
        //===============================================

        _DataManager_extractSaveContents.call(
            this,
            contents
        );


        //===============================================
        // 保存されていた倍率を取得
        //===============================================

        if ($gameSystem &&
            $gameSystem._mapZoom !== undefined) {

            currentZoom =
                Number(
                    $gameSystem._mapZoom
                );


            //===========================================
            // 不正な値だった場合
            //===========================================

            if (isNaN(currentZoom) ||
                currentZoom <= 0) {

                currentZoom =
                    1.0;
            }


            //===========================================
            // 最大値を超えていた場合
            //===========================================

            if (currentZoom > MAX_ZOOM) {

                currentZoom =
                    MAX_ZOOM;
            }

        } else {

            //===========================================
            // 古いセーブデータなど
            // 倍率が存在しない場合は1倍
            //===========================================

            currentZoom =
                1.0;
        }
    };


})();