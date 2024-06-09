import {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  UIEventHandler,
  useCallback,
  useRef,
} from "react"
import styled from "@emotion/styled"
import { calculateChange, displayIndexToActualIndex } from "./utils"

export const MentionTextareaCommon = styled.textarea`
  padding: 10px;
  margin: 0;
  border: solid 1px transparent;
  border-radius: 5px;
  font: 12px sans-serif;
  word-break: break-all;
`

const MentionTextareaBase = styled(MentionTextareaCommon)`
  position: relative;
  background: transparent;
  color: transparent;
  caret-color: black;
  border-color: rgba(0, 190, 255, 0.5);
  outline: none;
  min-width: 400px;
  min-height: 150px;

  :focus {
    border-color: rgb(0, 190, 255);
  }
`

interface MentionTextareaProps {
  value: string
  displayedValue: string
  onChange: (value: string) => void
  onMentionStart: (location: number) => void
  onScrollTopChange: (scrollTop: number) => void
  onUpOrDownKey?: (action: "UP" | "DOWN") => void
  onEnterKey?: VoidFunction
  onSelectionChange: (selectionStart: number, selectionEnd: number) => void
}

const MentionTextarea: FC<MentionTextareaProps> = ({
  value,
  displayedValue,
  onMentionStart,
  onChange,
  onScrollTopChange,
  onUpOrDownKey,
  onEnterKey,
  onSelectionChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const [start, end, replacement] = calculateChange(
        displayedValue,
        event.target.value,
      )
      if (start === end && replacement === "@") {
        onMentionStart(start)
      }

      const startIndex = displayIndexToActualIndex(start, value)
      const endIndex = displayIndexToActualIndex(end, value, true)
      onChange(
        `${value.substring(0, startIndex)}${replacement}${value.substring(endIndex)}`,
      )
    },
    [displayedValue, onMentionStart, value, onChange],
  )
  const handleScroll: UIEventHandler<HTMLTextAreaElement> = useCallback(
    ({ currentTarget: { scrollTop } }) => {
      onScrollTopChange(scrollTop)
    },
    [onScrollTopChange],
  )
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      if (["ArrowDown", "ArrowUp"].includes(event.code) && onUpOrDownKey) {
        event.preventDefault()
        onUpOrDownKey(event.code === "ArrowDown" ? "DOWN" : "UP")
      } else if (event.code === "Enter" && onEnterKey) {
        event.preventDefault()
        onEnterKey()
      }
    },
    [onUpOrDownKey, onEnterKey],
  )
  const handleSelection = useCallback(() => {
    if (!textareaRef.current) return

    const { selectionStart, selectionEnd } = textareaRef.current
    onSelectionChange(selectionStart, selectionEnd)
  }, [onSelectionChange])

  return (
    <MentionTextareaBase
      ref={textareaRef}
      value={displayedValue}
      onChange={handleChange}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      onKeyUp={handleSelection}
      onClick={handleSelection}
      data-testid="MentionTextarea"
    />
  )
}

export default MentionTextarea
