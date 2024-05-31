import { css } from "@emotion/react"
import { useCallback, useState, type FC, type ChangeEventHandler, type UIEventHandler, useRef, ReactNode, useMemo, KeyboardEventHandler } from "react"
import { actualValueToDisplayValue, calculateChange, displayIndexToActualIndex, mentionLocations } from "./utils"
import Ampersand from "./Ampersand"
import Mention from "./Mention"
import UserList from "./UserList"

const commonStyles = css`
  padding: 5px;
  margin: 0;
  border: solid 1px;
  font: 12px sans-serif;
`

const overlayStyles = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  word-wrap: break-word;
`

const textareaStyles = css`
  position: relative;
  background: transparent;
  color: transparent;
  caret-color: black;
`

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
  const textareaValue = useMemo(() => actualValueToDisplayValue(actualValue), [actualValue])
  const displayValue = useMemo(() => {
    const unformattedDisplayValue = textareaValue.split("")
    const lineBrokenValue = unformattedDisplayValue.reduce<ReactNode[]>((memo, char, index) => {
      if (char === "\n") {
        if (index === unformattedDisplayValue.length - 1) {
          return [...memo, <br />, <>&nbsp;</>]
        } else {
          return [...memo, <br />]
        }
      } else if (char === " ") {
        return [...memo, <>&nbsp;</>]
      } else {
        return [...memo, index === ampersandLocation ? <Ampersand onInitialize={setAmpersandPosition} /> : char]
      }
    }, [])

    const locations = mentionLocations(actualValue)

    if (locations.length === 0) return lineBrokenValue

    const mentionAddedValue: ReactNode[] = []
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      if (i === 0) {
        mentionAddedValue.push(lineBrokenValue.slice(0, location[0]))
      } else {
        mentionAddedValue.push(lineBrokenValue.slice(locations[i - 1][1], location[0]))
      }
      const mention = lineBrokenValue.slice(location[0], location[1])
      mentionAddedValue.push(<Mention>{mention}</Mention>)
      if (i === locations.length - 1) {
        mentionAddedValue.push(lineBrokenValue.slice(location[1]))
      }
    }

    return mentionAddedValue
  }, [textareaValue, actualValue, ampersandLocation])
  const divRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const removeMentionList = useCallback(() => {
    setAmpersandLocation(undefined)
    setAmpersandPosition(undefined)
    setMentionFilter(undefined)
  }, [])
  const handleMentionFilter = useCallback(() => {
    if (!textareaRef.current) return

    const { selectionStart, selectionEnd } = textareaRef.current
    if (ampersandLocation != null && ampersandLocation < selectionStart && selectionStart === selectionEnd) {
      const filterValue = textareaValue.substring(ampersandLocation + 1, selectionStart)
      if (/^[a-zA-Z0-9-]*$/.test(filterValue)) {
        return setMentionFilter(filterValue)
      }
    }
    removeMentionList()
  }, [ampersandLocation, textareaValue, removeMentionList])
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(event => {
    handleMentionFilter()
    const [start, end, replacement] = calculateChange(textareaValue, event.target.value)
    if (start === end && replacement === "@") {
      setAmpersandLocation(start)
      setSelectedUserIndex(0)
    }

    setActualValue(actualValue => {
      const startIndex = displayIndexToActualIndex(start, actualValue)
      const endIndex = displayIndexToActualIndex(end, actualValue, true)
      return `${actualValue.substring(0, startIndex)}${replacement}${actualValue.substring(endIndex)}`
    })
  }, [textareaValue, handleMentionFilter])
  const handleScroll: UIEventHandler<HTMLTextAreaElement> = useCallback(event => {
    const { scrollTop } = event.target as HTMLTextAreaElement
    if (divRef.current) {
      divRef.current.scrollTop = scrollTop
    }
  }, [])
  const handleKeyUpDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(event => {
    const p = (v: string) => {
      console.log(v)
      return v
    }
    if (["ArrowDown", "ArrowUp", "Enter"].includes(event.code)) {
      event.preventDefault()
      switch (event.code) {
        case "ArrowDown":
          if (selectedUserIndex < users.length - 1) setSelectedUserIndex(current => current + 1)
          break
        case "ArrowUp":
          if (selectedUserIndex > 0) setSelectedUserIndex(current => current - 1)
          break
        case "Enter": {
          const selectedUser = users[selectedUserIndex]
          setActualValue(actualValue => {
            if (!textareaRef.current || !ampersandLocation) return actualValue

            return p(actualValue.substring(0, displayIndexToActualIndex(ampersandLocation, actualValue)) + `@[${selectedUser.id};${selectedUser.fullname}]` + actualValue.substring(displayIndexToActualIndex(textareaRef.current.selectionStart, actualValue)))
          })
        }
      }
    }
  }, [selectedUserIndex, users, ampersandLocation])

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          ref={divRef}
          css={css(overlayStyles, commonStyles)}
        >
          {displayValue}
        </div>
        <textarea
          css={css(textareaStyles, commonStyles)}
          ref={textareaRef}
          value={textareaValue}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={mentionFilter == null ? undefined : handleKeyUpDown}
          onKeyUp={handleMentionFilter}
          onClick={handleMentionFilter}
        />
      </div>

      {mentionFilter != null && ampersandPosition && (
        <UserList
          users={users}
          position={ampersandPosition}
          selectedIndex={selectedUserIndex}
        />
      )}
    </div>
  )
}

export default MentionableInput
