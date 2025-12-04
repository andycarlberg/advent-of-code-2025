export class Solution {
  static readonly FILTER_REGEXP: RegExp = /^(\.|@)+$/;

  static readonly NEIGHBOR_OFFSETS: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // NW, N, NE
    [0, -1],
    [0, 1], // W, E
    [1, -1],
    [1, 0],
    [1, 1], // SW, S, SE
  ];

  public solve(input: string): number {
    const rows = Solution.parseInput(input);

    const R = rows.length;
    if (R === 0) return 0; // nothing to do here.

    // Track the number of neighbors a given roll has, initialized to 0
    const neighborCounts: number[][] = rows.map((row) =>
      Array(row.length).fill(0),
    );

    for (let r = 0; r < R; r++) {
      const rowData = rows[r];
      const C = rowData.length;

      for (let c = 0; c < C; c++) {
        // ignore non-roll data
        if (rowData[c] === "@") {
          for (const [rowOffset, charOffset] of Solution.NEIGHBOR_OFFSETS) {
            const neighborRow = r + rowOffset;
            const neighborCol = c + charOffset;

            if (
              neighborRow >= 0 &&
              neighborRow < R &&
              neighborCol >= 0 &&
              neighborCol < neighborCounts[neighborRow].length
            ) {
              neighborCounts[neighborRow][neighborCol]++;
            }
          }
        }
      }
    }

    let accCount = 0;
    // Count the number of rolls with fewer than 4 neighbors.
    for (let r = 0; r < R; r++) {
      const currentRow = rows[r];
      for (let c = 0; c < currentRow.length; c++) {
        if (currentRow[c] === "@") {
          if (neighborCounts[r][c] < 4) {
            accCount++;
          }
        }
      }
    }

    return accCount;
  }

  private static parseInput(input: string): string[] {
    return input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim()) // Trim the lines
      .filter((line) => Solution.FILTER_REGEXP.test(line)); // Validate input
  }
}
