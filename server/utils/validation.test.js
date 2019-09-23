const expect = require('expect');

var isRealString = require('./validation').isRealString;

describe('isRealString', () => {
    it('should reject non-string values', () => {
        expect(isRealString(123)).toBeFalsy();
    });

    it('should reject string with only spaces', () => {
        expect(isRealString("   ")).toBeFalsy();        
    });

    it('should allow string with non-space characters', () => {
        expect(isRealString(".,-!<|*+#'`?\/"));
    });
});