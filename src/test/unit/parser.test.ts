import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../../parser';

describe('Parser', function () {
  describe('.parse', function () {
    it('sample-1(Simple)', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/sample-1.yml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser(filePath).parse(yml);


      // Evaluate
      const expected: YamlItem[] = [
        {
          key: "hoge.baz",
          value: "Baz",
          lineNumber: 2,
          path: filePath
        }
      ];
      assert.deepStrictEqual(result, expected);
    });
    it('sample-2(Complex)', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/sample-2.yml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser(filePath).parse(yml);


      // Evaluate
      const expected: YamlItem[] = [
         {
           key: "hoge.baz.nyanko",
           lineNumber: 2,
           path: filePath,
           value: "Nyanko"
         },
         {
           key: "hoge.baz.jyaiko",
           lineNumber: 3,
           path: filePath,
           value: "Jyaiko"
         },
         {
           key: "hoge.piyo",
           lineNumber: 4,
           path: filePath,
           value: "Piyo"
         },
         {
           key: "foo.jit",
           lineNumber: 6,
           path: filePath,
           value: "Jit"
         },
         {
           key: "foo.suki",
           lineNumber: 7,
           path: filePath,
           value: "suki"
         },
         {
           key: "top",
           lineNumber: 9,
           path: filePath,
           value: "value"
         }
       ];
      assert.deepStrictEqual(result, expected);
    });
  });
});