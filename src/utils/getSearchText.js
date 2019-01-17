export default function getSearchText(currentShortcutText, lastCharacter) {
  return `${currentShortcutText}${lastCharacter}`.substring(1)
}
