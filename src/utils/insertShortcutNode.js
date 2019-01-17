import getCurrentShortcutText from './getCurrentShortcutText'
import isInsideShortcut from '../utils/isInsideShortcut'

export default function insertShortcutNode(data, state, trigger, type) {
  let transform = state.transform()

  if (isInsideShortcut(state, type)) {
    const currentShortcut = getCurrentShortcutText(state.endText.text, trigger)
    transform = transform.deleteBackward(currentShortcut.length)
  }

  const shortcut = { isVoid: true, type, data }

  return transform.insertInline(shortcut).collapseToStartOfNextText()
}
