import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import LoadingIcon from '../General/Loading.js'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Barcode from 'react-barcode'
import EmailIcon from '@material-ui/icons/Email'
import {  sendReceiptMail,convertTZ } from '../General/Functions'
import Alert from 'react-bootstrap/Alert'

export default class SendReceipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    loading: false,
    email: '',
    alert: false,
    }
    this.handleMailChange = this.handleMailChange.bind(this)
  }
  handleMailChange(event) {
    this.setState({ email: event.target.value, alert: false })
  }
  async sendMail() {
    // this.setState({
    //   mailAlert: false,
    // })
    
      this.setState({ loading: true })
      await sendReceiptMail(
        localStorage.getItem('token'),
        this.state.email,
        this.props.receipt._id
      )
      this.setState({ show: false, loading: false,email: '' })
    
  }

  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })

  render() {
    return (
      <>
        <Button variant="info" onClick={this.handleShow}>
          <EmailIcon />
        </Button>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          centered
          size="lg"
        >
              <Modal.Body>
                <h4>Send this receipt by mail</h4>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHeader />
                    <TableBody>
                      <Row row={this.props.receipt} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Modal.Body>
              <Modal.Body>
              <div class="form-label-group" style={{paddingBottom:'1ex'}}>
                        <label for="inputStoreEmail">Email</label>
                        <input
                          id="inputAddress"
                          type="email"
                          class="form-control"
                          placeholder="Enter recipient Email"
                          onChange={this.handleMailChange}
                          value={this.state.email}
                          required
                          autofocus
                        />
                      </div>
                <Alert variant="danger" show={this.state.alert}>
                  Invalid Email address!
                </Alert>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button
                  variant="info"
                  disabled={this.state.loading}
                  onClick={() => this.sendMail(this.props.receipt._id)}
                >
                  {!this.state.loading ? (
                            'Send' 
                          ) : (
                            <LoadingIcon  color="#ffffff" />
                          )}
                </Button>
              </Modal.Footer>
          
           
        </Modal>
      </>
    )
  }
}



const titleMenuColor = '#353A40'

function TableHeader() {
  return (
    <TableHead>
      <TableRow style={{ backgroundColor: titleMenuColor }}>
        <TableCell />
        <TableCell style={{ color: 'white' }}>
          <b>Date-Time</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Barcode</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Subtotal</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>VAT</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Total</b>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
})

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)
  const classes = useRowStyles()

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
        {convertTZ(row.date, 'full', 'short')}
        </TableCell>
        <TableCell align="center">
          <Barcode width={1} height={20} value={row.barcode} />
        </TableCell>
        <TableCell align="center">{20}</TableCell>
        <TableCell align="center">{row.receipt.vatPercentage}</TableCell>
        <TableCell align="center">{40}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.receipt.items.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {/* {Math.round(20 * 20* 100) / 100}
                         */}
                        {item.price * item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
