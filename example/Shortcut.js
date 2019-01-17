import React from 'react'

export default function Shortcut({ attributes, node, state: { selection } }) {
  const { data } = node
  const id = data.get('id')
  const description = data.get('description')
  const isSelected = selection.hasFocusIn(node)

  return (
    <a
      {...attributes}
      className={`shortcut ${isSelected ? 'selected' : ''}`}
      contentEditable={false}
      href={`https://example.com/user/${id}`}
      rel='noreferrer noopener'
      target='_blank'
    >
      {description}
    </a>
  )
}
