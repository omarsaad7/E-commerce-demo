import React, { PureComponent } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts'
import Title from './Title'
import { Styles } from '../General/StaticVariables/Styles.js'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ReactTooltip from 'react-tooltip'
import IconButton from '@material-ui/core/IconButton'
import TodayIcon from '@material-ui/icons/Today'
import LoadingIcon from '../General/Loading.js'
import Alert from 'react-bootstrap/Alert'
import { getCurrentDate } from '../General/Functions'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import InfoIcon from '@material-ui/icons/Info';

const currentday = getCurrentDate()

export default class NumberReceiptsChart extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: null,
      day: currentday,
      openEdit:null
    }
  }
  async componentDidMount() {
    this.getNumberReceipts(this.state.day)
  }
   handleClick(event) {

    this.setState({openEdit:event.currentTarget})
  }

   handleClose() {
    this.setState({openEdit:null})
  }
   handleDayChange(event) {
     this.setState({day:event.target.value})
    this.getNumberReceipts(event.target.value)
  }
   Edit() {
    return (
      <div>
        <InfoIcon data-tip data-for="receiptChartInfo" style={{paddingTop:'0.7%'}}/>
          <ReactTooltip id="receiptChartInfo" type="warning">
            <span>{staticVariables.descriptions.noReceiptsAnalytics}<br/>{staticVariables.descriptions.analyticsEdit}</span>
          </ReactTooltip>
        <IconButton
          aria-label="delete"
          onClick={() => (window.location.href = '/store/dashboard')}
          disabled={this.state.loading}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(e) => this.handleClick(e)}
          style={Styles.right}
        >
          <TodayIcon
            // style={{ color: 'white' }}
            data-tip
            data-for="edit"
            style={Styles.analyticsEditIcon}
          />
          <ReactTooltip id="edit" type="dark">
            <span>Edit date</span>
          </ReactTooltip>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={this.state.openEdit}
          keepMounted
          open={Boolean(this.state.openEdit)}
          onClose={() => this.handleClose()}
          // style={{float:'right'}}
        >
          <MenuItem>
            <form noValidate>
              <TextField
                id="date"
                label="Select Date"
                type="date"
                onChange={(e) => this.handleDayChange(e)}
                value={this.state.day}
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
    )
  }





  async getNumberReceipts(date) {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
      storeId: localStorage.getItem('key'),
    }
    await axios
      .get(
        `${staticVariables.backendURL}/api/storesInfo/totalReceiptsPerDay/${date}T00:00:00`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        this.setState({ data: response.data.result, loading: false })
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
      <>
      <div style={Styles.sideByside}>
      <div style={Styles.sideByside}>
        <Title>Number of Orders {currentday === this.state.day?"Today":`on ${this.state.day}`}</Title>
        
      </div>
      
      {this.Edit()}
    </div>
      <ResponsiveContainer width="100%" height="100%">
      {this.state.loading ? (
          <LoadingIcon type="spin" color="#5bc0de" />
        ) :this.state.error?<Alert variant="danger">
        Error
      </Alert>:
        <BarChart
          width={500}
          height={300}
          data={this.state.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time">
            </XAxis>
          <YAxis>
            {' '}
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
              }}
            >
              Orders
            </Label>
          </YAxis>
          <Tooltip />
          {/* <Legend />   */}
          <Bar dataKey="amount" fill="#3f51b5" />
          {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
        </BarChart>
  }
      </ResponsiveContainer>
      </>
    )
  }
}


