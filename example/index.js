import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Editor, Plain, Raw } from 'slate'

import Shortcut from './Shortcut'
import Suggestion from './Suggestion'

import createShortcutsPlugin from '../src'

import './main.scss'

const initialState = {}

class App extends Component {
  state = {
    state: Plain.deserialize(''),
    index: 0,
    open: false,
    suggestions: [
      {
        id: 1,
        title: '/hi',
        description: 'Hi, how can we help you today? =)'
      },
      {
        id: 2,
        title: '/hi-with-options',
        description: 'Hello, welcome. What camera are you looking for?'
      },
      {
        id: 3,
        title: '/hi-with-attitude',
        description: 'Well hello there, what brings you to these parts?'
      },
      {
        id: 4,
        title: '/hi-pirate-mode',
        description: 'Ahoy there matey, how are ye faring this fine day?'
      }
    ]
  }

  addShortcut = (shortcut) => {
    const { state } = this.state
    this.setState({ open: false })
    return this.shortcutPlugin.addShortcut(shortcut, state).insertText(' ')
  }

  onCollapseShortcuts = () => {
    this.setState({ open: false })
  }

  onInsertShortcut = () => {
    const { index, suggestions } = this.state

    return this.addShortcut(suggestions[index])
  }

  onSeekShortcuts = (delta) => {
    const { index, suggestions } = this.state

    let newIndex = index + delta
    if (newIndex < 0) newIndex = 0
    if (newIndex >= suggestions.length) newIndex = suggestions.length - 1

    this.setState({ index: newIndex })
  }

  onTriggerShortcuts = () => {
    this.setState({ index: 0, open: true })
  }

  shortcutPlugin = createShortcutsPlugin({
    Shortcut,
    trigger: '/',
    type: 'user',
    onCollapse: this.onCollapseShortcuts,
    onTrigger: this.onTriggerShortcuts,
    onSeek: this.onSeekShortcuts,
    onInsert: this.onInsertShortcut
  })

  onClickAddShortcut = shortcut => (
    this.onChange(this.addShortcut(shortcut).apply())
  )

  onClickLogRaw = () => {
    console.log(Raw.serialize(this.state.state))
  }

  onChange = (state) => {
    this.setState({ state })
  }

  render() {
    const { index, open, state, suggestions } = this.state

    return (
      <div>
        <h1 className='navbar'>Slate Shortcuts POC</h1>
        <div className='container'>
          <ul className={`suggestions ${open ? 'open' : ''}`}>
            {suggestions.map((suggestion, idx) => (
              <Suggestion
                key={suggestion.id}
                data={suggestion}
                selected={index === idx}
                onClick={this.onClickAddShortcut}
              />
            ))}
          </ul>
          <div className='editor-wrapper'>
            <Editor
              placeholder='Reply via chat'
              className='editor'
              plugins={[this.shortcutPlugin]}
              state={state}
              onChange={this.onChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
