import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '../../parser';

describe('Parser', function () {
  describe('.parse', function () {
    // it('sample-1', function () {
    //   // Prepare
    //   const filePath = path.resolve(__dirname, "../../../sample-yml/sample-1.yml");
    //   const yml = fs.readFileSync(filePath, 'utf8');

    //   // Execute
    //   const result = new Parser().parse(yml, filePath);


    //   // Evaluate
    //   const expected: YamlItem[] = [
    //     {
    //       key: "hoge.baz",
    //       value: "Baz",
    //       lineNumber: 2
    //     }
    //   ];
    //   assert.deepStrictEqual(result, expected);
    // });
    it('sample-2', function () {
      // Prepare
      const filePath = path.resolve(__dirname, "../../../sample-yml/sample-2.yml");
      const yml = fs.readFileSync(filePath, 'utf8');

      // Execute
      const result = new Parser().parse(yml, filePath);


      // Evaluate
      const expected: YamlItem[] = [
      ];
      assert.deepStrictEqual(result, expected);
    });
  });
});