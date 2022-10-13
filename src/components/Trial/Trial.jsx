import React, { Component } from 'react'
import Navbar from '../General/NavBar'
import Footer from '../General/Footer'
import TestReceiptQr from './TestReceiptQr'
import { ToastContainer, toast } from 'react-toastify'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { isLoggedIn, getWindowSize } from '../General/Functions'
import CreateTestReceipt from './CreateReceipt'
import Card from 'react-bootstrap/Card'

const screenSize = getWindowSize()

export default class Trial extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      createReceipt:false
    }
  }
  componentDidMount() {
    this.setState({ loggedIn: isLoggedIn() })
  }

  switchChanged() {
    this.setState({ createReceipt: !this.state.createReceipt })
  }

  render() {
    return (
      <div style={Styles.bgImage}>
        <div style={Styles.minHeight}>
          <Navbar />
          <div style={{width:'20%',marginRight:'auto',marginLeft:'auto',paddingTop:'20px'}}>
          <Card border="success">
            <div style={{padding:'15px'}}>
          <FormControlLabel
            control={<Switch onClick={()=>this.switchChanged()} color="primary" />}
            label="Create your test receipt"
            labelPlacement="Create your test receipt"
          />
          </div>
          </Card>
          </div>
          {!this.state.createReceipt?<TestReceiptQr loggedIn={this.state.loggedIn} />:
          <CreateTestReceipt test/>}
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
        <Footer />
      </div>
    )
  }
}

const Styles = {
  bgImage: {
    backgroundImage: `url(/beatthereceipt.png)`,
    'background-repeat': 'no-repeat',
    'background-attachment': 'fixed',
    'background-size': 'cover',
    'min-height': `${screenSize.height}px`,
  },
  minHeight: {
    'min-height': `${screenSize.height}px`,
  },
}
