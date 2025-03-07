import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
import nextJest from "next/jest.js";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testRegex: ".*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  testTimeout: 90000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
