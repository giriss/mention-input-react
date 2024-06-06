import { expect, describe, it } from "vitest"
import {
  displayIndexToActualIndex,
  actualValueToDisplayValue,
  calculateChange,
  mentionLocations,
} from "."

const actualValue =
  "Hey @[1;Girish Gopaul]! How are you? Me and @[2;Someone Else] are waiting for you."

describe("displayIndexToActualIndex", () => {
  it("returns 2 when the display index is 2", () => {
    expect(displayIndexToActualIndex(2, actualValue)).toBe(2)
  })

  it("returns 4 when the display index is 10", () => {
    expect(displayIndexToActualIndex(10, actualValue)).toBe(4)
  })

  it("returns 22 when the display index is 10 and useMentionEndIndex is true", () => {
    expect(displayIndexToActualIndex(10, actualValue, true)).toBe(22)
  })

  it("returns 42 when the display index is 38", () => {
    expect(displayIndexToActualIndex(38, actualValue)).toBe(42)
  })

  it("returns 64 when the display index is 56", () => {
    expect(displayIndexToActualIndex(56, actualValue)).toBe(64)
  })
})

describe("actualValueToDisplayValue", () => {
  it("returns the same value when there is no mention", () => {
    const stringWithoutMention = "Hello Sir @[fakeMention]!"
    expect(actualValueToDisplayValue(stringWithoutMention)).toBe(
      stringWithoutMention,
    )
  })

  it("understands the mention format and returns the value to be displayed", () => {
    expect(actualValueToDisplayValue(actualValue)).toBe(
      "Hey @Girish Gopaul! How are you? Me and @Someone Else are waiting for you.",
    )
  })
})

describe("calculateChange", () => {
  it("identifies additions", () => {
    expect(calculateChange("ab", "abcd")).toEqual([2, 2, "cd"])
    expect(calculateChange("ab", "yzab")).toEqual([0, 0, "yz"])
    expect(calculateChange("ab", "axxb")).toEqual([1, 1, "xx"])
  })

  it("identifies removals", () => {
    expect(calculateChange("abcd", "ad")).toEqual([1, 3, ""])
    expect(calculateChange("abcd", "ab")).toEqual([2, 4, ""])
    expect(calculateChange("abcd", "cd")).toEqual([0, 2, ""])
    expect(calculateChange("aaa", "aa")).toEqual([2, 3, ""])
  })

  it("identifies replacements", () => {
    expect(calculateChange("abcd", "axd")).toEqual([1, 3, "x"])
    expect(calculateChange("abcd", "axxd")).toEqual([1, 3, "xx"])
    expect(calculateChange("abcd", "xbcd")).toEqual([0, 1, "x"])
    expect(calculateChange("abcd", "abcx")).toEqual([3, 4, "x"])
  })
})

describe("mentionLocations", () => {
  it("returns empty array when there is no mention", () => {
    expect(mentionLocations("Hey girish!")).toEqual([])
  })

  it("returns the correct locations of mentions", () => {
    expect(
      mentionLocations("Hey @[girish;Girish Gopaul]! Do you know @[him;Him]?"),
    ).toEqual([
      [4, 18],
      [32, 36],
    ])
  })
})
