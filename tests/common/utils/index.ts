import { getIdFromUrl } from "../../../src/common/utils"

describe('common/utils/index.ts', () => {
    test('getIdFromUrl() return ID after a given url', () => {
        const result = getIdFromUrl('url/1');

        expect(result).toBe('1');
    })
})