export class Solution {
  static readonly BANK_REGEXP: RegExp = /^[1-9]{2,}$/;

  public solve(input: string): number {
    const banks = Solution.parseInput(input);

    let sum = 0;
    for (const bank of banks) {
      sum += this.maxOutput(bank);
    }

    return sum;
  }

  private maxOutput(bank: string): number {
    const bankMax = new MaxVoltage();

    for (const char of bank) {
      const voltage = parseInt(char);
      bankMax.testAndUpdate(voltage);
    }

    return bankMax.value();
  }

  private static parseInput(input: string): string[] {
    return input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim()) // Trim the lines
      .filter((line) => Solution.BANK_REGEXP.test(line)); // Validate input
  }
}

class MaxVoltage {
  private currentMax = 0;
  private bestTensDigit = 0;

  testAndUpdate(value: number): void {
    // Check if the new value in the ones place creates a new max
    const potentialMax = this.bestTensDigit * 10 + value;
    if (potentialMax > this.currentMax) {
      this.currentMax = potentialMax;
    }

    // Check if the new value would be a better tens digit if there is another
    // value is provided. If this is the last digit to be applied, then the
    // currentMax doesn't change. If another digit is provided then this value
    // must be greater than the previous max no matter what. The previous check
    // will capture it.
    if (value > this.bestTensDigit) {
      this.bestTensDigit = value;
    }
  }

  value(): number {
    return this.currentMax;
  }
}
