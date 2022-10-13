import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { Styles } from '../General/StaticVariables/Styles.js'
export default class QrCodeModal extends Component {
  state = {
    show: false,
  }

  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })
  render() {
    return (
      <>
        <Button variant="link" onClick={this.handleShow}>Show Qr-Code</Button>
        <Modal show={this.state.show} onHide={this.handleClose} centered >
          <Modal.Header closeButton/>
          
          <Modal.Body>
              
          <div style={Styles.centered60}>
                        <img
                          src={this.props.qrCodeSrc}
                          alt="Receipt Qr Code"
                          width="300"
                          height="300"
                        />
                        </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="info" onClick={()=> window.open(`/receipt/${this.props.receiptId}`, "_blank")}>
              Open Receipt
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

