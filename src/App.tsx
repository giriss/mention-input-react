import type { FC } from "react"
import MentionableInput from "./MentionableInput"

const App: FC = () => {
  return (
    <MentionableInput
      users={[
        { id: "alia", fullname: "Alia Bhatt" },
        { id: "girish", fullname: "Girish Gopaul" },
        { id: "bob", fullname: "Bob Marley" },
        { id: "varun", fullname: "Varun Dhawan" },
      ]}
    />
  )
}

export default App
