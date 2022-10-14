import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import Items from './ViewTable.jsx'
import TotalTable from './TotalTable.jsx'
import Error from '../Error/Error.jsx'
import LoadingIcon from '../General/Loading.js'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import GetAppIcon from '@material-ui/icons/GetApp'
import Barcode from 'react-barcode'
import Pdf from 'react-to-pdf'
import { convertTZ } from '../General/Functions'
import { Styles } from '../General/StaticVariables/Styles.js'

const ref = React.createRef()
export default class receipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: false,
      storeName: '',
      storeAddress: '',
      storeNumbers: [],
      barcode: 0,
      dateTime: undefined,
      receipt: undefined,
      bgColor: null,
      fontColor: null,
      dateStyle: null,
      timeStyle: null,
      currency:null
    }
  }

  async componentDidMount() {
    console.log(this.props.match.params)
    await axios
      .get(
        `${staticVariables.backendURL}/api/receipts/read/${this.props.match.params.id}`
      )
      .then((response) => {
        if (response.data.data) {
          this.setState({
            receipt: response.data.data.receipt,
            barcode: response.data.data.barcode,
            storeName: response.data.data.storeInfo.storeName,
            storeAddress: response.data.data.storeInfo.address,
            storeNumbers: response.data.data.storeInfo.phoneNumbers,
            dateTime: response.data.data.date,
            bgColor: response.data.data.storeInfo.backgroundColor,
            fontColor: response.data.data.storeInfo.fontColor,
            dateStyle: response.data.data.storeInfo.dateStyle,
            timeStyle: response.data.data.storeInfo.timeStyle,
            currency: response.data.data.storeInfo.currency
          })
          this.setState({ loading: false })
        } else {
          this.setState({ error: true, loading: false })
        }
      })
      .catch((error) => {
        this.setState({ error: true, loading: false })
      })
  }

  pdfScale = () => {
    switch (this.state.receipt.items.length) {
      case (1, 2, 3, 4, 5):
        return 1
      case (6, 7):
        return 0.9
      case (8, 9, 10, 11, 12, 13, 14):
        return 0.8
      case (15, 16):
        return 0.7
      default:
        return 0.6
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={Styles.bgImage}>
          <div class="signin-background">
            <br />
            <br />
            <br />
            <div class="container">
              <div class="row">
                <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                  <div class="card card-signin my-5">
                    <div class="card-body">
                      <Card>
                        <Card.Body>
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <LoadingIcon type="spin" color="#5bc0de" />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      )
    } else if (this.state.error) {
      return <Error errorCode="400" errorMessage="Couldn't find Receipt" />
    } else {
      return (
        <div style={Styles.bgImage}>
          <div class="signin-background">
            <br />
            <br />
            <br />

            <div class="container">
              <div class="row">
                <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                  <div class="card card-signin my-5">
                    <Pdf
                      targetRef={ref}
                      filename={`${
                        this.state.storeName
                      } ${new Date().toLocaleString()}.pdf`}
                      scale={`${this.pdfScale()}`}
                      x={5}
                      y={0}
                    >
                      {({ toPdf }) => (
                        <button
                          class="btn btn-lg btn-info btn-block text-uppercase"
                          onClick={toPdf}
                        >
                          Download as pdf
                          <GetAppIcon />
                        </button>
                      )}
                    </Pdf>
                    <div class="card-body" ref={ref}>
                      <Card style={Styles.card3(this.state.bgColor)}>
                        <Card.Body style={{ color: this.state.fontColor }}>
                          <h1 class="card-title text-center">
                            {this.state.storeName}
                          </h1>
                          <h3 class="card-title text-center">
                            {this.state.storeAddress}
                          </h3>
                          {this.state.storeNumbers.map((number) => (
                            <h5 class="card-title text-center">+{number}</h5>
                          ))}
                          <h6 class="card-title text-center">
                            {convertTZ(this.state.dateTime, this.state.dateStyle, this.state.timeStyle)}
                          </h6>
                        </Card.Body>
                      </Card>
                      <form class="form-signin">
                        <div class="form-label-group">
                          <Items items={this.state.receipt.items} />
                          <br />
                          <Card>
                            <TotalTable
                              subTotal={this.state.receipt.subtotal}
                              total={this.state.receipt.total}
                              vatPercentage={this.state.receipt.vatPercentage}
                              currency={this.state.currency}
                            />
                          </Card>
                          {this.state.barcode && (
                            <Barcode width={2} value={this.state.barcode} />
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      )
    }
  }
}
