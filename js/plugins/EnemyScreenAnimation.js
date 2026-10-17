/*:
 * @plugindesc フロントビュー敵スキル画面中央アニメーション
 * @author
 *
 * @help
 * フロントビュー戦闘で敵がスキルを使用したとき、
 * そのスキルに設定されているアニメーションを
 * 自動的に画面中央へ表示します。
 *
 * 敵側のスキルに個別の設定は必要ありません。
 *
 * 通常攻撃にも対応します。
 *
 * RPGツクールMV用
 */

(function() {

    'use strict';


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
                this.setWaitMode('effect');

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

                this.setWaitMode('effect');

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
    // 画面中央にアニメーションを表示
    //==================================================

    function playEnemyScreenAnimation(animationId) {

        var scene =
            SceneManager._scene;


        if (!(scene instanceof Scene_Battle)) {
            return;
        }


        //------------------------------------------------
        // アニメーションデータを取得
        //------------------------------------------------

        var animation =
            $dataAnimations[animationId];


        if (!animation) {
            return;
        }


        //------------------------------------------------
        // アニメーションをコピー
        //------------------------------------------------

        var screenAnimation =
            Object.create(animation);


        //------------------------------------------------
        // 表示位置
        //
        // 1 = ターゲット中央
        //
        // ダミーターゲットの座標を基準に表示
        //------------------------------------------------

        screenAnimation.position = 1;


        //------------------------------------------------
        // ダミーのターゲットを作る
        //------------------------------------------------

        var target =
            new Sprite_Base();


        target.x =
            Graphics.width / 2;

        target.y =
            Graphics.height / 2 + 260;


        //------------------------------------------------
        // Scene_Battleに直接追加
        //
        // battleFieldではなくScene_Battleに追加することで
        // 戦闘UIより前面に表示する
        //------------------------------------------------

        scene.addChild(target);


        //------------------------------------------------
        // アニメーション開始
        //------------------------------------------------

        target.startAnimation(
            screenAnimation,
            false,
            0
        );


        //------------------------------------------------
        // アニメーション終了後にダミーを削除
        //------------------------------------------------

        var check = function() {

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