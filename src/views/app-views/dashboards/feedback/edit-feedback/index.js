import React from 'react'
import FeedbackForm from '../FeedbackForm'

const EditFeedback = props => {
  return <FeedbackForm mode="EDIT" param={props.match.params} />
}

export default EditFeedback
