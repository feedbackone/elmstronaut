import { expect, test } from "vitest";
import { CREATOR_MODE } from "./dev.js";

test("CREATOR_MODE should be disabled before publishing", () => {
	expect(CREATOR_MODE).toBe(false);
});
