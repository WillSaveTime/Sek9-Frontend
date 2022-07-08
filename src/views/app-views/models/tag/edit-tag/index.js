import React from 'react'
import TagForm from '../TagForm'

const EditTag = props => {
  return <TagForm mode="EDIT" param={props.match.params} />
}

export default EditTag
