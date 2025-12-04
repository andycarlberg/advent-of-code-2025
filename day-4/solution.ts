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

    // For part2, we really need proper two dimensional array
    const grid: string[][] = rows.map((row) => row.split(""));

    // Track the number of neighbors a given roll has, initialized to 0
    const neighborCounts: number[][] = rows.map((row) =>
      Array(row.length).fill(0),
    );

    // we need to track rolls that have been removed to avoid double-counting
    const removedRolls: Set<string> = new Set();
    // track candidates *to be* removed
    let removableQueue: Set<string> = new Set();
    let removedCount = 0;

    for (let r = 0; r < R; r++) {
      const rowData = grid[r];
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

    // Instead of counting the removed, we queue them for removal
    // This build up the initial queue to be processed
    for (let r = 0; r < R; r++) {
      const currentRow = grid[r];
      for (let c = 0; c < currentRow.length; c++) {
        if (currentRow[c] === "@") {
          if (neighborCounts[r][c] < 4) {
            removableQueue.add(this.createCoordKey(r, c));
          }
        }
      }
    }

    // Now process any removals, adding any newly removable rolls to the queue
    // until we've removed everything we can
    while (removableQueue.size > 0) {
      // Get the next item in the set
      // (since it's not a true queue, we need the iterator)
      const iterator = removableQueue.values();
      const key = iterator.next().value;
      removableQueue.delete(key);

      if (removedRolls.has(key)) continue;

      const parts = key.split(",").map(Number);
      const r = parts[0];
      const c = parts[1];

      // Remove the roll
      removedCount++;
      removedRolls.add(key); // Mark as finalized

      // Update adjacency
      for (const [dr, dc] of Solution.NEIGHBOR_OFFSETS) {
        const nr = r + dr;
        const nc = c + dc;
        const neighborKey = this.createCoordKey(nr, nc);

        if (nr >= 0 && nr < R && nc >= 0 && nc < neighborCounts[nr].length) {
          neighborCounts[nr][nc]--;
          const newCount = neighborCounts[nr][nc];

          if (
            grid[nr][nc] === "@" &&
            !removedRolls.has(neighborKey) &&
            newCount < 4
          ) {
            removableQueue.add(neighborKey);
          }
        }
      }
    }

    return removedCount;
  }

  private createCoordKey(r: number, c: number): string {
    return `${r},${c}`;
  }

  private static parseInput(input: string): string[] {
    return input
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim()) // Trim the lines
      .filter((line) => Solution.FILTER_REGEXP.test(line)); // Validate input
  }
}
