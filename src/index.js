import React from 'react'

import clearCurrentShortcut from './utils/clearCurrentShortcut'
import getCurrentShortcutText from './utils/getCurrentShortcutText'
import getSearchText from './utils/getSearchText'
import insertShortcutNode from './utils/insertShortcutNode'
import isInsideShortcut from './utils/isInsideShortcut'
import validateOptions from './utils/validateOptions'

import { TAB, ENTER, SPACE, UP, DOWN } from './keys'

export default function createShortcutPlugin(options) {
  const pluginOptions = validateOptions(options)

  const {
    Mark, Shortcut, SuggestionItem, trigger, type,
    onCollapse, onInsert, onSearch, onSeek, onTrigger
  } = pluginOptions

  const key = `${type}-shortcut`

  const schema = {
    marks: {
      [key]: Mark
    },
    nodes: {
      [key]: Shortcut
    }
  }

  function render(props, state) {
    console.log(props.children);
    return (
      <div id={`${key}-plugin`}>
        {props.children}
      </div>
    )
  }

  function addShortcut(shortcut, state) {
    return insertShortcutNode(shortcut, state, trigger, key)
  }

  function addMark(state) {
    return state.transform()
                .addMark(key)
                .insertText(trigger)
  }

  function onKeyDown(event, { code }, state) {
    if (!isInsideShortcut(state, key)) return

    switch (code) {
      case SPACE:
        return clearCurrentShortcut(state, trigger, key).apply()

      case TAB:
      case ENTER:
        event.preventDefault()

        onCollapse()
        return onInsert().apply()

      case DOWN:
        event.preventDefault()

        onSeek(1)
        return

      case UP:
        event.preventDefault()

        onSeek(-1)
        return
    }
  }

  function onBeforeInput(event, data, state) {
    if (isInsideShortcut(state, key)) {
      if (event.data === trigger) {
        event.preventDefault()
        return state
      }

      const shortcutText = getCurrentShortcutText(state.endText.text, trigger)
      onSearch(getSearchText(shortcutText, event.data))
    } else {
      if (event.data === trigger) {
        event.preventDefault()

        onTrigger()

        return addMark(state).apply()
      }
    }
  }

  function onChange(state) {
    const { selection } = state

    if (!selection.isCollapsed) {
      onCollapse()
      return
    }

    if (isInsideShortcut(state, key)) {
      onTrigger()
    } else {
      onCollapse()
    }
  }

  return {
    addMark,
    addShortcut,
    onBeforeInput,
    onChange,
    onKeyDown,
    render,
    schema,
  }
}
