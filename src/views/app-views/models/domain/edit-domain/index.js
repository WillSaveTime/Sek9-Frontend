import React from 'react'
import DomainForm from '../DomainForm'

const EditDomain = props => {
  return <DomainForm mode="EDIT" param={props.match.params} />
}

export default EditDomain
