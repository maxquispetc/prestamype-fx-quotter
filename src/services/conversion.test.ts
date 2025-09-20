import { describe, it, expect } from "vitest";
import { penToUsd, usdToPen, roundToDecimals } from "@/services/conversion";

describe("conversion.ts", () => {
  describe("roundToDecimals", () => {
    it("should round to 2 decimal places by default", () => {
      expect(roundToDecimals(1.23456)).toBe(1.23);
      expect(roundToDecimals(1.235)).toBe(1.24);
    });

    it("should round to specified decimal places", () => {
      expect(roundToDecimals(1.23456, 3)).toBe(1.235);
      expect(roundToDecimals(1.23456, 4)).toBe(1.2346);
    });

    it("should handle non-finite values", () => {
      expect(roundToDecimals(NaN)).toBe(0);
      expect(roundToDecimals(Infinity)).toBe(0);
      expect(roundToDecimals(-Infinity)).toBe(0);
    });

    it("should handle stable rounding for typical cases", () => {
      // Caso típico de redondeo estable
      expect(roundToDecimals(1.125, 2)).toBe(1.13);
      expect(roundToDecimals(2.125, 2)).toBe(2.13);
      expect(roundToDecimals(1.135, 2)).toBe(1.14);
    });
  });

  describe("penToUsd", () => {
    it("should convert PEN to USD correctly", () => {
      // penToUsd(380, 3.80) ≈ 100
      expect(penToUsd(380, 3.8)).toBe(100);
      expect(penToUsd(190, 3.8)).toBe(50);
    });

    it("should handle different decimal precision", () => {
      expect(penToUsd(100, 3.8, 4)).toBe(26.3158);
      expect(penToUsd(100, 3.8, 0)).toBe(26);
    });

    it("should handle non-finite pen values", () => {
      expect(penToUsd(NaN, 3.8)).toBe(0);
      expect(penToUsd(Infinity, 3.8)).toBe(0);
      expect(penToUsd(-Infinity, 3.8)).toBe(0);
    });

    it("should throw error for invalid sale price", () => {
      expect(() => penToUsd(100, 0)).toThrow(
        "El precio de venta debe ser mayor a 0"
      );
      expect(() => penToUsd(100, -1)).toThrow(
        "El precio de venta debe ser mayor a 0"
      );
    });

    it("should throw error for non-finite sale price", () => {
      expect(() => penToUsd(100, NaN)).toThrow(
        "El precio de venta debe ser un número válido"
      );
      expect(() => penToUsd(100, Infinity)).toThrow(
        "El precio de venta debe ser un número válido"
      );
    });
  });

  describe("usdToPen", () => {
    it("should convert USD to PEN correctly", () => {
      // usdToPen(100, 3.75) ≈ 375
      expect(usdToPen(100, 3.75)).toBe(375);
      expect(usdToPen(50, 3.75)).toBe(187.5);
    });

    it("should handle different decimal precision", () => {
      expect(usdToPen(100, 3.75, 4)).toBe(375.0);
      expect(usdToPen(100, 3.75, 0)).toBe(375);
    });

    it("should handle non-finite usd values", () => {
      expect(usdToPen(NaN, 3.75)).toBe(0);
      expect(usdToPen(Infinity, 3.75)).toBe(0);
      expect(usdToPen(-Infinity, 3.75)).toBe(0);
    });

    it("should throw error for invalid purchase price", () => {
      expect(() => usdToPen(100, 0)).toThrow(
        "El precio de compra debe ser mayor a 0"
      );
      expect(() => usdToPen(100, -1)).toThrow(
        "El precio de compra debe ser mayor a 0"
      );
    });

    it("should throw error for non-finite purchase price", () => {
      expect(() => usdToPen(100, NaN)).toThrow(
        "El precio de compra debe ser un número válido"
      );
      expect(() => usdToPen(100, Infinity)).toThrow(
        "El precio de compra debe ser un número válido"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle zero amounts", () => {
      expect(penToUsd(0, 3.8)).toBe(0);
      expect(usdToPen(0, 3.75)).toBe(0);
    });

    it("should handle very small amounts", () => {
      expect(penToUsd(0.01, 3.8, 4)).toBe(0.0026);
      expect(usdToPen(0.01, 3.75, 4)).toBe(0.0375);
    });

    it("should handle very large amounts", () => {
      expect(penToUsd(1000000, 3.8)).toBe(263157.89);
      expect(usdToPen(1000000, 3.75)).toBe(3750000);
    });
  });
});
