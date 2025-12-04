import { describe, expect, test } from "@jest/globals";
import { Solution } from "./solution";

// The Day 4 puzzle only has one part, so we'll just name the suite after the day.
describe("Advent of Code Day 4: Printing Department (Revised Logic)", () => {
  const solver = new Solution();

  // The number of accessible paper rolls in the puzzle's main example.
  const EXAMPLE_ACCESSIBLE_COUNT = 13;

  // =========================================================
  // ## Core Logic Tests
  // =========================================================

  test("Provided Example: Correctly counts 13 accessible rolls", () => {
    /*
     * The input should yield 13 rolls that have < 4 adjacent rolls.
     */
    const exampleInput = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`;
    expect(solver.solve(exampleInput)).toBe(EXAMPLE_ACCESSIBLE_COUNT);
  });

  describe("Adjacency Rule: Fewer than four rolls", () => {
    /*
     * Rule: A roll (@) is accessible if it has < 4 adjacent rolls (@).
     * The accessibility check must be performed for EVERY roll on the grid.
     */

    test("Accessible: Surrounded by 3 rolls (max allowed adjacent)", () => {
      // Grid:
      // .@@.
      // ...@
      // .@@.
      // Rolls: 5 total
      // Roll 1 (Top-Center-Left): 3 adjacent (Accessible)
      // Roll 2 (Top-Center-Right): 3 adjacent (Accessible)
      // Roll 3 (Middle-Right): 2 adjacent (Accessible)
      // Roll 4 (Bottom-Center-Left): 3 adjacent (Accessible)
      // Roll 5 (Bottom-Center-Right): 3 adjacent (Accessible)
      const input = `
.@@.
...@
.@@.
`;
      // Expected: 5 accessible rolls
      expect(solver.solve(input)).toBe(5);
    });

    test("Not Accessible: Surrounded by 4 rolls (minimum to be blocked)", () => {
      // Grid:
      // @@@.
      // @.@.
      // @@..
      // Rolls: 6 total
      // (0,0): 2 adjacent (Accessible)
      // (0,1): 3 adjacent (BLOCKED)
      // (0,2): 2 adjacent (Accessible)
      // (1,0): 3 adjacent (BLOCKED)
      // (1,2): 4 adjacent (Accessible)
      // (2,0): 2 adjacent (Accessible)
      // (2,1): 3 adjacent (Accessible)
      const input = `
@@@.
@.@.
@@..
`;
      expect(solver.solve(input)).toBe(5);
    });

    test("Not Accessible: Fully Blocked (Checkerboard pattern)", () => {
      // Grid:
      // @.@@@
      // .@.@.
      // @.@@@
      // Roll (0,0): 1 adjacent (Accessible)
      // Roll (0,2): 3 adjacent (Accessible)
      // Roll (0,3): 3 adjacent (Accessible)
      // Roll (0,4): 2 adjacent (Accessible)
      // Roll (1,1): 4 adjacent (BLOCKED)
      // Roll (1,3): 6 adjacent (BLOCKED)
      // Roll (2,0): 1 adjacent (Accessible)
      // Roll (2,2): 3 adjacent (Accessible)
      // Roll (2,3): 3 adjacent (Accessible)
      // Roll (2,4): 2 adjacent (Accessible)
      const input = `
@.@@@
.@.@.
@.@@@
`;
      expect(solver.solve(input)).toBe(8);
    });

    test("Not Accessible: Center of 3x3 block (8 adjacent)", () => {
      // The center '@' has 8 adjacent '@'s (BLOCKED).
      // The 8 surrounding '@'s all have < 4 adjacent (Accessible).
      const input = `
@@@
@@@
@@@
`;
      // Total rolls: 9. Center one is blocked.
      // Expected: 8 accessible rolls
      expect(solver.solve(input)).toBe(4);
    });

    test("Accessible: Single roll (0 adjacent)", () => {
      const input = `
...
.@.
...
`;
      // Expected: 1
      expect(solver.solve(input)).toBe(1);
    });
  });

  // =========================================================
  // ## Edge Cases and Grid Boundaries
  // =========================================================

  describe("Grid Boundaries and Edge Cases", () => {
    test("Checking accessibility on all four edges and corners", () => {
      /*
       * Grid:
       * @..@
       * ....
       * .@..
       * @.@.
       * All 5 rolls have 0 adjacent rolls and are Accessible.
       */
      const input = `
@..@
....
.@..
@.@.
`;
      expect(solver.solve(input)).toBe(5);
    });

    test("Small 1x1 grid (single accessible roll)", () => {
      const input = `@`;
      expect(solver.solve(input)).toBe(1);
    });

    test("Large grid with only non-roll characters (zero accessible rolls)", () => {
      const input = `
..........
..........
..........
..........
`;
      expect(solver.solve(input)).toBe(0);
    });

    test("Input with varying line lengths (should handle jagged input)", () => {
      // (0,0) @: 1 adjacent (Accessible)
      // (0,1) @: 1 adjacent (Accessible)
      // (1,0) @: 1 adjacent (Accessible)
      // (2,0) @: 0 adjacent (Accessible)
      const input = `
@@
@
@
`;
      expect(solver.solve(input)).toBe(4);
    });

    test("Empty input should result in zero", () => {
      expect(solver.solve("")).toBe(0);
    });

    test("Ignore rows with invalid characters", () => {
      const input = `
@.A.
..@.
. @.
`;
      // There is 1 accessible roll in a valid row.
      expect(solver.solve(input)).toBe(1);
    });

    test("Ignore extra whitespace", () => {
      const input = `
@...  

  ..@.
 ..@.
`;
      // There are 3 valid rows with 1 accessible roll each.
      expect(solver.solve(input)).toBe(3);
    });
  });
});
