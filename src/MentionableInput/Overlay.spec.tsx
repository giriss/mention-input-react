import { expect, describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import Overlay from "./Overlay"

describe("Overlay", () => {
  it("displays simple values properly", async () => {
    const page = render(
      <Overlay
        value="Test"
        displayedValue="Test"
        scrollTop={0}
        onMentionCoordinates={() => {}}
      />,
    )

    expect(page.baseElement.textContent).toBe("Test")
  })

  it("displays user mentions properly", async () => {
    const page = render(
      <Overlay
        value="Test @[1;First Last Name]!"
        displayedValue="Test @First Last Name!"
        scrollTop={0}
        onMentionCoordinates={() => {}}
      />,
    )

    const normalizedTextContent = page.baseElement.textContent!.replace(
      /\u00A0/g,
      " ",
    )

    expect(normalizedTextContent).toBe("Test @First Last Name!")
  })

  it("sends the '@' coordinates properly", async () => {
    const fn = vi.fn()

    // offsetParent doesn't exist in jsdom & happy-dom
    Object.defineProperty(HTMLElement.prototype, "offsetParent", {
      configurable: true,
      get: function () {
        return this._offsetParent || { scrollTop: 0, scrollLeft: 0 }
      },
      set(val) {
        this._offsetParent = val
      },
    })

    render(
      <div style={{ position: "relative" }}>
        <Overlay
          value="Test @"
          displayedValue="Test @"
          scrollTop={0}
          ampersandLocation={5}
          onMentionCoordinates={fn}
        />
      </div>,
    )

    expect(fn).toHaveBeenCalledWith(expect.any(Number), expect.any(Number))
  })
})
