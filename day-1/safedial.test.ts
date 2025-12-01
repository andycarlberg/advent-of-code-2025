import { describe, expect, test } from "@jest/globals";
import { SafeDial } from "./safedial";

describe("safe dial", () => {
  test("provided example", () => {
    const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

    const safeDial = new SafeDial();
    expect(safeDial.run(exampleInput)).toBe(3);
  });

  describe("boundaries", () => {
    test("single move", () => {
      const safeDial = new SafeDial();

      expect(safeDial.run("R1")).toBe(0);
      expect(safeDial.pos).toBe(51);

      safeDial.reset();

      expect(safeDial.run("L1")).toBe(0);
      expect(safeDial.pos).toBe(49);
    });

    test("move to 0", () => {
      const safeDial = new SafeDial();

      expect(safeDial.run("R50")).toBe(1);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      expect(safeDial.run("L50")).toBe(1);
      expect(safeDial.pos).toBe(0);
    });

    test("move past 0 (51 ticks)", () => {
      const safeDial = new SafeDial();

      expect(safeDial.run("R51")).toBe(0);
      expect(safeDial.pos).toBe(1);

      safeDial.reset();

      expect(safeDial.run("L51")).toBe(0);
      expect(safeDial.pos).toBe(99);
    });

    test("move shy of 0 (49 ticks)", () => {
      const safeDial = new SafeDial();

      expect(safeDial.run("R49")).toBe(0);
      expect(safeDial.pos).toBe(99);

      safeDial.reset();

      expect(safeDial.run("L49")).toBe(0);
      expect(safeDial.pos).toBe(1);
    });
  });

  describe("simple movements", () => {
    test("moves away from 0", () => {
      const safeDial = new SafeDial();

      // Starts at 50, moves right 10 to 60.
      expect(safeDial.run("R10")).toBe(0);
      expect(safeDial.pos).toBe(60);

      safeDial.reset();

      // Starts at 50, moves left 25 to 25.
      expect(safeDial.run("L25")).toBe(0);
      expect(safeDial.pos).toBe(25);
    });
  });

  describe("multiple instructions (chaining and state)", () => {
    test("alternating directions landing on zero (2 stops)", () => {
      const alternatingInput = `R50
L50
R50
L50`; // 50 -> 0 (Stop 1) -> 50 -> 0 (Stop 2) -> 50

      const safeDial = new SafeDial();
      expect(safeDial.run(alternatingInput)).toBe(2);
      expect(safeDial.pos).toBe(50);
    });

    test("multiple same-direction moves resulting in 1 stop at zero", () => {
      const chainedSameDirectionInput = `L40
L10
R100
R50`; // 50 -> 10 -> 0 (Stop 1) -> 0 -> 50

      const safeDial = new SafeDial();
      expect(safeDial.run(chainedSameDirectionInput)).toBe(2);
      expect(safeDial.pos).toBe(50);
    });

    test("many non-zero stops", () => {
      const complexNonZeroInput = `R1
R1
R1
L1
L1
L1`; // 50 -> 51 -> 52 -> 53 -> 52 -> 51 -> 50

      const safeDial = new SafeDial();
      expect(safeDial.run(complexNonZeroInput)).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("stop at zero, then immediately move away", () => {
      const zeroThenAwayInput = `L50
R1
L1`; // 50 -> 0 (Stop 1) -> 1 -> 0 (Stop 2)

      const safeDial = new SafeDial();
      expect(safeDial.run(zeroThenAwayInput)).toBe(2);
      expect(safeDial.pos).toBe(0);
    });

    test("explicit 99 to 0 wrap (1 stop)", () => {
      const wrapInput = `R49 
R1`; // 50 -> 99 (Count=0) -> 0 (Count=1)

      const safeDial = new SafeDial();
      expect(safeDial.run(wrapInput)).toBe(1);
      expect(safeDial.pos).toBe(0);
    });
  });

  describe("large spin values (multiple wraps)", () => {
    test("multi-wrap, no stop at 0", () => {
      const safeDial = new SafeDial();

      // 50 + 100 = 150 -> 50. No stop at 0.
      expect(safeDial.run("R100")).toBe(0);
      expect(safeDial.pos).toBe(50);

      safeDial.reset();

      // 50 - 100 = -50 -> 50. No stop at 0.
      expect(safeDial.run("L100")).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("multi-wrap, landing exactly on 0", () => {
      const safeDial = new SafeDial();

      // 50 + 150 = 200 -> 0. Stops at 0.
      expect(safeDial.run("R150")).toBe(1);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      // 50 - 150 = -100 -> 0. Stops at 0.
      expect(safeDial.run("L150")).toBe(1);
      expect(safeDial.pos).toBe(0);
    });

    test("very large multi-wrap, landing exactly on 0", () => {
      const safeDial = new SafeDial();

      // 50 + 250 = 300 -> 0. Stops at 0.
      expect(safeDial.run("R250")).toBe(1);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      // 50 - 250 = -200 -> 0. Stops at 0.
      expect(safeDial.run("L250")).toBe(1);
      expect(safeDial.pos).toBe(0);
    });

    test("extremely large ticks (testing large integer stability)", () => {
      const safeDial = new SafeDial();
      // A large prime number of ticks that shouldn't land on 0 (e.g., a number slightly off an even hundred)
      const hugeTicks = 500000000 + 1; // 500 million + 1

      // 50 + (500000000 + 1) = 500000051. 500000051 % 100 = 51. No stop at 0.
      expect(safeDial.run(`R${hugeTicks}`)).toBe(0);
      expect(safeDial.pos).toBe(51);
    });
  });

  describe("edge cases", () => {
    test("empty string input", () => {
      const safeDial = new SafeDial();

      // Empty string should result in 0 stops at 0, position remains 50.
      expect(safeDial.run("")).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("instruction with zero ticks (R0, L0)", () => {
      const safeDial = new SafeDial();

      // R0 should change the stop count to 0, and position should remain 50.
      expect(safeDial.run("R0")).toBe(0);
      expect(safeDial.pos).toBe(50);

      safeDial.reset();

      // L0 should also result in 0 stops, position remains 50.
      expect(safeDial.run("L0")).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("instructions containing negative ticks must throw an error", () => {
      const safeDial = new SafeDial();

      const inputWithNegative = `R-10
L50`;

      // We wrap the function call in an anonymous function for Jest's toThrow()
      expect(() => safeDial.run(inputWithNegative)).toThrow();

      // Check the position remains the starting value (50) because the error
      // should stop execution immediately.
      expect(safeDial.pos).toBe(50);
    });

    test("instructions with invalid starting letter or format must throw an error", () => {
      const safeDial = new SafeDial();

      const invalidInput = `X10
R50
L_5`;

      // The first invalid line (X10) should cause the function to throw.
      expect(() => safeDial.run(invalidInput)).toThrow();

      // Position should remain 50.
      expect(safeDial.pos).toBe(50);
    });

    test("instruction with non-numeric ticks must throw an error", () => {
      const safeDial = new SafeDial();

      const badTicks = `L10A
R50`;

      // L10A should cause the function to throw.
      expect(() => safeDial.run(badTicks)).toThrow();

      // Position should remain 50.
      expect(safeDial.pos).toBe(50);
    });

    test("input containing whitespace and blank lines should process valid lines", () => {
      const safeDial = new SafeDial();

      // Lines included:
      // 1. Valid: R50 (50 -> 0, Stop 1)
      // 2. Whitespace: "  " (Should be ignored)
      // 3. Blank line: "" (Should be ignored)
      // 4. Valid with trailing space: L50  (0 -> 50, Stop 1)
      const messyInput = `R50
 

L50  
`;

      expect(safeDial.run(messyInput)).toBe(1);
      expect(safeDial.pos).toBe(50);
    });
  });
});
