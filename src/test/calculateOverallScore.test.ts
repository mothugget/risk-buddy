import { describe, it, expect } from "vitest";
import { calculateOverallScore } from "@/lib/utils";

describe("calculateOverallScore", () => {
    it("returns 0 when factors is empty", () => {
        const result = calculateOverallScore([], {});
        expect(result).toBe(0);
    });

    it("returns 0 when factors is undefined", () => {
        const result = calculateOverallScore(undefined, {});
        expect(result).toBe(0);
    });

    it("calculates weighted consequence score correctly", () => {
        const factors = [
            {
                "id": "a",
                "name": "data",
                "consequence": 5,
                "created_at": "2026-01-27T07:08:43.718Z"
            },
            {
                "id": "b",
                "name": "foo",
                "consequence": 5,
                "created_at": "2026-01-27T07:08:51.801Z"
            }
        ]

        const scores = {
            a: 40,
            b: 20,
        };

        // (4 * 50%) + (2 * 50%) = 2 + 1 = 3
        const result = calculateOverallScore(factors, scores);

        expect(result).toBe(3);
    });

    it("uses 0 for missing scores", () => {
        const factors = [{
            "id": "6cd99651-086c-4adf-a906-f84759a8ee20",
            "name": "foo",
            "consequence": 100,
            "created_at": "2026-01-27T07:08:51.801Z"
        }];
        const scores = {};

        const result = calculateOverallScore(factors, scores);

        expect(result).toBe(0);
    });
});
