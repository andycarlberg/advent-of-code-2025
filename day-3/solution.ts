export class Solution {
  static readonly BANK_REGEXP: RegExp = /^[0-9]{12,}$/;

  static readonly TARGET_LENGTH = 12;

  public solve(input: string): bigint {
    const banks = Solution.parseInput(input);

    let sum = 0n;
    for (const bank of banks) {
      sum = sum + this.maxOutput(bank);
    }

    return sum;
  }

  private maxOutput(bank: string): bigint {
    const stack: bigint[] = [];
    let countToDrop = bank.length - Solution.TARGET_LENGTH;
    for (const char of bank) {
      const voltage = BigInt(char);

      // We need to compare our current digit and drop digits as necessary
      // until we either have only 12 digits remaining or we run into a value
      // greater than our current value.
      while (countToDrop > 0 && voltage > stack[stack.length - 1]) {
        stack.pop();
        countToDrop--;
      }

      // Since we always add it, it will eventually fill.
      stack.push(voltage);
    }

    // Truncate to TARGET_LENGTH
    stack.length = Solution.TARGET_LENGTH;

    const stringValue = stack.join("");
    return BigInt(stringValue);
  }

  private static parseInput(input: string): string[] {
    return input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim()) // Trim the lines
      .filter((line) => Solution.BANK_REGEXP.test(line)); // Validate input
  }
}
