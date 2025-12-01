export class SafeDial {
  pos: number;

  constructor() {
    this.pos = 0;
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
    return 0;
  }

  /**
   * Reset the safe dial.
   */
  public reset(): void {
    this.pos = 50;
  }
}
