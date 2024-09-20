/**
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import ParagraphBase from '@/core/ParagraphBase';
import { compileRegExp } from '@/utils/regexp';

function computeLeadingSpaces(leadingChars) {
  const indentRegex = /^(\t|[ ]{1,4})/;
  let leadingCharsTemp = leadingChars;
  let indent = 0;
  while (indentRegex.test(leadingCharsTemp)) {
    leadingCharsTemp = leadingCharsTemp.replace(/^(\t|[ ]{1,4})/g, '');
    indent += 1;
  }
  return indent;
}

export default class Blockquote extends ParagraphBase {
  static HOOK_NAME = 'blockquote';

  constructor() {
    super({ needCache: true });
    // TODO: String.prototype.repeat polyfill
  }

  handleMatch(str, sentenceMakeFunc) {
    return str.replace(this.RULE.reg, (match, lines, content) => {
      const lineCount = this.getLineCount(match, lines); // 段落所占行数
      const sign = this.$engine.md5(match);
      const testHasCache = this.testHasCache(sign);
      if (testHasCache !== false) {
        return this.getCacheWithSpace(testHasCache, match);
      }
      let handledHtml = `<blockquote data-sign="${sign}_${lineCount}" data-lines="${lineCount}">`;
      const $content = content.replace(/^([ \t]*>)/gm, '');
      handledHtml += this.$engine.makeHtmlForBlockquote($content);
      // 标签闭合
      handledHtml += '</blockquote>';
      return this.getCacheWithSpace(this.pushCache(handledHtml, sign, lineCount), match);
    });
  }

  makeHtml(str, sentenceMakeFunc) {
    return this.handleMatch(str, sentenceMakeFunc);
  }

  rule() {
    const ret = {
      begin: '(?:^|\\n)(\\s*)',
      content: [
        '(',
        '>(?:.+?\\n(?![*+-]|\\d+[.]|[a-z]\\.))(?:>*.+?\\n(?![*+-]|\\d+[.]|[a-z]\\.))*(?:>*.+?)', // multiline
        '|', // or
        '>(?:.+?)', // single line
        ')',
      ].join(''),
      end: '(?=(\\n)|$)',
    };
    ret.reg = compileRegExp(ret, 'g');
    return ret;
  }
}
