import type { JestConfigWithTsJest } from "ts-jest";
import { createDefaultEsmPreset } from "ts-jest";

const defaultEsmPreset = createDefaultEsmPreset();

const config: JestConfigWithTsJest = {
  ...defaultEsmPreset,
  testEnvironment: "node",
  // You may need this for relative imports in TS files
  // that don't include the .js extension:
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
