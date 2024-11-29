import type { Question } from "@/types/question";

describe("sample tests used as examples", () => {
    test("1 to equal 1", () => {
      expect(1).toBe(1);
    });

    test("import type from src", () => {
      const q: Question = {
        id: 1,
        title: "example",
        user_create_id: 0
      };

      expect(q.id).toBe(1);
    })
})
