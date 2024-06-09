import { expect, describe, it } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import MentionableInput, { User } from "."

describe("MentionOverlay", () => {
  it("accepts and displays simple values properly", async () => {
    const { findByTestId } = setupMentionableInput()
    const mentionTextarea = await findByTestId("MentionTextarea")

    fireEvent.change(mentionTextarea, { target: { value: "Hello" } })

    expect(mentionTextarea.innerText).toBe("Hello")
  })

  it("opens up the mentionable users list", async () => {
    const { findByTestId } = setupMentionableInput()
    const mentionTextarea = await findByTestId("MentionTextarea")

    fireEvent.change(mentionTextarea, { target: { value: "Hello " } })
    fireEvent.change(mentionTextarea, { target: { value: "Hello @" } })
    fireEvent.click(mentionTextarea)

    expect((await findByTestId("UserList")).innerText).toBe(
      "Girish Gopaul\nBob Walker\nSheldon Cooper",
    )
  })

  it("allows to select and mention user using keys", async () => {
    const { findByTestId } = setupMentionableInput()
    const mentionTextarea = await findByTestId("MentionTextarea")

    fireEvent.change(mentionTextarea, { target: { value: "Hello " } })
    fireEvent.change(mentionTextarea, { target: { value: "Hello @" } })
    fireEvent.click(mentionTextarea)
    fireEvent.keyDown(mentionTextarea, { code: "ArrowDown" })
    fireEvent.keyDown(mentionTextarea, { code: "Enter" })

    const displayedText = mentionTextarea.innerText.replace(/\u00A0/g, " ")

    expect(displayedText).toBe("Hello @Bob Walker")
  })
})

const setupMentionableInput = () => {
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

  const users: User[] = [
    { id: "girish", fullname: "Girish Gopaul" },
    { id: "bob", fullname: "Bob Walker" },
    { id: "sheldon", fullname: "Sheldon Cooper" },
  ]

  return render(<MentionableInput users={users} />)
}
