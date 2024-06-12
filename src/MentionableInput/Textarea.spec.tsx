import { expect, describe, it, vi } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import Textarea from "./Textarea"

describe("Textarea", () => {
  it("changes the value properly", async () => {
    const fn = vi.fn()
    const { baseElement } = render(
      <Textarea
        value=""
        displayedValue=""
        onChange={fn}
        onMentionStart={() => {}}
        onScrollTopChange={() => {}}
        onSelectionChange={() => {}}
      />,
    )

    fireEvent.change(baseElement.querySelector("textarea")!, {
      target: { value: "test" },
    })

    expect(fn).toHaveBeenCalledWith("test")
  })

  it("detects when mention starts", async () => {
    const fn = vi.fn()
    const { baseElement } = render(
      <Textarea
        value="test "
        displayedValue="test "
        onChange={() => {}}
        onMentionStart={fn}
        onScrollTopChange={() => {}}
        onSelectionChange={() => {}}
      />,
    )

    fireEvent.change(baseElement.querySelector("textarea")!, {
      target: { value: "test @" },
    })

    expect(fn).toHaveBeenCalledWith(5)
  })
})
