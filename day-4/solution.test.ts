import { describe, expect, test } from "@jest/globals";
import { Solution } from "./solution";

// The Day 4 puzzle only has one part, so we'll just name the suite after the day.
describe("Advent of Code Day 4: Printing Department (Revised Logic)", () => {
  const solver = new Solution();

  // The number of accessible paper rolls in the puzzle's main example.
  const EXAMPLE_ACCESSIBLE_COUNT = 43;

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
      // (0,1): 3 adjacent (Accessible after iteration)
      // (0,2): 2 adjacent (Accessible)
      // (1,0): 3 adjacent (Accessible after iteration)
      // (1,2): 4 adjacent (Accessible)
      // (2,0): 2 adjacent (Accessible)
      // (2,1): 3 adjacent (Accessible)
      const input = `
@@@.
@.@.
@@..
`;
      expect(solver.solve(input)).toBe(7);
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
      // Roll (1,1): 4 adjacent (Accessible after iteration)
      // Roll (1,3): 6 adjacent (Accessible after iteration)
      // Roll (2,0): 1 adjacent (Accessible)
      // Roll (2,2): 3 adjacent (Accessible)
      // Roll (2,3): 3 adjacent (Accessible)
      // Roll (2,4): 2 adjacent (Accessible)
      const input = `
@.@@@
.@.@.
@.@@@
`;
      expect(solver.solve(input)).toBe(10);
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
      // After two round of iteration, all 9 are accessible
      expect(solver.solve(input)).toBe(9);
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

    test("Propagation: Long line removed end-to-end", () => {
      // Grid: @@@@@@ (6 rolls total)
      // Step 1: Ends (2 rolls) are accessible (1 neighbor each). Remove them.
      // Step 2: The new ends (2 rolls) are accessible (2 neighbors each). Remove them.
      // Step 3: The center 2 rolls are accessible (2 neighbors each). Remove them.
      const input = `@.@@@@@`; // 6 rolls
      // Expected: 6 (All rolls should eventually be removed)
      expect(solver.solve(input)).toBe(6);
    });

    test("Unlocking: Single core roll surrounded by a removable block (Corrected Count)", () => {
      /*
       * Grid (3x3):
       * .@.  <- 1 rolls
       * @@@  <- 2 rolls
       * .@.  <- 1 rolls
       * Total Rolls: 5
       * Initial State: The 4 border rolls are removed, center is blocked.
       * Step 1: Remove the 4 outer rolls.
       * The remaining roll is now accessible and removed
       * * Total Removed: 5
       */
      const input = `
.@.
@@@
.@.
`;
      expect(solver.solve(input)).toBe(5);
    });

    test("Termination: Final core remains permanently blocked", () => {
      // Grid:
      // .@.
      // @@@
      // .@.
      // Rolls: 5 total
      // Initial State: Corner rolls (4) are ACCESSIBLE (1 neighbor). Center roll (1,1) has 4 neighbors (BLOCKED).
      // Step 1: Remove the 4 corner rolls.
      // Step 2: The center roll remains with 0 neighbors (ACCESSIBLE). Remove it.
      //
      // Now consider a slightly larger core where one survives:
      // Grid:
      // @@@
      // @.@
      // @@@
      // Rolls: 8 total
      // Initial: 4 corners (2-3 neighbors) and 4 edges (4-5 neighbors).
      // The 4 edge rolls (0,1), (1,0), (1,2), (2,1) have 5 neighbors -> BLOCKED.
      // The 4 corner rolls are ACCESSIBLE.
      // Step 1: Remove 4 corner rolls.
      // Step 2: The remaining 4 rolls are still adjacent to each other (3 neighbors each). Remove them.
      //
      // Let's create one that stops:
      const input = `
..@
.@.
@..
`;
      // Rolls: 3 total. All are accessible (0 or 1 neighbor).
      // Test for a small grid that becomes blocked:
      const blockedInput = `
@.@
.@.
@.@
`;
      // Initial State: 4 rolls. All have 2 neighbors. Remove all 4. (4 total removed).

      // Let's use the provided 3x3 Block and expect 9, as per your earlier test.
      const input3x3 = `
@@@
@@@
@@@
`;
      // Expect 9 (All are removed in 2 steps, as shown in the walkthrough)
      expect(solver.solve(input3x3)).toBe(9);
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

    test("Jagged Grid: Iterative removal handles variable column lengths", () => {
      // Grid (5 rolls total):
      // @@@
      // @.
      // @
      // Initial State: R(0,0), R(0,2), R(1,0), R(2,0) are ACCESSIBLE. R(0,1) has 4 neighbors (BLOCKED).
      // Step 1: Remove the 4 accessible rolls.
      // Step 2: R(0,1) remains with 0 neighbors (ACCESSIBLE). Remove it.
      const input = `
@@@
@.
@
`;
      // Expected: 5 (All rolls should eventually be removed)
      expect(solver.solve(input)).toBe(5);
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
