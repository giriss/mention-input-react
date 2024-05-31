import type { FC } from "react"
import MentionableInput from "./MentionableInput"

const App: FC = () => {
  return (
    <MentionableInput
      users={[
        { id: "asdf", fullname: "Asdf Fdsa" },
        { id: "girish", fullname: "Girish Gopaul" },
      ]}
    />
  )
}

export default App
