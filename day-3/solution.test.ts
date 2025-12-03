import { describe, expect, test } from "@jest/globals";
import { Solution } from "./solution";

describe("Advent of Code Day 3: Lobby (Part Two: Max Twelve-Digit Joltage)", () => {
  const solver = new Solution();

  // Calculations: 987654321111 + 811111111119 + 434234234278 + 888911112111 = 3121910778619
  const EXAMPLE_INPUT_SUM = 3121910778619n; // Use BigInt for large numbers

  // =========================================================
  // ## Core Logic Tests (N=12 Fixed)
  // =========================================================

  test("Provided Example: All Banks Sum Correctly (3,121,910,778,619)", () => {
    /*
     * Note: The Solution.solve method must return a BigInt for the total sum.
     */
    const exampleInput = `
            987654321111111
            811111111111119
            234234234234278
            818181911112111
        `;
    // The solve function is called with only the input string
    expect(solver.solve(exampleInput)).toBe(EXAMPLE_INPUT_SUM);
  });

  describe("Greedy Selection and Dropping Logic", () => {
    test("Bank where the maximum number requires dropping low-value digits in the middle", () => {
      // Bank length: 14. N=12. Must drop 2 digits.
      // Output: 999876543211 (Drop the 0s at indices 3 and 7)
      const input = `99908760543211`;
      const expected = 999876543211n;
      expect(solver.solve(input)).toBe(expected);
    });

    test("Max output where dropping the first digit is the only correct choice (1 is weakest)", () => {
      // Bank length: 13. N=12. Must drop 1 digit.
      // Dropping '1' yields 987654321111.
      const input = `1987654321111`;
      const expected = 987654321111n;
      expect(solver.solve(input)).toBe(expected);
    });

    test("Bank where multiple identical low digits must be dropped consecutively", () => {
      // Bank length: 15. N=12. Must drop 3 digits.
      // Output: 999999999999 (The three '1's must be dropped)
      const input = `99999911199999`;
      const expected = 999999199999n;
      expect(solver.solve(input)).toBe(expected);
    });

    test("Bank where only one digit can be dropped (N=12)", () => {
      // Bank length: 13. N=12. Drop the leading '1' to get 987654321119.
      const input = `1987654321119`;
      const expected = 987654321119n;
      expect(solver.solve(input)).toBe(expected);
    });
  });

  // =========================================================
  // ## Input Format and Edge Cases
  // =========================================================

  describe("Input Format and Edge Cases", () => {
    // The implementation must now define the constant N=12 internally
    const N = 12;

    test("Empty input should result in zero", () => {
      expect(solver.solve("")).toBe(0n);
    });

    test("Input line length equals N (no digits to drop)", () => {
      // Bank length: 12. N=12. Output is the full string.
      const input = `987654321111`;
      const expected = 987654321111n;
      expect(solver.solve(input)).toBe(expected);
    });

    test("Input line length is less than N (invalid bank must be filtered)", () => {
      // First line has 11 digits (invalid, should be filtered). Second line is valid.
      const input = `11111111111\n987654321111`;
      const expected = 987654321111n;
      expect(solver.solve(input)).toBe(expected);
    });
  });
});
