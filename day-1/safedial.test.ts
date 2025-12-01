import { describe, expect, test } from "@jest/globals";
import { SafeDial } from "./safedial";

describe("safe dial (pass or stop at 0 count - Refined Logic)", () => {
  test("provided example (Expected count: 6)", () => {
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

    // Trace:
    // L68: 50 -> 82. Passes 0 at 0. Count = 1.
    // L30: 82 -> 52. No pass/stop. Count = 0.
    // R48: 52 -> 0. Stops at 0. Count = 1.
    // L5: 0 -> 95. No pass/stop (starting at 0). Count = 0.
    // R60: 95 -> 55. Passes 0 at 100. Count = 1.
    // L55: 55 -> 0. Stops at 0. Count = 1.
    // L1: 0 -> 99. No pass/stop (starting at 0). Count = 0.
    // L99: 99 -> 0. Stops at 0. Count = 1.
    // R14: 0 -> 14. No pass/stop (starting at 0). Count = 0.
    // L82: 14 -> 32. Passes 0 at 0. Count = 1.
    // Total Count = 6.
    const safeDial = new SafeDial();
    expect(safeDial.run(exampleInput)).toBe(6);
  });

  describe("boundaries", () => {
    test("single move", () => {
      const safeDial = new SafeDial();

      // R1: 50 -> 51. No pass/stop. Count = 0.
      expect(safeDial.run("R1")).toBe(0);
      expect(safeDial.pos).toBe(51);

      safeDial.reset();

      // L1: 50 -> 49. No pass/stop. Count = 0.
      expect(safeDial.run("L1")).toBe(0);
      expect(safeDial.pos).toBe(49);
    });

    test("move to 0", () => {
      const safeDial = new SafeDial();

      // R50: 50 -> 0. Stops at 0. Count = 1.
      expect(safeDial.run("R50")).toBe(1);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      // L50: 50 -> 0. Stops at 0. Count = 1.
      expect(safeDial.run("L50")).toBe(1);
      expect(safeDial.pos).toBe(0);
    });

    test("move past 0 (51 ticks)", () => {
      const safeDial = new SafeDial();

      // R51: 50 -> 1. Passes 0 at 100. Count = 1.
      expect(safeDial.run("R51")).toBe(1);
      expect(safeDial.pos).toBe(1);

      safeDial.reset();

      // L51: 50 -> 99. Passes 0 at 0. Count = 1.
      expect(safeDial.run("L51")).toBe(1);
      expect(safeDial.pos).toBe(99);
    });

    test("move shy of 0 (49 ticks)", () => {
      const safeDial = new SafeDial();

      // R49: 50 -> 99. No pass/stop. Count = 0.
      expect(safeDial.run("R49")).toBe(0);
      expect(safeDial.pos).toBe(99);

      safeDial.reset();

      // L49: 50 -> 1. No pass/stop. Count = 0.
      expect(safeDial.run("L49")).toBe(0);
      expect(safeDial.pos).toBe(1);
    });
  });

  describe("simple movements", () => {
    test("moves away from 0", () => {
      const safeDial = new SafeDial();

      // R10: 50 -> 60. No pass/stop. Count = 0.
      expect(safeDial.run("R10")).toBe(0);
      expect(safeDial.pos).toBe(60);

      safeDial.reset();

      // L25: 50 -> 25. No pass/stop. Count = 0.
      expect(safeDial.run("L25")).toBe(0);
      expect(safeDial.pos).toBe(25);
    });
  });

  describe("multiple instructions (chaining and state)", () => {
    test("alternating directions landing on zero (2 stops)", () => {
      const alternatingInput = `R50
L50
R50
L50`; 
      // R50: 50 -> 0. Stops at 0. Count = 1.
      // L50: 0 -> 50. No pass/stop (starting at 0). Count = 0.
      // R50: 50 -> 0. Stops at 0. Count = 1.
      // L50: 0 -> 50. No pass/stop (starting at 0). Count = 0.
      const safeDial = new SafeDial();
      expect(safeDial.run(alternatingInput)).toBe(2);
      expect(safeDial.pos).toBe(50);
    });

    test("multiple same-direction moves resulting in 2 stops at zero", () => {
      const chainedSameDirectionInput = `L40
L10
R100
R50`; 
      // L40: 50 -> 10. No pass/stop. Count = 0.
      // L10: 10 -> 0. Stops at 0. Count = 1.
      // R100: 0 -> 0. Stops at 0 (after wrapping 100). Count = 1.
      // R50: 0 -> 50. No pass/stop (starting at 0). Count = 0.
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
L1`; 
      // R1: 50 -> 51. Count = 0.
      // ...
      // L1: 51 -> 50. Count = 0.
      const safeDial = new SafeDial();
      expect(safeDial.run(complexNonZeroInput)).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("stop at zero, then immediately move away (0->X moves count = 0)", () => {
      const zeroThenAwayInput = `L50
R1
L1`; 
      // L50: 50 -> 0. Stops at 0. Count = 1.
      // R1: 0 -> 1. No pass/stop (starting at 0). Count = 0.
      // L1: 1 -> 0. Stops at 0. Count = 1.
      const safeDial = new SafeDial();
      expect(safeDial.run(zeroThenAwayInput)).toBe(2);
      expect(safeDial.pos).toBe(0);
    });

    test("explicit 99 to 0 wrap (1 stop)", () => {
      const wrapInput = `R49 
R1`; 
      // R49: 50 -> 99. No pass/stop. Count = 0.
      // R1: 99 -> 0. Stops at 0. Count = 1.
      const safeDial = new SafeDial();
      expect(safeDial.run(wrapInput)).toBe(1);
      expect(safeDial.pos).toBe(0);
    });
  });

  describe("large spin values (multiple wraps)", () => {
    test("multi-wrap, no stop at 0", () => {
      const safeDial = new SafeDial();

      // R100: 50 -> 50. Passes 0 at 100. Count = 1.
      expect(safeDial.run("R100")).toBe(1);
      expect(safeDial.pos).toBe(50);

      safeDial.reset();

      // L100: 50 -> 50. Passes 0 at 0. Count = 1.
      expect(safeDial.run("L100")).toBe(1);
      expect(safeDial.pos).toBe(50);
    });

    test("multi-wrap, landing exactly on 0", () => {
      const safeDial = new SafeDial();

      // R150: 50 -> 0. Passes 0 at 100, stops at 200 (0). Count = 2.
      expect(safeDial.run("R150")).toBe(2);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      // L150: 50 -> 0. Passes 0 at 0, stops at -100 (0). Count = 2.
      expect(safeDial.run("L150")).toBe(2);
      expect(safeDial.pos).toBe(0);
    });

    test("very large multi-wrap, landing exactly on 0", () => {
      const safeDial = new SafeDial();

      // R250: 50 -> 0. Passes 0 at 100, 200, stops at 300 (0). Count = 3.
      expect(safeDial.run("R250")).toBe(3);
      expect(safeDial.pos).toBe(0);

      safeDial.reset();

      // L250: 50 -> 0. Passes 0 at 0, -100, stops at -200 (0). Count = 3.
      expect(safeDial.run("L250")).toBe(3);
      expect(safeDial.pos).toBe(0);
    });

    test("extremely large ticks (testing large integer stability)", () => {
      const safeDial = new SafeDial();
      const hugeTicks = 500000000 + 1;

      // R500000001: 50 -> 51. Passes 0 5,000,000 times (at 100, 200, ...). Count = 5000000.
      expect(safeDial.run(`R${hugeTicks}`)).toBe(5000000);
      expect(safeDial.pos).toBe(51);
    });
  });

  describe("edge cases", () => {
    test("empty string input", () => {
      // "": 50 -> 50. No movement. Count = 0.
      const safeDial = new SafeDial();
      expect(safeDial.run("")).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("instruction with zero ticks (R0, L0)", () => {
      const safeDial = new SafeDial();
      // R0: 50 -> 50. No movement. Count = 0.
      expect(safeDial.run("R0")).toBe(0);
      expect(safeDial.pos).toBe(50);

      safeDial.reset();

      // L0: 50 -> 50. No movement. Count = 0.
      expect(safeDial.run("L0")).toBe(0);
      expect(safeDial.pos).toBe(50);
    });

    test("instructions containing negative ticks must throw an error", () => {
      const safeDial = new SafeDial();
      const inputWithNegative = `R-10
L50`;
      // R-10: Throws error. Position remains 50.
      expect(() => safeDial.run(inputWithNegative)).toThrow();
      expect(safeDial.pos).toBe(50);
    });

    test("instructions with invalid starting letter or format must throw an error", () => {
      const safeDial = new SafeDial();
      const invalidInput = `X10
R50
L_5`;
      // X10: Throws error. Position remains 50.
      expect(() => safeDial.run(invalidInput)).toThrow();
      expect(safeDial.pos).toBe(50);
    });

    test("instruction with non-numeric ticks must throw an error", () => {
      const safeDial = new SafeDial();
      const badTicks = `L10A
R50`;
      // L10A: Throws error. Position remains 50.
      expect(() => safeDial.run(badTicks)).toThrow();
      expect(safeDial.pos).toBe(50);
    });

    test("input containing whitespace and blank lines should process valid lines", () => {
      const safeDial = new SafeDial();
      const messyInput = `R50
 
L50  
`;
      // R50: 50 -> 0. Stops at 0. Count = 1.
      // L50: 0 -> 50. No pass/stop. Count = 0.
      expect(safeDial.run(messyInput)).toBe(1);
      expect(safeDial.pos).toBe(50);
    });
  });
});
