import { describe, expect, test } from "@jest/globals";
import { Solution } from "./solution";

describe("Advent of Code Day 3: Lobby (Battery Joltage)", () => {
  // The required total joltage for the example input.
  // Calculations: 98 + 89 + 78 + 92 = 357
  const EXAMPLE_INPUT_SUM = 357;

  const solver = new Solution();

  test("Provided Example: All Banks Sum Correctly", () => {
    /*
     * This example covers the four main banks and their corresponding max joltages:
     * 987654321111111 -> 98 (9 and 8)
     * 811111111111119 -> 89 (8 and 9)
     * 234234234234278 -> 78 (7 and 8)
     * 818181911112111 -> 92 (9 and 2)
     */
    const exampleInput = `
            987654321111111
            811111111111119
            234234234234278
            818181911112111
        `;

    expect(solver.solve(exampleInput)).toBe(EXAMPLE_INPUT_SUM);
  });

  // --- Boundary Conditions and Max Joltage Logic ---
  describe("Max Joltage Logic for Single Banks", () => {
    test("Maximum joltage (99) at the start of the bank", () => {
      // Max joltage is 99 (9 at index 0, 9 at index 1).
      const input = `991111`;
      expect(solver.solve(input)).toBe(99);
    });

    test("Maximum joltage (99) at the end of the bank", () => {
      // Max joltage is 99 (9 at index 5, 9 at index 6).
      const input = `1111199`;
      expect(solver.solve(input)).toBe(99);
    });

    test("Digits are far apart, forming max joltage 89 (8 followed by 9)", () => {
      // Largest digits are 9 and 8. 98 is impossible (9 is not followed by 8).
      // Max is 89 (8 at index 2, 9 at index 7).
      const input = `11811119`;
      expect(solver.solve(input)).toBe(89);
    });

    test("Only two digits, ensuring correct output", () => {
      // Max joltage is 64.
      const input = `64`;
      expect(solver.solve(input)).toBe(64);
    });

    test("Ascending digits should still find the highest pair (56)", () => {
      // Max joltage is 56 (5 at index 4, 6 at index 5).
      const input = `123456`;
      expect(solver.solve(input)).toBe(56);
    });

    test("Largest digit appears first (9), find largest second digit (8) later", () => {
      // Max joltage is 98 (9 at index 0, 8 at index 4).
      const input = `91238`;
      expect(solver.solve(input)).toBe(98);
    });
  });

  // --- Input Format and Edge Cases ---
  describe("Input Format and Edge Cases for Multiple Banks", () => {
    test("Input containing only a single bank", () => {
      // Max joltage is 43. Total sum is 43.
      const input = `4193`;
      expect(solver.solve(input)).toBe(93);
    });

    test("Input containing banks of varying lengths", () => {
      const input = `
                918
                591
                1234
                77
            `;
      // Total: 98 + 91 + 34 + 77 = 300
      expect(solver.solve(input)).toBe(300);
    });

    test("Empty input should result in zero", () => {
      expect(solver.solve("")).toBe(0);
    });

    test("Input with unexpected formatting (extra spaces, tabs, newline)", () => {
      // Bank 1: 918 -> 98
      // Bank 2: 777 -> 77
      const messyInput = ` 918 
            
            777
            `;
      // Total: 98 + 77 = 175
      expect(solver.solve(messyInput)).toBe(175);
    });

    test("Input with non-whitespace, non-digit characters", () => {
      const input = `12A45`;
      expect(solver.solve(input)).toBe(0);
    });
  });
});
