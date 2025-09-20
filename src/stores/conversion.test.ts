import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useConversionStore } from "@/stores/conversion";

// Mock del store de rates
vi.mock("@/stores/rates", () => ({
  useRatesStore: vi.fn(() => ({
    hasRates: true,
    purchase_price: 3.75,
    sale_price: 3.8,
  })),
}));

describe("conversion store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with default values", () => {
    const store = useConversionStore();

    expect(store.mode).toBe("PEN_TO_USD");
    expect(store.penInput).toBe("");
    expect(store.usdInput).toBe("");
    expect(store.decimals).toBe(2);
  });

  it("should calculate PEN to USD conversion correctly", () => {
    const store = useConversionStore();

    store.setPenInput("380");
    expect(store.result).toBe(100);
    expect(store.hasResult).toBe(true);
  });

  it("should calculate USD to PEN conversion correctly", () => {
    const store = useConversionStore();

    store.setMode("USD_TO_PEN");
    store.setUsdInput("100");
    expect(store.result).toBe(375);
    expect(store.hasResult).toBe(true);
  });

  it("should handle invalid inputs gracefully", () => {
    const store = useConversionStore();

    store.setPenInput("invalid");
    expect(store.result).toBe(0);
    expect(store.hasResult).toBe(false);
  });

  it("should swap mode correctly", () => {
    const store = useConversionStore();

    store.setPenInput("380");
    store.setUsdInput("100");

    store.swapMode();

    expect(store.mode).toBe("USD_TO_PEN");
    // Después del swap, el modo cambia y los valores se intercambian
    // Los valores exactos dependen de los cálculos de conversión
    expect(store.penInput).toBeTruthy();
    expect(store.usdInput).toBeTruthy();
  });

  it("should clear inputs", () => {
    const store = useConversionStore();

    store.setPenInput("100");
    store.setUsdInput("50");

    store.clearInputs();

    expect(store.penInput).toBe("");
    expect(store.usdInput).toBe("");
  });

  it("should set decimals within valid range", () => {
    const store = useConversionStore();

    store.setDecimals(4);
    expect(store.decimals).toBe(4);

    store.setDecimals(-1);
    expect(store.decimals).toBe(0);

    store.setDecimals(15);
    expect(store.decimals).toBe(10);
  });
});
