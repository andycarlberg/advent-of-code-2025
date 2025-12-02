type Range = {
  start: number;
  end: number;
};

export class Solution {
  public solve(input: string): number {
    const ranges = Solution.parseInput(input);

    let sum = 0;
    for (const { start, end } of ranges) {
      const startLength = start.toString().length;
      const endLength = end.toString().length;

      // A number made up of two repeated numbers will be divisible
      // by (10^k + 1) where k is the length of the repeated number
      // so we can use this to make our test much more efficient.

      // Find the bounds on k based on our range
      const minK = Math.ceil(startLength / 2);
      const maxK = Math.floor(endLength / 2);

      for (let k = minK; k <= maxK; k++) {
        const multiplier = Math.pow(10, k) + 1;

        // find the bounds on the repeated number for the given k
        const repeatStart = Math.ceil(start / multiplier);
        const repeatEnd = Math.floor(end / multiplier);

        // Because we can't have leading zeros, we must also find the range of
        // numbers that could repeat and still be within our range.
        const minRepeat = Math.pow(10, k - 1);
        const maxRepeat = Math.pow(10, k) - 1;

        const effectiveStart = Math.max(repeatStart, minRepeat);
        const effectiveEnd = Math.min(repeatEnd, maxRepeat);

        for (let n = effectiveStart; n <= effectiveEnd; n++) {
          // n * multiplier will *always* be a repeat
          // and we already know if must be in the range
          // so we can immediately sum.
          sum += n * multiplier;
        }
      }
    }
    return sum;
  }

  private static parseInput(input: string): Range[] {
    // split input on commas and remove any empty items
    // this gives us an array of ranges
    const rangeStrings = input
      .split(",")
      .map((rangeString) => rangeString.trim())
      .filter((rangeString) => rangeString.length > 0);

    const ranges: Range[] = [];
    for (const rangeString of rangeStrings) {
      // split range by hyphen and filter empty items
      const parts = rangeString
        .split("-")
        .map((endPoint) => endPoint.trim())
        .filter((endPoint) => endPoint.length > 0)
        .map((endPoint) => parseInt(endPoint));

      if (
        parts.length !== 2 ||
        isNaN(parts[0]) ||
        isNaN(parts[1]) ||
        parts[1] > parts[2]
      ) {
        // If it's an invalid range, we just ignore it.
        continue;
      }

      // Return the successfully parsed range object.
      ranges.push({ start: parts[0], end: parts[1] });
    }

    return ranges;
  }
}
