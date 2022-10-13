import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import { toast } from 'react-toastify'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import {logout} from '../General/Functions'


export default class DeleteStore extends Component {
  state = {
    show: false,
    loading: false,
  }
  async deleteStore() {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
    }
    await axios
      .delete(
        `${staticVariables.backendURL}/api/storesInfo/delete/${localStorage.getItem('key')}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        this.setState({ show: false, loading: false })
        toast.success(`Account Deleted`)
        logout()
      })
      .catch((error) => {
        this.setState({ show: false, loading: false })
        toast.error(`OOPS Something went wrong!! Try again later`)
      })
  }
  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })

  render() {
    return (
      <>
        <Button  variant="danger" block onClick={this.handleShow}>
        {this.props.open ? 'Unsubscribe' : <DeleteForeverIcon />}
      </Button>
        <Modal show={this.state.show} onHide={this.handleClose} centered >
          {!this.state.loading ? (
            <>
              <Modal.Body>
                <h4>All Receipts and account info will be deleted.
                  <br/>
                  Are you sure you want to unsubscribe?
                </h4>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => this.deleteStore()}
                >
                  Unsubscribe
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


