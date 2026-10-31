
/*:
 * @plugindesc 文章表示・スクロール中央揃え v6.0
 * @author ChatGPT
 *
 * @help
 * 行頭に \CENTER を付けると中央揃えします。
 *
 * 対応：
 * \C[n] 色変更
 * \{    文字サイズ拡大
 * \}    文字サイズ縮小
 * \I[n] アイコン
 *
 * 使用例：
 * \CENTER\C[7]\{\{ THE END\}\}
 */

(function() {
    'use strict';

    // 制御文字を解釈し、実際の描画に近い幅を測定
    function measureLine(win, text) {
        var converted = win.convertEscapeCharacters(text);
        var bitmap = win.contents;

        var oldSize = bitmap.fontSize;
        var oldColor = bitmap.textColor;

        var width = 0;
        var buffer = '';

        function flush() {
            if (buffer.length > 0) {
                width += win.textWidth(buffer);
                buffer = '';
            }
        }

        var state = {
            index: 0,
            text: converted
        };

        while (state.index < converted.length) {
            var c = converted[state.index];

            if (c === '\x1b') {
                flush();
                state.index++;

                var code = win.obtainEscapeCode(state);

                if (code === 'C') {
                    win.obtainEscapeParam(state);

                } else if (code === 'I') {
                    win.obtainEscapeParam(state);
                    width += Window_Base._iconWidth + 4;

                } else if (code === '{') {
                    win.makeFontBigger();

                } else if (code === '}') {
                    win.makeFontSmaller();

                } else if (code === 'CENTER') {
                    // 中央揃え指定は幅に含めない

                } else if (converted[state.index] === '[') {
                    win.obtainEscapeParam(state);
                }

            } else if (c === '\n') {
                break;

            } else {
                buffer += c;
                state.index++;
            }
        }

        flush();

        bitmap.fontSize = oldSize;
        bitmap.textColor = oldColor;

        return width;
    }

    // --------------------------------------------------
    // 文章の表示
    // --------------------------------------------------

    var _messageEscape =
        Window_Message.prototype.processEscapeCharacter;

    Window_Message.prototype.processEscapeCharacter =
        function(code, textState) {

            if (code === 'CENTER') {
                var remaining =
                    textState.text.substring(textState.index);

                var line = remaining.split('\n')[0];

                var width = measureLine(this, line);
                var left = this.newLineX();

                textState.x = left + Math.max(
                    0,
                    (this.contentsWidth() - left - width) / 2
                );

                return;
            }

            _messageEscape.call(this, code, textState);
        };

    // --------------------------------------------------
    // 文章のスクロール
    // --------------------------------------------------

    Window_ScrollText.prototype.refresh = function() {
        var lines = this._text.split('\n');

        var processed = lines.map(function(line) {
            return line.replace(/^\\CENTER\b/i, '');
        });

        this.resetFontSettings();

        var heights = [];
        var totalHeight = 0;

        for (var i = 0; i < processed.length; i++) {
            this.resetFontSettings();

            var h = this.calcTextHeight({
                index: 0,
                text: this.convertEscapeCharacters(processed[i])
            }, false);

            heights.push(h);
            totalHeight += h;
        }

        this._allTextHeight = totalHeight;
        this.createContents();

        var y = 0;

        for (var j = 0; j < lines.length; j++) {
            var isCenter = /^\\CENTER\b/i.test(lines[j]);
            var lineText = processed[j];

            this.resetFontSettings();

            var x = 0;

            if (isCenter) {
                var width = measureLine(this, lineText);

                x = Math.max(
                    0,
                    (this.contentsWidth() - width) / 2
                );
            }

            this.drawTextEx(lineText, x, y);
            y += heights[j];
        }

        // 画面下からスクロール開始
        this.origin.y = -this.height;
    };

})();
