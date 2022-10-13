import React, { Component } from 'react'
import APIs from './APIs.jsx'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import IntegrationSteps from './IntegrationSteps'
import { ToastContainer } from 'react-toastify'
import {isLoggedIn} from '../General/Functions'
import { Styles } from '../General/StaticVariables/Styles.js'


export default class Documentation extends Component {
  state = {
    loggedIn: false,
  }
  componentDidMount() {
    this.setState({ loggedIn: isLoggedIn() })
  }

  render() {
      return (
        <div style={Styles.bgImage}>
          <div style={Styles.minHeight}>
          <Navbar/>
          <div class="signin-background">
            <br />
            <br />
            <br />
            <div class="container">
              <div class="row">
                <div class="col-sm-9 col-md-7 col-lg-12 mx-auto">
                <div class="card card-signin my-5">
                    <div class="card-body">
                    <IntegrationSteps loggedin={this.state.loggedIn}/>
                    </div>
                  </div>
                  <div class="card card-signin my-5">
                    <div class="card-body">
                      <APIs/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
          <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                </div>
          <Footer/>
        </div>
      
   
      )
    
  }
}



