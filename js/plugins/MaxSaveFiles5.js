/*:
 * @plugindesc セーブデータの最大数を5個に制限
 * @author
 *
 * @help
 * RPG Maker MVのセーブデータ最大数を5個に変更します。
 */

(function() {
    'use strict';

    DataManager.maxSavefiles = function() {
        return 5;
    };

})();