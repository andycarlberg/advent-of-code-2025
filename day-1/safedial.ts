export class SafeDial {
  // By problem statement, we start at 50.
  readonly START_POINT: number = 50;

  // There are 100 positions (0-99)
  readonly NUM_POSITIONS: number = 100;

  pos: number;

  constructor() {
    this.pos = this.START_POINT;
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
      if (this._doInstruction(instruction) && this.pos === 0) {
        countZero++;
      }
    }

    return countZero;
  }

  /**
   * Reset the safe dial.
   */
  public reset(): void {
    this.pos = this.START_POINT;
  }

  /**
   * Apply a given instruction to the safe dial.
   *
   * @param instruction The instruction indicating direction and ticks
   * @throws {Error} If the instruction is invalid.
   */
  private _doInstruction(instruction: string): boolean {
    instruction = instruction.trim();

    // if the instruction is empty or only whitespace, do nothing.
    if (instruction.length === 0) {
      return false;
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

    if (dir === "L") {
      // Subtract the number of ticks and modulo to get the position.
      // Add back the number of positions to get a positive value in case it
      // was negative.
      // Modulo again to get the corrected positive position.
      this.pos =
        (((this.pos - numTicks) % this.NUM_POSITIONS) + this.NUM_POSITIONS) %
        this.NUM_POSITIONS;
    } else if (dir === "R") {
      // Add the number of ticks and modulo to get the position.
      this.pos = (this.pos + numTicks) % this.NUM_POSITIONS;
    }

    return true;
  }
}
