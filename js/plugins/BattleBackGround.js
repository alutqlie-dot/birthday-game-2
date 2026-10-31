/*:
 * @plugindesc 敵グループ専用戦闘背景＋敵スキル画面中央アニメーション
 * @author
 *
 * @help
 * ============================================================
 * ■敵グループごとの専用戦闘背景
 * ============================================================
 *
 * 敵グループの「バトルイベント」に「注釈」を追加して、
 *
 * <BattleBackground:ひろゆき1>
 *
 * と記述してください。
 *
 * 画像は、
 *
 * img/pictures/ひろゆき1.png
 *
 * に入れてください。
 *
 *
 * ============================================================
 * ■敵スキルのアニメーション
 * ============================================================
 *
 * 敵がスキルを使用したとき、
 * そのスキルのアニメーションを画面中央に表示します。
 *
 * 敵の通常攻撃にも対応します。
 *
 *
 * ============================================================
 * ■アニメーション位置
 * ============================================================
 *
 * 現在は画面中央より260px下です。
 *
 * target.y = Graphics.height / 2 + 260;
 *
 * の260を変更すると位置を変更できます。
 *
 *
 * ============================================================
 * RPGツクールMV用
 */

(function() {

    'use strict';


    //==================================================
    // 設定
    //==================================================

    var BACKGROUND_TAG = 'BattleBackground';


    //==================================================
    // 敵グループの注釈から背景画像名を取得
    //==================================================

    function getBattleBackgroundName() {

        var troop =
            $dataTroops[$gameTroop._troopId];


        if (!troop || !troop.pages) {
            return null;
        }


        //================================================
        // バトルイベントのページを検索
        //================================================

        for (var p = 0; p < troop.pages.length; p++) {

            var page =
                troop.pages[p];


            if (!page || !page.list) {
                continue;
            }


            //============================================
            // イベントコマンドを検索
            //============================================

            for (var i = 0; i < page.list.length; i++) {

                var command =
                    page.list[i];


                // 108 = 注釈
                // 408 = 注釈の続き
                if (command.code === 108 ||
                    command.code === 408) {


                    var text =
                        command.parameters[0];


                    if (!text) {
                        continue;
                    }


                    var regex =
                        new RegExp(
                            '<' +
                            BACKGROUND_TAG +
                            '\\s*:\\s*([^>]+)>',
                            'i'
                        );


                    var match =
                        text.match(regex);


                    if (match) {

                        return match[1].trim();

                    }

                }

            }

        }


        return null;

    }


    //==================================================
    // 戦闘背景作成
    //==================================================

    var _createBattleback =
        Spriteset_Battle.prototype.createBattleback;


    Spriteset_Battle.prototype.createBattleback =
        function() {


        //================================================
        // 通常の戦闘背景を作成
        //================================================

        _createBattleback.call(this);


        //================================================
        // 敵グループ専用背景を取得
        //================================================

        var backgroundName =
            getBattleBackgroundName();


        // 指定されていなければ通常背景のまま
        if (!backgroundName) {
            return;
        }


        //================================================
        // 通常の戦闘背景を非表示
        //================================================

        if (this._back1Sprite) {
            this._back1Sprite.visible = false;
        }


        if (this._back2Sprite) {
            this._back2Sprite.visible = false;
        }


        //================================================
        // 専用背景を作成
        //================================================

        this._enemyBattleBackground =
            new Sprite();


        this._enemyBattleBackground.bitmap =
            ImageManager.loadPicture(
                backgroundName
            );


        //================================================
        // 中央配置
        //================================================

        this._enemyBattleBackground.anchor.x =
            0.5;


        this._enemyBattleBackground.anchor.y =
            0.5;


        this._enemyBattleBackground.x =
            Graphics.width / 2;


        this._enemyBattleBackground.y =
            Graphics.height / 2;


        //================================================
        // 画像読み込み後に拡大
        //================================================

        this._enemyBattleBackground.bitmap.addLoadListener(
            function(bitmap) {


                if (!bitmap ||
                    bitmap.width <= 0 ||
                    bitmap.height <= 0) {

                    return;

                }


                // 画面を完全に覆うための倍率
                var scaleX =
                    Graphics.width /
                    bitmap.width;


                var scaleY =
                    Graphics.height /
                    bitmap.height;


                var scale =
                    Math.max(
                        scaleX,
                        scaleY
                    );


                this._enemyBattleBackground.scale.x =
                    scale;


                this._enemyBattleBackground.scale.y =
                    scale;


            }.bind(this)
        );


        //================================================
        // BattleFieldの一番後ろに追加
        //
        // 敵やアクターより後ろ
        //================================================

        this._battleField.addChildAt(
            this._enemyBattleBackground,
            0
        );

    };


    //==================================================
    // 敵のスキル使用時のアニメーション
    //==================================================

    var _showAnimation =
        Window_BattleLog.prototype.showAnimation;


    Window_BattleLog.prototype.showAnimation =
        function(subject, targets, animationId) {


        // 敵が使用した場合
        if (subject &&
            subject.isEnemy &&
            subject.isEnemy()) {


            if (animationId > 0) {


                playEnemyScreenAnimation(
                    animationId
                );


                // アニメーションが終わるまで待つ
                this.setWaitMode(
                    'effect'
                );


                return;

            }

        }


        // 味方などは通常処理
        _showAnimation.call(
            this,
            subject,
            targets,
            animationId
        );

    };


    //==================================================
    // 敵の通常攻撃
    //==================================================

    var _showEnemyAttackAnimation =
        Window_BattleLog.prototype.showEnemyAttackAnimation;


    Window_BattleLog.prototype.showEnemyAttackAnimation =
        function(subject, targets) {


        if (subject &&
            subject.isEnemy &&
            subject.isEnemy()) {


            // 通常攻撃のアニメーションID
            var animationId =
                subject.attackAnimationId
                ? subject.attackAnimationId()
                : 1;


            if (animationId > 0) {


                playEnemyScreenAnimation(
                    animationId
                );


                this.setWaitMode(
                    'effect'
                );


                return;

            }

        }


        _showEnemyAttackAnimation.call(
            this,
            subject,
            targets
        );

    };


    //==================================================
    // 敵アニメーション表示
    //==================================================

    function playEnemyScreenAnimation(animationId) {


        var scene =
            SceneManager._scene;


        if (!(scene instanceof Scene_Battle)) {
            return;
        }


        //================================================
        // アニメーションデータ
        //================================================

        var animation =
            $dataAnimations[animationId];


        if (!animation) {
            return;
        }


        //================================================
        // アニメーションをコピー
        //================================================

        var screenAnimation =
            Object.create(animation);


        //================================================
        // 表示位置
        //================================================

        screenAnimation.position =
            1;


        //================================================
        // ダミーターゲット
        //================================================

        var target =
            new Sprite_Base();


        //================================================
        // アニメーション位置
        //================================================

        target.x =
            Graphics.width / 2;


        target.y =
            Graphics.height / 2 + 260;


        //================================================
        // Scene_Battleに直接追加
        //
        // UIより前面
        //================================================

        scene.addChild(
            target
        );


        //================================================
        // アニメーション開始
        //================================================

        target.startAnimation(
            screenAnimation,
            false,
            0
        );


        //================================================
        // アニメーション終了後に削除
        //================================================

        var check =
            function() {


                if (!target.parent) {
                    return;
                }


                if (!target.isAnimationPlaying()) {


                    target.parent.removeChild(
                        target
                    );


                    return;

                }


                setTimeout(
                    check,
                    16
                );

            };


        setTimeout(
            check,
            16
        );

    }


})();