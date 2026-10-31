/*:
 * @plugindesc Undertale風 戦闘UI
 * @author
 *
 * @help
 *
 * ■ プラグインコマンド
 *
 * UndertaleBattleUI ON
 * UndertaleBattleUI OFF
 *
 * ON  = Undertale式戦闘UI
 * OFF = RPGツクールMV標準戦闘
 *
 * ※戦闘開始前に切り替えてください。
 * ※戦闘中の切り替えには対応しません。
 */

(function() {
'use strict';


// ============================================================
// ON / OFF 初期状態
// ============================================================

var _undertaleBattleUIDefault = true;


// ============================================================
// Game_System
// ============================================================

var _UT_GameSystem_initialize =
    Game_System.prototype.initialize;

Game_System.prototype.initialize = function() {

    _UT_GameSystem_initialize.call(this);

    this._undertaleBattleUIEnabled =
        _undertaleBattleUIDefault;
};


// ============================================================
// Undertale UI が現在ONか
// ============================================================

function isUndertaleBattleUIEnabled() {

    if (!$gameSystem) {
        return _undertaleBattleUIDefault;
    }

    if (
        $gameSystem._undertaleBattleUIEnabled ===
        undefined
    ) {

        $gameSystem._undertaleBattleUIEnabled =
            _undertaleBattleUIDefault;
    }

    return (
        $gameSystem._undertaleBattleUIEnabled === true
    );
}


// ============================================================
// 外部スクリプトから状態確認
// ============================================================

window.isUndertaleBattleUIEnabled =
function() {

    return isUndertaleBattleUIEnabled();
};


// ============================================================
// スクリプトからON
// ============================================================

window.UndertaleBattleUIOn =
function() {

    if ($gameSystem) {

        $gameSystem._undertaleBattleUIEnabled =
            true;
    }
};


// ============================================================
// スクリプトからOFF
// ============================================================

window.UndertaleBattleUIOff =
function() {

    if ($gameSystem) {

        $gameSystem._undertaleBattleUIEnabled =
            false;
    }
};


// ============================================================
// MV プラグインコマンド
//
// UndertaleBattleUI ON
// UndertaleBattleUI OFF
// ============================================================

var _UT_GameInterpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand =
function(command, args) {

    _UT_GameInterpreter_pluginCommand.call(
        this,
        command,
        args
    );

    if (
        String(command).toUpperCase() !==
        'UNDERTALEBATTLEUI'
    ) {
        return;
    }

    var value =
        args &&
        args.length > 0
        ? String(args[0]).toUpperCase()
        : '';


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    if (value === 'ON') {

        if ($gameSystem) {

            $gameSystem._undertaleBattleUIEnabled =
                true;
        }

        return;
    }


    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (value === 'OFF') {

        if ($gameSystem) {

            $gameSystem._undertaleBattleUIEnabled =
                false;
        }

        return;
    }
};


// ============================================================
// UI設定
// ============================================================


// ------------------------------------------------------------
// 下部4コマンド
// ------------------------------------------------------------

var COMMAND_HEIGHT = 100;


// ------------------------------------------------------------
// ステータス
// ------------------------------------------------------------

var STATUS_HEIGHT = 90;


// ------------------------------------------------------------
// 中央メッセージ枠
// ------------------------------------------------------------

var MESSAGE_SIDE_MARGIN = 25;

var MESSAGE_TOP_Y = 290;

var MAIN_BOX_STATUS_GAP = 4;

var MESSAGE_BORDER_SIZE = 4;


// ------------------------------------------------------------
// 中央メッセージ色
// ------------------------------------------------------------

var MESSAGE_BACKGROUND_COLOR = '#000000';

var MESSAGE_BORDER_COLOR = '#ffffff';

var MESSAGE_TEXT_COLOR = '#ffffff';


// ------------------------------------------------------------
// 中央メッセージ文字
// ------------------------------------------------------------

var MESSAGE_FONT_SIZE = 24;

var MESSAGE_MAX_LINES = 3;

var MESSAGE_LINE_HEIGHT = 38;

var MESSAGE_TEXT_X = 25;

var MESSAGE_TEXT_Y = 16;


// ------------------------------------------------------------
// 下部4ボタン
// ------------------------------------------------------------

var SIDE_MARGIN = 12;

var BUTTON_GAP = 12;

var BUTTON_MARGIN_Y = 8;

var BUTTON_BORDER_SIZE = 4;

var BUTTON_BACKGROUND_COLOR = '#000000';

var BUTTON_SELECTED_COLOR = '#663d00';

var BUTTON_BORDER_COLOR = '#ff9900';

var BUTTON_TEXT_COLOR = '#ff9900';


// ------------------------------------------------------------
// ステータス文字
// ------------------------------------------------------------

var STATUS_NAME_COLOR = '#ffffff';

var STATUS_HP_LABEL_COLOR = '#ffffff';

var STATUS_HP_VALUE_COLOR = '#ffffff';

var STATUS_FONT_SIZE = 22;

var NAME_HP_GAP = 10;

var HP_VALUE_GAP = 8;

var STATUS_SIDE_MARGIN = 15;


// ------------------------------------------------------------
// 敵・ACT・アイテム等の一覧
// ------------------------------------------------------------

var LIST_COLS = 2;

var LIST_ROWS = 3;

var LIST_SIDE_MARGIN = 20;

var LIST_TOP_MARGIN = 8;

var LIST_BOTTOM_MARGIN = 8;

var LIST_COLUMN_GAP = 20;

var LIST_FONT_SIZE = 24;


// ============================================================
// 座標計算
// ============================================================


// ------------------------------------------------------------
// 下部コマンドY
// ------------------------------------------------------------

function commandY() {

    return (
        Graphics.boxHeight -
        COMMAND_HEIGHT
    );
}


// ------------------------------------------------------------
// ステータスY
//
// 元コードと同じ位置関係を維持
// ------------------------------------------------------------

function statusY() {

    return (
        commandY() -
        STATUS_HEIGHT +
        30
    );
}


// ------------------------------------------------------------
// 中央枠Y
// ------------------------------------------------------------

function messageY() {

    return MESSAGE_TOP_Y;
}


// ------------------------------------------------------------
// 中央枠高さ
// ------------------------------------------------------------

function messageHeight() {

    var bottom =
        statusY() +
        28 -
        MAIN_BOX_STATUS_GAP;

    return Math.max(
        100,
        bottom - messageY()
    );
}


// ============================================================
// Undertale戦闘画面か
// ============================================================

function isUndertaleBattleScene() {

    return (
        isUndertaleBattleUIEnabled() &&
        SceneManager._scene instanceof Scene_Battle
    );
}

// ============================================================
// メイン枠描画
// ============================================================

function drawMainBox(win) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return;
    }

    if (
        !win ||
        !win.contents
    ) {
        return;
    }


    var w =
        win.contentsWidth();

    var h =
        win.contentsHeight();

    var s =
        MESSAGE_BORDER_SIZE;


    // --------------------------------------------------------
    // 背景
    // --------------------------------------------------------

    win.contents.fillRect(
        0,
        0,
        w,
        h,
        MESSAGE_BACKGROUND_COLOR
    );


    // --------------------------------------------------------
    // 上
    // --------------------------------------------------------

    win.contents.fillRect(
        0,
        0,
        w,
        s,
        MESSAGE_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 下
    // --------------------------------------------------------

    win.contents.fillRect(
        0,
        h - s,
        w,
        s,
        MESSAGE_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 左
    // --------------------------------------------------------

    win.contents.fillRect(
        0,
        0,
        s,
        h,
        MESSAGE_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 右
    // --------------------------------------------------------

    win.contents.fillRect(
        w - s,
        0,
        s,
        h,
        MESSAGE_BORDER_COLOR
    );
}


// ============================================================
// ウィンドウを中央メイン枠へ移動
// ============================================================

function moveToMainBox(win) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return;
    }

    if (!win) {
        return;
    }


    win.move(
        MESSAGE_SIDE_MARGIN,
        messageY(),
        Graphics.boxWidth -
            MESSAGE_SIDE_MARGIN * 2,
        messageHeight()
    );


    win.createContents();


    win.opacity =
        0;

    win.backOpacity =
        0;
}


// ============================================================
// 標準スクロール矢印を隠す
// ============================================================

function hideStandardArrows(win) {

    if (!win) {
        return;
    }


    if (
        win._upArrowSprite
    ) {

        win._upArrowSprite.visible =
            false;
    }


    if (
        win._downArrowSprite
    ) {

        win._downArrowSprite.visible =
            false;
    }
}


// ============================================================
// Undertaleメイン文章を表示
// ============================================================

function showUndertaleMainMessage(scene) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return;
    }


    if (
        !scene ||
        !scene._undertaleMessageWindow
    ) {
        return;
    }


    // --------------------------------------------------------
    // 通常イベント文章が表示されている場合は隠す
    // --------------------------------------------------------


    scene
        ._undertaleMessageWindow
        .visible =
            true;


    scene
        ._undertaleMessageWindow
        .show();


    scene
        ._undertaleMessageWindow
        .refresh();
}


// ============================================================
// Undertaleメイン文章を隠す
// ============================================================

function hideUndertaleMainMessage(scene) {

    if (
        !scene ||
        !scene._undertaleMessageWindow
    ) {
        return;
    }


    scene
        ._undertaleMessageWindow
        .hide();


    scene
        ._undertaleMessageWindow
        .visible =
            false;
}


// ============================================================
// Window_ActorCommand
//
// ON:
// Undertale式4コマンド
//
// OFF:
// RPGツクールMV標準
// ============================================================


// ------------------------------------------------------------
// MV標準処理を保存
// ------------------------------------------------------------

var _UT_WindowActorCommand_windowWidth =
    Window_ActorCommand.prototype.windowWidth;


var _UT_WindowActorCommand_windowHeight =
    Window_ActorCommand.prototype.windowHeight;


var _UT_WindowActorCommand_numVisibleRows =
    Window_ActorCommand.prototype.numVisibleRows;


var _UT_WindowActorCommand_maxCols =
    Window_ActorCommand.prototype.maxCols;


var _UT_WindowActorCommand_standardBackOpacity =
    Window_ActorCommand.prototype.standardBackOpacity;


var _UT_WindowActorCommand_makeCommandList =
    Window_ActorCommand.prototype.makeCommandList;


var _UT_WindowActorCommand_itemRect =
    Window_ActorCommand.prototype.itemRect;


var _UT_WindowActorCommand_itemRectForText =
    Window_ActorCommand.prototype.itemRectForText;


var _UT_WindowActorCommand_drawItem =
    Window_ActorCommand.prototype.drawItem;


var _UT_WindowActorCommand_updateCursor =
    Window_ActorCommand.prototype.updateCursor;


var _UT_WindowActorCommand_select =
    Window_ActorCommand.prototype.select;


var _UT_WindowActorCommand_initialize =
    Window_ActorCommand.prototype.initialize;


// ============================================================
// ActorCommand 横幅
// ============================================================

Window_ActorCommand.prototype.windowWidth =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_windowWidth.call(
            this
        );
    }


    return Graphics.boxWidth;
};


// ============================================================
// ActorCommand 高さ
// ============================================================

Window_ActorCommand.prototype.windowHeight =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_windowHeight.call(
            this
        );
    }


    return COMMAND_HEIGHT;
};


// ============================================================
// 表示行数
// ============================================================

Window_ActorCommand.prototype.numVisibleRows =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_numVisibleRows.call(
            this
        );
    }


    return 1;
};


// ============================================================
// 4列
// ============================================================

Window_ActorCommand.prototype.maxCols =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_maxCols.call(
            this
        );
    }


    return 4;
};


// ============================================================
// 背景透明
// ============================================================

Window_ActorCommand.prototype.standardBackOpacity =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_standardBackOpacity.call(
            this
        );
    }


    return 0;
};


// ============================================================
// コマンド作成
// ============================================================

Window_ActorCommand.prototype.makeCommandList =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowActorCommand_makeCommandList.call(
            this
        );

        return;
    }


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    if (!this._actor) {
        return;
    }


    this.addCommand(
        'FIGHT',
        'attack',
        this._actor.canAttack()
    );


    this.addCommand(
        'ACT',
        'undertaleAct',
        true
    );


    this.addCommand(
        'ITEM',
        'undertaleItem',
        true
    );


    this.addCommand(
        'MERCY',
        'undertaleMercy',
        true
    );
};


// ============================================================
// ボタン1個の横幅
// ============================================================

Window_ActorCommand.prototype.commandButtonWidth =
function() {

    var usable =
        this.contentsWidth() -
        SIDE_MARGIN * 2 -
        BUTTON_GAP * 3;


    return Math.floor(
        usable / 4
    );
};


// ============================================================
// ボタン矩形
// ============================================================

Window_ActorCommand.prototype.itemRect =
function(index) {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_itemRect.call(
            this,
            index
        );
    }


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    var rect =
        new Rectangle();


    var width =
        this.commandButtonWidth();


    rect.width =
        width;


    rect.height =
        this.contentsHeight() -
        BUTTON_MARGIN_Y * 2;


    rect.x =
        SIDE_MARGIN +
        index *
        (
            width +
            BUTTON_GAP
        );


    rect.y =
        BUTTON_MARGIN_Y;


    return rect;
};


// ============================================================
// テキスト矩形
// ============================================================

Window_ActorCommand.prototype.itemRectForText =
function(index) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowActorCommand_itemRectForText.call(
            this,
            index
        );
    }


    var rect =
        this.itemRect(
            index
        );


    return new Rectangle(
        rect.x + 8,
        rect.y,
        rect.width - 16,
        rect.height
    );
};


// ============================================================
// コマンド描画
// ============================================================

Window_ActorCommand.prototype.drawItem =
function(index) {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowActorCommand_drawItem.call(
            this,
            index
        );

        return;
    }


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    var command =
        this._list[index];


    if (!command) {
        return;
    }


    var rect =
        this.itemRect(
            index
        );


    var textRect =
        this.itemRectForText(
            index
        );


    var selected =
        this.active &&
        this.index() === index;


    var bg =
        selected
        ? BUTTON_SELECTED_COLOR
        : BUTTON_BACKGROUND_COLOR;


    // --------------------------------------------------------
    // 背景
    // --------------------------------------------------------

    this.contents.fillRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        bg
    );


    // --------------------------------------------------------
    // 無効状態
    // --------------------------------------------------------

    var oldOpacity =
        this.contents.paintOpacity;


    this.contents.paintOpacity =
        command.enabled
        ? 255
        : 100;


    var s =
        BUTTON_BORDER_SIZE;


    // --------------------------------------------------------
    // 上枠
    // --------------------------------------------------------

    this.contents.fillRect(
        rect.x,
        rect.y,
        rect.width,
        s,
        BUTTON_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 下枠
    // --------------------------------------------------------

    this.contents.fillRect(
        rect.x,
        rect.y +
            rect.height -
            s,
        rect.width,
        s,
        BUTTON_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 左枠
    // --------------------------------------------------------

    this.contents.fillRect(
        rect.x,
        rect.y,
        s,
        rect.height,
        BUTTON_BORDER_COLOR
    );


    // --------------------------------------------------------
    // 右枠
    // --------------------------------------------------------

    this.contents.fillRect(
        rect.x +
            rect.width -
            s,
        rect.y,
        s,
        rect.height,
        BUTTON_BORDER_COLOR
    );


    this.contents.paintOpacity =
        oldOpacity;


    // --------------------------------------------------------
    // 文字
    // --------------------------------------------------------

    this.changePaintOpacity(
        command.enabled
    );


    this.changeTextColor(
        BUTTON_TEXT_COLOR
    );


    var textY =
        rect.y +
        Math.floor(
            (
                rect.height -
                this.lineHeight()
            ) / 2
        );


    this.drawText(
        command.name,
        textRect.x,
        textY,
        textRect.width,
        'center'
    );


    this.changePaintOpacity(
        true
    );


    this.resetTextColor();
};


// ============================================================
// 標準カーソルを完全に消す
//
// これが「緑色の帯」を出さないために重要
// ============================================================

Window_ActorCommand.prototype.updateCursor =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowActorCommand_updateCursor.call(
            this
        );

        return;
    }


    this.setCursorRect(
        0,
        0,
        0,
        0
    );
};


// ============================================================
// 選択変更
// ============================================================

Window_ActorCommand.prototype.select =
function(index) {

    _UT_WindowActorCommand_select.call(
        this,
        index
    );


    if (
        isUndertaleBattleUIEnabled() &&
        this.contents
    ) {

        this.refresh();
    }
};


// ============================================================
// ActorCommand 初期化
// ============================================================

Window_ActorCommand.prototype.initialize =
function() {

    _UT_WindowActorCommand_initialize.apply(
        this,
        arguments
    );


    if (
        isUndertaleBattleUIEnabled()
    ) {

        this.opacity =
            0;


        this.backOpacity =
            0;
    }
};


// ============================================================
// Window_BattleStatus
//
// ON:
// Undertale式ステータス
//
// OFF:
// MV標準
// ============================================================


// ------------------------------------------------------------
// 標準処理保存
// ------------------------------------------------------------

var _UT_WindowBattleStatus_windowWidth =
    Window_BattleStatus.prototype.windowWidth;


var _UT_WindowBattleStatus_standardBackOpacity =
    Window_BattleStatus.prototype.standardBackOpacity;


var _UT_WindowBattleStatus_numVisibleRows =
    Window_BattleStatus.prototype.numVisibleRows;


var _UT_WindowBattleStatus_refresh =
    Window_BattleStatus.prototype.refresh;


var _UT_WindowBattleStatus_drawItem =
    Window_BattleStatus.prototype.drawItem;


var _UT_WindowBattleStatus_updateCursor =
    Window_BattleStatus.prototype.updateCursor;


// ============================================================
// 横幅
// ============================================================

Window_BattleStatus.prototype.windowWidth =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleStatus_windowWidth.call(
            this
        );
    }


    return Graphics.boxWidth;
};


// ============================================================
// 背景透明
// ============================================================

Window_BattleStatus.prototype.standardBackOpacity =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleStatus_standardBackOpacity.call(
            this
        );
    }


    return 0;
};


// ============================================================
// 1行表示
// ============================================================

Window_BattleStatus.prototype.numVisibleRows =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleStatus_numVisibleRows.call(
            this
        );
    }


    return 1;
};


// ============================================================
// ステータス再描画
// ============================================================

Window_BattleStatus.prototype.refresh =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleStatus_refresh.call(
            this
        );

        return;
    }


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    if (!this.contents) {
        return;
    }


    this.contents.clear();


    var members =
        $gameParty.battleMembers();


    for (
        var i = 0;
        i < members.length;
        i++
    ) {

        this.drawUndertaleStatus(
            members[i],
            i,
            members.length
        );
    }
};


// ============================================================
// Undertale式ステータス描画
// ============================================================

Window_BattleStatus.prototype.drawUndertaleStatus =
function(actor, index, count) {

    if (!actor) {
        return;
    }


    this.contents.fontSize =
        STATUS_FONT_SIZE;


    // ========================================================
    // 表示文字
    // ========================================================

    var name =
        actor.name();


    var hpLabel =
        'HP';


    var hp =
        String(actor.hp) +
        '/' +
        String(actor.mhp);


    // ========================================================
    // 各文字の実幅
    // ========================================================

    var nameWidth =
        this.textWidth(
            name
        );


    var labelWidth =
        this.textWidth(
            hpLabel
        );


    var hpWidth =
        this.textWidth(
            hp
        );


    // ========================================================
    // 1人分の文字列全体の幅
    //
    // 例：
    // 佐吉 HP 450/450
    // ========================================================

    var groupWidth =
        nameWidth +
        NAME_HP_GAP +
        labelWidth +
        HP_VALUE_GAP +
        hpWidth;


    // ========================================================
    // contentsの実際の横幅
    // ========================================================

    var totalWidth =
        this.contentsWidth();


    // ========================================================
    // 人数で完全に等分
    //
    // 2人なら
    //
    // |------- 佐吉 -------|------ 味方1 ------|
    //
    // という2領域を作る
    // ========================================================

    var slotWidth =
        totalWidth /
        Math.max(
            count,
            1
        );


    // ========================================================
    // 今のキャラの領域左端
    // ========================================================

    var slotX =
        slotWidth *
        index;


    // ========================================================
    // その領域の中央へ文字列全体を配置
    // ========================================================

    var startX =
        slotX +
        (
            slotWidth -
            groupWidth
        ) / 2;


    // ========================================================
    // Y位置
    // ========================================================

    var y =
        Math.floor(
            (
                this.contentsHeight() -
                this.lineHeight()
            ) / 2
        );


    // ========================================================
    // 名前
    // ========================================================

    this.changeTextColor(
        STATUS_NAME_COLOR
    );


    this.drawText(
        name,
        Math.floor(
            startX
        ),
        y,
        nameWidth + 4,
        'left'
    );


    // ========================================================
    // HP
    // ========================================================

    var labelX =
        startX +
        nameWidth +
        NAME_HP_GAP;


    this.changeTextColor(
        STATUS_HP_LABEL_COLOR
    );


    this.drawText(
        hpLabel,
        Math.floor(
            labelX
        ),
        y,
        labelWidth + 4,
        'left'
    );


    // ========================================================
    // HP数値
    // ========================================================

    var hpX =
        labelX +
        labelWidth +
        HP_VALUE_GAP;


    this.changeTextColor(
        STATUS_HP_VALUE_COLOR
    );


    this.drawText(
        hp,
        Math.floor(
            hpX
        ),
        y,
        hpWidth + 8,
        'left'
    );


    this.resetTextColor();
};


// ============================================================
// ON時は標準ステータスdrawItemを使わない
// ============================================================

Window_BattleStatus.prototype.drawItem =
function(index) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleStatus_drawItem.call(
            this,
            index
        );

        return;
    }
};


// ============================================================
// ステータス標準カーソルを消す
//
// ここも「緑色の帯」対策
// ============================================================

Window_BattleStatus.prototype.updateCursor =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleStatus_updateCursor.call(
            this
        );

        return;
    }


    this.setCursorRect(
        0,
        0,
        0,
        0
    );
};

// ============================================================
// Undertale 中央メッセージウィンドウ
// ============================================================

function Window_UndertaleMessage() {

    this.initialize.apply(
        this,
        arguments
    );
}


Window_UndertaleMessage.prototype =
    Object.create(
        Window_Base.prototype
    );


Window_UndertaleMessage.prototype.constructor =
    Window_UndertaleMessage;


// ============================================================
// 初期化
// ============================================================

Window_UndertaleMessage.prototype.initialize =
function() {

    Window_Base.prototype.initialize.call(
        this,
        MESSAGE_SIDE_MARGIN,
        messageY(),
        Graphics.boxWidth -
            MESSAGE_SIDE_MARGIN * 2,
        messageHeight()
    );


    this.opacity =
        0;


    this.backOpacity =
        0;


    this._text =
        '';


    this.refresh();
};


// ============================================================
// 文章設定
// ============================================================

Window_UndertaleMessage.prototype.setText =
function(text) {

    this._text =
        text !== undefined &&
        text !== null
        ? String(text)
        : '';


    this.refresh();
};


// ============================================================
// 現在の文章
// ============================================================

Window_UndertaleMessage.prototype.text =
function() {

    return this._text || '';
};


// ============================================================
// 描画
// ============================================================

Window_UndertaleMessage.prototype.refresh =
function() {

    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    this.contents.fontSize =
        MESSAGE_FONT_SIZE;


    this.changeTextColor(
        MESSAGE_TEXT_COLOR
    );


    var text =
        this.text();


    if (
        !text
    ) {

        this.resetTextColor();

        return;
    }


    var lines =
        text.split(
            '\n'
        );


    for (
        var i = 0;
        i < lines.length &&
        i < MESSAGE_MAX_LINES;
        i++
    ) {

        this.drawTextEx(
            lines[i],
            MESSAGE_TEXT_X,
            MESSAGE_TEXT_Y +
                i *
                MESSAGE_LINE_HEIGHT
        );
    }


    this.resetTextColor();
};


// ============================================================
// Window_BattleEnemy
//
// ON:
// Undertale中央枠内に敵一覧
//
// OFF:
// MV標準
// ============================================================


// ------------------------------------------------------------
// 標準処理保存
// ------------------------------------------------------------

var _UT_WindowBattleEnemy_initialize =
    Window_BattleEnemy.prototype.initialize;


var _UT_WindowBattleEnemy_refresh =
    Window_BattleEnemy.prototype.refresh;


var _UT_WindowBattleEnemy_drawItem =
    Window_BattleEnemy.prototype.drawItem;


var _UT_WindowBattleEnemy_updateCursor =
    Window_BattleEnemy.prototype.updateCursor;


var _UT_WindowBattleEnemy_itemRect =
    Window_BattleEnemy.prototype.itemRect;


var _UT_WindowBattleEnemy_itemRectForText =
    Window_BattleEnemy.prototype.itemRectForText;


var _UT_WindowBattleEnemy_maxCols =
    Window_BattleEnemy.prototype.maxCols;


var _UT_WindowBattleEnemy_maxItems =
    Window_BattleEnemy.prototype.maxItems;


// ============================================================
// 敵選択 初期化
// ============================================================

Window_BattleEnemy.prototype.initialize =
function(x, y) {

    _UT_WindowBattleEnemy_initialize.call(
        this,
        x,
        y
    );


    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return;
    }


    moveToMainBox(
        this
    );


    this.hide();

    this.deactivate();


    hideStandardArrows(
        this
    );
};


// ============================================================
// 敵一覧 列数
// ============================================================

Window_BattleEnemy.prototype.maxCols =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleEnemy_maxCols.call(
            this
        );
    }


    return LIST_COLS;
};


// ============================================================
// 敵一覧 件数
// ============================================================

Window_BattleEnemy.prototype.maxItems =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleEnemy_maxItems.call(
            this
        );
    }


    return this._enemies
        ? this._enemies.length
        : 0;
};


// ============================================================
// 敵項目矩形
// ============================================================

Window_BattleEnemy.prototype.itemRect =
function(index) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleEnemy_itemRect.call(
            this,
            index
        );
    }


    var rect =
        new Rectangle();


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) /
            LIST_COLS
        );


    var rowHeight =
        Math.floor(
            innerHeight /
            LIST_ROWS
        );


    var col =
        index %
        LIST_COLS;


    var row =
        Math.floor(
            index /
            LIST_COLS
        );


    rect.x =
        LIST_SIDE_MARGIN +
        col *
        (
            colWidth +
            LIST_COLUMN_GAP
        );


    rect.y =
        LIST_TOP_MARGIN +
        row *
        rowHeight;


    rect.width =
        colWidth;


    rect.height =
        rowHeight;


    return rect;
};


// ============================================================
// 敵テキスト矩形
// ============================================================

Window_BattleEnemy.prototype.itemRectForText =
function(index) {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_WindowBattleEnemy_itemRectForText.call(
            this,
            index
        );
    }


    var rect =
        this.itemRect(
            index
        );


    return new Rectangle(
        rect.x + 8,
        rect.y,
        rect.width - 16,
        rect.height
    );
};


// ============================================================
// 敵選択：描画
//
// Undertale UI ON:
//
// ・選択中は背景色＋「＊ 」
// ・見逃し可能な敵は黄色
//
// OFF:
// MV標準
// ============================================================

var _UT_WindowBattleEnemy_drawItem =
    Window_BattleEnemy.prototype.drawItem;


Window_BattleEnemy.prototype.drawItem =
function(index) {

    // ========================================================
    // OFF
    // → MV標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleEnemy_drawItem.call(
            this,
            index
        );

        return;
    }


    // ========================================================
    // 敵取得
    // ========================================================

    var enemy =
        this._enemies
            ? this._enemies[index]
            : null;


    if (!enemy) {
        return;
    }


    // ========================================================
    // 描画範囲
    // ========================================================

    var rect =
        this.itemRect(
            index
        );


    var selected =
        this.active &&
        this.index() === index;


    // ========================================================
    // 選択背景
    // ========================================================

    if (selected) {

        this.contents.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            BUTTON_SELECTED_COLOR
        );
    }


    // ========================================================
    // フォント
    // ========================================================

    this.contents.fontSize =
        LIST_FONT_SIZE;


    // ========================================================
    // 見逃し可能なら黄色
    //
    // UndertaleMercyOn() が実行された敵だけ
    // _undertaleMercyReady === true になる
    // ========================================================

    if (
        enemy._undertaleMercyReady ===
        true
    ) {

        this.changeTextColor(
            '#ff9900'
        );

    } else {

        this.changeTextColor(
            MESSAGE_TEXT_COLOR
        );
    }


    // ========================================================
    // 選択中だけ「＊ 」
    // ========================================================

    var prefix =
        selected
            ? '＊ '
            : '   ';


    // ========================================================
    // 敵名
    // ========================================================

    this.drawText(
        prefix +
            enemy.name(),
        rect.x + 10,
        rect.y,
        rect.width - 20,
        'left'
    );


    this.resetTextColor();
};

// ============================================================
// 敵選択位置が変わったら再描画
//
// ＊ と背景色を現在位置へ移動させる
// ============================================================

var _UT_WindowBattleEnemy_select =
    Window_BattleEnemy.prototype.select;


Window_BattleEnemy.prototype.select =
function(index) {

    _UT_WindowBattleEnemy_select.call(
        this,
        index
    );


    if (
        isUndertaleBattleUIEnabled() &&
        this.contents
    ) {

        this.refresh();
    }
};

// ============================================================
// 敵一覧再描画
// ============================================================

Window_BattleEnemy.prototype.refresh =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleEnemy_refresh.call(
            this
        );

        return;
    }


    // --------------------------------------------------------
    // ON
    // --------------------------------------------------------

    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    // --------------------------------------------------------
    // 生存している敵だけ
    // --------------------------------------------------------

    this._enemies =
        $gameTroop.aliveMembers();


    for (
        var i = 0;
        i < this.maxItems();
        i++
    ) {

        this.drawItem(
            i
        );
    }


    hideStandardArrows(
        this
    );
};


// ============================================================
// 敵選択カーソル
// ============================================================

Window_BattleEnemy.prototype.updateCursor =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleEnemy_updateCursor.call(
            this
        );

        return;
    }


    // --------------------------------------------------------
    // 非選択時
    // --------------------------------------------------------

    if (
        this.index() < 0 ||
        !this.active
    ) {

        this.setCursorRect(
            0,
            0,
            0,
            0
        );

        return;
    }


    // --------------------------------------------------------
    // 選択中
    // --------------------------------------------------------

    var rect =
        this.itemRect(
            this.index()
        );


    this.setCursorRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height
    );
};


// ============================================================
// Window_BattleActor
//
// アイテム等で味方選択が必要になった場合に備え
// Undertale中央枠へ配置
// ============================================================

var _UT_WindowBattleActor_initialize =
    Window_BattleActor.prototype.initialize;


var _UT_WindowBattleActor_refresh =
    Window_BattleActor.prototype.refresh;


var _UT_WindowBattleActor_updateCursor =
    Window_BattleActor.prototype.updateCursor;


// ============================================================
// 味方選択 初期化
// ============================================================

Window_BattleActor.prototype.initialize =
function(x, y) {

    _UT_WindowBattleActor_initialize.call(
        this,
        x,
        y
    );


    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return;
    }


    moveToMainBox(
        this
    );


    this.hide();

    this.deactivate();


    hideStandardArrows(
        this
    );
};


// ============================================================
// 味方一覧再描画
// ============================================================

Window_BattleActor.prototype.refresh =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleActor_refresh.call(
            this
        );

        return;
    }


    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    var members =
        $gameParty.battleMembers();


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) /
            LIST_COLS
        );


    var rowHeight =
        Math.floor(
            innerHeight /
            LIST_ROWS
        );


    this.contents.fontSize =
        LIST_FONT_SIZE;


    for (
        var i = 0;
        i < members.length;
        i++
    ) {

        var actor =
            members[i];


        if (!actor) {
            continue;
        }


        var col =
            i %
            LIST_COLS;


        var row =
            Math.floor(
                i /
                LIST_COLS
            );


        var x =
            LIST_SIDE_MARGIN +
            col *
            (
                colWidth +
                LIST_COLUMN_GAP
            );


        var y =
            LIST_TOP_MARGIN +
            row *
            rowHeight;


        this.resetTextColor();


        this.drawText(
            actor.name(),
            x + 8,
            y +
                Math.floor(
                    (
                        rowHeight -
                        this.lineHeight()
                    ) / 2
                ),
            colWidth - 16,
            'left'
        );
    }


    hideStandardArrows(
        this
    );
};


// ============================================================
// 味方選択カーソル
// ============================================================

Window_BattleActor.prototype.updateCursor =
function() {

    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_WindowBattleActor_updateCursor.call(
            this
        );

        return;
    }


    // --------------------------------------------------------
    // 非選択
    // --------------------------------------------------------

    if (
        this.index() < 0 ||
        !this.active
    ) {

        this.setCursorRect(
            0,
            0,
            0,
            0
        );

        return;
    }


    var index =
        this.index();


    var col =
        index %
        LIST_COLS;


    var row =
        Math.floor(
            index /
            LIST_COLS
        );


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) /
            LIST_COLS
        );


    var rowHeight =
        Math.floor(
            innerHeight /
            LIST_ROWS
        );


    var x =
        LIST_SIDE_MARGIN +
        col *
        (
            colWidth +
            LIST_COLUMN_GAP
        );


    var y =
        LIST_TOP_MARGIN +
        row *
        rowHeight;


    this.setCursorRect(
        x,
        y,
        colWidth,
        rowHeight
    );
};

// ============================================================
// Undertale ACT選択ウィンドウ
// ============================================================

function Window_UndertaleAct() {

    this.initialize.apply(
        this,
        arguments
    );
}


Window_UndertaleAct.prototype =
    Object.create(
        Window_Selectable.prototype
    );


Window_UndertaleAct.prototype.constructor =
    Window_UndertaleAct;


// ============================================================
// 初期化
// ============================================================

Window_UndertaleAct.prototype.initialize =
function() {

    Window_Selectable.prototype.initialize.call(
        this,
        MESSAGE_SIDE_MARGIN,
        messageY(),
        Graphics.boxWidth -
            MESSAGE_SIDE_MARGIN * 2,
        messageHeight()
    );


    this.opacity =
        0;


    this.backOpacity =
        0;


    this._enemy =
        null;


    // ACTデータはすべてここに格納
    this._acts =
        [];


    this.hide();

    this.deactivate();
};


// ============================================================
// ACT一覧作成
//
// 敵のメモ欄:
//
// <ACT: 調べる>
// <ACT: 話す>
//
// の形式を読み込む
// ============================================================

// ============================================================
// ACT数
// ============================================================

Window_UndertaleAct.prototype.maxItems =
function() {

    return this._acts
        ? this._acts.length
        : 0;
};


// ============================================================
// 2列
// ============================================================

Window_UndertaleAct.prototype.maxCols =
function() {

    return LIST_COLS;
};


// ============================================================
// ACT項目矩形
// ============================================================

Window_UndertaleAct.prototype.itemRect =
function(index) {

    var rect =
        new Rectangle();


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) /
            LIST_COLS
        );


    var rowHeight =
        Math.floor(
            innerHeight /
            LIST_ROWS
        );


    var col =
        index %
        LIST_COLS;


    var row =
        Math.floor(
            index /
            LIST_COLS
        );


    rect.x =
        LIST_SIDE_MARGIN +
        col *
        (
            colWidth +
            LIST_COLUMN_GAP
        );


    rect.y =
        LIST_TOP_MARGIN +
        row *
        rowHeight;


    rect.width =
        colWidth;


    rect.height =
        rowHeight;


    return rect;
};


// ============================================================
// ACT描画
// ============================================================

Window_UndertaleAct.prototype.drawItem =
function(index) {

    var act =
        this._acts[index];


    if (!act) {
        return;
    }


    var rect =
        this.itemRect(
            index
        );


    var selected =
        this.active &&
        this.index() === index;


    // --------------------------------------------------------
    // 選択背景
    // --------------------------------------------------------

    if (selected) {

        this.contents.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            BUTTON_SELECTED_COLOR
        );
    }


    this.contents.fontSize =
        LIST_FONT_SIZE;


    this.changeTextColor(
        MESSAGE_TEXT_COLOR
    );


    var prefix =
        selected
        ? '＊ '
        : '   ';


    var y =
        rect.y +
        Math.floor(
            (
                rect.height -
                this.lineHeight()
            ) / 2
        );


    this.drawText(
        prefix +
            act.name,
        rect.x + 10,
        y,
        rect.width - 20,
        'left'
    );


    this.resetTextColor();
};


// ============================================================
// ACT一覧再描画
// ============================================================

Window_UndertaleAct.prototype.refresh =
function() {

    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    for (
        var i = 0;
        i < this.maxItems();
        i++
    ) {

        this.drawItem(
            i
        );
    }


    hideStandardArrows(
        this
    );
};


// ============================================================
// 現在選択しているACT
// ============================================================

Window_UndertaleAct.prototype.currentAct =
function() {

    if (
        !this._acts ||
        this.index() < 0
    ) {

        return null;
    }


    return (
        this._acts[
            this.index()
        ] ||
        null
    );
};


// ============================================================
// ACT選択変更
// ============================================================

var _UT_WindowUndertaleAct_select =
    Window_UndertaleAct.prototype.select;


Window_UndertaleAct.prototype.select =
function(index) {

    _UT_WindowUndertaleAct_select.call(
        this,
        index
    );


    if (
        this.contents
    ) {

        this.refresh();
    }
};


// ============================================================
// ACT標準カーソル
//
// 選択位置は「＊」と背景で表示するため
// MV標準カーソルは消す
// ============================================================

Window_UndertaleAct.prototype.updateCursor =
function() {

    this.setCursorRect(
        0,
        0,
        0,
        0
    );
};

// ============================================================
// 敵生成時
// 初期見逃し状態を設定
//
// 敵メモ欄:
//
// <MERCY_START>
//
// がある場合、戦闘開始時から見逃し可能
// ============================================================

var _UT_GameEnemy_setup =
    Game_Enemy.prototype.setup;


Game_Enemy.prototype.setup =
function(enemyId, x, y) {

    // ========================================================
    // MV標準処理
    // ========================================================

    _UT_GameEnemy_setup.call(
        this,
        enemyId,
        x,
        y
    );


    // ========================================================
    // 敵データ
    // ========================================================

    var enemyData =
        this.enemy();


    // ========================================================
    // メモ欄
    // ========================================================

    var note =
        enemyData
            ? enemyData.note || ''
            : '';


    // ========================================================
    // <MERCY_START>
    // があれば最初から見逃し可能
    // ========================================================

    this._undertaleMercyReady =
        /<MERCY_START>/i.test(
            note
        );
};

// ============================================================
// UNDERTALE式「みのがす」フラグ
// ============================================================

function setUndertaleMercy(enemy, value) {

    if (!enemy) {
        return;
    }

    enemy._undertaleMercyReady =
        !!value;
}


// ============================================================
// 見逃し可能か
// ============================================================

function canUndertaleSpare(enemy) {

    if (!enemy) {
        return false;
    }

    return (
        enemy._undertaleMercyReady ===
        true
    );
}


// ============================================================
// 現在ACT中の敵を見逃し可能にする
//
// コモンイベントのスクリプト:
//
// UndertaleMercyOn();
//
// ============================================================

window.UndertaleMercyOn =
function() {

    if (
        !$gameTemp ||
        !$gameTemp._undertaleActEnemy
    ) {
        return;
    }

    setUndertaleMercy(
        $gameTemp._undertaleActEnemy,
        true
    );
};


// ============================================================
// 現在ACT中の敵を見逃し不可に戻す
//
// UndertaleMercyOff();
//
// ============================================================

window.UndertaleMercyOff =
function() {

    if (
        !$gameTemp ||
        !$gameTemp._undertaleActEnemy
    ) {
        return;
    }

    setUndertaleMercy(
        $gameTemp._undertaleActEnemy,
        false
    );
};


// ============================================================
// 敵メモ欄からACTを読み取る
//
// 書式:
// <ACT: はなす, 11>
// <ACT: おどす, 12>
// <ACT: お金を渡す, 13>
// ============================================================

function readEnemyActs(enemy) {

    var result = [];

    if (
        !enemy ||
        !enemy.enemy()
    ) {
        return result;
    }

    var note =
        enemy.enemy().note ||
        '';

    var regex =
        /<ACT\s*:\s*([^,>]+?)\s*,\s*(\d+)\s*>/gi;

    var match;

    while (
        (
            match =
                regex.exec(note)
        ) !== null
    ) {

        result.push({

            name:
                String(
                    match[1]
                ).trim(),

            commonEventId:
                Number(
                    match[2]
                )
        });
    }

    return result;
}


// ============================================================
// ACT対象敵を設定
// ============================================================

Window_UndertaleAct.prototype.setEnemy =
function(enemy) {

    this._enemy = enemy;

    this._acts =
        readEnemyActs(enemy);

    this._undertaleTopRow = 0;

    if (
        this._acts.length > 0
    ) {
        this.select(0);

    } else {

        this.select(-1);
    }

    this.refresh();
};


// ============================================================
// Undertale アイテム選択ウィンドウ
// ============================================================

function Window_UndertaleItem() {

    this.initialize.apply(
        this,
        arguments
    );
}


Window_UndertaleItem.prototype =
    Object.create(
        Window_Selectable.prototype
    );


Window_UndertaleItem.prototype.constructor =
    Window_UndertaleItem;


// ============================================================
// 初期化
// ============================================================

Window_UndertaleItem.prototype.initialize =
function() {

    Window_Selectable.prototype.initialize.call(
        this,
        MESSAGE_SIDE_MARGIN,
        messageY(),
        Graphics.boxWidth -
            MESSAGE_SIDE_MARGIN * 2,
        messageHeight()
    );


    this.opacity =
        0;


    this.backOpacity =
        0;


    this._data =
        [];


    this.refresh();


    this.hide();

    this.deactivate();
};


// ============================================================
// 使用可能なアイテム一覧作成
// ============================================================

Window_UndertaleItem.prototype.makeItemList =
function() {

    this._data =
        [];


    var actor =
        BattleManager.actor();


    if (!actor) {
        return;
    }


    var items =
        $gameParty.items();


    for (
        var i = 0;
        i < items.length;
        i++
    ) {

        var item =
            items[i];


        if (!item) {
            continue;
        }


        if (
            actor.canUse(
                item
            )
        ) {

            this._data.push(
                item
            );
        }
    }
};


// ============================================================
// アイテム数
// ============================================================

Window_UndertaleItem.prototype.maxItems =
function() {

    return this._data
        ? this._data.length
        : 0;
};


// ============================================================
// 2列
// ============================================================

Window_UndertaleItem.prototype.maxCols =
function() {

    return LIST_COLS;
};


// ============================================================
// 表示行数
// ============================================================

Window_UndertaleItem.prototype.numVisibleRows =
function() {

    return LIST_ROWS;
};


// ============================================================
// アイテム項目矩形
// ============================================================

Window_UndertaleItem.prototype.itemRect =
function(index) {

    var rect =
        new Rectangle();


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) /
            LIST_COLS
        );


    var rowHeight =
        Math.floor(
            innerHeight /
            LIST_ROWS
        );


    var col =
        index %
        LIST_COLS;


    var row =
        Math.floor(
            index /
            LIST_COLS
        );


    rect.x =
        LIST_SIDE_MARGIN +
        col *
        (
            colWidth +
            LIST_COLUMN_GAP
        );


    rect.y =
        LIST_TOP_MARGIN +
        row *
        rowHeight;


    rect.width =
        colWidth;


    rect.height =
        rowHeight;


    return rect;
};


// ============================================================
// アイテム描画
// ============================================================

Window_UndertaleItem.prototype.drawItem =
function(index) {

    var item =
        this._data[index];


    if (!item) {
        return;
    }


    var rect =
        this.itemRect(
            index
        );


    var selected =
        this.active &&
        this.index() === index;


    // --------------------------------------------------------
    // 選択背景
    // --------------------------------------------------------

    if (selected) {

        this.contents.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            BUTTON_SELECTED_COLOR
        );
    }


    this.contents.fontSize =
        LIST_FONT_SIZE;


    this.changeTextColor(
        MESSAGE_TEXT_COLOR
    );


    var prefix =
        selected
        ? '＊ '
        : '   ';


    var amount =
        $gameParty.numItems(
            item
        );


    var text =
        prefix +
        item.name +
        ' ×' +
        amount;


    var y =
        rect.y +
        Math.floor(
            (
                rect.height -
                this.lineHeight()
            ) / 2
        );


    this.drawText(
        text,
        rect.x + 10,
        y,
        rect.width - 20,
        'left'
    );


    this.resetTextColor();
};


// ============================================================
// アイテム一覧再描画
// ============================================================

Window_UndertaleItem.prototype.refresh =
function() {

    this.makeItemList();


    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    for (
        var i = 0;
        i < this.maxItems();
        i++
    ) {

        this.drawItem(
            i
        );
    }


    hideStandardArrows(
        this
    );
};


// ============================================================
// 現在選択中アイテム
// ============================================================

Window_UndertaleItem.prototype.item =
function() {

    if (
        !this._data ||
        this.index() < 0
    ) {

        return null;
    }


    return (
        this._data[
            this.index()
        ] ||
        null
    );
};


// ============================================================
// 選択変更
// ============================================================

var _UT_WindowUndertaleItem_select =
    Window_UndertaleItem.prototype.select;


Window_UndertaleItem.prototype.select =
function(index) {

    _UT_WindowUndertaleItem_select.call(
        this,
        index
    );


    if (
        this.contents
    ) {

        this.refresh();
    }
};


// ============================================================
// 標準カーソルを消す
// ============================================================

Window_UndertaleItem.prototype.updateCursor =
function() {

    this.setCursorRect(
        0,
        0,
        0,
        0
    );
};


// ============================================================
// Undertale みのがすウィンドウ
//
// 「みのがす」
// 「逃げる」
//
// の2択
// ============================================================

function Window_UndertaleMercy() {

    this.initialize.apply(
        this,
        arguments
    );
}


Window_UndertaleMercy.prototype =
    Object.create(
        Window_Command.prototype
    );


Window_UndertaleMercy.prototype.constructor =
    Window_UndertaleMercy;


// ============================================================
// 横幅
// ============================================================

Window_UndertaleMercy.prototype.windowWidth =
function() {

    return (
        Graphics.boxWidth -
        MESSAGE_SIDE_MARGIN * 2
    );
};


// ============================================================
// 高さ
// ============================================================

Window_UndertaleMercy.prototype.windowHeight =
function() {

    return messageHeight();
};


// ============================================================
// 2列
// ============================================================

Window_UndertaleMercy.prototype.maxCols =
function() {

    return LIST_ROWS;
};


// ============================================================
// 1行
// ============================================================

Window_UndertaleMercy.prototype.numVisibleRows =
function() {

    return LIST_COLS;
};


// ============================================================
// コマンド作成
// ============================================================

Window_UndertaleMercy.prototype.makeCommandList =
function() {

    this.addCommand(
        'みのがす',
        'spare',
        true
    );


    this.addCommand(
        '逃げる',
        'escape',
        true
    );
};


// ============================================================
// 初期化
// ============================================================

Window_UndertaleMercy.prototype.initialize =
function() {

    Window_Command.prototype.initialize.call(
        this,
        MESSAGE_SIDE_MARGIN,
        messageY()
    );


    // --------------------------------------------------------
    // Window_CommandはwindowWidth/windowHeightを使って
    // 一度生成されるが、念のため正確な位置へ移動
    // --------------------------------------------------------

    this.move(
        MESSAGE_SIDE_MARGIN,
        messageY(),
        Graphics.boxWidth -
            MESSAGE_SIDE_MARGIN * 2,
        messageHeight()
    );


    this.createContents();


    this.opacity =
        0;


    this.backOpacity =
        0;


    this.hide();

    this.deactivate();


    this.refresh();
};


// ============================================================
// みのがす項目矩形
//
// 2列 × 3行
// ============================================================

Window_UndertaleMercy.prototype.itemRect =
function(index) {

    var rect =
        new Rectangle();


    var innerWidth =
        this.contentsWidth() -
        LIST_SIDE_MARGIN * 2;


    var innerHeight =
        this.contentsHeight() -
        LIST_TOP_MARGIN -
        LIST_BOTTOM_MARGIN;


    // ========================================================
    // 2列
    // ========================================================

    var colWidth =
        Math.floor(
            (
                innerWidth -
                LIST_COLUMN_GAP
            ) / 2
        );


    // ========================================================
    // 3行
    // ========================================================

    var rowHeight =
        Math.floor(
            innerHeight / 3
        );


    // ========================================================
    // 現在の列・行
    // ========================================================

    var col =
        index % 2;


    var row =
        Math.floor(
            index / 2
        );


    // ========================================================
    // 座標
    // ========================================================

    rect.x =
        LIST_SIDE_MARGIN +
        col *
        (
            colWidth +
            LIST_COLUMN_GAP
        );


    rect.y =
        LIST_TOP_MARGIN +
        row *
        rowHeight;


    rect.width =
        colWidth;


    rect.height =
        rowHeight;


    return rect;
};


// ============================================================
// みのがす描画
// ============================================================

Window_UndertaleMercy.prototype.drawItem =
function(index) {

    var rect =
        this.itemRect(
            index
        );


    var selected =
        this.active &&
        this.index() === index;


    // --------------------------------------------------------
    // 選択背景
    // --------------------------------------------------------

    if (selected) {

        this.contents.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            BUTTON_SELECTED_COLOR
        );
    }


    this.contents.fontSize =
        LIST_FONT_SIZE;


    this.changeTextColor(
        MESSAGE_TEXT_COLOR
    );


    var prefix =
        selected
        ? '＊ '
        : '   ';


    var y =
        rect.y +
        Math.floor(
            (
                rect.height -
                this.lineHeight()
            ) / 2
        );


    this.drawText(
        prefix +
            this.commandName(
                index
            ),
        rect.x + 10,
        y,
        rect.width - 20,
        'left'
    );


    this.resetTextColor();
};


// ============================================================
// 再描画
// ============================================================

Window_UndertaleMercy.prototype.refresh =
function() {

    // --------------------------------------------------------
    // Window_Commandではコマンドリスト自体は
    // initialize時に生成済み。
    //
    // 選択変更のたびにclearCommandList()すると
    // Window_Command内部状態まで作り直すことになるため、
    // ここでは描画だけ行う。
    // --------------------------------------------------------

    if (
        !this.contents
    ) {
        return;
    }


    this.contents.clear();


    drawMainBox(
        this
    );


    for (
        var i = 0;
        i < this.maxItems();
        i++
    ) {

        this.drawItem(
            i
        );
    }


    hideStandardArrows(
        this
    );
};


// ============================================================
// 選択変更
// ============================================================

var _UT_WindowUndertaleMercy_select =
    Window_UndertaleMercy.prototype.select;


Window_UndertaleMercy.prototype.select =
function(index) {

    _UT_WindowUndertaleMercy_select.call(
        this,
        index
    );


    if (
        this.contents
    ) {

        this.refresh();
    }
};


// ============================================================
// 標準カーソルを消す
// ============================================================

Window_UndertaleMercy.prototype.updateCursor =
function() {

    this.setCursorRect(
        0,
        0,
        0,
        0
    );
};

// ============================================================
// Scene_Battle
//
// ここから戦闘画面側の制御
// ============================================================


// ============================================================
// MV標準処理を保存
// ============================================================

var _UT_SceneBattle_createAllWindows =
    Scene_Battle.prototype.createAllWindows;


var _UT_SceneBattle_createActorCommandWindow =
    Scene_Battle.prototype.createActorCommandWindow;


var _UT_SceneBattle_createStatusWindow =
    Scene_Battle.prototype.createStatusWindow;


var _UT_SceneBattle_createEnemyWindow =
    Scene_Battle.prototype.createEnemyWindow;


var _UT_SceneBattle_startPartyCommandSelection =
    Scene_Battle.prototype.startPartyCommandSelection;


var _UT_SceneBattle_startActorCommandSelection =
    Scene_Battle.prototype.startActorCommandSelection;

    // ============================================================
// Scene_Battle.updateWindowPositions
//
// MV標準では戦闘状態によって
// ステータスウィンドウのX座標が動く。
//
// Undertale UI ON時はそれを禁止して
// 常に x = 0 に固定する。
// ============================================================

var _UT_SceneBattle_updateWindowPositions =
    Scene_Battle.prototype.updateWindowPositions;


Scene_Battle.prototype.updateWindowPositions =
function() {

    // ========================================================
    // OFF
    // → MV標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_updateWindowPositions.call(
            this
        );

        return;
    }


    // ========================================================
    // ON
    //
    // MV標準のupdateWindowPositionsは呼ばない。
    // ステータスを絶対に横移動させない。
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.x =
            0;


        this._statusWindow.y =
            statusY();
    }


    // ========================================================
    // ActorCommandも固定
    // ========================================================

    if (
        this._actorCommandWindow
    ) {

        this._actorCommandWindow.x =
            0;


        this._actorCommandWindow.y =
            commandY();
    }
};

// ============================================================
// 全ウィンドウ生成
// ============================================================

Scene_Battle.prototype.createAllWindows =
function() {

    // --------------------------------------------------------
    // まずMV標準ウィンドウを全部生成
    //
    // OFF時はこれだけで標準戦闘になる
    // --------------------------------------------------------

    _UT_SceneBattle_createAllWindows.call(
        this
    );


    // --------------------------------------------------------
    // OFFなら独自UIを作らない
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // Undertale中央メッセージ
    // ========================================================

    this._undertaleMessageWindow =
        new Window_UndertaleMessage();


    this.addWindow(
        this._undertaleMessageWindow
    );


    // ========================================================
    // ACT
    // ========================================================

    this._undertaleActWindow =
        new Window_UndertaleAct();


    this._undertaleActWindow.setHandler(
        'ok',
        this.onUndertaleActOk.bind(
            this
        )
    );


    this._undertaleActWindow.setHandler(
        'cancel',
        this.onUndertaleActCancel.bind(
            this
        )
    );


    this.addWindow(
        this._undertaleActWindow
    );


    // ========================================================
    // アイテム
    // ========================================================

    this._undertaleItemWindow =
        new Window_UndertaleItem();


    this._undertaleItemWindow.setHandler(
        'ok',
        this.onUndertaleItemOk.bind(
            this
        )
    );


    this._undertaleItemWindow.setHandler(
        'cancel',
        this.onUndertaleItemCancel.bind(
            this
        )
    );


    this.addWindow(
        this._undertaleItemWindow
    );


    // ========================================================
    // みのがす
    // ========================================================

    this._undertaleMercyWindow =
        new Window_UndertaleMercy();


    this._undertaleMercyWindow.setHandler(
        'spare',
        this.onUndertaleSpare.bind(
            this
        )
    );


    this._undertaleMercyWindow.setHandler(
        'escape',
        this.onUndertaleEscape.bind(
            this
        )
    );


    this._undertaleMercyWindow.setHandler(
        'cancel',
        this.onUndertaleMercyCancel.bind(
            this
        )
    );


    this.addWindow(
        this._undertaleMercyWindow
    );


    // ========================================================
    // Undertale側の状態初期化
    // ========================================================

    this._undertaleMode =
        null;


    this._undertaleSelectedEnemy =
        null;


    this._undertaleItemMessageWait =
        0;


    this._undertaleMercyMessageWait =
        0;


    this._undertaleBattleLogLines =
        [];


    BattleManager._undertaleLogWait =
        false;

    BattleManager._undertaleLogWaitCount =
        0;

    // --------------------------------------------------------
    // 最初は特殊ウィンドウを全部隠す
    // --------------------------------------------------------

    this._undertaleActWindow.hide();

    this._undertaleActWindow.deactivate();


    this._undertaleItemWindow.hide();

    this._undertaleItemWindow.deactivate();


    this._undertaleMercyWindow.hide();

    this._undertaleMercyWindow.deactivate();
};


// ============================================================
// ActorCommand生成
// ============================================================

Scene_Battle.prototype.createActorCommandWindow =
function() {

    // --------------------------------------------------------
    // MV標準生成
    // --------------------------------------------------------

    _UT_SceneBattle_createActorCommandWindow.call(
        this
    );


    // --------------------------------------------------------
    // OFFなら標準のまま
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // Undertale専用ハンドラ
    // ========================================================

    this._actorCommandWindow.setHandler(
        'undertaleAct',
        this.commandUndertaleAct.bind(
            this
        )
    );


    this._actorCommandWindow.setHandler(
        'undertaleItem',
        this.commandUndertaleItem.bind(
            this
        )
    );


    this._actorCommandWindow.setHandler(
        'undertaleMercy',
        this.commandUndertaleMercy.bind(
            this
        )
    );


    // ========================================================
    // 下部へ配置
    // ========================================================

    this._actorCommandWindow.move(
        0,
        commandY(),
        Graphics.boxWidth,
        COMMAND_HEIGHT
    );


    this._actorCommandWindow.createContents();


    this._actorCommandWindow.opacity =
        0;


    this._actorCommandWindow.backOpacity =
        0;
};


// ============================================================
// ステータス生成
// ============================================================

Scene_Battle.prototype.createStatusWindow =
function() {

    // --------------------------------------------------------
    // MV標準生成
    // --------------------------------------------------------

    _UT_SceneBattle_createStatusWindow.call(
        this
    );


    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // Undertale位置
    // ========================================================

    this._statusWindow.move(
        0,
        statusY(),
        Graphics.boxWidth,
        STATUS_HEIGHT
    );


    this._statusWindow.createContents();


    this._statusWindow.opacity =
        0;


    this._statusWindow.backOpacity =
        0;


    this._statusWindow.deactivate();


    this._statusWindow.deselect();


    this._statusWindow.refresh();
};


// ============================================================
// 敵選択ウィンドウ生成
// ============================================================

Scene_Battle.prototype.createEnemyWindow =
function() {

    // --------------------------------------------------------
    // MV標準生成
    // --------------------------------------------------------

    _UT_SceneBattle_createEnemyWindow.call(
        this
    );


    // --------------------------------------------------------
    // OFF
    // --------------------------------------------------------

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // Undertale中央枠へ移動
    // ========================================================

    moveToMainBox(
        this._enemyWindow
    );


    this._enemyWindow.hide();

    this._enemyWindow.deactivate();


    hideStandardArrows(
        this._enemyWindow
    );
};


// ============================================================
// Undertale用
// 敵グループ名を通常文章として表示
// ============================================================

Scene_Battle.prototype.showUndertaleDefaultMessage =
function() {


    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    if (
        !this._undertaleMessageWindow
    ) {

        return;
    }


    var troop =
        $dataTroops[
            $gameTroop._troopId
        ];


    var troopName =
        troop
        ? troop.name
        : '敵';


    this._undertaleMessageWindow.setText(
        '＊ ' +
        troopName
    );


    showUndertaleMainMessage(
        this
    );
};


// ============================================================
// パーティコマンド選択
//
// OFF:
// MV標準「たたかう / 逃げる」
//
// ON:
// パーティコマンドを出さず
// 直接 Undertale 4コマンドへ進む
//
// ★この関数はこのプラグイン内でここだけ定義する
// ============================================================

Scene_Battle.prototype.startPartyCommandSelection =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_startPartyCommandSelection.call(
            this
        );

        return;
    }


    // ========================================================
    // 標準パーティコマンドを完全に隠す
    // ========================================================

    if (
        this._partyCommandWindow
    ) {

        this._partyCommandWindow.deactivate();

        this._partyCommandWindow.close();

        this._partyCommandWindow.hide();

        this._partyCommandWindow.visible =
            false;
    }


    // ========================================================
    // 特殊状態解除
    // ========================================================

    this._undertaleMode =
        null;


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // 特殊ウィンドウを隠す
    // ========================================================

    if (
        this._undertaleActWindow
    ) {

        this._undertaleActWindow.deactivate();

        this._undertaleActWindow.hide();
    }


    if (
        this._undertaleItemWindow
    ) {

        this._undertaleItemWindow.deactivate();

        this._undertaleItemWindow.hide();
    }


    if (
        this._undertaleMercyWindow
    ) {

        this._undertaleMercyWindow.deactivate();

        this._undertaleMercyWindow.hide();
    }


    if (
        this._enemyWindow
    ) {

        this._enemyWindow.deactivate();

        this._enemyWindow.hide();
    }


    // ========================================================
    // ステータス
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.deactivate();

        this._statusWindow.deselect();


        this._statusWindow.move(
            0,
            statusY(),
            Graphics.boxWidth,
            STATUS_HEIGHT
        );


        this._statusWindow.createContents();


        this._statusWindow.opacity =
            0;


        this._statusWindow.backOpacity =
            0;


        this._statusWindow.show();

        this._statusWindow.refresh();
    }


    // ========================================================
    // 最初の入力アクターをBattleManager側で選択
    //
    // すでに入力アクターが存在する場合は
    // selectNextCommand() を繰り返さない。
    // ========================================================

    if (
        !BattleManager.actor()
    ) {

        BattleManager.selectNextCommand();
    }


    // ========================================================
    // 4コマンド開始
    // ========================================================

    if (
        BattleManager.actor()
    ) {

        this.startActorCommandSelection();
    }
};


// ============================================================
// アクターコマンド開始
//
// ★これもこのプラグイン内でここだけ定義する
// ============================================================

Scene_Battle.prototype.startActorCommandSelection =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_startActorCommandSelection.call(
            this
        );

        return;
    }


    // ========================================================
    // ACT・アイテム・みのがす等の途中なら
    // 勝手に4コマンドへ戻さない
    // ========================================================

    if (
        this._undertaleMode
    ) {

        return;
    }


    var actor =
        BattleManager.actor();


    if (!actor) {

        return;
    }


    // ========================================================
    // パーティコマンドを念のため再度隠す
    // ========================================================

    if (
        this._partyCommandWindow
    ) {

        this._partyCommandWindow.deactivate();

        this._partyCommandWindow.close();

        this._partyCommandWindow.hide();

        this._partyCommandWindow.visible =
            false;
    }


    // ========================================================
    // 敵選択を閉じる
    // ========================================================

    if (
        this._enemyWindow
    ) {

        this._enemyWindow.deactivate();

        this._enemyWindow.hide();
    }


    // ========================================================
    // ACTを閉じる
    // ========================================================

    if (
        this._undertaleActWindow
    ) {

        this._undertaleActWindow.deactivate();

        this._undertaleActWindow.hide();
    }


    // ========================================================
    // アイテムを閉じる
    // ========================================================

    if (
        this._undertaleItemWindow
    ) {

        this._undertaleItemWindow.deactivate();

        this._undertaleItemWindow.hide();
    }


    // ========================================================
    // みのがすを閉じる
    // ========================================================

    if (
        this._undertaleMercyWindow
    ) {

        this._undertaleMercyWindow.deactivate();

        this._undertaleMercyWindow.hide();
    }


    // ========================================================
    // ステータス
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.deactivate();

        this._statusWindow.deselect();


        this._statusWindow.move(
            0,
            statusY(),
            Graphics.boxWidth,
            STATUS_HEIGHT
        );


        this._statusWindow.createContents();


        this._statusWindow.opacity =
            0;


        this._statusWindow.backOpacity =
            0;


        this._statusWindow.show();

        this._statusWindow.refresh();
    }


    // ========================================================
    // Undertale 4コマンド
    // ========================================================

    this._actorCommandWindow.setup(
        actor
    );


    this._actorCommandWindow.move(
        0,
        commandY(),
        Graphics.boxWidth,
        COMMAND_HEIGHT
    );


    this._actorCommandWindow.createContents();


    this._actorCommandWindow.opacity =
        0;


    this._actorCommandWindow.backOpacity =
        0;


    this._actorCommandWindow.show();

    this._actorCommandWindow.visible =
        true;


    this._actorCommandWindow.select(
        0
    );


    this._actorCommandWindow.activate();

    this._actorCommandWindow.refresh();


    // ========================================================
    // 通常文章
    // 敵グループ名
    // ========================================================

    this.showUndertaleDefaultMessage();
};


// ============================================================
// 「こうどう」
// → 敵選択
// ============================================================

Scene_Battle.prototype.commandUndertaleAct =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // モード
    // ========================================================

    this._undertaleMode =
        'actEnemy';


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // 通常文章を隠す
    // ========================================================

    hideUndertaleMainMessage(
        this
    );


    // ========================================================
    // 4コマンド停止
    // ========================================================

    this._actorCommandWindow.deactivate();


    // ========================================================
    // 敵一覧
    // ========================================================

    this._enemyWindow.refresh();

    this._enemyWindow.show();


    if (
        this._enemyWindow.maxItems() >
        0
    ) {

        this._enemyWindow.select(
            0
        );

    } else {

        this._enemyWindow.select(
            -1
        );
    }


    this._enemyWindow.activate();
};


// ============================================================
// 「アイテム」
// ============================================================

Scene_Battle.prototype.commandUndertaleItem =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    this._undertaleMode =
        'item';


    hideUndertaleMainMessage(
        this
    );


    this._actorCommandWindow.deactivate();


    this._undertaleItemWindow.refresh();

    this._undertaleItemWindow.show();


    if (
        this._undertaleItemWindow.maxItems() >
        0
    ) {

        this._undertaleItemWindow.select(
            0
        );

    } else {

        this._undertaleItemWindow.select(
            -1
        );
    }


    this._undertaleItemWindow.activate();
};


// ============================================================
// 「みのがす」
// ============================================================

Scene_Battle.prototype.commandUndertaleMercy =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    this._undertaleMode =
        'mercyCommand';


    hideUndertaleMainMessage(
        this
    );


    this._actorCommandWindow.deactivate();


    this._undertaleMercyWindow.show();

    this._undertaleMercyWindow.select(
        0
    );

    this._undertaleMercyWindow.activate();

    this._undertaleMercyWindow.refresh();
};

// ============================================================
// ACT：敵選択後
// ============================================================

Scene_Battle.prototype.onUndertaleActEnemyOk =
function(enemy) {

    if (!enemy) {

        SoundManager.playBuzzer();

        this._enemyWindow.activate();

        return;
    }


    SoundManager.playOk();


    this._undertaleSelectedEnemy =
        enemy;


    this._undertaleMode =
        'actCommand';


    this._enemyWindow.deactivate();

    this._enemyWindow.hide();


    // ========================================================
    // ACT一覧を作成
    // ========================================================

    this._undertaleActWindow.setEnemy(
        enemy
    );


    this._undertaleActWindow.show();


    if (
        this._undertaleActWindow.maxItems() >
        0
    ) {

        this._undertaleActWindow.select(
            0
        );

    } else {

        this._undertaleActWindow.select(
            -1
        );
    }


    this._undertaleActWindow.activate();

    this._undertaleActWindow.refresh();
};


// ============================================================
// ACT選択キャンセル
//
// ACT一覧
// ↓
// 敵選択
// ============================================================

Scene_Battle.prototype.onUndertaleActCancel =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    SoundManager.playCancel();


    this._undertaleActWindow.deactivate();

    this._undertaleActWindow.hide();


    this._undertaleSelectedEnemy =
        null;


    this._undertaleMode =
        'actEnemy';


    // ========================================================
    // 敵一覧へ戻る
    // ========================================================

    this._enemyWindow.refresh();

    this._enemyWindow.show();


    if (
        this._enemyWindow.maxItems() >
        0
    ) {

        this._enemyWindow.select(
            0
        );

    } else {

        this._enemyWindow.select(
            -1
        );
    }


    this._enemyWindow.activate();
};


// ============================================================
// ACT決定
// ============================================================

Scene_Battle.prototype.onUndertaleActOk =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    var act =
        this._undertaleActWindow.currentAct();


    var enemy =
        this._undertaleSelectedEnemy;

    // コモンイベントから参照できるように
    // 現在ACT中の敵を保存
    $gameTemp._undertaleActEnemy =
        enemy;


    // ========================================================
    // ACTなし
    // ========================================================

    if (
        !act ||
        !enemy
    ) {

        SoundManager.playBuzzer();

        this._undertaleActWindow.activate();

        return;
    }


    SoundManager.playOk();


    this._undertaleActWindow.deactivate();

    this._undertaleActWindow.hide();

    // ========================================================
    // ACT決定後
    // コモンイベントの文章が出るまで
    // 敵グループ名を表示させない
    // ========================================================

    if (
        this._undertaleMessageWindow
    ) {

        this._undertaleMessageWindow.setText(
            ''
        );

        showUndertaleMainMessage(
            this
        );
    }


    // ========================================================
    // 見逃し可能フラグ
    //
    // <ACT_MERCY: ○○>
    // が付いているACTなら、この敵だけ見逃し可能にする
    // ========================================================

    if (
        act.mercyReady ===
            true
    ) {

        enemy._undertaleMercyReady =
            true;
    }


    // ========================================================
    // コモンイベント
    //
    // <ACT_EVENT: ○○, ID>
    // ========================================================

    if (
        act.commonEventId &&
        act.commonEventId > 0
    ) {

        $gameTemp.reserveCommonEvent(
            act.commonEventId
        );
    }


    // ========================================================
    // ACT終了
    // ========================================================

    this._undertaleMode =
        null;


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // 敵一覧の色更新
    // ========================================================

    if (
        this._enemyWindow
    ) {

        this._enemyWindow.refresh();
    }


    // ========================================================
    // プレイヤー側の行動を消す
    //
    // ACT自体を1ターンの行動として扱う
    // ========================================================

    var members =
        $gameParty.battleMembers();


    for (
        var i = 0;
        i < members.length;
        i++
    ) {

        members[i].clearActions();
    }


    // ========================================================
    // 敵ターンへ
    // ========================================================

    BattleManager._actorIndex =
        -1;


    BattleManager.startTurn();
};


// ============================================================
// アイテムキャンセル
//
// アイテム一覧
// ↓
// 4コマンド
// ============================================================

Scene_Battle.prototype.onUndertaleItemCancel =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    SoundManager.playCancel();


    this._undertaleItemWindow.deactivate();

    this._undertaleItemWindow.hide();


    this._undertaleMode =
        null;


    showUndertaleMainMessage(
        this
    );


    this._actorCommandWindow.show();

    this._actorCommandWindow.activate();

    this._actorCommandWindow.refresh();
};


// ============================================================
// アイテム決定
// ============================================================

// ============================================================
// アイテム決定
// ============================================================

Scene_Battle.prototype.onUndertaleItemOk =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    var item =
        this._undertaleItemWindow.item();


    var actor =
        BattleManager.actor();


    // ========================================================
    // 使用不可
    // ========================================================

    if (
        !item ||
        !actor ||
        !actor.canUse(item)
    ) {

        SoundManager.playBuzzer();

        this._undertaleItemWindow.activate();

        return;
    }


    SoundManager.playOk();


    this._undertaleItemWindow.deactivate();

    this._undertaleItemWindow.hide();


    // ========================================================
    // 使用前の状態を保存
    // ========================================================

    var oldHp =
        actor.hp;

    var oldMp =
        actor.mp;

    var oldTp =
        actor.tp;

    var oldStates =
        actor.states().slice();


    // ========================================================
    // アイテム使用
    // ========================================================

    actor.useItem(
        item
    );


    var action =
        new Game_Action(
            actor
        );


    action.setItemObject(
        item
    );


    // ========================================================
    // 使用者自身
    // ========================================================

    if (
        action.isForUser()
    ) {

        action.apply(
            actor
        );
    }


    // ========================================================
    // 味方対象
    //
    // 現在の仕様では1人戦闘を想定して
    // 使用者本人へ適用
    // ========================================================

    else if (
        action.isForFriend()
    ) {

        action.apply(
            actor
        );
    }


    // ========================================================
    // グローバル効果
    // ========================================================

    action.applyGlobal();


    // ========================================================
    // 使用後の変化を調べる
    // ========================================================

    var hpChange =
        actor.hp - oldHp;

    var mpChange =
        actor.mp - oldMp;

    var tpChange =
        actor.tp - oldTp;


    var newStates =
        actor.states();


    var addedStates =
        [];

    var removedStates =
        [];


    // --------------------------------------------------------
    // 追加されたステート
    // --------------------------------------------------------

    for (
        var i = 0;
        i < newStates.length;
        i++
    ) {

        if (
            oldStates.indexOf(
                newStates[i]
            ) < 0
        ) {

            addedStates.push(
                newStates[i]
            );
        }
    }


    // --------------------------------------------------------
    // 解除されたステート
    // --------------------------------------------------------

    for (
        var j = 0;
        j < oldStates.length;
        j++
    ) {

        if (
            newStates.indexOf(
                oldStates[j]
            ) < 0
        ) {

            removedStates.push(
                oldStates[j]
            );
        }
    }


    // ========================================================
    // 結果文章
    // ========================================================

    var resultLines =
        [];


    // --------------------------------------------------------
    // HP
    // --------------------------------------------------------

    if (
        hpChange > 0
    ) {

        resultLines.push(
            '＊ HPが' +
            hpChange +
            '回復した。'
        );

    } else if (
        hpChange < 0
    ) {

        resultLines.push(
            '＊ HPが' +
            Math.abs(hpChange) +
            '減った。'
        );
    }


    // --------------------------------------------------------
    // MP
    // --------------------------------------------------------

    if (
        mpChange > 0
    ) {

        resultLines.push(
            '＊ MPが' +
            mpChange +
            '回復した。'
        );

    } else if (
        mpChange < 0
    ) {

        resultLines.push(
            '＊ MPが' +
            Math.abs(mpChange) +
            '減った。'
        );
    }


    // --------------------------------------------------------
    // TP
    // --------------------------------------------------------

    if (
        tpChange > 0
    ) {

        resultLines.push(
            '＊ TPが' +
            tpChange +
            '増えた。'
        );

    } else if (
        tpChange < 0
    ) {

        resultLines.push(
            '＊ TPが' +
            Math.abs(tpChange) +
            '減った。'
        );
    }


    // --------------------------------------------------------
    // ステート付与
    // --------------------------------------------------------

    for (
        var k = 0;
        k < addedStates.length;
        k++
    ) {

        resultLines.push(
            '＊ ' +
            addedStates[k].name +
            'になった。'
        );
    }


    // --------------------------------------------------------
    // ステート解除
    // --------------------------------------------------------

    for (
        var l = 0;
        l < removedStates.length;
        l++
    ) {

        resultLines.push(
            '＊ ' +
            removedStates[l].name +
            'が治った。'
        );
    }


    // ========================================================
    // 何も変化しなかった
    // ========================================================

    if (
        resultLines.length === 0
    ) {

        resultLines.push(
            '＊ しかし 何も起こらなかった。'
        );
    }


    // ========================================================
    // 表示文章を作成
    // ========================================================

    var message =
        '＊ ' +
        actor.name() +
        'は' +
        item.name +
        'を使った。';


    // 最大3行まで表示
    for (
        var m = 0;
        m < resultLines.length &&
        m < 2;
        m++
    ) {

        message +=
            '\n' +
            resultLines[m];
    }


    // ========================================================
    // ステータス更新
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.refresh();
    }


    // ========================================================
    // 使用メッセージ
    // ========================================================

    if (
        this._undertaleMessageWindow
    ) {

        this._undertaleMessageWindow.setText(
            message
        );


        showUndertaleMainMessage(
            this
        );
    }


    // ========================================================
    // 決定キー待ち
    // ========================================================

    this._undertaleMode =
        'itemMessage';


    // 誤入力防止
    this._undertaleItemMessageWait =
        8;
};


// ============================================================
// みのがす：キャンセル
//
// Mercy一覧
// ↓
// 4コマンド
// ============================================================

Scene_Battle.prototype.onUndertaleMercyCancel =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    SoundManager.playCancel();


    this._undertaleMercyWindow.deactivate();

    this._undertaleMercyWindow.hide();


    this._undertaleMode =
        null;


    showUndertaleMainMessage(
        this
    );


    this._actorCommandWindow.show();

    this._actorCommandWindow.activate();

    this._actorCommandWindow.refresh();
};


// ============================================================
// 「みのがす」選択
//
// Mercy一覧
// ↓
// 敵選択
// ============================================================

Scene_Battle.prototype.onUndertaleSpare =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    SoundManager.playOk();


    this._undertaleMercyWindow.deactivate();

    this._undertaleMercyWindow.hide();


    this._undertaleMode =
        'mercyEnemy';


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // 敵一覧
    // ========================================================

    this._enemyWindow.refresh();

    this._enemyWindow.show();


    if (
        this._enemyWindow.maxItems() >
        0
    ) {

        this._enemyWindow.select(
            0
        );

    } else {

        this._enemyWindow.select(
            -1
        );
    }


    this._enemyWindow.activate();
};


// ============================================================
// 「逃げる」
// ============================================================

Scene_Battle.prototype.onUndertaleEscape =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    SoundManager.playOk();


    this._undertaleMercyWindow.deactivate();

    this._undertaleMercyWindow.hide();


    this._undertaleMode =
        null;


    // ========================================================
    // MV標準の逃走処理を使う
    // ========================================================

    BattleManager.processEscape();
};


// ============================================================
// 見逃し成功
// ============================================================

Scene_Battle.prototype.processUndertaleSpareSuccess =
function(enemy) {

    if (!enemy) {

        return;
    }


    // ========================================================
    // 敵を戦闘から非表示
    // ========================================================

    enemy.hide();


    $gameTroop.makeUniqueNames();


    // ========================================================
    // 状態
    // ========================================================

    this._undertaleMode =
        'mercySuccessMessage';


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // ステータス
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.refresh();
    }


    // ========================================================
    // メッセージ
    // ========================================================

    if (
        this._undertaleMessageWindow
    ) {

        this._undertaleMessageWindow.setText(
            '＊ ' +
            enemy.name() +
            'を見逃した。'
        );


        showUndertaleMainMessage(
            this
        );
    }


    // ========================================================
    // 決定キー誤入力防止
    // ========================================================

    this._undertaleMercyMessageWait =
        8;
};


// ============================================================
// 見逃し失敗
// ============================================================

Scene_Battle.prototype.processUndertaleSpareFailure =
function(enemy) {

    if (!enemy) {

        return;
    }


    // ========================================================
    // 状態
    // ========================================================

    this._undertaleMode =
        'mercyFailMessage';


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // メッセージ
    // ========================================================

    if (
        this._undertaleMessageWindow
    ) {

        this._undertaleMessageWindow.setText(
            '＊ ' +
            enemy.name() +
            'はまだ見逃せない。'
        );


        showUndertaleMainMessage(
            this
        );
    }


    // ========================================================
    // プレイヤー行動を消す
    // ========================================================

    var members =
        $gameParty.battleMembers();


    for (
        var i = 0;
        i < members.length;
        i++
    ) {

        members[i].clearActions();
    }


    // ========================================================
    // 決定キー誤入力防止
    // ========================================================

    this._undertaleMercyMessageWait =
        8;
};

// ============================================================
// 敵選択 OK / Cancel
//
// ここでは
//
// 1. 通常攻撃
// 2. ACT
// 3. みのがす
//
// の3種類を _undertaleMode で振り分ける。
//
// ★ onEnemyOk はこのプラグイン内でここだけ定義する
// ★ onEnemyCancel もここだけ定義する
// ============================================================


// ============================================================
// MV標準処理を保存
// ============================================================

var _UT_SceneBattle_onEnemyOk =
    Scene_Battle.prototype.onEnemyOk;


var _UT_SceneBattle_onEnemyCancel =
    Scene_Battle.prototype.onEnemyCancel;


var _UT_SceneBattle_commandAttack =
    Scene_Battle.prototype.commandAttack;


// ============================================================
// 「たたかう」
//
// ON:
// 通常攻撃をセット
// ↓
// 敵選択
//
// OFF:
// MV標準
// ============================================================

Scene_Battle.prototype.commandAttack =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_commandAttack.call(
            this
        );

        return;
    }


    // ========================================================
    // 現在入力中の行動
    // ========================================================

    var action =
        BattleManager.inputtingAction();


    if (!action) {

        SoundManager.playBuzzer();


        this._actorCommandWindow.activate();


        return;
    }


    // ========================================================
    // 通常攻撃
    // ========================================================

    action.setAttack();


    // ========================================================
    // 通常攻撃の敵選択であることを明示
    //
    // nullのままでも判別できるが、
    // 今回は状態を明確にするため専用モードを使う
    // ========================================================

    this._undertaleMode =
        'attackEnemy';


    this._undertaleSelectedEnemy =
        null;


    // ========================================================
    // 4コマンド停止
    // ========================================================

    this._actorCommandWindow.deactivate();


    // ========================================================
    // 中央通常文章を隠す
    // ========================================================

    hideUndertaleMainMessage(
        this
    );


    // ========================================================
    // 敵一覧
    // ========================================================

    this._enemyWindow.refresh();

    this._enemyWindow.show();


    if (
        this._enemyWindow.maxItems() >
        0
    ) {

        this._enemyWindow.select(
            0
        );

    } else {

        this._enemyWindow.select(
            -1
        );
    }


    this._enemyWindow.activate();
};


// ============================================================
// 敵選択 OK
//
// ★この関数はここで1回だけ定義
// ============================================================

Scene_Battle.prototype.onEnemyOk =
function() {

    // ========================================================
    // OFF
    // → MV標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_onEnemyOk.call(
            this
        );

        return;
    }


    // ========================================================
    // 選択された敵
    // ========================================================

    var enemy =
        this._enemyWindow.enemy();


    if (!enemy) {

        SoundManager.playBuzzer();


        this._enemyWindow.activate();


        return;
    }


    // ========================================================
    // ACT用 敵選択
    // ========================================================

    if (
        this._undertaleMode ===
        'actEnemy'
    ) {

        this.onUndertaleActEnemyOk(
            enemy
        );


        return;
    }


    // ========================================================
    // みのがす用 敵選択
    // ========================================================

    if (
        this._undertaleMode ===
        'mercyEnemy'
    ) {

        SoundManager.playOk();


        this._enemyWindow.deactivate();

        this._enemyWindow.hide();


        // ====================================================
        // 見逃し可能
        // ====================================================

        if (
            enemy._undertaleMercyReady ===
            true
        ) {

            this.processUndertaleSpareSuccess(
                enemy
            );


            return;
        }


        // ====================================================
        // まだ見逃せない
        // ====================================================

        this.processUndertaleSpareFailure(
            enemy
        );


        return;
    }


    // ========================================================
    // 通常攻撃
    // ========================================================

    if (
        this._undertaleMode ===
        'attackEnemy'
    ) {

        SoundManager.playOk();


        var action =
            BattleManager.inputtingAction();


        if (!action) {

            SoundManager.playBuzzer();


            this._enemyWindow.activate();


            return;
        }


        // ====================================================
        // 攻撃対象設定
        // ====================================================

        action.setTarget(
            enemy.index()
        );


        // ====================================================
        // 敵選択終了
        // ====================================================

        this._enemyWindow.deactivate();

        this._enemyWindow.hide();


        this._undertaleMode =
            null;


        this._undertaleSelectedEnemy =
            null;


        // ====================================================
        // 1人分の入力完了
        //
        // Undertale式ではそのままターン開始
        // ====================================================

        BattleManager.startTurn();


        return;
    }


    // ========================================================
    // 想定外
    //
    // Undertale ON中にここへ来た場合は
    // 標準処理へ流さず安全に敵選択へ戻す
    // ========================================================

    SoundManager.playBuzzer();


    this._enemyWindow.activate();
};


// ============================================================
// 敵選択 Cancel
//
// ★この関数もここで1回だけ定義
// ============================================================

Scene_Battle.prototype.onEnemyCancel =
function() {

    // ========================================================
    // OFF
    // → MV標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_onEnemyCancel.call(
            this
        );

        return;
    }


    // ========================================================
    // ACT敵選択からキャンセル
    //
    // 敵一覧
    // ↓
    // 4コマンド
    // ========================================================

    if (
        this._undertaleMode ===
        'actEnemy'
    ) {

        SoundManager.playCancel();


        this._enemyWindow.deactivate();

        this._enemyWindow.hide();


        this._undertaleMode =
            null;


        this._undertaleSelectedEnemy =
            null;


        // ====================================================
        // 通常文章
        // ====================================================

        this.showUndertaleDefaultMessage();


        // ====================================================
        // 4コマンド
        // ====================================================

        this._actorCommandWindow.show();

        this._actorCommandWindow.activate();

        this._actorCommandWindow.refresh();


        return;
    }


    // ========================================================
    // みのがす敵選択からキャンセル
    //
    // 敵一覧
    // ↓
    // 「みのがす / 逃げる」
    // ========================================================

    if (
        this._undertaleMode ===
        'mercyEnemy'
    ) {

        SoundManager.playCancel();


        this._enemyWindow.deactivate();

        this._enemyWindow.hide();


        this._undertaleMode =
            'mercyCommand';


        // ====================================================
        // Mercyウィンドウへ戻す
        // ====================================================

        this._undertaleMercyWindow.show();


        this._undertaleMercyWindow.select(
            0
        );


        this._undertaleMercyWindow.activate();

        this._undertaleMercyWindow.refresh();


        return;
    }


    // ========================================================
    // 通常攻撃の敵選択からキャンセル
    //
    // 敵一覧
    // ↓
    // 4コマンド
    // ========================================================

    if (
        this._undertaleMode ===
        'attackEnemy'
    ) {

        SoundManager.playCancel();


        this._enemyWindow.deactivate();

        this._enemyWindow.hide();


        this._undertaleMode =
            null;


        this._undertaleSelectedEnemy =
            null;


        // ====================================================
        // 入力中アクションを通常攻撃選択前へ戻す
        //
        // clear()すると現在アクションそのものを
        // BattleManagerから失わせる可能性があるので、
        // ここでは対象選択を解除するだけにする
        // ====================================================

        var action =
            BattleManager.inputtingAction();


        if (action) {

            action.setTarget(
                -1
            );
        }


        // ====================================================
        // 通常文章
        // ====================================================

        this.showUndertaleDefaultMessage();


        // ====================================================
        // 4コマンド
        // ====================================================

        this._actorCommandWindow.show();

        this._actorCommandWindow.activate();

        this._actorCommandWindow.refresh();


        return;
    }


    // ========================================================
    // 想定外
    //
    // ON中は標準onEnemyCancelへ渡さない。
    // 標準パーティコマンドへ戻ってしまうのを防ぐ。
    // ========================================================

    SoundManager.playCancel();


    this._enemyWindow.deactivate();

    this._enemyWindow.hide();


    this._undertaleMode =
        null;


    this._undertaleSelectedEnemy =
        null;


    this.showUndertaleDefaultMessage();


    this._actorCommandWindow.show();

    this._actorCommandWindow.activate();

    this._actorCommandWindow.refresh();
};


// ============================================================
// Scene_Battle selectNextCommand
//
// OFF:
// MV標準
//
// ON:
// プレイヤーの通常攻撃入力完了後などに
// 複数人分の標準コマンド入力へ進ませない。
// ============================================================

var _UT_SceneBattle_selectNextCommand =
    Scene_Battle.prototype.selectNextCommand;


Scene_Battle.prototype.selectNextCommand =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_selectNextCommand.call(
            this
        );


        return;
    }


    // ========================================================
    // ON
    //
    // Undertale式では1回の選択を1ターンとして扱う
    // ========================================================

    BattleManager.startTurn();
};


// ============================================================
// Scene_Battle selectPreviousCommand
//
// OFF:
// MV標準
//
// ON:
// 標準パーティコマンドへ戻る挙動を防ぐ
// ============================================================

var _UT_SceneBattle_selectPreviousCommand =
    Scene_Battle.prototype.selectPreviousCommand;


Scene_Battle.prototype.selectPreviousCommand =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_SceneBattle_selectPreviousCommand.call(
            this
        );


        return;
    }


    // ========================================================
    // 特殊選択中は
    // 各専用キャンセル処理に任せる
    // ========================================================

    if (
        this._undertaleMode
    ) {

        return;
    }


    // ========================================================
    // ONではパーティコマンドへ戻さない
    //
    // 現在の4コマンドをそのまま再アクティブ化
    // ========================================================

    if (
        this._actorCommandWindow
    ) {

        this._actorCommandWindow.show();

        this._actorCommandWindow.activate();

        this._actorCommandWindow.refresh();
    }


    this.showUndertaleDefaultMessage();
};

// ============================================================
// BattleLog
//
// Undertale UI ON:
// 標準BattleLogの文章を中央メッセージ枠へ転送
//
// Undertale UI OFF:
// MV標準処理
// ============================================================


// ============================================================
// 標準処理保存
// ============================================================

var _UT_BattleLog_addText =
    Window_BattleLog.prototype.addText;


var _UT_BattleLog_clear =
    Window_BattleLog.prototype.clear;


var _UT_BattleLog_standardBackOpacity =
    Window_BattleLog.prototype.standardBackOpacity;


var _UT_BattleLog_refresh =
    Window_BattleLog.prototype.refresh;


// ============================================================
// BattleLog文章追加
// ============================================================

Window_BattleLog.prototype.addText =
function(text) {



    // ========================================================
    // Undertale UI ON時
    // MV標準の戦闘開始「○○が出現！」だけ捨てる
    // ========================================================

    if (
        isUndertaleBattleUIEnabled() &&
        text !== undefined &&
        text !== null
    ) {

        var startText =
            String(text);

        var emergeText =
            TextManager.emerge;

        if (
            emergeText
        ) {

            var escaped =
                emergeText.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                );

            escaped =
                escaped.replace(
                    '%1',
                    '.+'
                );

            var emergeRegex =
                new RegExp(
                    '^' +
                    escaped +
                    '$'
                );

            if (
                emergeRegex.test(
                    startText
                )
            ) {
                return;
            }
        }
    }

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_BattleLog_addText.call(
            this,
            text
        );


        return;
    }


    // ========================================================
    // ON
    // ========================================================

    var scene =
        SceneManager._scene;


    // --------------------------------------------------------
    // Scene_Battleでなければ標準
    // --------------------------------------------------------

    if (
        !scene ||
        !(scene instanceof Scene_Battle)
    ) {

        _UT_BattleLog_addText.call(
            this,
            text
        );


        return;
    }

    // --------------------------------------------------------
    // 空文字
    // --------------------------------------------------------

    if (
        text === undefined ||
        text === null ||
        String(text).length === 0
    ) {

        return;
    }


    // --------------------------------------------------------
    // 中央メッセージ枠がまだない場合
    // --------------------------------------------------------

    if (
        !scene._undertaleMessageWindow
    ) {

        _UT_BattleLog_addText.call(
            this,
            text
        );


        return;
    }


    // ========================================================
    // 表示文章保存
    // ========================================================

    if (
        !scene._undertaleBattleLogLines
    ) {

        scene._undertaleBattleLogLines =
            [];
    }


    var line =
        String(text);


    // ========================================================
    // Undertale式「＊ 」を付ける
    // ========================================================

    if (
        line.indexOf('＊') !== 0
    ) {

        line =
            '＊ ' +
            line;
    }


    scene._undertaleBattleLogLines.push(
        line
    );


    // ========================================================
    // 最大行数
    // ========================================================

    while (
        scene._undertaleBattleLogLines.length >
        MESSAGE_MAX_LINES
    ) {

        scene._undertaleBattleLogLines.shift();
    }


    // ========================================================
    // 中央枠へ表示
    // ========================================================

    scene._undertaleMessageWindow.setText(
        scene._undertaleBattleLogLines.join(
            '\n'
        )
    );


    showUndertaleMainMessage(
        scene
    );


    // ========================================================
    // ★正常版と同じ
    //
    // ON時は標準addTextを呼ばない。
    // 中央枠への転送だけ行う。
    // ========================================================

    return;
};


// ============================================================
// BattleLog clear
// ============================================================

Window_BattleLog.prototype.clear =
function() {

    _UT_BattleLog_clear.call(
        this
    );


    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    var scene =
        SceneManager._scene;


    if (
        scene &&
        scene instanceof Scene_Battle
    ) {

        scene._undertaleBattleLogLines =
            [];
    }
};


// ============================================================
// BattleLog背景
// ============================================================

Window_BattleLog.prototype.standardBackOpacity =
function() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return _UT_BattleLog_standardBackOpacity.call(
            this
        );
    }


    return 0;
};


// ============================================================
// BattleLog描画
//
// ON時は標準BattleLogの文字を画面上に描画しない。
// 中央枠だけに表示する。
// ============================================================

Window_BattleLog.prototype.refresh =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_BattleLog_refresh.call(
            this
        );


        return;
    }


    // ========================================================
    // ON
    // ========================================================

    if (
        this.contents
    ) {

        this.contents.clear();
    }
};

// ============================================================
// BattleManager.endAction
//
// 正常版と同じ方式
//
// 行動終了
// ↓
// 標準endActionを先に実行
// ↓
// ログがあった場合だけ決定待ち
// ============================================================

var _UT_BattleManager_endAction =
    BattleManager.endAction;


BattleManager.endAction =
function() {

    // ========================================================
    // OFFなら完全に標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_BattleManager_endAction.call(
            this
        );

        return;
    }


    var scene =
        SceneManager._scene;


    // ========================================================
    // Scene_Battleでなければ標準
    // ========================================================

    if (
        !scene ||
        !(scene instanceof Scene_Battle)
    ) {

        _UT_BattleManager_endAction.call(
            this
        );

        return;
    }


    // ========================================================
    // 今回の行動で中央ログが作られたか
    // ========================================================

    var hadUndertaleLog =
        scene._undertaleBattleLogLines &&
        scene._undertaleBattleLogLines.length > 0;


    // ========================================================
    // ★重要
    //
    // 正常版と同じく
    // 標準endActionを「先に」完了させる
    // ========================================================

    _UT_BattleManager_endAction.call(
        this
    );


    // ========================================================
    // ログがあった場合
    // ========================================================

    if (
        hadUndertaleLog
    ) {

        this._undertaleLogWait =
            true;


        // 正常版と同じ10フレーム
        this._undertaleLogWaitCount =
            10;
    }
};

// ============================================================
// BattleManager.update
//
// 正常版方式の戦闘ログ決定待ち
// ============================================================

var _UT_BattleManager_update =
    BattleManager.update;


BattleManager.update =
function() {

    // ========================================================
    // Undertale UI ON時だけ独自ログ待ち
    // ========================================================

    if (
        isUndertaleBattleUIEnabled() &&
        this._undertaleLogWait
    ) {

        // ----------------------------------------------------
        // 決定直後の入力を少し無視
        // 正常版と同じ
        // ----------------------------------------------------

        if (
            this._undertaleLogWaitCount >
            0
        ) {

            this._undertaleLogWaitCount--;

            return;
        }


        // ----------------------------------------------------
        // 決定待ち
        // ----------------------------------------------------

        if (
            Input.isTriggered('ok') ||
            TouchInput.isTriggered()
        ) {

            SoundManager.playOk();


            this._undertaleLogWait =
                false;


            this._undertaleLogWaitCount =
                0;


            // ------------------------------------------------
            // 表示したログを消す
            // 次の行動ログと混ざらないようにする
            // ------------------------------------------------

            var scene =
                SceneManager._scene;


            if (
                scene &&
                scene instanceof Scene_Battle
            ) {

                scene._undertaleBattleLogLines =
                    [];


                if (
                    scene._undertaleMessageWindow
                ) {

                    scene
                        ._undertaleMessageWindow
                        .setText('');
                }
            }

        } else {

            // 決定されるまで戦闘進行停止
            return;
        }
    }


    // ========================================================
    // 通常のBattleManager更新
    // ========================================================

    _UT_BattleManager_update.call(
        this
    );
};


// ------------------------------------------------------------
// 現在Undertale戦闘中か
// ------------------------------------------------------------

function isUndertaleBattleMessageMode() {

    if (
        !isUndertaleBattleUIEnabled()
    ) {
        return false;
    }


    var scene =
        SceneManager._scene;


    if (
        !scene ||
        !(scene instanceof Scene_Battle)
    ) {
        return false;
    }


    if (
        !scene._undertaleMessageWindow
    ) {
        return false;
    }


    return true;
}


// ============================================================
// Window_Message.startMessage
//
// 戦闘中＋Undertale UI ON:
//
// $gameMessage に入った文章を
// Undertale中央枠へ転送する。
// ============================================================

var _UT_WindowMessage_startMessage =
    Window_Message.prototype.startMessage;


Window_Message.prototype.startMessage =
function() {

    // ========================================================
    // 通常時
    // ========================================================

    if (
        !isUndertaleBattleMessageMode()
    ) {

        _UT_WindowMessage_startMessage.call(
            this
        );

        return;
    }


    var scene =
        SceneManager._scene;


    // ========================================================
    // $gameMessage の全文取得
    // ========================================================

    var texts =
        $gameMessage._texts || [];


    // ========================================================
    // ★戦闘開始時の「○○が出現！」を判定
    //
    // MV標準の出現メッセージは
    // TextManager.emerge = "%1が出現！"
    // ========================================================

    var isStartEnemyMessage =
        false;


    if (
        texts.length > 0 &&
        TextManager.emerge
    ) {

        var emergeFormat =
            String(
                TextManager.emerge
            );


        // %1 の前後を取得
        var emergeParts =
            emergeFormat.split(
                '%1'
            );


        var emergePrefix =
            emergeParts[0] || '';


        var emergeSuffix =
            emergeParts.length > 1
                ? emergeParts[1]
                : '';


        // 全行が「○○が出現！」なら
        // 戦闘開始メッセージとみなす
        isStartEnemyMessage =
            true;


        for (
            var e = 0;
            e < texts.length;
            e++
        ) {

            var enemyText =
                String(
                    texts[e] || ''
                );


            var prefixOk =
                emergePrefix === '' ||
                enemyText.indexOf(
                    emergePrefix
                ) === 0;


            var suffixOk =
                emergeSuffix === '' ||
                enemyText.slice(
                    -emergeSuffix.length
                ) === emergeSuffix;


            if (
                !prefixOk ||
                !suffixOk
            ) {

                isStartEnemyMessage =
                    false;

                break;
            }
        }
    }


    if (
        isStartEnemyMessage
    ) {

        // ========================================================
        // 戦闘開始時の「○○が出現！」は
        //
        // ・中央枠へ表示しない
        // ・標準Window_Messageも開始しない
        // ・決定待ちもしない
        //
        // 完全に消費して終了する
        // ========================================================

        $gameMessage.clear();


        // Undertale側も文章待ちにしない
        scene._undertaleCommonMessageActive =
            false;

        scene._undertaleCommonMessageWait =
            0;


        return;
    }


    // ========================================================
    // ここから通常のACT等の文章
    // ========================================================

    var lines =
        [];


    for (
        var i = 0;
        i < texts.length;
        i++
    ) {

        var text =
            String(
                texts[i] || ''
            );


        // ----------------------------------------------------
        // 各行の先頭に「＊ 」
        // ----------------------------------------------------

        if (
            text.indexOf('＊') !== 0
        ) {

            text =
                '＊ ' +
                text;
        }


        lines.push(
            text
        );
    }


    // ========================================================
    // 中央枠へ表示
    // ========================================================

    scene._undertaleMessageWindow.setText(
        lines.join('\n')
    );


    showUndertaleMainMessage(
        scene
    );


    // ========================================================
    // ACTイベント文章待ち
    // ========================================================

    scene._undertaleCommonMessageActive =
        true;


    scene._undertaleCommonMessageWait =
        8;


    // ========================================================
    // 標準Window_Messageは
    // 内部処理だけ開始する
    // ========================================================

    _UT_WindowMessage_startMessage.call(
        this
    );


    // ========================================================
    // 見た目だけ消す
    // ========================================================

    this.opacity =
        0;


    this.backOpacity =
        0;


    this.contentsOpacity =
        0;
};

// ============================================================
// Window_Message.update
//
// Undertale戦闘中は標準メッセージを透明に保つ
// ============================================================

var _UT_WindowMessage_update =
    Window_Message.prototype.update;


Window_Message.prototype.update =
function() {

    _UT_WindowMessage_update.call(
        this
    );


    if (
        isUndertaleBattleMessageMode()
    ) {

        this.opacity =
            0;


        this.backOpacity =
            0;


        this.contentsOpacity =
            0;
    }
};

// ============================================================
// Scene_Battle update
//
// Undertale独自の「決定キー待ち」をここでまとめて処理する
//
// ★ Scene_Battle.prototype.update は
//   このプラグイン内でここだけ上書きする
// ============================================================

var _UT_SceneBattle_update =
    Scene_Battle.prototype.update;


Scene_Battle.prototype.update =
function() {

    // ========================================================
    // まずMV標準update
    //
    // OFFでもONでも標準BattleManager等は動かす
    // ========================================================

    _UT_SceneBattle_update.call(
        this
    );


    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


// ============================================================
// コモンイベント文章
// 決定キー待ち
// ============================================================

if (
    this._undertaleCommonMessageActive ===
    true
) {

    // --------------------------------------------------------
    // 押しっぱなし防止
    // --------------------------------------------------------

    if (
        this._undertaleCommonMessageWait >
        0
    ) {

        this._undertaleCommonMessageWait--;


        return;
    }


    // --------------------------------------------------------
    // 決定
    // --------------------------------------------------------

    if (
        Input.isTriggered('ok') ||
        TouchInput.isTriggered()
    ) {

        SoundManager.playOk();


        // ====================================================
        // Window_Messageへ決定入力を渡す
        //
        // 標準Window_Message自身が次の文章・終了を管理する
        // ====================================================

        if (
            this._messageWindow
        ) {

            this._messageWindow._pauseSkip =
                true;


            this._messageWindow.pause =
                false;


            this._messageWindow.terminateMessage();
        }


        this._undertaleCommonMessageActive =
            false;


        this._undertaleCommonMessageWait =
            0;
    }


    return;
}
    // ========================================================
    // イベントの「文章の表示」などが出ている間は
    // Undertale中央枠を隠す
    // ========================================================

    if (
        $gameMessage.isBusy() &&
        !this._undertaleCommonMessageActive
    ) {

        hideUndertaleMainMessage(
            this
        );

    } else {

        // ----------------------------------------------------
        // 選択ウィンドウ表示中でなければ
        // 中央メッセージを表示
        // ----------------------------------------------------

        if (
            !this._undertaleMode ||
            this._undertaleMode ===
                'itemMessage' ||
            this._undertaleMode ===
                'mercyFailMessage' ||
            this._undertaleMode ===
                'mercySuccessMessage' ||
            this._undertaleMode ===
                'battleLogMessage'
        ) {

            if (
                this._undertaleMessageWindow
            ) {

                this._undertaleMessageWindow.show();
            }
        }
    }


    // ========================================================
    // アイテム使用メッセージ
    // ========================================================

    if (
        this._undertaleMode ===
        'itemMessage'
    ) {

        if (
            this._undertaleItemMessageWait >
            0
        ) {

            this._undertaleItemMessageWait--;


            return;
        }


        if (
            Input.isTriggered('ok') ||
            TouchInput.isTriggered()
        ) {

            SoundManager.playOk();


            this._undertaleMode =
                null;


            this._undertaleItemMessageWait =
                0;


            // ================================================
            // プレイヤー行動を消す
            // ================================================

            var itemMembers =
                $gameParty.battleMembers();


            for (
                var i = 0;
                i < itemMembers.length;
                i++
            ) {

                itemMembers[i].clearActions();
            }


            // ================================================
            // 敵ターンへ
            // ================================================

            BattleManager._actorIndex =
                -1;


            BattleManager.startTurn();
        }


        return;
    }


    // ========================================================
    // 見逃し失敗
    // ========================================================

    if (
        this._undertaleMode ===
        'mercyFailMessage'
    ) {

        if (
            this._undertaleMercyMessageWait >
            0
        ) {

            this._undertaleMercyMessageWait--;


            return;
        }


        if (
            Input.isTriggered('ok') ||
            TouchInput.isTriggered()
        ) {

            SoundManager.playOk();


            this._undertaleMode =
                null;


            this._undertaleMercyMessageWait =
                0;


            // ================================================
            // 「まだ見逃せない。」
            // ↓
            // 敵ターン
            // ================================================

            BattleManager._actorIndex =
                -1;


            BattleManager.startTurn();
        }


        return;
    }


    // ========================================================
    // 見逃し成功
    // ========================================================

    if (
        this._undertaleMode ===
        'mercySuccessMessage'
    ) {

        if (
            this._undertaleMercyMessageWait >
            0
        ) {

            this._undertaleMercyMessageWait--;


            return;
        }


        if (
            Input.isTriggered('ok') ||
            TouchInput.isTriggered()
        ) {

            SoundManager.playOk();


            this._undertaleMode =
                null;


            this._undertaleMercyMessageWait =
                0;


            // ================================================
            // 敵が全員いなくなった
            // ================================================

            if (
                $gameTroop.aliveMembers().length ===
                0
            ) {

                BattleManager.checkBattleEnd();


                return;
            }


            // ================================================
            // まだ敵が残っている
            // ================================================

            var mercyMembers =
                $gameParty.battleMembers();


            for (
                var m = 0;
                m < mercyMembers.length;
                m++
            ) {

                mercyMembers[m].clearActions();
            }


            BattleManager._actorIndex =
                -1;


            BattleManager.startTurn();
        }


        return;
    }

// ============================================================
// BattleManager.startBattle
//
// 戦闘開始時
// ・見逃しフラグを戦闘ごとにリセット
//
// スイッチ等は使わない。
// 各 Game_Enemy インスタンスにだけ保持する。
// ============================================================

var _UT_BattleManager_startBattle =
    BattleManager.startBattle;


BattleManager.startBattle =
function() {

    // ========================================================
    // OFF
    // → 完全にMV標準
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_BattleManager_startBattle.call(
            this
        );

        return;
    }


    // ========================================================
    // ON
    //
    // MV標準startBattleの中で呼ばれる
    // displayStartMessagesだけ一時的に殺す
    // ========================================================

    var savedDisplayStartMessages =
        this.displayStartMessages;


    this.displayStartMessages =
    function() {

        // 何もしない

    };


    // ========================================================
    // MV標準startBattle
    // ========================================================

    _UT_BattleManager_startBattle.call(
        this
    );


    // ========================================================
    // 元に戻す
    // ========================================================

    this.displayStartMessages =
        savedDisplayStartMessages;

};


// ============================================================
// BattleManager.displayStartMessages
//
// ON:
// 標準の
//
// 「○○が出現！」
//
// を表示しない。
//
// 中央枠では敵グループ名を表示する。
//
// OFF:
// MV標準
// ============================================================

var _UT_BattleManager_displayStartMessages =
    BattleManager.displayStartMessages;


BattleManager.displayStartMessages =
function() {

    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        _UT_BattleManager_displayStartMessages.call(
            this
        );


        return;
    }


    // ========================================================
    // ON
    //
    // 何もしない
    // ========================================================
};


// ============================================================
// BattleManager.endBattle
//
// 戦闘終了時
// 見逃しフラグを掃除
// ============================================================

var _UT_BattleManager_endBattle =
    BattleManager.endBattle;


BattleManager.endBattle =
function(result) {

    // ========================================================
    // ONの場合のみ掃除
    // ========================================================

    if (
        isUndertaleBattleUIEnabled()
    ) {

        var enemies =
            $gameTroop.members();


        for (
            var i = 0;
            i < enemies.length;
            i++
        ) {

            enemies[i]._undertaleMercyReady =
                false;
        }
    }


    // ========================================================
    // MV標準
    // ========================================================

    _UT_BattleManager_endBattle.call(
        this,
        result
    );
};


// ============================================================
// Scene_Battle terminate
//
// Scene側の独自状態を掃除
// ============================================================

var _UT_SceneBattle_terminate =
    Scene_Battle.prototype.terminate;

Scene_Battle.prototype.terminate =
function() {

    // ========================================================
    // Undertale独自状態
    // ========================================================

    this._undertaleMode =
        null;

    this._undertaleSelectedEnemy =
        null;

    this._undertaleBattleLogLines =
        null;

    this._undertaleItemMessageWait =
        0;

    this._undertaleMercyMessageWait =
        0;

    this._undertaleBattleLogMessageWait =
        0;

    this._undertaleCommonMessageActive =
        false;

    this._undertaleCommonMessageWait =
        0;


    // ========================================================
    // Scene側に残る可能性がある戦闘状態もリセット
    // ========================================================

    this._undertaleBattlePaused =
        false;

    this._undertalePendingEndAction =
        false;


    // ========================================================
    // BattleManager側に残る状態をリセット
    //
    // BattleManagerは戦闘終了後も残るため、
    // 次の戦闘へ持ち越さないようここで確実に消す
    // ========================================================

    BattleManager._undertaleLogWait =
        false;

    BattleManager._undertaleLogWaitCount =
        0;


    // ========================================================
    // MV標準
    // ========================================================

    _UT_SceneBattle_terminate.call(
        this
    );
};


// ============================================================
// BattleLogウィンドウ
//
// ON時は画面上から完全に見えなくする。
// BattleLog内部の処理自体は残す。
// ============================================================

var _UT_SceneBattle_createLogWindow =
    Scene_Battle.prototype.createLogWindow;


Scene_Battle.prototype.createLogWindow =
function() {

    // ========================================================
    // MV標準生成
    // ========================================================

    _UT_SceneBattle_createLogWindow.call(
        this
    );


    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // ON
    //
    // BattleLogは処理用として存在させるが
    // 見た目は完全透明
    // ========================================================

    if (
        this._logWindow
    ) {

        this._logWindow.opacity =
            0;


        this._logWindow.backOpacity =
            0;
    }
};


// ============================================================
// 戦闘開始時のScene側初期化
// ============================================================

var _UT_SceneBattle_start =
    Scene_Battle.prototype.start;


Scene_Battle.prototype.start =
function() {

    // ========================================================
    // MV標準
    // ========================================================

    _UT_SceneBattle_start.call(
        this
    );


    // ========================================================
    // OFF
    // ========================================================

    if (
        !isUndertaleBattleUIEnabled()
    ) {

        return;
    }


    // ========================================================
    // Undertale状態初期化
    // ========================================================

    this._undertaleMode =
        null;


    this._undertaleSelectedEnemy =
        null;


    this._undertaleBattleLogLines =
        [];

    this._undertaleBattlePaused =
        false;

    this._undertalePendingEndAction =
        false;

    this._undertaleItemMessageWait =
        0;


    this._undertaleMercyMessageWait =
        0;


    this._undertaleBattleLogMessageWait =
        0;

    this._undertaleCommonMessageActive =
        false;


    this._undertaleCommonMessageWait =
        0;

    BattleManager._undertaleLogWait =
        false;

    BattleManager._undertaleLogWaitCount =
        0;


    // ========================================================
    // 標準パーティコマンドを隠す
    // ========================================================

    if (
        this._partyCommandWindow
    ) {

        this._partyCommandWindow.deactivate();

        this._partyCommandWindow.close();

        this._partyCommandWindow.hide();

        this._partyCommandWindow.visible =
            false;
    }


    // ========================================================
    // ステータス位置を最終確認
    // ========================================================

    if (
        this._statusWindow
    ) {

        this._statusWindow.move(
            0,
            statusY(),
            Graphics.boxWidth,
            STATUS_HEIGHT
        );


        this._statusWindow.createContents();


        this._statusWindow.opacity =
            0;


        this._statusWindow.backOpacity =
            0;


        this._statusWindow.show();

        this._statusWindow.refresh();
    }


    // ========================================================
    // ActorCommand位置を最終確認
    // ========================================================

    if (
        this._actorCommandWindow
    ) {

        this._actorCommandWindow.move(
            0,
            commandY(),
            Graphics.boxWidth,
            COMMAND_HEIGHT
        );


        this._actorCommandWindow.createContents();


        this._actorCommandWindow.opacity =
            0;


        this._actorCommandWindow.backOpacity =
            0;
    }


    // ========================================================
    // 中央メッセージ枠
    // ========================================================

    if (
        this._undertaleMessageWindow
    ) {

        this.showUndertaleDefaultMessage();
    }
};


// ============================================================
// プラグイン終了
// ============================================================
}
})();