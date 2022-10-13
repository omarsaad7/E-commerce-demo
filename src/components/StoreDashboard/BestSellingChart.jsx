import React, { PureComponent } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { Styles } from '../General/StaticVariables/Styles.js'
import Title from './Title'
import LoadingIcon from '../General/Loading.js'
import Alert from 'react-bootstrap/Alert'
import EditIcon from '@material-ui/icons/Edit'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ReactTooltip from 'react-tooltip'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';
const possibleValues = [1, 2, 3, 4, 5, 6]
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#000042',
  '#9C1424',
  '#888888',
]

export default class BestSelling extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      bestsell: null,
      loading: false,
      error: false,
      noOfItems: 4,
      openEdit: null,
    }
  }
  handleChange = (value) => {
    this.setState({ noOfItems: value })
    this.getBestSelling(value)
  }

  handleClick(event) {
    this.setState({ openEdit: event.currentTarget })
  }

  handleClose() {
    this.setState({ openEdit: null })
  }
  async getBestSelling(itemsNumber) {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
      storeId: localStorage.getItem('key'),
    }
    await axios
      .get(
        `${staticVariables.backendURL}/api/storesInfo/read/topBestSelling/${itemsNumber}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (!response.data) {
          this.setState({ loading: false, error: true })
        } else
          this.setState({
            bestsell: response.data,
            loading: false,
          })
      })
      .catch((error) => {
        if (error.response.data === 'no receipts found for that store id') {
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false, error: true })
        }
      })
  }

  async componentDidMount() {
    this.getBestSelling(this.state.noOfItems)
  }

  Edit() {
    return (
      <div>
        <InfoIcon data-tip data-for="topSellingInfo" style={{paddingTop:'1%'}}/>
          <ReactTooltip id="topSellingInfo" type="warning">
            <span>{staticVariables.descriptions.topSellingAnalytics}<br/>{staticVariables.descriptions.analyticsEdit}</span>
          </ReactTooltip>
        <IconButton
          aria-label="delete"
          // onClick={() => (window.location.href = '/store/dashboard')}
          disabled={this.state.loading}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(e) => this.handleClick(e)}
          style={Styles.right}
        >
          <ShoppingBasketIcon data-tip data-for="editBestSelling" style={Styles.analyticsEditIcon}/>
          <ReactTooltip id="editBestSelling" type="dark">
            <span>Edit number of items</span>
          </ReactTooltip>          
        </IconButton>
        
        <Menu
          id="simple-menu"
          anchorEl={this.state.openEdit}
          keepMounted
          open={Boolean(this.state.openEdit)}
          onClose={() => this.handleClose()}
          style={{ maxWidth: '300px' }}
        >
          {/* <MenuItem> */}
          <h6 style={{paddingLeft:'2%'}}>How many items to show? </h6>
          {/* </MenuItem> */}
          <MenuItem>
            {possibleValues.map((value) => (
              <MenuItem
                onClick={() => {
                  this.handleChange(value)
                }}
              >
                {value}
              </MenuItem>
            ))}
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
  render() {
    return (
      <>
        <div style={Styles.sideByside}>
          <div style={Styles.sideByside}>
            <Title>Top Selling Items</Title>
          </div>
          {this.Edit()}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          {this.state.loading ? (
            <LoadingIcon type="spin" color="#5bc0de" />
          ) : this.state.error ? (
            <Alert variant="danger">Error</Alert>
          ) : (
            <PieChart width={400} height={400}>
              <Pie
                data={this.state.bestsell}
                cx="50%"
                cy="50%"
                labelLine={false}
                // label
                outerRadius={72}
                fill="#8884d8"
                dataKey="quantity"
              >
                {this.state.bestsell &&
                  this.state.bestsell.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </>
    )
  }
}
