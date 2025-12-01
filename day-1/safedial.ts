export enum Direction {
  Left = "L",
  Right = "R",
}

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
      this._moveDial(instruction.dir, instruction.numTicks);
      if (this.pos === 0) {
        countZero++;
      }
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
   * Apply a given instruction to the safe dial.
   *
   * @param instruction The instruction indicating direction and ticks
   * @throws {Error} If the instruction is invalid.
   */
  private _moveDial(dir: Direction, numTicks: number): void {
    if (dir === "L") {
      // Subtract the number of ticks and modulo to get the position.
      // Add back the number of positions to get a positive value in case it
      // was negative.
      // Modulo again to get the corrected positive position.
      this.pos = (this.pos - numTicks) % SafeDial.NUM_POSITIONS;
      this.pos = (this.pos + SafeDial.NUM_POSITIONS) % SafeDial.NUM_POSITIONS;
    } else if (dir === "R") {
      // Add the number of ticks and modulo to get the position.
      this.pos = (this.pos + numTicks) % SafeDial.NUM_POSITIONS;
    }
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
    const match = instruction.match(/^([L|R])([0-9]+)$/);

    if (!match) {
      throw new Error(`Invalid instruction: "${instruction}"`);
    }

    const dir = match[1] as Direction;
    const numTicks = parseInt(match[2]);
    return { dir, numTicks };
  }
}
