import React from 'react'
import NewsletterForm from '../NewsletterForm'

const EditNewsletter = props => {
  return <NewsletterForm mode="EDIT" param={props.match.params} />
}

export default EditNewsletter
