import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import { toast } from 'react-toastify'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
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
import {convertTZ} from '../General/Functions'
export default class DeleteReceipt extends Component {
  state = {
    show: false,
    loading: false,
  }
  async deleteReceipt() {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
    }
    await axios
      .delete(
        `${staticVariables.backendURL}/api/receipts/delete/${this.props.receipt._id}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        this.setState({ show: false, loading: false })
        toast.success(`Receipt Deleted`)
        this.props.getReceipts.method(
          this.props.getReceipts.rowsPerPage,
          this.props.getReceipts.page
        )
      })
      .catch((error) => {
        this.setState({ show: false, loading: false })
        toast.error(`OOPS Something went wrong!! Couldn't delete receipt`)
      })
  }
  handleClose = () => this.setState({ show: false })
  handleShow = () => this.setState({ show: true })

  render() {
    return (
      <>
        <Button variant="danger" onClick={this.handleShow}>
          <DeleteForeverIcon />
        </Button>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          centered
          size="lg"
        >
          <Modal.Body>
            <h4>Are you sure you want to delete this receipt?</h4>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHeader />
                <TableBody>
                  <Row row={this.props.receipt} />
                </TableBody>
              </Table>
            </TableContainer>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="danger"
              disabled={this.state.loading}
              onClick={(e) => this.deleteReceipt(this.props.receipt._id)}
            >
              {!this.state.loading ? (
                'Delete'
              ) : (
                <LoadingIcon type="spin" color="#ffffff" />
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
  const [open, setOpen] = React.useState(true)
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
