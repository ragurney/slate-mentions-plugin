export default function isInsideShortcut(state, key) {
  return state.marks.some(mark => mark.type === key)
}
