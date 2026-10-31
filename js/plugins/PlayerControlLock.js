/*:
 * @plugindesc 複数スイッチによるプレイヤー操作ロック
 * @author
 *
 * @help
 * 指定したスイッチのいずれかがONの間、
 * プレイヤーの操作を禁止します。
 *
 * 例：
 * 20番、40番、60番のどれかがON
 * → プレイヤー操作禁止
 *
 * すべてOFF
 * → プレイヤー操作可能
 */

(function() {

    // 操作禁止に使用するスイッチ番号
    var LOCK_SWITCH_IDS = [20, 40, 60];

    // 指定したスイッチのどれかがONか確認
    function isPlayerControlLocked() {
        return LOCK_SWITCH_IDS.some(function(id) {
            return $gameSwitches.value(id);
        });
    }

    // プレイヤーの移動を禁止
    var _Game_Player_canMove = Game_Player.prototype.canMove;

    Game_Player.prototype.canMove = function() {
        if (isPlayerControlLocked()) {
            return false;
        }

        return _Game_Player_canMove.call(this);
    };

    // メニューを開く操作も禁止
    var _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;

    Scene_Map.prototype.updateCallMenu = function() {
        if (isPlayerControlLocked()) {
            this.menuCalling = false;
            return;
        }

        _Scene_Map_updateCallMenu.call(this);
    };

})();