import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import LoadingIcon from '../General/Loading.js'
import { toast } from 'react-toastify'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import {
  createReceipt,
  sendReceiptMail,
} from '../General/Functions'
import { Button } from 'react-bootstrap'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Alert from 'react-bootstrap/Alert'
import Switch from '@material-ui/core/Switch'
const tableHeaderColor ='#353A40'
function defaultItem(itemIndex) {
  return { name: `Item${itemIndex + 1}`, price: 1.0, quantity: 1 }
}
export default class CreateReceipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [defaultItem(0)],
      vat: 0,
      loading: false,
      receiptAlert: false,
      createdReceiptQR: undefined,
      createdReceiptID: undefined,
      showQrCode: false,
      mail: '',
      mailAlert: false,
      mailLoading: false,
      barcode: '',
      barcodeOn: false,
    }
  }

  getCredentials() {
    if (this.props.test) {
      return {
        storeId: staticVariables.testStore.testStoreKey,
        token: staticVariables.testStore.testStoreToken,
      }
    } else {
      return {
        storeId: localStorage.getItem('key'),
        token: localStorage.getItem('token'),
      }
    }
  }

  AddItem() {
    this.setState({
      items: [...this.state.items, defaultItem(this.state.items.length)],
      showQrCode: false,
    })
  }

  handleMailChange(event) {
    this.setState({ mail: event.target.value, mailAlert: false })
  }
  handleBarcodeChange(event) {
    this.setState({ barcode: event.target.value ,showQrCode: false })
  }
  handleNameChange(event, index) {
    this.state.items[index].name = event.target.value
    this.setState({ items: this.state.items, showQrCode: false })
  }

  handlePriceChange(event, index) {
    this.state.items[index].price = event.target.value
    this.setState({ items: this.state.items, showQrCode: false })
  }
  handleQuantityChange(event, index) {
    this.state.items[index].quantity = event.target.value
    this.setState({ items: this.state.items, showQrCode: false })
  }
  DeleteItem(index) {
    if (this.state.items.length > 1) {
      this.state.items.splice(index, 1)
      this.setState({ items: this.state.items, showQrCode: false })
    } else {
      toast.error('Receipt Should have at least 1 item')
    }
  }

  handleVatChange(event) {
    let vat = event.target.value
    if (vat >= 0 && vat <= 100) this.setState({ vat: vat, showQrCode: false })
  }

  handleBarcodeSwitch() {
    this.setState({ barcodeOn: !this.state.barcodeOn,showQrCode: false  })
  }
  async createTestReceipt() {
    this.setState({
      loading: true,
      showQrCode: true,
      createdReceiptQR: undefined,
      createdReceiptID: undefined,
    })
    let credentials = this.getCredentials()
    let response = await createReceipt(credentials.storeId, credentials.token, {
      items: this.state.items,
      vat: this.state.vat,
      barcode: this.state.barcodeOn ? this.state.barcode : undefined,
    })
    response
      ? this.setState({
          createdReceiptQR: response.qrCode,
          createdReceiptID: response.id,
          loading: false,
        })
      : this.setState({
          loading: false,
          showQrCode: false,
          receiptAlert: true,
        })
  }
  async sendMail(e) {
    this.setState({
      mailAlert: false,
    })
    
      this.setState({ mailLoading: true })
      let credentials = this.getCredentials()
      await sendReceiptMail(
        credentials.token,
        this.state.mail,
        this.state.createdReceiptID
      )
      this.setState({ mailLoading: false })
    
  }
  render() {
    return (
      <div style={Styles.centered}>
        <div class="card  my-5">
          <div class="card-body">
            <Table striped bordered hover>
              <thead>
                <tr style={{backgroundColor:tableHeaderColor, color:'white'}}>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '35%' }}>Item Name</th>
                  <th style={{ width: '18%' }}>Price</th>
                  <th style={{ width: '12%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>Total Price</th>
                  <th style={{ width: '10%' }} />
                </tr>
              </thead>
              <tbody>
                {this.state.items.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        class="form-control"
                        placeholder="Enter Item name"
                        onChange={(e) => this.handleNameChange(e, index)}
                        value={item.name}
                        required
                        autofocus
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Enter Price"
                        step="0.01"
                        defaultValue="1.00"
                        onChange={(e) => this.handlePriceChange(e, index)}
                        value={item.price}
                        min="0.01"
                        required
                        autofocus
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Enter quantity"
                        defaultValue="1"
                        onChange={(e) => this.handleQuantityChange(e, index)}
                        value={item.quantity}
                        min="1"
                        required
                        autofocus
                      />
                    </td>
                    <td>
                      <h5>{item.price * item.quantity}</h5>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => this.DeleteItem(index)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr >
                  <td style={{backgroundColor:tableHeaderColor, color:'white'}} colSpan="2">
                    <b>VAT</b>
                  </td>
                  <td style={{backgroundColor:tableHeaderColor, display: 'flex',color:'white' }}>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Enter VAT"
                      step="0.01"
                      defaultValue="1.00"
                      onChange={(e) => this.handleVatChange(e)}
                      value={this.state.vat}
                      min="0"
                      max="100"
                      style={{ width: '60%' }}
                      required
                      autofocus
                    />
                    <h2>%</h2>
                  </td>

                  <td colSpan="2">
                    <button
                      class="btn btn-lg btn-info  text-uppercase"
                      type="submit"
                      onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => this.AddItem(e)}
                    >
                      Add Item
                    </button>
                  </td>
                </tr>
                <tr style={{backgroundColor:tableHeaderColor, color:'white'}}>
                  <td colSpan="2">
                    <b>BarCode</b>
                    <Switch
                      onClick={() => this.handleBarcodeSwitch()}
                      color="primary"
                    />
                    <div style={{ padding: '15px' }}></div>
                  </td>
                  {this.state.barcodeOn && (
                    <td colSpan="2">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Enter receipt barcode"
                        onChange={(e) => this.handleBarcodeChange(e)}
                        value={this.state.barcode}
                        // style={{ width: '60%' }}
                        required
                        autofocus
                      />
                    </td>
                  )}
                </tr>
              </tbody>
            </Table>

            <div style={{ paddingTop: '10px' }}>
              <Alert variant="danger" show={this.state.receiptAlert}>
                Check that you entered all data correctly!
                <br />
                Item Name couldn't be empty
                <br />
                Item Price couldn't be smaller than or equal 0<br />
                Item Quantity couldn't be smaller than or equal 0<br />
                VAT couldn't be smaller than zero
              </Alert>
              <button
                class="btn btn-lg btn-info btn-block text-uppercase"
                type="submit"
                disabled={this.state.loading}
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => this.createTestReceipt()}
              >
                Create Receipt
              </button>
              {this.state.showQrCode && (
                <div style={Styles.createReceiptCard}>
                  <CardDeck>
                    <Card border="success">
                      <Card.Header>
                        <div style={Styles.cardCentered}>
                          <h4>Scan to get Receipt</h4>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {this.state.loading ? (
                          <LoadingIcon type="spin" color="#5bc0de" />
                        ) : (
                          <img
                            src={this.state.createdReceiptQR}
                            alt="Receipt Qr Code"
                            width="100%"
                            height="100%"
                            style={Styles.cardCentered}
                          />
                        )}
                      </Card.Body>
                      <Card.Footer>
                        {this.state.createdReceiptID && (
                          <a
                            href={`/receipt/${this.state.createdReceiptID}`}
                            target="_blank"
                          >
                            Open Receipt
                          </a>
                        )}
                      </Card.Footer>
                    </Card>
                    <Card border="success">
                      <Card.Header>
                        <div style={Styles.cardCentered}>
                          <h4>Or Send test receipt to your mail</h4>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {this.state.loading ? (
                          <LoadingIcon type="spin" color="#5bc0de" />
                        ) : (
                          <>
                            <div class="form-label-group">
                              <input
                                id="inputEmail"
                                type="email"
                                class="form-control"
                                placeholder="Enter Email"
                                onChange={(e) => this.handleMailChange(e)}
                                value={this.state.mail}
                                required
                                autofocus
                              />
                              <br />
                              <Alert
                                variant="danger"
                                show={this.state.mailAlert}
                              >
                                Invalid Email address!
                              </Alert>
                            </div>
                            <button
                              class="btn btn-lg btn-info btn-block text-uppercase"
                              type="submit"
                              disabled={this.state.mailLoading}
                              onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                              }}
                              onClick={(e) => this.sendMail(e)}
                            >
                              {!this.state.mailLoading ? (
                                'Send Mail'
                              ) : (
                                <LoadingIcon color="#ffffff" />
                              )}
                            </button>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </CardDeck>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Styles = {
  centered: {
    width: '60%',
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
  cardCentered: {
    width: '100%',
    'margin-left': 'auto',
    'margin-right': 'auto',
  },
  createReceiptCard: {
    width: '60%',
    'margin-left': 'auto',
    'margin-right': 'auto',
    paddingTop: '10px',
  },
}
