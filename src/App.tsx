import { type FC, useMemo } from "react"
import MentionableInput from "./MentionableInput"

const App: FC = () => {
  const users = useMemo(
    () => [
      { id: "alia", fullname: "Alia Bhatt" },
      { id: "girish", fullname: "Girish Gopaul" },
      { id: "bob", fullname: "Bob Marley" },
      { id: "varun", fullname: "Varun Dhawan" },
    ],
    [],
  )

  return <MentionableInput users={users} />
}

export default App
