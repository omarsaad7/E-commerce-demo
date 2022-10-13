import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Title from './Title'
import LoadingIcon from '../General/Loading.js'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import Alert from 'react-bootstrap/Alert'
import { numberWithCommas, ApproximateToNthDigit } from '../General/Functions'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import { Styles } from '../General/StaticVariables/Styles.js'
import InfoIcon from '@material-ui/icons/Info'
import ReactTooltip from 'react-tooltip'

export default class Savings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalReceipts: null,
      loading: false,
      error: false,
    }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const headers = {
      authtoken: localStorage.getItem('token'),
      storeId: localStorage.getItem('key'),
    }
    await axios
      .get(
        `${staticVariables.backendURL}/api/receipts/readStoreReceipts/?limit=1&page=1`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data === 'no receipts found for the given storeId!') {
          this.setState({ loading: false, emptyState: true })
        } else if (response.data.data) {
          this.setState({
            totalReceipts: response.data.size,
            loading: false,
          })
        }
      })
      .catch((error) => {
        this.setState({ loading: false, error: true })
      })
  }

  render() {
    return (
      <React.Fragment>
        <div style={Styles.sideByside}>
          <div style={Styles.sideByside}>
            <Title>You saved </Title>
          </div>
          <InfoIcon
            data-tip
            data-for="savingInfo"
            style={{ paddingTop: '2.5%' }}
          />
          <ReactTooltip id="savingInfo" type="warning">
            <span>{staticVariables.descriptions.savingAnalytics}</span>
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
              {numberWithCommas(
                ApproximateToNthDigit(this.state.totalReceipts * 0.015, 2)
              )}
              $
            </Typography>
            <br />
            <Typography color="textPrimary" style={{ flex: 1 }}>
              with Beat The Receipt
            </Typography>
            <br />
            <Typography color="textSecondary" style={{ flex: 1 }}>
              Since you joined till now
            </Typography>
          </>
        )}
      </React.Fragment>
    )
  }
}
