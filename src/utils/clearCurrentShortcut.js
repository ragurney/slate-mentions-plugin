import getCurrentShortcutText from './getCurrentShortcutText'

export default function clearCurrentShortcut(state, trigger, key) {
  const currentShortcut = getCurrentShortcutText(state.endText.text, trigger)

  return state.transform()
              .selectAll()
              .removeMark(key)
              .collapseToEnd()
}
