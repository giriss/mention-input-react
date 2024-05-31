const mentionRegex = () => /@\[([a-z0-9-]{1,36});([a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*)\]/g

export const displayIndexToActualIndex = (displayIndex: number, actualValue: string, useMentionEndIndex = false) => {
  const mentionFormat = mentionRegex()
  let match = mentionFormat.exec(actualValue)
  let delta = 0
  while (match) {
    const [fullMatch, , name] = match
    const { index } = match
    if (displayIndex <= index - delta) {
      break
    }
    if (displayIndex < index - delta + name.length + 1) {
      return useMentionEndIndex ? index + fullMatch.length : index
    }
    delta += fullMatch.length - (name.length + 1)
    match = mentionFormat.exec(actualValue)
  }
  return displayIndex + delta
}

export const mentionLocations = (actualValue: string) => {
  const mentionFormat = mentionRegex()
  let match = mentionFormat.exec(actualValue)
  let delta = 0
  const locations: [number, number][] = []
  while (match) {
    const [fullMatch, , name] = match
    const { index } = match
    locations.push([index - delta, index - delta + 1 + name.length])
    delta += fullMatch.length - (name.length + 1)
    match = mentionFormat.exec(actualValue)
  }
  return locations
}

export const actualValueToDisplayValue = (actualValue: string) => actualValue.replace(mentionRegex(), (_fullMatch, _id, name) => `@${name}`)

export const calculateChange = (before: string, after: string): [number, number, string] => {
  const shortest = before.length <= after.length ? "BEFORE" : "AFTER"
  const shortestText = shortest === "BEFORE" ? before : after;
  const longestText = shortest === "BEFORE" ? after : before;

  let startDiffIndex = shortestText.length;
  for (let i = 0; i < shortestText.length; i++) {
    if (shortestText[i] === longestText[i]) {
      continue
    } else {
      startDiffIndex = i
      break
    }
  }

  let endDiffIndex = startDiffIndex;
  const comparisonsLeft = shortestText.length - startDiffIndex
  for (let i = 0; i < comparisonsLeft; i++) {
    if (shortestText[shortestText.length - 1 - i] === longestText[longestText.length - 1 -i]) {
      continue
    } else {
      endDiffIndex = startDiffIndex + (comparisonsLeft - i)
      break
    }
  }

  const sizeDiff = longestText.length - shortestText.length

  if (shortest === "AFTER") {
    return [
      startDiffIndex,
      endDiffIndex + sizeDiff,
      shortestText.substring(startDiffIndex, endDiffIndex)
    ]
  }

  return [
    startDiffIndex,
    endDiffIndex,
    longestText.substring(startDiffIndex, endDiffIndex + sizeDiff)
  ]
}
