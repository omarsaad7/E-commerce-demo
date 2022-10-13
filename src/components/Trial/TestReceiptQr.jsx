import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import {  sendReceiptMail } from '../General/Functions'
export default class TestReceiptQr extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mail: '',
      mailAlert: false,
      loading: false,
    }
    this.handleMailChange = this.handleMailChange.bind(this)
  }

  handleMailChange(event) {
    this.setState({ mail: event.target.value, mailAlert: false })
  }

  async sendMail(e) {
    this.setState({
      mailAlert: false,
    })
   
      this.setState({ loading: true })
      await sendReceiptMail(
        staticVariables.testStore.testStoreToken,
        this.state.mail,
        staticVariables.testStore.testReceiptId
      )
      this.setState({ loading: false })
    
  }

  render() {
    return (
      <div class="signin-background">
        <div class="container">
          <div class="row">
            <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div class="card card-signin my-5">
                <div class="card-body">
                  <Card>
                    <Card.Header>
                      <div style={Styles.centered}>
                        <h4>Scan to get Test Receipt</h4>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <img
                        src={staticVariables.testStore.testReceiptQrCode}
                        alt="Receipt Qr Code"
                        width="300"
                        height="300"
                        style={Styles.centered}
                      />
                    </Card.Body>
                    <Card.Footer>
                      <h6>Or Send test receipt to your mail</h6>
                      <div class="form-label-group">
                        <input
                          id="inputEmail"
                          type="email"
                          class="form-control"
                          placeholder="Enter Email"
                          onChange={this.handleMailChange}
                          value={this.state.mail}
                          required
                          autofocus
                        />
                        <br />
                        <Alert variant="danger" show={this.state.mailAlert}>
                          Invalid Email address!
                        </Alert>
                      </div>
                      <button
                        class="btn btn-lg btn-info btn-block text-uppercase"
                        type="submit"
                        disabled={this.state.loading}
                        onSubmit={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => this.sendMail(e)}
                      >
                        {!this.state.loading ? (
                          'Send Mail'
                        ) : (
                          <LoadingIcon color="#ffffff" />
                        )}
                      </button>
                    </Card.Footer>
                  </Card>
                  {!this.props.loggedIn && (
                    <p style={{ color: 'gray', paddingTop: 5 }}>
                      didn't subscribe yet? {'  '}
                      <a href="/subscribe">subscribe</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Styles = {
  centered: {
    width: '100%',
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
}
