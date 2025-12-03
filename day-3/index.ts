import * as fs from "fs";
import * as path from "path";
import { Solution } from "./solution.ts";

function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  const absolutePath = path.resolve(filePath);

  // Read the file synchronously. For a simple CLI, this is often acceptable.
  // Use 'utf8' encoding to get the content as a string.
  const fileContent: string = fs.readFileSync(absolutePath, "utf8");

  const solution = new Solution();
  const result = solution.solve(fileContent);

  console.log(result);
}

main();
