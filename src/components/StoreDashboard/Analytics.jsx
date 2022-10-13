import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
// import Chart from './NoOfReceiptsChart'
import PeakHoursBarChart from './PeakHoursBarChart'
import NoReceiptsBarChart from './NoReceiptsBarChart.jsx'
import Income from './Income.jsx'
import Savings from './TotalSavings.jsx'
import BestSelling from './BestSellingChart'
import { Styles } from '../General/StaticVariables/Styles.js'
export default class Analytics extends Component {
  render() {
    return (
      <div>
          
          <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={6} style={{marginLeft:'auto',marginRight:'auto'}}>
            <Paper style={Styles.analyticsCard}>
              <BestSelling />
            </Paper>
          </Grid>
          </Grid>
          
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper style={Styles.analyticsCard}>
              <PeakHoursBarChart />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper style={Styles.analyticsCard}>
              <Income />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8} lg={9}>
            <Paper style={Styles.analyticsCard}>
              <NoReceiptsBarChart />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper style={Styles.analyticsCard}>
              <Savings />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

