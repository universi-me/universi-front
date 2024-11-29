import type { Institution } from "@/types/Institution";

describe("sample tests used as examples", () => {
    test("1 to equal 1", () => {
      expect(1).toBe(1);
    });

    test("import type from src", () => {
      const i: Institution = {
        id: 'pretend-its-a-uuid',
        name: 'institution name',
      };

      expect(i.id).toBe('pretend-its-a-uuid');
    })
})
