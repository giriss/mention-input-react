import { useCallback, useState, useMemo, type FC } from "react"
import { actualValueToDisplayValue, displayIndexToActualIndex } from "./utils"
import UserList from "./UserList"
import MentionTextarea from "./MentionTextarea"
import MentionOverlay from "./MentionOverlay"

export interface User {
  id: string
  fullname: string
}

interface MentionableInput {
  users: User[]
}

const MentionableInput: FC<MentionableInput> = ({ users }) => {
  const [actualValue, setActualValue] = useState<string>("")
  const [ampersandLocation, setAmpersandLocation] = useState<number>()
  const [ampersandPosition, setAmpersandPosition] = useState<[number, number]>()
  const [selectedUserIndex, setSelectedUserIndex] = useState(0)
  const [mentionFilter, setMentionFilter] = useState<string>()
  const [selectionStart, setSelectionStart] = useState(0)
  const [overlayScrollTop, setOverlayScrollTop] = useState(0)
  const filteredUsers = useMemo(
    () => mentionFilter ? users.filter(({ fullname }) => fullname.toLowerCase().match(mentionFilter.toLowerCase())) : users,
    [users, mentionFilter]
  )
  const displayedValue = useMemo(() => actualValueToDisplayValue(actualValue), [actualValue])
  const removeMentionList = useCallback(() => {
    setAmpersandLocation(undefined)
    setAmpersandPosition(undefined)
    setMentionFilter(undefined)
  }, [])

  const handleUpOrDownKey = useCallback((key: "UP" | "DOWN") => {
    if (key === "DOWN" && selectedUserIndex < filteredUsers.length - 1) {
      setSelectedUserIndex(current => current + 1)
    } else if (key === "UP" && selectedUserIndex > 0) {
      setSelectedUserIndex(current => current - 1)
    }
  }, [selectedUserIndex, filteredUsers.length])

  const handleEnterKey = useCallback(() => {
    const selectedUser = filteredUsers[selectedUserIndex]
    setActualValue(actualValue => {
      if (!ampersandLocation) return actualValue

      return actualValue.substring(0, displayIndexToActualIndex(ampersandLocation, actualValue)) + `@[${selectedUser.id};${selectedUser.fullname}]` + actualValue.substring(displayIndexToActualIndex(selectionStart, actualValue))
    })
  }, [filteredUsers, selectedUserIndex, ampersandLocation, selectionStart])

  const handleMentionStart = useCallback((location: number) => {
    setAmpersandLocation(location)
    setSelectedUserIndex(0)
  }, [])

  const handleCaretPosition = useCallback((start: number, end: number) => {
    setSelectionStart(start)
    if (ampersandLocation != null && ampersandLocation < start && start === end) {
      const filterValue = displayedValue.substring(ampersandLocation + 1, start)
      if (/^[a-zA-Z0-9-]*$/.test(filterValue)) {
        return setMentionFilter(filterValue)
      }
    }
    removeMentionList()
  }, [ampersandLocation, displayedValue, removeMentionList])

  const handleScrollTop = useCallback((scrollTop: number) => {
    setOverlayScrollTop(scrollTop)
  }, [])

  const handleMentionCoordinates = useCallback((x: number, y: number) => {
    setAmpersandPosition([x + 10, y + 10])
  }, [])

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <MentionOverlay
          scrollTop={overlayScrollTop}
          ampersandLocation={ampersandLocation}
          displayedValue={displayedValue}
          value={actualValue}
          onMentionCoordinates={handleMentionCoordinates}
        />
        <MentionTextarea
          value={actualValue}
          displayedValue={displayedValue}
          onChange={setActualValue}
          onEnterKey={ampersandLocation == null ? undefined : handleEnterKey}
          onMentionStart={handleMentionStart}
          onSelectionChange={handleCaretPosition}
          onScrollTopChange={handleScrollTop}
          onUpOrDownKey={ampersandLocation == null ? undefined : handleUpOrDownKey}
        />
      </div>

      {mentionFilter != null && ampersandPosition && (
        <UserList
          users={filteredUsers}
          position={ampersandPosition}
          selectedIndex={selectedUserIndex}
        />
      )}
    </div>
  )
}

export default MentionableInput
