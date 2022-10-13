import React, { Component } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
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
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import QrCodeModal from './QrCodeModal'
import DeleteReceipt from './DeleteReceipt.jsx'
import SendReceipt from './SendReceipt.jsx'
import DeleteAllReceipts from './DeleteAllReceipts.jsx'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import LoadingIcon from '../General/Loading.js'
import Barcode from 'react-barcode'
import {
  numberWithCommas,
  ApproximateToNthDigit,
  convertTZ,
} from '../General/Functions'

export default class ReceiptsTable extends Component {
  state = {
    page: 0,
    rowsPerPage: 5,
    loading: true,
    totalReceipts: 0,
    receipts: [],
    emptyState: false,
    error: false,
  }
  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) })
    this.getReceipts(parseInt(event.target.value, 10), 0)
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
    this.getReceipts(this.state.rowsPerPage, newPage)
  }

  getReceipts = async (rowsPerPage, page) => {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
      storeId: localStorage.getItem('key'),
    }
    await axios
      .get(
        `${
          staticVariables.backendURL
        }/api/receipts/readStoreReceipts/?limit=${rowsPerPage}&page=${
          page + 1
        }`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if(response.data === "no receipts found for the given storeId!"){
          this.setState({ loading: false, emptyState: true })
        }
        else 
        if (response.data.data) {
          this.setState({
            receipts: response.data.data,
            totalReceipts: response.data.size,
            loading: false,
          })
        }
      })
      .catch((error) => { 
          this.setState({ loading: false, error: true })
           
      })
  }

  async componentDidMount() {
    await this.getReceipts(this.state.rowsPerPage, this.state.page)
  }

  loading() {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeader />
          </Table>
        </TableContainer>
        <br />
        <LoadingIcon type="spin" color="#5bc0de" />
      </>
    )
  }

  Error(msg) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHeader />
          </Table>
        </TableContainer>
        <br />
        <div style={{ paddingLeft: '10ex' }}>
          <br />
          <br />
          <br />
          {msg}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </>
    )
  }
  render() {
    if (this.state.loading) {
      return this.loading()
    } else if (this.state.emptyState) {
      return this.Error(
        'No receipts found. follow the integration steps to create receipts'
      )
    } else if (this.state.error) {
      return this.Error('oops Something went wrong! Try again')
    } else {
      return (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHeader />
              <TableBody>
                {this.state.receipts.map((receipt) => (
                  <Row
                    row={receipt}
                    getReceipts={{
                      method: this.getReceipts,
                      rowsPerPage: this.state.rowsPerPage,
                      page: this.state.page,
                    }}
                    home={this.props.home}
                  />
                ))}
              </TableBody>
              {!this.props.home && (
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      colSpan={5}
                      count={this.state.totalReceipts}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </TableContainer>

          <br />
          {!this.props.home && (
            <DeleteAllReceipts
              getReceipts={{
                method: this.getReceipts,
                rowsPerPage: this.state.rowsPerPage,
                page: this.state.page,
              }}
            />
          )}
        </>
      )
    }
  }
}

const titleMenuColor = '#353A40'
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
})

function Row(props) {
  const { row, getReceipts } = props
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
          {convertTZ(row.date, props.home ? 'medium' : 'full', 'short')}
        </TableCell>
        {/* <TableCell align="center">{row._id}</TableCell> */}
        <TableCell align="center">
          <Barcode width={1} height={20} value={row.barcode} />
        </TableCell>
        <TableCell align="center">
          <QrCodeModal receiptId={row._id} qrCodeSrc={row.qrCode} />
        </TableCell>
        <TableCell align="center">
          {numberWithCommas(ApproximateToNthDigit(row.receipt.subtotal, 2))}{localStorage.getItem('currency')}
        </TableCell>
        <TableCell align="center">
          {numberWithCommas(
            ApproximateToNthDigit(
              row.receipt.subtotal * (row.receipt.vatPercentage / 100),
              2
            )
          )}{localStorage.getItem('currency')}
        </TableCell>
        <TableCell align="center">
          {numberWithCommas(ApproximateToNthDigit(row.receipt.total, 2))}{localStorage.getItem('currency')}
        </TableCell>

        <TableCell align="center">
          <SendReceipt receipt={row} getReceipts={getReceipts} />
          {'  '}
          <DeleteReceipt receipt={row} getReceipts={getReceipts} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table
                size="medium"
                aria-label="purchases"
                style={{
                  width: '90%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <TableHead>
                  <TableRow style={{ backgroundColor: '#353A40' }}>
                    <TableCell style={{ color: 'white' }}>
                      <b>Item</b>
                    </TableCell>
                    <TableCell style={{ color: 'white' }}>
                      <b>Price</b>
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="right">
                      <b>Quantity</b>
                    </TableCell>
                    <TableCell style={{ color: 'white' }} align="right">
                      <b>Total price</b>
                    </TableCell>
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

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

function TablePaginationActions(props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

function TableHeader() {
  return (
    <TableHead>
      <TableRow style={{ backgroundColor: titleMenuColor }}>
        <TableCell />
        <TableCell style={{ color: 'white' }}>
          <b>Date-Time</b>
        </TableCell>
        {/* <TableCell style={{ color: 'white' }} align="center">
    <b>Receipt-Id</b>
  </TableCell> */}
        <TableCell style={{ color: 'white' }} align="center">
          <b>Barcode</b>
        </TableCell>
        <TableCell style={{ color: 'white' }} align="center">
          <b>Qr-Code</b>
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
        <TableCell style={{ color: 'white' }} align="center"></TableCell>
      </TableRow>
    </TableHead>
  )
}
