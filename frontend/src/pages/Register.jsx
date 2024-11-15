import React from 'react'
import Form from '../components/Form';

const Register = () => {
  return (
    <div>
      <Form route='/api/user/register/' method='register'/>
      {/* when we are registering, the route is that we are to go to
      do the same for login, method also */}
    </div>
  )
}

export default Register;