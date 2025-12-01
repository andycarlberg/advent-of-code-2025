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
    const instructions = input.split(/\r\n|\r|\n/);

    let countZero = 0;

    for (const instruction of instructions) {
      // If the instruction applied and the current position is 0,
      // we need to increment the count.
      if (this._moveDial(instruction) && this.pos === 0) {
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
  private _moveDial(instruction: string): boolean {
    const parsed = this._parseInstrucion(instruction);
    if (!parsed) {
      return false;
    }
    const { dir, numTicks } = parsed;

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

    return true;
  }

  private _parseInstrucion(
    instruction: string,
  ): { dir: string; numTicks: number } | null {
    instruction = instruction.trim();

    // if the instruction is empty or only whitespace, do nothing.
    if (instruction.length === 0) {
      return null;
    }

    // Matches instructions in exactly our format.
    // first group is direction, second group is ticks.
    // Anything else fails and match is null.
    const match = instruction.match(/^([L|R])([0-9]+)$/);
    if (!match) {
      throw new Error("Invalid instruction.");
    }

    // Swallow the full match and extract groups.
    const [, dir, strTicks] = match;
    // We can assume strTicks will be defined because otherwise the regex would
    // have failed and returned null, caught in the previous if statement.
    const numTicks = parseInt(strTicks!);
    return { dir, numTicks };
  }
}
