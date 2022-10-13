import React, { Component } from 'react'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import {
  convertTZ,
  getCurrentDateTime,
} from '../General/Functions'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Items from '../Receipt/ViewTable.jsx'
import TotalTable from '../Receipt/TotalTable.jsx'
import Barcode from 'react-barcode'
import { Styles } from '../General/StaticVariables/Styles.js'
import Button from 'react-bootstrap/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ColorLensIcon from '@material-ui/icons/ColorLens'
import { SketchPicker } from 'react-color'
import Alert from 'react-bootstrap/Alert'
import { toast } from 'react-toastify'

const items = [
  {
    name: 'Item1',
    price: 20,
    quantity: 2,
  },
  {
    name: 'Item2',
    price: 10,
    quantity: 2,
  },
  {
    name: 'Item3',
    price: 10,
    quantity: 4,
  },
]
const subtotal = 100
const total = 110
const vatPercentage = 10
export default class CustomizeReceipts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      storeName:null,
      storeAddress:null,
      storeNumbers:[],
      bgColor: '#479521',
      fontColor: '#ffffff',
      changeFontColor: null,
      changebgColor: null,
      dateStyle: 'full',
      timeStyle: 'short',
      error: false,
      submitLoading : false
    }

    this.handlebgColorChange = this.handlebgColorChange.bind(this)
    this.handleFontColorChange = this.handleFontColorChange.bind(this)
    this.handleDateStyleChange = this.handleDateStyleChange.bind(this)
    this.handleTimeStyleChange = this.handleTimeStyleChange.bind(this)
  }

  handlebgColorChange(event) {
    this.setState({ bgColor: event.hex })
  }

  handleFontColorChange(event) {
    this.setState({ fontColor: event.hex })
  }
  handleDateStyleChange(event) { 
    this.setState({ dateStyle: event.target.value })
  }
  handleTimeStyleChange(event) { 
    this.setState({ timeStyle: event.target.value })
  }

  async saveChanges(){
    this.setState({ submitLoading: true })
    const headers = {
        authtoken: localStorage.getItem('token'),
      }
    const body = {
        backgroundColor: this.state.bgColor,
        fontColor: this.state.fontColor,
        dateStyle:this.state.dateStyle,
        timeStyle:this.state.timeStyle,
    }
    await axios
    .put(`${staticVariables.backendURL}/api/storesInfo/update/${localStorage.getItem('key')}`, body, {
      headers: headers,
    })
    .then((res) => {
      toast.success(`Receipt has been customized successfully`)
      this.setState({ submitLoading: false })
    })
    .catch((error) => {
      toast.error(`OOPS!! Something went wrong. Try again`)
      this.setState({ submitLoading: false })
       
    })
  }


  async componentDidMount() {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
    }
    await axios
      .get(
        `${staticVariables.backendURL}/api/storesInfo/${localStorage.getItem('key')}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (!response.data || !response.data.data) {
          this.setState({ loading: false, error: true })
        } else
          this.setState({
            loading: false,
            storeName: response.data.data.storeName,
            storeAddress: response.data.data.address,
            storeNumbers: response.data.data.phoneNumbers,
            bgColor: response.data.data.backgroundColor,
            fontColor: response.data.data.fontColor,
            dateStyle:response.data.data.dateStyle,
            timeStyle:response.data.data.timeStyle,
          })
      })
      .catch((error) => {
        this.setState({ loading: false, error: true })
         
      })
  }
  
  handleClick(event) {
    this.setState({ changebgColor: event.currentTarget })
  }
  handleFontClick(event) {
    this.setState({ changeFontColor: event.currentTarget })
  }

  handleClose() {
    this.setState({ changebgColor: null })
  }
  handleFontClose() {
    this.setState({ changeFontColor: null })
  }

  BackgroundColor() {
    return (
      <div style={{ padding: '2px' }}>
        <div style={Styles.sideByside}>
          <h3 style={{ paddingRight: '20px' }}>Background Color: </h3>
        </div>
        <div style={Styles.sideByside}>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(e) => this.handleClick(e)}
            style={{
              backgroundColor: this.state.bgColor,
              border: this.state.bgColor,
            }}
            disabled={this.state.submitLoading}
          >
            <ColorLensIcon style={{ color: this.state.fontColor }} />
          </Button>
        </div>

        <Menu
          id="simple-menu"
          anchorEl={this.state.changebgColor}
          keepMounted
          open={Boolean(this.state.changebgColor)}
          onClose={() => this.handleClose()}
        >
          <MenuItem>
            <form noValidate>
              <SketchPicker
                onChangeComplete={this.handlebgColorChange}
                color={this.state.bgColor}
              />
            </form>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleClose()
            }}
          >
            Done
          </MenuItem>
        </Menu>
      </div>
    )
  }
  FontColor() {
    return (
      <div style={{ padding: '2px' }}>
        <div style={Styles.sideByside}>
          <h3 style={{ paddingRight: '20px' }}>Font Color: </h3>
        </div>
        <div style={Styles.sideByside}>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(e) => this.handleFontClick(e)}
            style={{
              backgroundColor: this.state.fontColor,
              border: this.state.bgColor,
            }}
            disabled={this.state.submitLoading}
          >
            <ColorLensIcon style={{ color: this.state.bgColor }} />
          </Button>
        </div>

        <Menu
          id="simple-menu"
          anchorEl={this.state.changeFontColor}
          keepMounted
          open={Boolean(this.state.changeFontColor)}
          onClose={() => this.handleFontClose()}
        >
          <MenuItem>
            <form noValidate>
              <SketchPicker
                onChangeComplete={this.handleFontColorChange}
                color={this.state.fontColor}
              />
            </form>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleFontClose()
            }}
          >
            Done
          </MenuItem>
        </Menu>
      </div>
    )
  }

  DateTimeStyle() {
    return (
      <div style={{ padding: '2px' }}>
        <div style={Styles.sideByside}>
          <h3 style={{ paddingRight: '2px' }}>Date: </h3>
        </div>
        <div style={Styles.sideByside}>
          <select onChange={this.handleDateStyleChange} style={{padding:'10px'}}>
            <option value="full">Full</option>
            <option value="long">Long</option>
            <option value="medium">Medium</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div style={Styles.sideByside}>
          <h3 style={{ paddingRight: '2px',paddingLeft:'5px' }}>Time: </h3>
        </div>
        <div style={Styles.sideByside}>
          <select onChange={this.handleTimeStyleChange} style={{padding:'10px'}}>
            {/* <option value="full">Full</option>
            <option value="long">Long</option> */}
            <option value="medium">Medium</option>
            <option value="short">Short</option>
          </select>
          
        </div>
        </div>
    )
  }

  render() {
    return (
      <>
      {this.state.loading ? (
            <LoadingIcon type="spin" color="#5bc0de" />
          ) : this.state.error ? (
            <Alert variant="danger">Error</Alert>
          ) : (
              <>
        <CardDeck style={{ paddingBottom: '20px' }}>
          <Card border="success" style={{ minWidth: '350px', width: '18rem' }}>
            <Card.Body>{this.BackgroundColor()}</Card.Body>
          </Card>
          <Card border="success" style={{ width: '18rem' }}>
            <Card.Body>{this.FontColor()}</Card.Body>
          </Card>
          <Card border="success" style={{ minWidth: '400px',width: '18rem' }}>
            <Card.Body>{this.DateTimeStyle()}</Card.Body>
          </Card>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(e) => this.saveChanges(e)}
            variant="info"
            disabled={this.state.submitLoading}
            style = {{minWidth:'150px'}}
          >
              {this.state.submitLoading?<LoadingIcon type="spin" color="#ffffff" /> :"Save Changes"}
          </Button>
        </CardDeck>

        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-8">
            <div class="card-body">
              <Card style={Styles.card3(this.state.bgColor)}>
                <Card.Body style={{ color: this.state.fontColor }}>
                  <h1 class="card-title text-center">{this.state.storeName}</h1>
                  <h3 class="card-title text-center">{this.state.storeAddress}</h3>
                  {this.state.storeNumbers.map((number) => (
                  <h5 class="card-title text-center">+{number}</h5>
                  ))}
                  <h6 class="card-title text-center">
                    {convertTZ(
                      getCurrentDateTime(),
                      this.state.dateStyle,
                      this.state.timeStyle
                    )}
                  </h6>
                </Card.Body>
              </Card>
              <form class="form-signin">
                <div class="form-label-group">
                  <Items items={items} />
                  <br />
                  <Card>
                    <TotalTable subTotal={subtotal} total={total} vatPercentage={vatPercentage} currency ={localStorage.getItem('currency')}/>
                  </Card>
                  <Barcode width={2} value="0123456789" />
                </div>
              </form>
            </div>
          </div>
        </div>
        </>
          )}
      </>
    )
  }
}
