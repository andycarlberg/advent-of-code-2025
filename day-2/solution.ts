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

      // A number made up of repeated numbers of arbitrary length will be
      // divisible by (1+ 10^k + ... + 10(n-1)k) where k is the length of
      // the repeated number and n is the number of repeats.

      // This logic will find repeated id's and I can't see how to optimize
      // it out so we'll use a Set to avoid duplication.
      const invalidIds = new Set<number>();

      // We need to check all of the possible id lengths
      for (let l = Math.max(2, startLength); l <= endLength; l++) {
        // Then we need to check all of the possible repeats
        for (let n = 2; n <= l; n++) {
          if (l % n !== 0) {
            // The pattern length doesn't fit into the length
            continue;
          }

          const k = l / n;

          let multiplier = 0;
          for (let i = 0; i < n; i++) {
            multiplier += Math.pow(10, i * k);
          }

          // find the bounds on the repeated number for the given k
          const repeatStart = Math.ceil(start / multiplier);
          const repeatEnd = Math.floor(end / multiplier);

          // Because we can't have leading zeros, we must also find the range of
          // numbers that could repeat and still be within our range.
          const minRepeat = Math.pow(10, k - 1);
          const maxRepeat = Math.pow(10, k) - 1;

          const effectiveStart = Math.max(repeatStart, minRepeat);
          const effectiveEnd = Math.min(repeatEnd, maxRepeat);

          for (let p = effectiveStart; p <= effectiveEnd; p++) {
            invalidIds.add(p * multiplier);
          }
        }
      }

      for (const id of invalidIds) {
        sum += id;
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
        parts[0] > parts[1]
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
