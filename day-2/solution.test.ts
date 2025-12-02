import { describe, expect, test } from "@jest/globals";
// Note: You will need to create the 'Solution' class file (e.g., 'solution.ts')
import { Solution } from "./solution";

describe("Advent of Code Day 2: Gift Shop (Invalid Product IDs)", () => {
  // The sum of all invalid IDs from the example is 1227775554.
  const EXAMPLE_INPUT_SUM = 1227775554;

  test("Provided Example 1 (The core example from the prompt)", () => {
    // 11-22 (11, 22), 95-115 (99), 998-1012 (1010), 1188511880-1188511890 (1188511885),
    // 222220-222224 (222222), 446443-446449 (446446), 38593856-38593862 (38593859).
    const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

    const solver = new Solution();
    expect(solver.solve(exampleInput)).toBe(EXAMPLE_INPUT_SUM);
  });

  describe("Boundary Conditions and Range Limits", () => {
    test("Invalid ID is the start of the range (Small)", () => {
      // Range: 11-20. Invalid ID: 11. Sum: 11.
      const input = `11-20`;
      expect(new Solution().solve(input)).toBe(11);
    });

    test("Invalid ID is the end of the range (Large)", () => {
      // Range: 1234567812345670-1234567812345678. Invalid ID: 1234567812345678.
      const expectedId = 1234567812345678;
      const input = `${expectedId - 8}-${expectedId}`;
      expect(new Solution().solve(input)).toBe(expectedId);
    });

    test("Range limit check: invalid ID just outside the range", () => {
      // Invalid ID 1212 is outside 1213-1250. Sum: 0.
      const input = `1213-1250`;
      expect(new Solution().solve(input)).toBe(0);
    });

    test("Range spanning multiple pattern lengths", () => {
      // Range: 88-1011. Invalid IDs: 88, 99, 1010.
      // Sum: 88 + 99 + 1010 = 1197.
      const input = `88-1011`;
      expect(new Solution().solve(input)).toBe(1197);
    });
  });

  describe("Edge Cases and Input Format Issues", () => {
    test("Zero handling: Leading zero rule (IDs must be > 0)", () => {
      // The smallest possible repeat is 11. 00 is not possible because of no leading zeros.
      // Range: 1-10. Sum: 0.
      const input = `1-10`;
      expect(new Solution().solve(input)).toBe(0);
    });

    test("Empty string input should result in zero", () => {
      expect(new Solution().solve("")).toBe(0);
    });

    test("Input with only blank lines or spaces should result in zero", () => {
      expect(
        new Solution().solve(` 
      `),
      ).toBe(0);
    });

    test("Input with unexpected formatting (extra spaces, tabs, newline)", () => {
      // The parser must be robust against whitespace around commas and dashes.
      // Range: 11-22 (11, 22), 99-99 (99). Sum: 11 + 22 + 99 = 132.
      const messyInput = ` 11 - 22 , 
      99 - 99, `;
      expect(new Solution().solve(messyInput)).toBe(132);
    });

    test("Single invalid ID range", () => {
      // Range 123456-123456. Invalid ID: 123123. Sum: 123123.
      const input = `123123-123123`;
      expect(new Solution().solve(input)).toBe(123123);
    });

    test("Inverted range (start > end)", () => {
      const input = `20-11`;
      expect(new Solution().solve(input)).toBe(0);
    });
  });
});
