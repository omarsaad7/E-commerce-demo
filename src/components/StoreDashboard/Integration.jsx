import React, { Component } from 'react'
import APIs from '../Documentation/APIs.jsx'
import IntegrationSteps from '../Documentation/IntegrationSteps'
import Credentials from './Credentials'
export default class Integration extends Component {
  
  render() {
    return (
      <div>
      <Credentials/>
      <div class="card card-signin my-5">
      <div class="card-body">
      <IntegrationSteps loggedin={true}/>
      </div>
    </div>
    <div class="card card-signin my-5">
      <div class="card-body">
        <APIs/>
      </div>
    </div>
    </div>   
    )
  }
}

