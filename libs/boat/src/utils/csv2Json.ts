import { camelCase, get } from 'lodash';

export interface Csv2Json$Schema {
  emptyAsNull?: boolean;
  removeCarriage?: boolean;
}

export class Csv2Json {
  private options: Csv2Json$Schema;

  constructor(
    private data: string,
    options: Csv2Json$Schema,
  ) {
    this.options = options || {};
  }

  handle<T>(): T[] {
    const parsedResult = [];
    const len = this.data.length;
    let i = 0;
    let p = [];
    let a = [];
    const j = [];
    let isNested = false;
    while (i < len) {
      const ch = this.data.charAt(i);
      if (len - i == 1) {
        p.push(ch);
        a.push(p.join(''));
        j.push(a);
        a = [];
        p = [];
      } else if (!isNested && ch === ',') {
        a.push(p.join(''));
        p = [];
      } else if (ch === '\n' && !isNested) {
        a.push(p.join(''));
        j.push(a);
        a = [];
        p = [];
      } else if (ch === '"') {
        isNested = !isNested;
      } else {
        p.push(ch);
      }
      i++;
    }

    if (!j.length) return [];

    const headers = j[0];
    const rows = j.slice(1);

    for (const i in headers) headers[i] = camelCase(headers[i]);

    const removeCarriage = get(this.options, 'removeCarriage', true);
    for (const row of rows) {
      let obj = {};
      for (const i in row) {
        let rowValue = row[i] as string;
        if (removeCarriage && rowValue.includes('\r')) {
          rowValue = rowValue.replace('\r', '');
        }

        obj[headers[i]] = ['\r', ',', '', ''].includes(rowValue)
          ? null
          : rowValue;
      }

      parsedResult.push(obj);
      obj = {};
    }

    return parsedResult;
  }
}
