(function() {
'use strict';
var COMMAND_HEIGHT = 100;
var STATUS_HEIGHT = 90;
var MESSAGE_SIDE_MARGIN = 25;
var MESSAGE_TOP_Y = 290;
var MAIN_BOX_STATUS_GAP = 4;
var MESSAGE_BORDER_SIZE = 4;
var MESSAGE_BACKGROUND_COLOR = '#000000';
var MESSAGE_BORDER_COLOR = '#ffffff';
var MESSAGE_TEXT_COLOR = '#ffffff';
var MESSAGE_FONT_SIZE = 24;
var MESSAGE_MAX_LINES = 3;
var MESSAGE_LINE_HEIGHT = 38;
var MESSAGE_TEXT_X = 25;
var MESSAGE_TEXT_Y = 16;
var SIDE_MARGIN = 12;
var BUTTON_GAP = 12;
var BUTTON_MARGIN_Y = 8;
var BUTTON_BORDER_SIZE = 4;
var BUTTON_BACKGROUND_COLOR = '#000000';
var BUTTON_SELECTED_COLOR = '#663d00';
var BUTTON_BORDER_COLOR = '#ff9900';
var BUTTON_TEXT_COLOR = '#ff9900';
var STATUS_NAME_COLOR = '#ffffff';
var STATUS_HP_LABEL_COLOR = '#ffffff';
var STATUS_HP_VALUE_COLOR = '#ffffff';
var STATUS_FONT_SIZE = 22;
var NAME_HP_GAP = 10;
var HP_VALUE_GAP = 8;
var STATUS_SIDE_MARGIN = 15;
var LIST_COLS = 2;
var LIST_ROWS = 3;
var LIST_SIDE_MARGIN = 20;
var LIST_TOP_MARGIN = 8;
var LIST_BOTTOM_MARGIN = 8;
var LIST_COLUMN_GAP = 20;
var LIST_FONT_SIZE = 24;
function commandY() {
return Graphics.boxHeight - COMMAND_HEIGHT;
}
function statusY() {
return commandY() - STATUS_HEIGHT + 30;
}
function messageY() {
return MESSAGE_TOP_Y;
}
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
function drawMainBox(win) {
if (!win || !win.contents) return;
var w = win.contentsWidth();
var h = win.contentsHeight();
var s = MESSAGE_BORDER_SIZE;
win.contents.fillRect(
0,
0,
w,
h,
MESSAGE_BACKGROUND_COLOR
);
win.contents.fillRect(
0,
0,
w,
s,
MESSAGE_BORDER_COLOR
);
win.contents.fillRect(
0,
h - s,
w,
s,
MESSAGE_BORDER_COLOR
);
win.contents.fillRect(
0,
0,
s,
h,
MESSAGE_BORDER_COLOR
);
win.contents.fillRect(
w - s,
0,
s,
h,
MESSAGE_BORDER_COLOR
);
}
function moveToMainBox(win) {
if (!win) return;
win.move(
MESSAGE_SIDE_MARGIN,
messageY(),
Graphics.boxWidth -
MESSAGE_SIDE_MARGIN * 2,
messageHeight()
);
win.createContents();
win.opacity = 0;
win.backOpacity = 0;
}
function hideStandardArrows(win) {
if (!win) return;
if (win._upArrowSprite) {
win._upArrowSprite.visible = false;
}
if (win._downArrowSprite) {
win._downArrowSprite.visible = false;
}
}
function isUndertaleBattleMessage() {
return SceneManager._scene instanceof Scene_Battle;
}
function showUndertaleMainMessage(scene) {
if (
!scene ||
!scene._undertaleMessageWindow
) {
return;
}
if ($gameMessage.isBusy()) {
scene._undertaleMessageWindow.hide();
scene._undertaleMessageWindow.visible = false;
return;
}
scene._undertaleMessageWindow.visible = true;
scene._undertaleMessageWindow.show();
scene._undertaleMessageWindow.refresh();
}
function hideUndertaleMainMessage(scene) {
if (
!scene ||
!scene._undertaleMessageWindow
) {
return;
}
scene._undertaleMessageWindow.hide();
scene._undertaleMessageWindow.visible = false;
}
Window_ActorCommand.prototype.windowWidth = function() {
return Graphics.boxWidth;
};
Window_ActorCommand.prototype.windowHeight = function() {
return COMMAND_HEIGHT;
};
Window_ActorCommand.prototype.numVisibleRows = function() {
return 1;
};
Window_ActorCommand.prototype.maxCols = function() {
return 4;
};
Window_ActorCommand.prototype.standardBackOpacity = function() {
return 0;
};
Window_ActorCommand.prototype.makeCommandList = function() {
if (!this._actor) return;
this.addCommand(
'たたかう',
'attack',
this._actor.canAttack()
);
this.addCommand(
'こうどう',
'undertaleAct',
true
);
this.addCommand(
'アイテム',
'undertaleItem',
true
);
this.addCommand(
'みのがす',
'undertaleMercy',
true
);
};
Window_ActorCommand.prototype.commandButtonWidth = function() {
var usable =
this.contentsWidth() -
SIDE_MARGIN * 2 -
BUTTON_GAP * 3;
return Math.floor(usable / 4);
};
Window_ActorCommand.prototype.itemRect = function(index) {
var rect = new Rectangle();
var width = this.commandButtonWidth();
rect.width = width;
rect.height =
this.contentsHeight() -
BUTTON_MARGIN_Y * 2;
rect.x =
SIDE_MARGIN +
index * (width + BUTTON_GAP);
rect.y = BUTTON_MARGIN_Y;
return rect;
};
Window_ActorCommand.prototype.itemRectForText = function(index) {
var rect = this.itemRect(index);
return new Rectangle(
rect.x + 8,
rect.y,
rect.width - 16,
rect.height
);
};
Window_ActorCommand.prototype.drawItem = function(index) {
var command = this._list[index];
if (!command) return;
var rect = this.itemRect(index);
var textRect = this.itemRectForText(index);
var selected =
this.active &&
this.index() === index;
var bg =
selected
? BUTTON_SELECTED_COLOR
: BUTTON_BACKGROUND_COLOR;
this.contents.fillRect(
rect.x,
rect.y,
rect.width,
rect.height,
bg
);
var oldOpacity =
this.contents.paintOpacity;
this.contents.paintOpacity =
command.enabled ? 255 : 100;
var s = BUTTON_BORDER_SIZE;
this.contents.fillRect(
rect.x,
rect.y,
rect.width,
s,
BUTTON_BORDER_COLOR
);
this.contents.fillRect(
rect.x,
rect.y + rect.height - s,
rect.width,
s,
BUTTON_BORDER_COLOR
);
this.contents.fillRect(
rect.x,
rect.y,
s,
rect.height,
BUTTON_BORDER_COLOR
);
this.contents.fillRect(
rect.x + rect.width - s,
rect.y,
s,
rect.height,
BUTTON_BORDER_COLOR
);
this.contents.paintOpacity =
oldOpacity;
this.changePaintOpacity(
command.enabled
);
this.changeTextColor(
BUTTON_TEXT_COLOR
);
var textY =
rect.y +
Math.floor(
(rect.height -
this.lineHeight()) / 2
);
this.drawText(
command.name,
textRect.x,
textY,
textRect.width,
'center'
);
this.changePaintOpacity(true);
};
Window_ActorCommand.prototype.updateCursor = function() {
    // 標準の白いカーソル枠は使用しない
    this.setCursorRect(0, 0, 0, 0);
};


// ============================================================
// アクターコマンドの選択位置変更時に再描画
// ============================================================

var _ActorCommand_select =
Window_ActorCommand.prototype.select;

Window_ActorCommand.prototype.select = function(index) {

    // 標準の選択処理
    _ActorCommand_select.call(
        this,
        index
    );

    // 自作の選択背景を更新するため再描画
    if (this.contents) {
        this.refresh();
    }
};


// ============================================================
// アクターコマンド初期化
// ============================================================

var _ActorCommand_initialize =
Window_ActorCommand.prototype.initialize;

Window_ActorCommand.prototype.initialize = function() {

    _ActorCommand_initialize.apply(
        this,
        arguments
    );

    this.opacity = 0;
    this.backOpacity = 0;
};
Window_BattleStatus.prototype.windowWidth = function() {
return Graphics.boxWidth;
};
Window_BattleStatus.prototype.standardBackOpacity = function() {
return 0;
};
Window_BattleStatus.prototype.numVisibleRows = function() {
return 1;
};
Window_BattleStatus.prototype.refresh = function() {
if (!this.contents) return;
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
Window_BattleStatus.prototype.drawUndertaleStatus =
function(actor, index, count) {
if (!actor) return;
this.contents.fontSize =
STATUS_FONT_SIZE;
var name = actor.name();
var hpLabel = 'HP';
var hp =
String(actor.hp) +
'/' +
String(actor.mhp);
var nameWidth =
this.textWidth(name);
var labelWidth =
this.textWidth(hpLabel);
var hpWidth =
this.textWidth(hp);
var groupWidth =
nameWidth +
NAME_HP_GAP +
labelWidth +
HP_VALUE_GAP +
hpWidth;
var startX;
if (count === 1) {
startX =
Math.floor(
(
this.contentsWidth() -
groupWidth
) / 2
);
} else {
var available =
this.contentsWidth() -
STATUS_SIDE_MARGIN * 2;
var memberWidth =
available / count;
var areaX =
STATUS_SIDE_MARGIN +
memberWidth * index;
startX =
areaX +
(
memberWidth -
groupWidth
) / 2;
}
var y =
this.contentsHeight() -
this.lineHeight() -
4;
this.changeTextColor(
STATUS_NAME_COLOR
);
this.drawText(
name,
Math.floor(startX),
y,
nameWidth + 4
);
var labelX =
startX +
nameWidth +
NAME_HP_GAP;
this.changeTextColor(
STATUS_HP_LABEL_COLOR
);
this.drawText(
hpLabel,
Math.floor(labelX),
y,
labelWidth + 4
);
var hpX =
labelX +
labelWidth +
HP_VALUE_GAP;
this.changeTextColor(
STATUS_HP_VALUE_COLOR
);
this.drawText(
hp,
Math.floor(hpX),
y,
hpWidth + 8
);
this.resetTextColor();
};
Window_BattleStatus.prototype.drawItem = function() {
};
Window_BattleStatus.prototype.updateCursor = function() {
this.setCursorRect(0, 0, 0, 0);
};
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
this.opacity = 0;
this.backOpacity = 0;
this._lines = [
    //敵があらわれた。
''
];
this.refresh();
};
Window_UndertaleMessage.prototype.setText =
function(text) {
this._lines =
String(text || '')
.split(/\r?\n/);
while (
this._lines.length >
MESSAGE_MAX_LINES
) {
this._lines.shift();
}
this.refresh();
};
Window_UndertaleMessage.prototype.refresh =
function() {
if (!this.contents) return;
this.contents.clear();
drawMainBox(this);
this.contents.fontSize =
MESSAGE_FONT_SIZE;
this.changeTextColor(
MESSAGE_TEXT_COLOR
);
for (
var i = 0;
i < this._lines.length;
i++
) {
this.drawTextEx(
this._lines[i],
MESSAGE_TEXT_X,
MESSAGE_TEXT_Y +
i * MESSAGE_LINE_HEIGHT
);
}
this.resetTextColor();
};
var _WindowMessage_initialize =
Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function() {
_WindowMessage_initialize.apply(
this,
arguments
);
if (isUndertaleBattleMessage()) {
moveToMainBox(this);
}
};
var _WindowMessage_updateBackground =
Window_Message.prototype.updateBackground;
Window_Message.prototype.updateBackground = function() {
if (isUndertaleBattleMessage()) {
this._background =
$gameMessage.background();
this.setBackgroundType(2);
this.opacity = 0;
this.backOpacity = 0;
return;
}
_WindowMessage_updateBackground.call(
this
);
};
var _WindowMessage_startMessage =
Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
if (isUndertaleBattleMessage()) {
moveToMainBox(this);
hideUndertaleMainMessage(
SceneManager._scene
);
}
_WindowMessage_startMessage.call(
this
);
};
var _WindowMessage_newPage =
Window_Message.prototype.newPage;
Window_Message.prototype.newPage =
function(textState) {
_WindowMessage_newPage.call(
this,
textState
);
if (isUndertaleBattleMessage()) {
drawMainBox(this);
this.contents.fontSize =
MESSAGE_FONT_SIZE;
this.changeTextColor(
MESSAGE_TEXT_COLOR
);
textState.x =
MESSAGE_TEXT_X;
textState.left =
MESSAGE_TEXT_X;
textState.y =
MESSAGE_TEXT_Y;
textState.height =
MESSAGE_LINE_HEIGHT;
}
};
var _WindowMessage_newLineX =
Window_Message.prototype.newLineX;
Window_Message.prototype.newLineX =
function() {
if (isUndertaleBattleMessage()) {
return MESSAGE_TEXT_X;
}
return _WindowMessage_newLineX.call(
this
);
};
var _WindowMessage_lineHeight =
Window_Message.prototype.lineHeight;
Window_Message.prototype.lineHeight =
function() {
if (isUndertaleBattleMessage()) {
return MESSAGE_LINE_HEIGHT;
}
return _WindowMessage_lineHeight.call(
this
);
};
var _WindowMessage_standardFontSize =
Window_Message.prototype.standardFontSize;
Window_Message.prototype.standardFontSize =
function() {
if (isUndertaleBattleMessage()) {
return MESSAGE_FONT_SIZE;
}
return _WindowMessage_standardFontSize.call(
this
);
};
var _WindowMessage_updatePlacement =
Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement =
function() {
if (isUndertaleBattleMessage()) {
this.x =
MESSAGE_SIDE_MARGIN;
this.y =
messageY();
this.width =
Graphics.boxWidth -
MESSAGE_SIDE_MARGIN * 2;
this.height =
messageHeight();
return;
}
_WindowMessage_updatePlacement.call(
this
);
};
var _WindowMessage_terminateMessage =
Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage =
function() {
_WindowMessage_terminateMessage.call(
this
);
if (isUndertaleBattleMessage()) {
var scene =
SceneManager._scene;
if (
scene &&
scene._undertaleMessageWindow
) {
scene
._undertaleMessageWindow
.setText(
    //敵があらわれた。
''
);
}
}
};
Window_BattleEnemy.prototype.maxCols = function() {
return LIST_COLS;
};
Window_BattleEnemy.prototype.numVisibleRows = function() {
return LIST_ROWS;
};
Window_BattleEnemy.prototype.standardBackOpacity = function() {
return 0;
};
Window_BattleEnemy.prototype.itemWidth = function() {
return Math.floor(
(
this.contentsWidth() -
LIST_SIDE_MARGIN * 2 -
LIST_COLUMN_GAP
) /
LIST_COLS
);
};
Window_BattleEnemy.prototype.itemHeight = function() {
return Math.floor(
(
this.contentsHeight() -
LIST_TOP_MARGIN -
LIST_BOTTOM_MARGIN
) /
LIST_ROWS
);
};
Window_BattleEnemy.prototype.undertaleTopRow = function() {
return this._undertaleTopRow || 0;
};
Window_BattleEnemy.prototype.updateUndertaleScroll = function() {
var index = this.index();
if (index < 0) return;
var row =
Math.floor(
index / LIST_COLS
);
var top =
this.undertaleTopRow();
if (row < top) {
this._undertaleTopRow = row;
} else if (
row >=
top + LIST_ROWS
) {
this._undertaleTopRow =
row -
LIST_ROWS +
1;
}
};
Window_BattleEnemy.prototype.undertaleItemRect =
function(index) {
var rect =
new Rectangle();
var col =
index % LIST_COLS;
var row =
Math.floor(
index / LIST_COLS
) -
this.undertaleTopRow();
var w =
this.itemWidth();
var h =
this.itemHeight();
rect.x =
LIST_SIDE_MARGIN +
col *
(
w +
LIST_COLUMN_GAP
);
rect.y =
LIST_TOP_MARGIN +
row * h;
rect.width = w;
rect.height = h;
return rect;
};
Window_BattleEnemy.prototype.updateCursor =
function() {
this.setCursorRect(
0,
0,
0,
0
);
};
Window_BattleEnemy.prototype.refresh =
function() {
if (!this.contents) return;
this._enemies =
$gameTroop.aliveMembers();
this.updateUndertaleScroll();
this.contents.clear();
drawMainBox(this);
var first =
this.undertaleTopRow() *
LIST_COLS;
var last =
first +
LIST_COLS *
LIST_ROWS;
for (
var i = first;
i < last &&
i < this._enemies.length;
i++
) {
this.drawItem(i);
}
};

Window_BattleEnemy.prototype.drawItem =
function(index) {

    if (!this._enemies) {
        return;
    }

    var enemy =
        this._enemies[index];

    if (!enemy) {
        return;
    }

    var rect =
        this.undertaleItemRect(
            index
        );

    var selected =
        this.active &&
        this.index() === index;


    // ========================================================
    // 選択中の背景
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


    this.contents.fontSize =
        LIST_FONT_SIZE;


    // ========================================================
    // 「みのがす」の敵選択中か
    // ========================================================

    var scene =
        SceneManager._scene;

    var mercyMode =
        scene &&
        scene instanceof Scene_Battle &&
        scene._undertaleMode ===
            'mercyEnemy';


    // ========================================================
    // 見逃し可能な敵だけ黄色
    // ========================================================

    if (
        mercyMode &&
        canUndertaleSpare(enemy)
    ) {

        // MV標準色14 = 黄色
        this.changeTextColor(
            this.textColor(14)
        );

    } else {

        this.changeTextColor(
            MESSAGE_TEXT_COLOR
        );
    }


    // ========================================================
    // 選択マーク
    // ========================================================

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
            ) /
            2
        );


    this.drawText(
        prefix +
        enemy.name(),
        rect.x + 10,
        y,
        rect.width - 20
    );


    this.resetTextColor();
};
var _Enemy_select =
Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select =
function(index) {
_Enemy_select.call(
this,
index
);
if (this.contents) {
this.updateUndertaleScroll();
this.refresh();
}
};
// ============================================================
// UNDERTALE式「みのがす」専用フラグ
// ============================================================
//
// このフラグは Game_Enemy のインスタンスに保存する。
// そのため戦闘終了後にリセット処理をする必要はない。
// 次の戦闘では新しい敵インスタンスになるため自動的にOFFになる。
// ============================================================


// ------------------------------------------------------------
// 指定した敵を見逃し可能にする
// ------------------------------------------------------------

function setUndertaleMercy(enemy, value) {

    if (!enemy) {
        return;
    }

    enemy._undertaleMercy = !!value;
}


// ------------------------------------------------------------
// 指定した敵が見逃し可能か
// ------------------------------------------------------------

function canUndertaleSpare(enemy) {

    if (!enemy) {
        return false;
    }

    return enemy._undertaleMercy === true;
}


// ------------------------------------------------------------
// 現在ACTしている敵を見逃し可能にする
//
// コモンイベントの「スクリプト」で
//
// UndertaleMercyOn();
//
// と書けばOK。
// ------------------------------------------------------------

window.UndertaleMercyOn = function() {

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


// ------------------------------------------------------------
// 現在ACTしている敵を再び見逃し不可にする
//
// 必要な場合だけ使用:
//
// UndertaleMercyOff();
// ------------------------------------------------------------

window.UndertaleMercyOff = function() {

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
Window_UndertaleAct.prototype.initialize =
function() {
this._acts = [];
this._enemy = null;
this._undertaleTopRow = 0;
Window_Selectable.prototype.initialize.call(
this,
MESSAGE_SIDE_MARGIN,
messageY(),
Graphics.boxWidth -
MESSAGE_SIDE_MARGIN * 2,
messageHeight()
);
this.opacity = 0;
this.backOpacity = 0;
this.hide();
this.deactivate();
};
Window_UndertaleAct.prototype.setEnemy =
function(enemy) {
this._enemy = enemy;
this._acts =
readEnemyActs(enemy);
this._undertaleTopRow = 0;
if (
this._acts.length >
0
) {
this.select(0);
} else {
this.select(-1);
}
this.refresh();
};
Window_UndertaleAct.prototype.maxItems =
function() {
return this._acts
? this._acts.length
: 0;
};
Window_UndertaleAct.prototype.maxCols =
function() {
return LIST_COLS;
};
Window_UndertaleAct.prototype.currentAct =
function() {
if (!this._acts) {
return null;
}
return this._acts[
this.index()
] || null;
};
Window_UndertaleAct.prototype.itemWidth =
function() {
return Math.floor(
(
this.contentsWidth() -
LIST_SIDE_MARGIN * 2 -
LIST_COLUMN_GAP
) /
LIST_COLS
);
};
Window_UndertaleAct.prototype.itemHeight =
function() {
return Math.floor(
(
this.contentsHeight() -
LIST_TOP_MARGIN -
LIST_BOTTOM_MARGIN
) /
LIST_ROWS
);
};
Window_UndertaleAct.prototype.undertaleTopRow =
function() {
return this._undertaleTopRow ||
0;
};
Window_UndertaleAct.prototype.updateUndertaleScroll =
function() {
var index =
this.index();
if (index < 0) return;
var row =
Math.floor(
index /
LIST_COLS
);
var top =
this.undertaleTopRow();
if (row < top) {
this._undertaleTopRow =
row;
} else if (
row >=
top + LIST_ROWS
) {
this._undertaleTopRow =
row -
LIST_ROWS +
1;
}
};
Window_UndertaleAct.prototype.itemRectUndertale =
function(index) {
var rect =
new Rectangle();
var col =
index %
LIST_COLS;
var row =
Math.floor(
index /
LIST_COLS
) -
this.undertaleTopRow();
var w =
this.itemWidth();
var h =
this.itemHeight();
rect.x =
LIST_SIDE_MARGIN +
col *
(
w +
LIST_COLUMN_GAP
);
rect.y =
LIST_TOP_MARGIN +
row * h;
rect.width = w;
rect.height = h;
return rect;
};
Window_UndertaleAct.prototype.updateCursor =
function() {
this.setCursorRect(
0,
0,
0,
0
);
};
Window_UndertaleAct.prototype.refresh =
function() {
if (!this.contents) return;
this.updateUndertaleScroll();
this.contents.clear();
drawMainBox(this);
var first =
this.undertaleTopRow() *
LIST_COLS;
var last =
first +
LIST_COLS *
LIST_ROWS;
for (
var i = first;
i < last &&
i < this.maxItems();
i++
) {
this.drawItem(i);
}
};
Window_UndertaleAct.prototype.drawItem =
function(index) {
if (!this._acts) return;
var act =
this._acts[index];
if (!act) return;
var rect =
this.itemRectUndertale(
index
);
var selected =
this.active &&
this.index() === index;
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
) /
2
);
this.drawText(
prefix +
act.name,
rect.x + 10,
y,
rect.width - 20
);
this.resetTextColor();
};
var _Act_select =
Window_UndertaleAct.prototype.select;
Window_UndertaleAct.prototype.select =
function(index) {
_Act_select.call(
this,
index
);
if (this.contents) {
this.updateUndertaleScroll();
this.refresh();
}
};
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
Window_UndertaleItem.prototype.initialize =
function() {
this._data = [];
this._undertaleTopRow = 0;
Window_Selectable.prototype.initialize.call(
this,
MESSAGE_SIDE_MARGIN,
messageY(),
Graphics.boxWidth -
MESSAGE_SIDE_MARGIN * 2,
messageHeight()
);
this.opacity = 0;
this.backOpacity = 0;
this.hide();
this.deactivate();
this.refresh();
};
Window_UndertaleItem.prototype.maxItems =
function() {
return this._data
? this._data.length
: 0;
};
Window_UndertaleItem.prototype.maxCols =
function() {
return LIST_COLS;
};
Window_UndertaleItem.prototype.currentItem =
function() {
if (!this._data) {
return null;
}
return this._data[
this.index()
] || null;
};
Window_UndertaleItem.prototype.includes =
function(item) {
if (!item) return false;
if (
!DataManager.isItem(item)
) {
return false;
}
return (
item.occasion === 0 ||
item.occasion === 1
);
};
Window_UndertaleItem.prototype.makeItemList =
function() {
this._data =
$gameParty
.allItems()
.filter(
function(item) {
return (
this.includes(
item
) &&
$gameParty
.numItems(
item
) > 0
);
},
this
);
};
Window_UndertaleItem.prototype.itemWidth =
function() {
return Math.floor(
(
this.contentsWidth() -
LIST_SIDE_MARGIN * 2 -
LIST_COLUMN_GAP
) /
LIST_COLS
);
};
Window_UndertaleItem.prototype.itemHeight =
function() {
return Math.floor(
(
this.contentsHeight() -
LIST_TOP_MARGIN -
LIST_BOTTOM_MARGIN
) /
LIST_ROWS
);
};
Window_UndertaleItem.prototype.undertaleTopRow =
function() {
return this._undertaleTopRow ||
0;
};
Window_UndertaleItem.prototype.updateUndertaleScroll =
function() {
var index =
this.index();
if (index < 0) return;
var row =
Math.floor(
index /
LIST_COLS
);
var top =
this.undertaleTopRow();
if (row < top) {
this._undertaleTopRow =
row;
} else if (
row >=
top + LIST_ROWS
) {
this._undertaleTopRow =
row -
LIST_ROWS +
1;
}
};
Window_UndertaleItem.prototype.itemRectUndertale =
function(index) {
var rect =
new Rectangle();
var col =
index %
LIST_COLS;
var row =
Math.floor(
index /
LIST_COLS
) -
this.undertaleTopRow();
var w =
this.itemWidth();
var h =
this.itemHeight();
rect.x =
LIST_SIDE_MARGIN +
col *
(
w +
LIST_COLUMN_GAP
);
rect.y =
LIST_TOP_MARGIN +
row * h;
rect.width = w;
rect.height = h;
return rect;
};
Window_UndertaleItem.prototype.updateCursor =
function() {
this.setCursorRect(
0,
0,
0,
0
);
};
Window_UndertaleItem.prototype.refresh =
function() {
if (!this.contents) return;
this.makeItemList();
this.updateUndertaleScroll();
this.contents.clear();
drawMainBox(this);
var first =
this.undertaleTopRow() *
LIST_COLS;
var last =
first +
LIST_COLS *
LIST_ROWS;
for (
var i = first;
i < last &&
i < this.maxItems();
i++
) {
this.drawItem(i);
}
};
Window_UndertaleItem.prototype.drawItem =
function(index) {
if (!this._data) return;
var item =
this._data[index];
if (!item) return;
var rect =
this.itemRectUndertale(
index
);
var selected =
this.active &&
this.index() === index;
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
'×' +
$gameParty.numItems(
item
);
var amountWidth =
this.textWidth(
amount
);
var y =
rect.y +
Math.floor(
(
rect.height -
this.lineHeight()
) /
2
);
this.drawText(
prefix +
item.name,
rect.x + 10,
y,
rect.width -
amountWidth -
35
);
this.drawText(
amount,
rect.x +
rect.width -
amountWidth -
10,
y,
amountWidth,
'right'
);
this.resetTextColor();
};
var _Item_select =
Window_UndertaleItem.prototype.select;
Window_UndertaleItem.prototype.select =
function(index) {
_Item_select.call(
this,
index
);
if (this.contents) {
this.updateUndertaleScroll();
this.refresh();
}
};
function Window_UndertaleMercy() {
this.initialize.apply(
this,
arguments
);
}
Window_UndertaleMercy.prototype =
Object.create(
Window_Selectable.prototype
);
Window_UndertaleMercy.prototype.constructor =
Window_UndertaleMercy;
Window_UndertaleMercy.prototype.initialize =
function() {
this._commands = [
'みのがす',
'逃げる'
];
Window_Selectable.prototype.initialize.call(
this,
MESSAGE_SIDE_MARGIN,
messageY(),
Graphics.boxWidth -
MESSAGE_SIDE_MARGIN * 2,
messageHeight()
);
this.opacity = 0;
this.backOpacity = 0;
this.hide();
this.deactivate();
};
Window_UndertaleMercy.prototype.maxItems =
function() {
return this._commands
? this._commands.length
: 0;
};
Window_UndertaleMercy.prototype.maxCols =
function() {
return 2;
};
Window_UndertaleMercy.prototype.itemWidth =
function() {
return Math.floor(
(
this.contentsWidth() -
LIST_SIDE_MARGIN * 2 -
LIST_COLUMN_GAP
) /
2
);
};
Window_UndertaleMercy.prototype.itemHeight =
function() {
return Math.floor(
(
this.contentsHeight() -
LIST_TOP_MARGIN -
LIST_BOTTOM_MARGIN
) /
LIST_ROWS
);
};
Window_UndertaleMercy.prototype.itemRectUndertale =
function(index) {
var rect =
new Rectangle();
var w =
this.itemWidth();
var h =
this.itemHeight();
rect.x =
LIST_SIDE_MARGIN +
index *
(
w +
LIST_COLUMN_GAP
);
rect.y =
LIST_TOP_MARGIN;
rect.width = w;
rect.height = h;
return rect;
};
Window_UndertaleMercy.prototype.updateCursor =
function() {
this.setCursorRect(
0,
0,
0,
0
);
};
Window_UndertaleMercy.prototype.refresh =
function() {
if (!this.contents) return;
this.contents.clear();
drawMainBox(this);
for (
var i = 0;
i < this.maxItems();
i++
) {
this.drawItem(i);
}
};
Window_UndertaleMercy.prototype.drawItem =
function(index) {
var name =
this._commands[index];
if (!name) return;
var rect =
this.itemRectUndertale(
index
);
var selected =
this.active &&
this.index() === index;
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
) /
2
);
this.drawText(
prefix + name,
rect.x + 10,
y,
rect.width - 20
);
this.resetTextColor();
};
var _Mercy_select =
Window_UndertaleMercy.prototype.select;
Window_UndertaleMercy.prototype.select =
function(index) {
_Mercy_select.call(
this,
index
);
if (this.contents) {
this.refresh();
}
};
var _createPartyCommandWindow =
Scene_Battle.prototype
.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow =
function() {
_createPartyCommandWindow.call(
this
);
this._partyCommandWindow.hide();
this._partyCommandWindow.deactivate();
};
var _createStatusWindow =
Scene_Battle.prototype
.createStatusWindow;
Scene_Battle.prototype.createStatusWindow =
function() {
_createStatusWindow.call(
this
);
this._statusWindow.move(
0,
statusY(),
Graphics.boxWidth,
STATUS_HEIGHT
);
this._statusWindow
.createContents();
this._statusWindow.opacity = 0;
this._statusWindow.backOpacity = 0;
};
var _createActorCommandWindow =
Scene_Battle.prototype
.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow =
function() {
_createActorCommandWindow.call(
this
);
var win =
this._actorCommandWindow;
win.setHandler(
'attack',
this.commandAttack.bind(
this
)
);
win.setHandler(
'undertaleAct',
this.commandUndertaleAct.bind(
this
)
);
win.setHandler(
'undertaleItem',
this.commandUndertaleItem.bind(
this
)
);
win.setHandler(
'undertaleMercy',
this.commandUndertaleMercy.bind(
this
)
);
win.move(
0,
commandY(),
Graphics.boxWidth,
COMMAND_HEIGHT
);
win.opacity = 0;
win.backOpacity = 0;
};
var _createAllWindows =
Scene_Battle.prototype
.createAllWindows;
Scene_Battle.prototype.createAllWindows =
function() {
_createAllWindows.call(
this
);
if (this._messageWindow) {
moveToMainBox(
this._messageWindow
);
this._messageWindow.opacity = 0;
this._messageWindow.backOpacity = 0;
}
this._undertaleMessageWindow =
new Window_UndertaleMessage();
this.addWindow(
this._undertaleMessageWindow
);
if (this._messageWindow) {
this.removeChild(
this._messageWindow
);
this.addWindow(
this._messageWindow
);
}
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
this._undertaleMercyWindow =
new Window_UndertaleMercy();
this._undertaleMercyWindow.setHandler(
'ok',
this.onUndertaleMercyOk.bind(
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
this._undertaleMode = null;
this._undertaleSelectedEnemy =
null;
if (this._helpWindow) {
this._helpWindow.hide();
}
if (this._itemWindow) {
this._itemWindow.hide();
this._itemWindow.deactivate();
}
};
Scene_Battle.prototype.startPartyCommandSelection =
function() {

    // パーティコマンドは使わない
    if (this._partyCommandWindow) {
        this._partyCommandWindow.hide();
        this._partyCommandWindow.deactivate();
    }

    // 最初のアクターを入力対象にする
    BattleManager._actorIndex = 0;

    var actor = BattleManager.actor();

    if (!actor) {
        return;
    }

    // アクターコマンドを開始
    this.startActorCommandSelection();
};
var _startActorCommandSelection =
Scene_Battle.prototype.startActorCommandSelection;

Scene_Battle.prototype.startActorCommandSelection =
function() {

    // ACTなどの特殊選択中なら通常コマンドを開かない
    if (this._undertaleMode) {
        return;
    }

    var actor = BattleManager.actor();

    if (!actor) {
        return;
    }

    // 標準処理
    _startActorCommandSelection.call(this);

    // 念のため現在のアクターを再設定
    this._actorCommandWindow.setup(actor);

    // メインメッセージ
    showUndertaleMainMessage(this);

    // ステータス
    if (this._statusWindow) {

        this._statusWindow.move(
            0,
            statusY(),
            Graphics.boxWidth,
            STATUS_HEIGHT
        );

        this._statusWindow.show();
        this._statusWindow.refresh();
    }

    // コマンド
    this._actorCommandWindow.move(
        0,
        commandY(),
        Graphics.boxWidth,
        COMMAND_HEIGHT
    );

    this._actorCommandWindow.show();

    // ★重要
    this._actorCommandWindow.select(0);
    this._actorCommandWindow.activate();

    this._actorCommandWindow.refresh();
};
Scene_Battle.prototype.commandUndertaleAct =
function() {
this._undertaleMode =
'actEnemy';
this._undertaleSelectedEnemy =
null;
this._actorCommandWindow
.deactivate();
hideUndertaleMainMessage(
this
);
var win =
this._enemyWindow;
win._undertaleTopRow = 0;
moveToMainBox(win);
win.show();
win.open();
win.select(0);
win.activate();
win.refresh();
};
Scene_Battle.prototype.commandUndertaleItem =
function() {
this._undertaleMode = 'item';
this._actorCommandWindow
.deactivate();
hideUndertaleMainMessage(
this
);
var win =
this._undertaleItemWindow;
win._undertaleTopRow = 0;
moveToMainBox(win);
win.refresh();
if (
win.maxItems() > 0
) {
win.select(0);
} else {
win.select(-1);
}
win.show();
win.open();
win.activate();
win.refresh();
};
Scene_Battle.prototype.onUndertaleItemCancel =
function() {
this._undertaleItemWindow.deactivate();
this._undertaleItemWindow.hide();
this._undertaleMode = null;
showUndertaleMainMessage(
this
);
this._actorCommandWindow.show();
this._actorCommandWindow.activate();
this._actorCommandWindow.refresh();
};

Scene_Battle.prototype.onUndertaleItemOk = function() {

    var item =
        this._undertaleItemWindow.currentItem();

    if (!item) {
        SoundManager.playBuzzer();
        this._undertaleItemWindow.activate();
        return;
    }

    var members =
        $gameParty.battleMembers();

    if (members.length <= 0) {
        SoundManager.playBuzzer();
        this._undertaleItemWindow.activate();
        return;
    }

    // アイテムは1人目だけが対象
    var actor = members[0];

    if (!$gameParty.hasItem(item)) {
        SoundManager.playBuzzer();
        this._undertaleItemWindow.refresh();
        this._undertaleItemWindow.activate();
        return;
    }

    if (!actor.canUse(item)) {
        SoundManager.playBuzzer();
        this._undertaleItemWindow.activate();
        return;
    }

    SoundManager.playOk();


    // ========================================================
    // 使用前の状態を保存
    // ========================================================

    var oldHp = actor.hp;
    var oldMp = actor.mp;


    // ========================================================
    // アイテム使用
    // ========================================================

    actor.useItem(item);

    var action =
        new Game_Action(actor);

    action.setItem(item.id);

    action.apply(actor);
    action.applyGlobal();


    // ========================================================
    // 使用後との差を取得
    // ========================================================

    var hpChange =
        actor.hp - oldHp;

    var mpChange =
        actor.mp - oldMp;


    // ========================================================
    // ステータス更新
    // ========================================================

    if (this._statusWindow) {
        this._statusWindow.refresh();
    }


    // ========================================================
    // アイテムウィンドウを閉じる
    // ========================================================

    this._undertaleItemWindow.deactivate();
    this._undertaleItemWindow.hide();

    this._actorCommandWindow.deactivate();


    // ========================================================
    // 表示する文章を作る
    // ========================================================

    var lines = [];

    lines.push(
        '＊ ' +
        actor.name() +
        'は' +
        item.name +
        'を使った。'
    );


    // HP回復
    if (hpChange > 0) {

        lines.push(
            '＊ HPが' +
            hpChange +
            '回復した。'
        );

    }

    // HP減少
    else if (hpChange < 0) {

        lines.push(
            '＊ HPが' +
            Math.abs(hpChange) +
            '減った。'
        );

    }


    // MP回復
    if (mpChange > 0) {

        lines.push(
            '＊ MPが' +
            mpChange +
            '回復した。'
        );

    }

    // MP減少
    else if (mpChange < 0) {

        lines.push(
            '＊ MPが' +
            Math.abs(mpChange) +
            '減った。'
        );

    }


    // 変化が何もない場合
    if (
        hpChange === 0 &&
        mpChange === 0
    ) {

        lines.push(
            '＊ しかし 何も起こらなかった。'
        );

    }


    // ========================================================
    // メイン文章枠へ表示
    // ========================================================

    this._undertaleMessageWindow.setText(
        lines.join('\n')
    );

    this._undertaleMessageWindow.show();
    this._undertaleMessageWindow.visible = true;


    // ========================================================
    // アイテムメッセージ待機モード
    // ========================================================

    this._undertaleMode = 'itemMessage';


    // 決定キー押しっぱなしによる即終了防止
    this._undertaleItemMessageWait = 10;
};

Scene_Battle.prototype.commandUndertaleMercy =
function() {
this._undertaleMode =
'mercyCommand';
this._actorCommandWindow
.deactivate();
hideUndertaleMainMessage(
this
);
var win =
this._undertaleMercyWindow;
moveToMainBox(win);
win.show();
win.open();
win.select(0);
win.activate();
win.refresh();
};
Scene_Battle.prototype.onUndertaleMercyCancel =
function() {
this._undertaleMercyWindow.deactivate();
this._undertaleMercyWindow.hide();
this._undertaleMode = null;
showUndertaleMainMessage(
this
);
this._actorCommandWindow.show();
this._actorCommandWindow.activate();
this._actorCommandWindow.refresh();
};
Scene_Battle.prototype.onUndertaleMercyOk =
function() {
var index =
this._undertaleMercyWindow.index();
if (index === 0) {
SoundManager.playOk();
this._undertaleMercyWindow.deactivate();
this._undertaleMercyWindow.hide();
this._undertaleMode =
'mercyEnemy';
var enemyWin =
this._enemyWindow;
enemyWin._undertaleTopRow = 0;
moveToMainBox(
enemyWin
);
enemyWin.show();
enemyWin.open();
if
(
$gameTroop
.aliveMembers()
.length > 0
) {
enemyWin.select(0);
} else {
enemyWin.select(-1);
}
enemyWin.activate();
enemyWin.refresh();
return;
}
if (index === 1) {
SoundManager.playOk();
this._undertaleMercyWindow.deactivate();
this._undertaleMercyWindow.hide();
this._undertaleMode = null;
BattleManager.processEscape();
return;
}
};
var _selectEnemySelection =
Scene_Battle.prototype
.selectEnemySelection;
Scene_Battle.prototype.selectEnemySelection =
function() {
_selectEnemySelection.call(
this
);
if (this._undertaleMode) {
return;
}
hideUndertaleMainMessage(
this
);
moveToMainBox(
this._enemyWindow
);
this._enemyWindow._undertaleTopRow = 0;
this._enemyWindow.show();
this._enemyWindow.activate();
this._enemyWindow.select(0);
this._enemyWindow.refresh();
};
var _onEnemyOk =
Scene_Battle.prototype
.onEnemyOk;

Scene_Battle.prototype.onEnemyOk =
function() {
if (
this._undertaleMode ===
'actEnemy'
) {
var enemy =
this._enemyWindow.enemy();
if (!enemy) {
SoundManager.playBuzzer();
this._enemyWindow.activate();
return;
}
this._undertaleSelectedEnemy =
enemy;
this._undertaleMode =
'actCommand';
this._enemyWindow.deactivate();
this._enemyWindow.hide();
var actWin =
this._undertaleActWindow;
actWin.setEnemy(
enemy
);
actWin.show();
actWin.open();
if (
actWin.maxItems() > 0
) {
actWin.select(0);
} else {
actWin.select(-1);
}
actWin.activate();
actWin.refresh();
return;
}
if (
    this._undertaleMode ===
    'mercyEnemy'
) {

    var mercyEnemy =
        this._enemyWindow.enemy();


    // ========================================================
    // 敵が取得できなかった
    // ========================================================

    if (!mercyEnemy) {

        SoundManager.playBuzzer();

        this._enemyWindow.activate();

        return;
    }


    // ========================================================
    // まだ見逃せない敵
    // ========================================================

    if (
        !canUndertaleSpare(
            mercyEnemy
        )
    ) {

        SoundManager.playOk();

        this._enemyWindow.deactivate();
        this._enemyWindow.hide();


        // ----------------------------------------------------
        // 中央文章枠に表示
        // ----------------------------------------------------

        this._undertaleMessageWindow.setText(
            '＊ ' +
            mercyEnemy.name() +
            'はまだ見逃せない。'
        );

        showUndertaleMainMessage(
            this
        );


        // ----------------------------------------------------
        // 「見逃せなかった」メッセージ待機モード
        // ----------------------------------------------------

        this._undertaleMode =
            'mercyFailMessage';

        // 決定キー押しっぱなし対策
        this._undertaleMercyMessageWait =
            10;

        return;
    }


// ========================================================
// 見逃し成功
// ========================================================

SoundManager.playOk();

this._enemyWindow.deactivate();
this._enemyWindow.hide();


// ========================================================
// 敵名を消す前に保存
// ========================================================

var mercyEnemyName =
    mercyEnemy.name();


// ========================================================
// 敵を戦闘から除外
// ========================================================

mercyEnemy.hide();

$gameTroop.makeUniqueNames();


// ========================================================
// ステータス更新
// ========================================================

if (
    this._statusWindow
) {

    this._statusWindow.refresh();
}


// ========================================================
// メッセージ表示
// ========================================================

this._undertaleMessageWindow.setText(
    '＊ ' +
    mercyEnemyName +
    'を見逃した。'
);

showUndertaleMainMessage(
    this
);


// ========================================================
// 成功メッセージ待機モード
// ========================================================

this._undertaleMode =
    'mercySuccessMessage';

this._undertaleSelectedEnemy = null;


// 決定キー押しっぱなし対策
this._undertaleMercyMessageWait =
    10;


return;
}

_onEnemyOk.call(
this
);
};

var _onEnemyCancel =
Scene_Battle.prototype
.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel =
function() {
if (
this._undertaleMode ===
'actEnemy'
) {
this._undertaleMode = null;
this._undertaleSelectedEnemy = null;
this._enemyWindow.deactivate();
this._enemyWindow.hide();
showUndertaleMainMessage(
this
);
this._actorCommandWindow.show();
this._actorCommandWindow.activate();
this._actorCommandWindow.refresh();
return;
}
if (
this._undertaleMode ===
'mercyEnemy'
) {
this._enemyWindow.deactivate();
this._enemyWindow.hide();
this._undertaleMode =
'mercyCommand';
var mercyWin =
this._undertaleMercyWindow;
moveToMainBox(
mercyWin
);
mercyWin.show();
mercyWin.open();
mercyWin.select(0);
mercyWin.activate();
mercyWin.refresh();
return;
}
_onEnemyCancel.call(
this
);
};
Scene_Battle.prototype.onUndertaleActCancel =
function() {
if (
this._undertaleMode !==
'actCommand'
) {
return;
}
this._undertaleActWindow.deactivate();
this._undertaleActWindow.hide();
this._undertaleMode =
'actEnemy';
var win =
this._enemyWindow;
moveToMainBox(
win
);
win.show();
win.open();
var index = 0;
if (
this._undertaleSelectedEnemy
) {
index =
this
._undertaleSelectedEnemy
.index();
}
win.select(index);
win.activate();
win.refresh();
};
Scene_Battle.prototype.onUndertaleActOk = function() {

    if (this._undertaleMode !== 'actCommand') return;

    var act = this._undertaleActWindow.currentAct();
    var enemy = this._undertaleSelectedEnemy;

    if (!act || !enemy) {
        SoundManager.playBuzzer();
        this._undertaleActWindow.activate();
        return;
    }

    SoundManager.playOk();

    // 選択した敵・ACT情報を保存
    $gameTemp._undertaleActEnemy = enemy;
    $gameTemp._undertaleActEnemyIndex = enemy.index();
    $gameTemp._undertaleActEnemyId = enemy.enemyId();
    $gameTemp._undertaleActName = act.name;
    $gameTemp._undertaleActCommonEventId = act.commonEventId;

    // 選択ウィンドウを閉じる
    this._undertaleActWindow.deactivate();
    this._undertaleActWindow.hide();
    this._actorCommandWindow.deactivate();

    hideUndertaleMainMessage(this);

    // ACTイベント実行モード
    this._undertaleMode = 'actCommonEvent';

    // =====================================================
    // ACT専用Interpreterを作る
    // =====================================================

    this._undertaleActInterpreter = null;

    if (
        act.commonEventId > 0 &&
        $dataCommonEvents[act.commonEventId]
    ) {

        var commonEvent =
            $dataCommonEvents[act.commonEventId];

        this._undertaleActInterpreter =
            new Game_Interpreter();

        this._undertaleActInterpreter.setup(
            commonEvent.list,
            0
        );
    }
};

var _changeInputWindow =
Scene_Battle.prototype
.changeInputWindow;

Scene_Battle.prototype.changeInputWindow =
function() {

if (
    this._undertaleMode === 'actEnemy' ||
    this._undertaleMode === 'actCommand' ||
    this._undertaleMode === 'actCommonEvent' ||
    this._undertaleMode === 'item' ||
    this._undertaleMode === 'itemMessage' ||
    this._undertaleMode === 'mercyCommand' ||
    this._undertaleMode === 'mercyEnemy' ||
    this._undertaleMode === 'mercyFailMessage' ||
    this._undertaleMode === 'mercySuccessMessage'
) {
    return;
}

_changeInputWindow.call(
this
);
};

var _update =
Scene_Battle.prototype.update;

Scene_Battle.prototype.update =
function() {

_update.call(
this
);

if (
this._helpWindow
) {
this._helpWindow.hide();
}

if (
this._partyCommandWindow
) {
this._partyCommandWindow.hide();
this._partyCommandWindow.deactivate();
}

if (
this._itemWindow
) {
this._itemWindow.hide();
this._itemWindow.deactivate();
}

if (
this._undertaleMessageWindow
) {
if ($gameMessage.isBusy()) {
hideUndertaleMainMessage(
this
);
}
}

if (this._undertaleMode === 'actCommonEvent') {

    hideUndertaleMainMessage(this);

    var interpreter =
        this._undertaleActInterpreter;

    // =====================================================
    // コモンイベント実行中
    // =====================================================

    if (
        interpreter &&
        interpreter.isRunning()
    ) {

        interpreter.update();

        return;
    }


    // =====================================================
    // コモンイベント終了
    // =====================================================

    this._undertaleActInterpreter = null;

    var actMembers =
        $gameParty.battleMembers();

    for (
        var ai = 0;
        ai < actMembers.length;
        ai++
    ) {
        actMembers[ai].clearActions();
    }

    this._undertaleMode = null;

    showUndertaleMainMessage(this);

    // 敵ターンへ
    BattleManager._actorIndex = -1;
    BattleManager.startTurn();

    return;
}

// ============================================================
// アイテム使用後メッセージ
// ============================================================

if (this._undertaleMode === 'itemMessage') {

    // 他の選択ウィンドウは操作させない
    this._actorCommandWindow.deactivate();

    this._undertaleItemWindow.deactivate();
    this._undertaleItemWindow.hide();

    this._enemyWindow.deactivate();
    this._enemyWindow.hide();

    this._undertaleActWindow.deactivate();
    this._undertaleActWindow.hide();

    this._undertaleMercyWindow.deactivate();
    this._undertaleMercyWindow.hide();


    // ========================================================
    // 決定直後のキー入力を無視する
    // ========================================================

    if (this._undertaleItemMessageWait > 0) {

        this._undertaleItemMessageWait--;

        return;
    }


    // ========================================================
    // 決定キーでメッセージ終了
    // ========================================================

    if (
        Input.isTriggered('ok') ||
        TouchInput.isTriggered()
    ) {

        SoundManager.playOk();


        // 通常メッセージへ戻す
        this._undertaleMessageWindow.setText(
            //敵があらわれた。
            ''
        );


        // ====================================================
        // 味方の行動を消す
        // ====================================================

        var members =
            $gameParty.battleMembers();

        for (
            var i = 0;
            i < members.length;
            i++
        ) {

            members[i].clearActions();

        }


        // ====================================================
        // アイテムメッセージモード終了
        // ====================================================

        this._undertaleMode = null;

        this._undertaleItemMessageWait = 0;


        // ====================================================
        // 敵ターン開始
        // ====================================================

        BattleManager._actorIndex = -1;
        BattleManager.startTurn();

        return;
    }


    return;
}

// ============================================================
// 「まだ見逃せない」メッセージ待機
// ============================================================

if (
    this._undertaleMode ===
    'mercyFailMessage'
) {

    // 他のウィンドウを操作不能にする
    this._actorCommandWindow.deactivate();

    this._enemyWindow.deactivate();
    this._enemyWindow.hide();

    this._undertaleActWindow.deactivate();
    this._undertaleActWindow.hide();

    this._undertaleItemWindow.deactivate();
    this._undertaleItemWindow.hide();

    this._undertaleMercyWindow.deactivate();
    this._undertaleMercyWindow.hide();


    // ========================================================
    // 決定直後のキー入力を少し無視
    // ========================================================

    if (
        this._undertaleMercyMessageWait > 0
    ) {

        this._undertaleMercyMessageWait--;

        return;
    }


    // ========================================================
    // 決定キー待ち
    // ========================================================

    if (
        Input.isTriggered('ok') ||
        TouchInput.isTriggered()
    ) {

        SoundManager.playOk();


        // 通常メッセージへ戻す
        this._undertaleMessageWindow.setText(
            //敵があらわれた。
            ''
        );


        // ====================================================
        // 味方の行動を消す
        // ====================================================

        var members =
            $gameParty.battleMembers();

        for (
            var i = 0;
            i < members.length;
            i++
        ) {

            members[i].clearActions();
        }


        // ====================================================
        // 見逃し失敗メッセージ終了
        // ====================================================

        this._undertaleMode = null;

        this._undertaleMercyMessageWait = 0;


        // ====================================================
        // 敵ターン開始
        // ====================================================

        BattleManager._actorIndex = -1;

        BattleManager.startTurn();

        return;
    }


    return;
}
// ============================================================
// 「見逃した」メッセージ待機
// ============================================================

if (
    this._undertaleMode ===
    'mercySuccessMessage'
) {

    // ========================================================
    // 他のウィンドウを操作不能にする
    // ========================================================

    this._actorCommandWindow.deactivate();

    this._enemyWindow.deactivate();
    this._enemyWindow.hide();

    this._undertaleActWindow.deactivate();
    this._undertaleActWindow.hide();

    this._undertaleItemWindow.deactivate();
    this._undertaleItemWindow.hide();

    this._undertaleMercyWindow.deactivate();
    this._undertaleMercyWindow.hide();


    // ========================================================
    // 決定直後のキー入力を少し無視
    // ========================================================

    if (
        this._undertaleMercyMessageWait > 0
    ) {

        this._undertaleMercyMessageWait--;

        return;
    }


    // ========================================================
    // 決定待ち
    // ========================================================

    if (
        Input.isTriggered('ok') ||
        TouchInput.isTriggered()
    ) {

        SoundManager.playOk();


        // ====================================================
        // 待機モード終了
        // ====================================================

        this._undertaleMode = null;

        this._undertaleMercyMessageWait = 0;


        // ====================================================
        // 最後の敵を見逃した場合
        // ====================================================

        if (
            $gameTroop
                .aliveMembers()
                .length === 0
        ) {

            BattleManager.checkBattleEnd();

            return;
        }


        // ====================================================
        // まだ敵が残っている
        // ====================================================

        var members =
            $gameParty.battleMembers();

        for (
            var i = 0;
            i < members.length;
            i++
        ) {

            members[i].clearActions();
        }


        // ====================================================
        // 敵ターン開始
        // ====================================================

        BattleManager._actorIndex = -1;

        BattleManager.startTurn();

        return;
    }


    return;
}

hideStandardArrows(
this._enemyWindow
);

hideStandardArrows(
this._undertaleActWindow
);

hideStandardArrows(
this._undertaleItemWindow
);

hideStandardArrows(
this._undertaleMercyWindow
);

if (
this._undertaleMode ===
'actEnemy'
) {

hideUndertaleMainMessage(
this
);

this._undertaleActWindow.hide();
this._undertaleActWindow.deactivate();

this._undertaleItemWindow.hide();
this._undertaleItemWindow.deactivate();

this._undertaleMercyWindow.hide();
this._undertaleMercyWindow.deactivate();
}

else if (
this._undertaleMode ===
'actCommand'
) {

hideUndertaleMainMessage(
this
);

this._enemyWindow.hide();
this._enemyWindow.deactivate();

this._undertaleItemWindow.hide();
this._undertaleItemWindow.deactivate();

this._undertaleMercyWindow.hide();
this._undertaleMercyWindow.deactivate();

if (
!this
._undertaleActWindow
.visible
) {
this._undertaleActWindow.show();
}
}

else if (
this._undertaleMode ===
'item'
) {

hideUndertaleMainMessage(
this
);

this._enemyWindow.hide();
this._enemyWindow.deactivate();

this._undertaleActWindow.hide();
this._undertaleActWindow.deactivate();

this._undertaleMercyWindow.hide();
this._undertaleMercyWindow.deactivate();

if (
!this
._undertaleItemWindow
.visible
) {
this._undertaleItemWindow.show();
}
}

else if (
this._undertaleMode ===
'mercyCommand'
) {

hideUndertaleMainMessage(
this
);

this._enemyWindow.hide();
this._enemyWindow.deactivate();

this._undertaleActWindow.hide();
this._undertaleActWindow.deactivate();

this._undertaleItemWindow.hide();
this._undertaleItemWindow.deactivate();

if (
!this
._undertaleMercyWindow
.visible
) {
this._undertaleMercyWindow.show();
}
}

else if (
this._undertaleMode ===
'mercyEnemy'
) {

hideUndertaleMainMessage(
this
);

this._undertaleActWindow.hide();
this._undertaleActWindow.deactivate();

this._undertaleItemWindow.hide();
this._undertaleItemWindow.deactivate();

this._undertaleMercyWindow.hide();
this._undertaleMercyWindow.deactivate();

if (
!this
._enemyWindow
.visible
) {
this._enemyWindow.show();
}
}
};

var _updateWindowPositions =
Scene_Battle.prototype
.updateWindowPositions;

Scene_Battle.prototype.updateWindowPositions =
function() {

_updateWindowPositions.call(
this
);

if (
this._statusWindow
) {
this._statusWindow.x = 0;
this._statusWindow.y = statusY();
}

if (
this._actorCommandWindow
) {
this._actorCommandWindow.x = 0;
this._actorCommandWindow.y = commandY();
}

if (
this._undertaleMessageWindow
) {
this._undertaleMessageWindow.x =
MESSAGE_SIDE_MARGIN;

this._undertaleMessageWindow.y =
messageY();
}

if (
this._messageWindow
) {
this._messageWindow.x =
MESSAGE_SIDE_MARGIN;

this._messageWindow.y =
messageY();
}

if (
this._enemyWindow &&
this._enemyWindow.visible
) {
this._enemyWindow.x =
MESSAGE_SIDE_MARGIN;

this._enemyWindow.y =
messageY();
}

if (
this._undertaleActWindow &&
this._undertaleActWindow.visible
) {
this._undertaleActWindow.x =
MESSAGE_SIDE_MARGIN;

this._undertaleActWindow.y =
messageY();
}

if (
this._undertaleItemWindow &&
this._undertaleItemWindow.visible
) {
this._undertaleItemWindow.x =
MESSAGE_SIDE_MARGIN;

this._undertaleItemWindow.y =
messageY();
}

if (
this._undertaleMercyWindow &&
this._undertaleMercyWindow.visible
) {
this._undertaleMercyWindow.x =
MESSAGE_SIDE_MARGIN;

this._undertaleMercyWindow.y =
messageY();
}
};

Scene_Battle.prototype.selectNextCommand =
function() {

var members =
$gameParty.battleMembers();

if (
members.length <= 0
) {
return;
}

var actingActor =
BattleManager.actor() ||
members[0];

for (
var i = 0;
i < members.length;
i++
) {
if (
members[i] !==
actingActor
) {
members[i].clearActions();
}
}

BattleManager._actorIndex = -1;

BattleManager.startTurn();
};

var _BattleManager_startTurn =
BattleManager.startTurn;

BattleManager.startTurn =
function() {

var members =
$gameParty.battleMembers();

var actingActor =
BattleManager.actor();

if (!actingActor) {
if (
members.length > 0
) {
actingActor =
members[0];
}
}

for (
var i = 0;
i < members.length;
i++
) {

var actor =
members[i];

if (
actor !==
actingActor
) {
actor.clearActions();
}
}

_BattleManager_startTurn.call(
this
);
};

// ============================================================
// 敵の戦闘ログを Undertale 中央メッセージ枠へ表示
// ============================================================
//
// ★このコードをプラグイン内の一番下、最後の
//
// })();
//
// の「直前」に追加してください。
//
// 表示例：
//
// ＊ 敵Aの攻撃！
// ＊ 佐吉は49のダメージを受けた！
//
// 敵の1行動が終了すると、次の敵の行動時に内容を更新します。
// ============================================================


// ============================================================
// 設定
// ============================================================

// 1行目と2行目の間隔
var UNDERTALE_BATTLELOG_LINE_GAP = 4;


// ============================================================
// 中央メッセージ枠へ戦闘ログを表示する
// ============================================================

function setUndertaleBattleLog(lines) {

    var scene = SceneManager._scene;

    if (
        !scene ||
        !(scene instanceof Scene_Battle) ||
        !scene._undertaleMessageWindow
    ) {
        return;
    }

    if (!lines) {
        lines = [];
    }

    // 空行除去
    var result = [];

    for (var i = 0; i < lines.length; i++) {

        var text = String(lines[i] || '');

        if (text.trim().length > 0) {
            result.push(text);
        }
    }

    if (result.length <= 0) {
        return;
    }

    // Undertale風の「＊ 」を付ける
    for (var j = 0; j < result.length; j++) {

        // すでに＊がある場合は二重にしない
        if (
            result[j].indexOf('＊') !== 0 &&
            result[j].indexOf('*') !== 0
        ) {
            result[j] = '＊ ' + result[j];
        }
    }

    scene._undertaleMessageWindow.setText(
        result.join('\n')
    );

    showUndertaleMainMessage(scene);
}


// ============================================================
// 敵の行動開始を検出
// ============================================================

// ============================================================
// 味方・敵の行動開始を検出
// ============================================================

var _UT_BattleManager_startAction =
    BattleManager.startAction;

BattleManager.startAction = function() {

    var subject = this._subject;

    var action = subject
        ? subject.currentAction()
        : null;


    // ========================================================
    // 味方・敵どちらでも行動ログを中央表示する
    // ========================================================

    if (
        subject &&
        action
    ) {

        this._undertaleEnemyLogActive = true;
        this._undertaleEnemyLogLines = [];

    } else {

        this._undertaleEnemyLogActive = false;
        this._undertaleEnemyLogLines = null;
    }


    // ========================================================
    // 元のMV処理
    // ========================================================

    _UT_BattleManager_startAction.call(this);


    // ========================================================
    // 中央枠を更新
    // ========================================================

    if (
        this._undertaleEnemyLogActive &&
        this._undertaleEnemyLogLines &&
        this._undertaleEnemyLogLines.length > 0
    ) {

        setUndertaleBattleLog(
            this._undertaleEnemyLogLines
        );
    }
};


// ============================================================
// 標準 BattleLog の文章を横取り
// ============================================================

var _UT_Window_BattleLog_addText =
    Window_BattleLog.prototype.addText;

Window_BattleLog.prototype.addText = function(text) {

    // --------------------------------------------------------
    // 敵行動中
    // --------------------------------------------------------

    if (
        BattleManager._undertaleEnemyLogActive
    ) {

        if (
            !BattleManager._undertaleEnemyLogLines
        ) {
            BattleManager._undertaleEnemyLogLines = [];
        }

        // 同じ文章が連続して入るのを防止
        var lines =
            BattleManager._undertaleEnemyLogLines;

        if (
            lines.length === 0 ||
            lines[lines.length - 1] !== text
        ) {
            lines.push(text);
        }


        // 中央枠を即更新
        setUndertaleBattleLog(lines);


        // ----------------------------------------------------
        // ★重要
        //
        // 標準BattleLogには文章を描画しない。
        //
        // ただし BattleLog 自体の処理キューを壊さないため、
        // addText以外のwait等はそのまま生かす。
        // ----------------------------------------------------

        return;
    }


    // 敵行動以外は元の処理
    _UT_Window_BattleLog_addText.call(
        this,
        text
    );
};


// ============================================================
// 敵の1行動終了
// ============================================================

var _UT_BattleManager_endAction =
    BattleManager.endAction;

BattleManager.endAction = function() {

    // ========================================================
    // 今回中央に表示した戦闘ログがあるか
    // ========================================================

    var hadUndertaleLog =
        this._undertaleEnemyLogActive &&
        this._undertaleEnemyLogLines &&
        this._undertaleEnemyLogLines.length > 0;


    // ========================================================
    // MV標準の行動終了処理
    // ========================================================

    _UT_BattleManager_endAction.call(this);


    // ========================================================
    // 中央ログを表示した行動なら
    // 「決定待ち」を開始
    // ========================================================

    if (hadUndertaleLog) {

        this._undertaleLogWait = true;

        // 決定キー押しっぱなしによる即解除防止
        this._undertaleLogWaitCount = 10;
    }


    // ログ収集終了
    this._undertaleEnemyLogActive = false;
    this._undertaleEnemyLogLines = null;
};

// ============================================================
// 戦闘ログの決定キー待ち
// ============================================================

var _UT_BattleManager_update =
    BattleManager.update;

BattleManager.update = function() {

    // ========================================================
    // 戦闘ログ表示後の決定待ち
    // ========================================================

    if (this._undertaleLogWait) {

        // ----------------------------------------------------
        // 決定直後の入力を少し無視
        // ----------------------------------------------------

        if (this._undertaleLogWaitCount > 0) {

            this._undertaleLogWaitCount--;

            return;
        }


        // ----------------------------------------------------
        // 決定キーを待つ
        // ----------------------------------------------------

        if (
            Input.isTriggered('ok') ||
            TouchInput.isTriggered()
        ) {

            SoundManager.playOk();

            this._undertaleLogWait = false;
            this._undertaleLogWaitCount = 0;

        } else {

            // 決定されるまで戦闘進行を止める
            return;
        }
    }


    // ========================================================
    // 通常のBattleManager更新
    // ========================================================

    _UT_BattleManager_update.call(this);
};

// ============================================================
// 標準 BattleLog ウィンドウを透明化
// ============================================================

var _UT_SceneBattle_createLogWindow =
    Scene_Battle.prototype.createLogWindow;

Scene_Battle.prototype.createLogWindow = function() {

    _UT_SceneBattle_createLogWindow.call(this);

    if (this._logWindow) {

        this._logWindow.opacity = 0;
        this._logWindow.backOpacity = 0;

        // ウィンドウ自体はvisibleのままにする。
        //
        // hide()してしまうと他プラグインやMV標準処理との
        // 互換性問題が出る可能性があるため。
    }
};

// ============================================================
// プレイヤーのコマンド選択に戻ったら
// 敵グループ名を表示
// ============================================================

var _UT_BattleLog_startActorCommandSelection =
    Scene_Battle.prototype.startActorCommandSelection;

Scene_Battle.prototype.startActorCommandSelection =
function() {

    _UT_BattleLog_startActorCommandSelection.call(
        this
    );

    // 特殊選択中は変更しない
    if (this._undertaleMode) {
        return;
    }

    if (this._undertaleMessageWindow) {

        // 現在の敵グループを取得
        var troop =
            $dataTroops[
                $gameTroop._troopId
            ];

        // 敵グループ名を取得
        var troopName =
            troop
            ? troop.name
            : '敵';

        // 表示
        this._undertaleMessageWindow.setText(
            '＊ ' + troopName
        );

        showUndertaleMainMessage(
            this
        );
    }
};
// ============================================================
// MV標準の戦闘開始メッセージ
// 「○○が出現！」を非表示にする
// ============================================================

BattleManager.displayStartMessages = function() {
    // 何も表示しない
};
})();