export const Direction = {
  Left: "L",
  Right: "R",
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export class SafeDial {
  // By problem statement, we start at 50.
  static readonly START_POINT: number = 50;

  // There are 100 positions (0-99)
  static readonly NUM_POSITIONS: number = 100;

  pos: number;

  constructor() {
    this.pos = SafeDial.START_POINT;
  }

  /**
   * Applies a set of instructions to the safe dial.
   * This function takes a set of instructions in the format "[R/L][###]"
   * indicating the direction (Right or Left) to spin the dial and the number
   * of steps the dial should make. Each instruction should be on a new line.
   * The number of times the dial *stopped* at '0' is returned.
   * For invalid input, an error is thrown.
   *
   * @param input The instruction set
   * @returns The number of times the dial stopped at 0
   * @throws {Error} If the input is invalid
   */
  public run(input: string): number {
    const parsedInstructions = SafeDial._parseAll(input);

    let countZero = 0;

    for (const instruction of parsedInstructions) {
      // Accumulate the count of zero-crossings/stops returned by _moveDial
      countZero += this._moveDial(instruction.dir, instruction.numTicks);
    }

    return countZero;
  }

  /**
   * Reset the safe dial.
   */
  public reset(): void {
    this.pos = SafeDial.START_POINT;
  }

  /**
   * Apply a given instruction to the safe dial and return the count of zero-crossings/stops.
   *
   * @param dir The instruction indicating direction
   * @param numTicks The number of ticks to move
   * @returns The number of times the dial passed or stopped at 0 during this move.
   */
  private _moveDial(dir: Direction, numTicks: number): number {
    const startPos = this.pos;
    let endPos: number;
    let countZeros = 0;

    if (dir === Direction.Left) {
      // Subtract the number of ticks and modulo to get the position.
      // Add back the number of positions to get a positive value in case it
      // was negative.
      // Modulo again to get the corrected positive position.
      endPos = (startPos - numTicks) % SafeDial.NUM_POSITIONS;
      endPos = (endPos + SafeDial.NUM_POSITIONS) % SafeDial.NUM_POSITIONS;

      // Check if a crossing could potentially happen
      if (numTicks > 0 && numTicks >= startPos) {
        const ticksToFirstZero =
          startPos === 0 ? SafeDial.NUM_POSITIONS : startPos;
        // If there are enough ticks to cross zero, proceed
        if (numTicks >= ticksToFirstZero) {
          countZeros =
            1 +
            Math.floor((numTicks - ticksToFirstZero) / SafeDial.NUM_POSITIONS);
        }
      }
    } else if (dir === Direction.Right) {
      // Add the number of ticks and modulo to get the position.
      endPos = (startPos + numTicks) % SafeDial.NUM_POSITIONS;
      countZeros = Math.floor((startPos + numTicks) / SafeDial.NUM_POSITIONS);
    }

    this.pos = endPos!;

    return countZeros;
  }

  private static _parseAll(
    input: string,
  ): { dir: Direction; numTicks: number }[] {
    return input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim()) // Trim the lines
      .filter((line) => line.length > 0) // Remove empty lines
      .map((line) => SafeDial._validateAndParse(line)); // Use the new function
  }

  private static _validateAndParse(instruction: string): {
    dir: Direction;
    numTicks: number;
  } {
    const match = instruction.match(/^([LR])([0-9]+)$/);

    if (!match) {
      throw new Error(`Invalid instruction: "${instruction}"`);
    }

    const dir = match[1] as Direction;
    const numTicks = parseInt(match[2]);
    return { dir, numTicks };
  }
}
