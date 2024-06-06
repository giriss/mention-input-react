import { FC, useEffect, useRef } from "react"

interface AmpersandProps {
  onInitialize: (x: number, y: number) => void
}

const Ampersand: FC<AmpersandProps> = ({ onInitialize }) => {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (spanRef.current && spanRef.current.offsetParent) {
      const parent = spanRef.current.offsetParent
      onInitialize(
        spanRef.current.offsetLeft - parent.scrollLeft,
        spanRef.current.offsetTop - parent.scrollTop,
      )
    }
  }, [onInitialize])

  return <span ref={spanRef}>@</span>
}

export default Ampersand
