import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import { toast } from 'react-toastify'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'


export default class DeleteAllReceipt extends Component {
  state = {
    show: false,
    loading: false,
  }
  async deleteAllReceipt() {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
    }
    await axios
      .delete(
        `${staticVariables.backendURL}/api/receipts/deleteReceiptsOfStore/${localStorage.getItem('key')}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        this.setState({ show: false, loading: false })
        toast.success(`All Receipts Deleted`)
        this.props.getReceipts.method(
          this.props.getReceipts.rowsPerPage,
          this.props.getReceipts.page
        )
      })
      .catch((error) => {
        this.setState({ show: false, loading: false })
        toast.error(`OOPS Something went wrong!! Couldn't delete receipts`)
      })
  }
  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })

  render() {
    return (
      <>
        <Button variant="danger" onClick={this.handleShow}>
          Delete All Receipts{' '}<DeleteForeverIcon />
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} centered >
          {!this.state.loading ? (
            <>
              <Modal.Body>
                <h4>Are you sure you want to delete All receipts?</h4>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => this.deleteAllReceipt()}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <div style={{ paddingBottom: '5ex', paddingTop: '5ex' }}>
              <LoadingIcon type="spin" color="#5bc0de" />
            </div>
          )}
        </Modal>
      </>
    )
  }
}


