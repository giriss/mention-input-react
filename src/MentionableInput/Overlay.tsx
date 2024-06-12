import { type FC, type ReactNode, useMemo, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import { mentionLocations } from "./utils"
import Ampersand from "./Ampersand"
import Mention from "./Mention"
import { TextareaCommon } from "./Textarea"

const OverlayBase = styled(TextareaCommon.withComponent("div"))`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
`

interface OverlayProps {
  scrollTop: number
  value: string
  displayedValue: string
  ampersandLocation?: number
  onMentionCoordinates: (x: number, y: number) => void
}

const Overlay: FC<OverlayProps> = ({
  scrollTop,
  value,
  displayedValue,
  ampersandLocation,
  onMentionCoordinates,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const formattedValue = useMemo(() => {
    const unformattedDisplayValue = displayedValue.split("")
    const lineBrokenValue = unformattedDisplayValue.reduce<ReactNode[]>(
      (memo, char, index) => {
        if (char === "\n") {
          if (index === unformattedDisplayValue.length - 1) {
            return [...memo, <br />, <>&nbsp;</>]
          } else {
            return [...memo, <br />]
          }
        } else if (char === " ") {
          return [...memo, <>&nbsp;</>]
        } else if (index === ampersandLocation) {
          return [...memo, <Ampersand onInitialize={onMentionCoordinates} />]
        }
        return [...memo, char]
      },
      [],
    )

    const locations = mentionLocations(value)

    if (locations.length === 0) return lineBrokenValue

    const mentionAddedValue: ReactNode[] = []
    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]
      if (i === 0) {
        mentionAddedValue.push(lineBrokenValue.slice(0, location[0]))
      } else {
        mentionAddedValue.push(
          lineBrokenValue.slice(locations[i - 1][1], location[0]),
        )
      }
      const mention = lineBrokenValue.slice(location[0], location[1])
      mentionAddedValue.push(<Mention>{mention}</Mention>)
      if (i === locations.length - 1) {
        mentionAddedValue.push(lineBrokenValue.slice(location[1]))
      }
    }

    return mentionAddedValue
  }, [displayedValue, value, ampersandLocation, onMentionCoordinates])

  useEffect(() => {
    if (!ref.current) return

    ref.current.scrollTop = scrollTop
  }, [scrollTop])

  return (
    <OverlayBase ref={ref} data-testid="Overlay">
      {formattedValue}
    </OverlayBase>
  )
}

export default Overlay
