import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import TextField from '@material-ui/core/TextField'
import Button from 'react-bootstrap/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LoadingIcon from '../General/Loading.js'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import Alert from 'react-bootstrap/Alert'
import {
  numberWithCommas,
  ApproximateToNthDigit,
  getCurrentDateTime,
} from '../General/Functions'
import { Styles } from '../General/StaticVariables/Styles.js'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import InfoIcon from '@material-ui/icons/Info'
import ReactTooltip from 'react-tooltip'

export default class Income extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changeDates: null,
      startDate: this.getfirstDayOfMonth(),
      endDate: getCurrentDateTime(),
      income: 0,
      loading: false,
      error: false,
    }
  }

  getfirstDayOfMonth() {
    let currentdate = new Date()
    let currentMonth =
      currentdate.getMonth() + 1 > 9
        ? currentdate.getMonth() + 1
        : `0${currentdate.getMonth() + 1}`
    let dateString = `${currentdate.getFullYear()}-${currentMonth}-01T00:00`
    return dateString
  }

  handleClick(event) {
    this.setState({ changeDates: event.currentTarget })
  }

  handleClose() {
    this.setState({ changeDates: null })
  }

  handleStartDateChange(event) {
    this.setState({ startDate: event.target.value })
    this.getIncome(event.target.value, this.state.endDate)
  }
  handleEndDateChange(event) {
    this.setState({ endDate: event.target.value })
    this.getIncome(this.state.startDate, event.target.value)
  }

  componentDidMount() {
    this.getIncome(this.state.startDate, this.state.endDate)
  }

  getIncome = async (startDate, endDate) => {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
      storeId: localStorage.getItem('key'),
    }
    await axios
      .get(
        `${staticVariables.backendURL}/api/storesInfo/totalSpendings/${startDate}/${endDate}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        this.setState({ income: response.data.totalSum, loading: false })
      })
      .catch((error) => {
        if (error.response.data === 'no receipts found for that store id') {
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false, error: true })
        }
      })
  }

  render() {
    return (
      <React.Fragment>
        <div style={Styles.sideByside}>
          <div style={Styles.sideByside}>
            <Title>Total Income</Title>
          </div>
          <InfoIcon
            data-tip
            data-for="incomeInfo"
            style={{ paddingTop: '2.5%' }}
          />
          <ReactTooltip id="incomeInfo" type="warning">
            <span>{staticVariables.descriptions.incomeAnalytics}</span>
          </ReactTooltip>
          <div style={Styles.right}>
            <MonetizationOnIcon style={{ color: 'gray' }} />
          </div>
        </div>

        {this.state.loading ? (
          <LoadingIcon type="spin" color="#5bc0de" />
        ) : this.state.error ? (
          <Alert variant="danger">Error</Alert>
        ) : (
          <>
            <Typography component="p" variant="h4">
              {numberWithCommas(ApproximateToNthDigit(this.state.income, 2))}{' '}
              {localStorage.getItem('currency')}
            </Typography>
            <br />
            <Typography color="textSecondary" style={{ flex: 1 }}>
              From{' '}
              {new Date(this.state.startDate).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
              <br />
              To{' '}
              {new Date(this.state.endDate).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Typography>
          </>
        )}
        <div>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={(e) => this.handleClick(e)}
            variant="link"
            disabled={this.state.loading}
          >
            Change Dates
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.changeDates}
            keepMounted
            open={Boolean(this.state.changeDates)}
            onClose={() => this.handleClose()}
          >
            <MenuItem>
              <form noValidate>
                <TextField
                  id="datetime-local"
                  label="Start Date"
                  type="datetime-local"
                  onChange={(e) => this.handleStartDateChange(e)}
                  value={this.state.startDate}
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </MenuItem>
            <MenuItem>
              <form noValidate>
                <TextField
                  id="datetime-local"
                  label="End Date"
                  type="datetime-local"
                  onChange={(e) => this.handleEndDateChange(e)}
                  value={this.state.endDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
      </React.Fragment>
    )
  }
}
