import { FC, useMemo, useRef } from "react";
import { actualValueToDisplayValue } from "./utils";

interface MentionTextareaProps {
  value: string
  onChange: (value: string, displayedValue: string) => void
}

const MentionTextarea: FC<MentionTextareaProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textareaValue = useMemo(() => actualValueToDisplayValue(value), [value])
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

  return (
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
  )
}

export default MentionTextarea
