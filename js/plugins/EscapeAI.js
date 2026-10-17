/*:
 * @plugindesc 先読みしてプレイヤーから逃げるイベントAI
 *
 * @help
 * ============================================================
 * FleeAI
 * ============================================================
 *
 * プラグインコマンド
 *
 * FleeStart 6 3 8
 *
 * 第1引数：最低距離
 * 第2引数：移動速度
 * 第3引数：先読み距離
 *
 * 例：
 *
 * FleeStart 6 3 8
 *
 *   プレイヤーから6マス以上離れる
 *   移動速度3
 *   8マス先まで考えて逃走方向を決定
 *
 *
 * FleeStop
 *
 *   逃走AIを停止
 *
 * ============================================================
 */

(function() {

    'use strict';


    //==========================================================
    // デフォルト設定
    //==========================================================

    var DEFAULT_DISTANCE = 6;

    var DEFAULT_SPEED = 3;

    var DEFAULT_LOOK_AHEAD = 8;


    //==========================================================
    // Game_Event 初期化
    //==========================================================

    var _Game_Event_initialize =
        Game_Event.prototype.initialize;

    Game_Event.prototype.initialize = function(mapId, eventId) {

        _Game_Event_initialize.call(
            this,
            mapId,
            eventId
        );

        this._fleeAI = false;

        this._fleeDistance =
            DEFAULT_DISTANCE;

        this._fleeSpeed =
            DEFAULT_SPEED;

        this._fleeLookAhead =
            DEFAULT_LOOK_AHEAD;
    };


    //==========================================================
    // Game_Event 更新
    //==========================================================

    var _Game_Event_update =
        Game_Event.prototype.update;

    Game_Event.prototype.update = function() {

        _Game_Event_update.call(this);


        // AIがOFF
        if (!this._fleeAI) {
            return;
        }


        // 移動中なら次の判断をしない
        if (this.isMoving()) {
            return;
        }


        // 逃走AI
        this.updateFleeAI();
    };


    //==========================================================
    // 逃走AI
    //==========================================================

    Game_Event.prototype.updateFleeAI = function() {

        var player = $gamePlayer;


        //======================================================
        // プレイヤーとの現在距離
        //======================================================

        var currentDistance =
            this.distanceToPlayer(
                this.x,
                this.y,
                player.x,
                player.y
            );


        //======================================================
        // すでに十分離れている場合
        //======================================================

        if (currentDistance >= this._fleeDistance) {
            return;
        }


        //======================================================
        // 4方向を評価
        //======================================================

        var directions = [2, 4, 6, 8];

        var bestDirection = 0;

        var bestScore = -999999999;


        for (var i = 0; i < directions.length; i++) {

            var direction = directions[i];


            //==================================================
            // その方向へ1マス移動できるか
            //==================================================

            if (!this.canPass(
                this.x,
                this.y,
                direction
            )) {
                continue;
            }


            //==================================================
            // 1マス進んだ場所
            //==================================================

            var nextX = this.x;
            var nextY = this.y;


            if (direction === 2) {
                nextY++;
            }

            else if (direction === 4) {
                nextX--;
            }

            else if (direction === 6) {
                nextX++;
            }

            else if (direction === 8) {
                nextY--;
            }


            //==================================================
            // この方向へ進んだ場合の逃走評価
            //==================================================

            var score =
                this.evaluateEscapeDirection(
                    nextX,
                    nextY,
                    player
                );


            //==================================================
            // 一番評価の高い方向を採用
            //==================================================

            if (score > bestScore) {

                bestScore = score;

                bestDirection = direction;
            }
        }


        //======================================================
        // 移動
        //======================================================

        if (bestDirection !== 0) {

            this.setMoveSpeed(
                this._fleeSpeed
            );

            this.moveStraight(
                bestDirection
            );
        }
    };


    //==========================================================
    // 逃走方向の評価
    //==========================================================

    Game_Event.prototype.evaluateEscapeDirection =
        function(startX, startY, player) {

            var currentX = startX;

            var currentY = startY;


            // 現在地点からプレイヤーまでの距離
            var startDistance =
                this.distanceToPlayer(
                    currentX,
                    currentY,
                    player.x,
                    player.y
                );


            //==================================================
            // 最も遠くまで進めた距離
            //==================================================

            var farthestDistance =
                startDistance;


            //==================================================
            // その方向にどれだけ進めるか
            //==================================================

            var travelDistance = 0;


            //==================================================
            // 周囲の広さ
            //==================================================

            var totalOpenSpace = 0;


            //==================================================
            // 先読み
            //==================================================

            for (
                var i = 0;
                i < this._fleeLookAhead;
                i++
            ) {


                //================================================
                // この地点から4方向を確認
                //================================================

                var possibleDirections = [];

                var checkDirections = [2, 4, 6, 8];


                for (
                    var j = 0;
                    j < checkDirections.length;
                    j++
                ) {

                    var checkDirection =
                        checkDirections[j];


                    if (
                        this.canPassAt(
                            currentX,
                            currentY,
                            checkDirection
                        )
                    ) {

                        possibleDirections.push(
                            checkDirection
                        );
                    }
                }


                //================================================
                // これ以上進めない
                //================================================

                if (possibleDirections.length === 0) {
                    break;
                }


                //================================================
                // 周囲が広いほど評価を上げる
                //================================================

                totalOpenSpace +=
                    possibleDirections.length;


                //================================================
                // プレイヤーから遠ざかる方向を探す
                //================================================

                var bestNextX = currentX;

                var bestNextY = currentY;

                var bestNextDistance =
                    this.distanceToPlayer(
                        currentX,
                        currentY,
                        player.x,
                        player.y
                    );


                for (
                    var k = 0;
                    k < possibleDirections.length;
                    k++
                ) {

                    var dir =
                        possibleDirections[k];


                    var testX = currentX;

                    var testY = currentY;


                    if (dir === 2) {
                        testY++;
                    }

                    else if (dir === 4) {
                        testX--;
                    }

                    else if (dir === 6) {
                        testX++;
                    }

                    else if (dir === 8) {
                        testY--;
                    }


                    var testDistance =
                        this.distanceToPlayer(
                            testX,
                            testY,
                            player.x,
                            player.y
                        );


                    if (
                        testDistance >
                        bestNextDistance
                    ) {

                        bestNextDistance =
                            testDistance;

                        bestNextX = testX;

                        bestNextY = testY;
                    }
                }


                //================================================
                // 次の地点へ
                //================================================

                if (
                    bestNextX === currentX &&
                    bestNextY === currentY
                ) {

                    break;
                }


                currentX = bestNextX;

                currentY = bestNextY;


                travelDistance++;


                //================================================
                // 最も離れた距離を更新
                //================================================

                var newDistance =
                    this.distanceToPlayer(
                        currentX,
                        currentY,
                        player.x,
                        player.y
                    );


                if (
                    newDistance >
                    farthestDistance
                ) {

                    farthestDistance =
                        newDistance;
                }
            }


            //==================================================
            // 評価値
            //==================================================

            var score = 0;


            //==================================================
            // ① 最終的にプレイヤーから離れられるほど高評価
            //==================================================

            score +=
                farthestDistance * 1000;


            //==================================================
            // ② 先へ進めるほど高評価
            //==================================================

            score +=
                travelDistance * 100;


            //==================================================
            // ③ 周囲が広いほど高評価
            //==================================================

            score +=
                totalOpenSpace * 10;


            //==================================================
            // ④ 直後にプレイヤーへ近づく方向でも
            //    先に広い場所へ行けるなら許容
            //==================================================

            // ここでは「最初の1マスの距離」だけで
            // 大きく減点しない。


            return score;
        };


    //==========================================================
    // 指定座標から移動可能か調べる
    //==========================================================

    Game_Event.prototype.canPassAt =
        function(x, y, direction) {

            var x2 = $gameMap.roundXWithDirection(
                x,
                direction
            );

            var y2 = $gameMap.roundYWithDirection(
                y,
                direction
            );


            //==================================================
            // イベント自身の通行判定
            //==================================================

            if (
                !$gameMap.isValid(
                    x2,
                    y2
                )
            ) {
                return false;
            }


            //==================================================
            // 現在地からその方向へ通行可能か
            //==================================================

            var reverseDirection =
                this.reverseDir(
                    direction
                );


            if (
                !$gameMap.isPassable(
                    x,
                    y,
                    direction
                )
            ) {
                return false;
            }


            if (
                !$gameMap.isPassable(
                    x2,
                    y2,
                    reverseDirection
                )
            ) {
                return false;
            }


            return true;
        };


    //==========================================================
    // 逆方向
    //==========================================================

    Game_Event.prototype.reverseDir =
        function(direction) {

            if (direction === 2) {
                return 8;
            }

            if (direction === 4) {
                return 6;
            }

            if (direction === 6) {
                return 4;
            }

            if (direction === 8) {
                return 2;
            }

            return 0;
        };


    //==========================================================
    // プレイヤーとの距離
    //==========================================================

    Game_Event.prototype.distanceToPlayer =
        function(x1, y1, x2, y2) {

            return Math.abs(
                x1 - x2
            ) + Math.abs(
                y1 - y2
            );
        };


    //==========================================================
    // プラグインコマンド
    //==========================================================

    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;


    Game_Interpreter.prototype.pluginCommand =
        function(command, args) {


            //==================================================
            // 元のプラグインコマンド
            //==================================================

            _Game_Interpreter_pluginCommand.call(
                this,
                command,
                args
            );


            //==================================================
            // FleeStart
            //==================================================

            if (command === 'FleeStart') {

                var event =
                    $gameMap.event(
                        this._eventId
                    );


                if (!event) {
                    return;
                }


                //================================================
                // AI ON
                //================================================

                event._fleeAI = true;


                //================================================
                // 最低距離
                //================================================

                if (args.length >= 1) {

                    event._fleeDistance =
                        Number(args[0]) ||
                        DEFAULT_DISTANCE;

                } else {

                    event._fleeDistance =
                        DEFAULT_DISTANCE;
                }


                //================================================
                // 移動速度
                //================================================

                if (args.length >= 2) {

                    event._fleeSpeed =
                        Number(args[1]) ||
                        DEFAULT_SPEED;

                } else {

                    event._fleeSpeed =
                        DEFAULT_SPEED;
                }


                //================================================
                // 先読み距離
                //================================================

                if (args.length >= 3) {

                    event._fleeLookAhead =
                        Number(args[2]) ||
                        DEFAULT_LOOK_AHEAD;

                } else {

                    event._fleeLookAhead =
                        DEFAULT_LOOK_AHEAD;
                }


                //================================================
                // 速度を設定
                //================================================

                event.setMoveSpeed(
                    event._fleeSpeed
                );
            }


            //==================================================
            // FleeStop
            //==================================================

            if (command === 'FleeStop') {

                var event =
                    $gameMap.event(
                        this._eventId
                    );


                if (!event) {
                    return;
                }


                event._fleeAI = false;
            }

        };

})();