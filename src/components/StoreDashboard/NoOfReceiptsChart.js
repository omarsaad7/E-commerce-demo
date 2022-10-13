import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts'
import Title from './Title'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Styles } from '../General/StaticVariables/Styles.js'
import IconButton from '@material-ui/core/IconButton'
import TodayIcon from '@material-ui/icons/Today'
import ReactTooltip from 'react-tooltip'
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { getCurrentDate } from '../General/Functions'
import LoadingIcon from '../General/Loading.js'
import Alert from 'react-bootstrap/Alert'
const currentday=getCurrentDate()
export default function Chart() {
  const theme = useTheme()
  const [openEdit, setOpenEdit] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [day, setDay] = React.useState(currentday)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(false)

  function handleClick(event) {
    setOpenEdit(event.currentTarget)
  }

  function handleClose() {
    setOpenEdit(null)
  }
  function handleDayChange(event) {
    setDay(event.target.value)
    getNumberReceipts(event.target.value)
  }
  React.useEffect(() => {
    getNumberReceipts(day)
  },[])
  async function getNumberReceipts(date) {
    setLoading(true)
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
        setData(response.data.result)
        setLoading(false)
      })
      .catch((error) => {
         
        setLoading(false)
        setError(true)
      })
  }
  function Edit() {
    return (
      <div>
        <IconButton
          aria-label="delete"
          onClick={() => (window.location.href = '/store/dashboard')}
          disabled={loading}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e)}
          style={Styles.right}
        >
          <TodayIcon
            // style={{ color: 'white' }}
            data-tip
            data-for="edit"
          />
          <ReactTooltip id="edit" type="dark">
            <span>Edit date</span>
          </ReactTooltip>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={openEdit}
          keepMounted
          open={Boolean(openEdit)}
          onClose={() => handleClose()}
          // style={{float:'right'}}
        >
          <MenuItem>
            <form noValidate>
              <TextField
                id="date"
                label="Select Date"
                type="date"
                onChange={(e) => handleDayChange(e)}
                value={day}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
            }}
          >
            Done
          </MenuItem>
        </Menu>
      </div>
    )
  }
  return (
    <React.Fragment>
      <div style={Styles.sideByside}>
        <div style={Styles.sideByside}>
          <Title>{currentday === day?"Today":day}</Title>
        </div>
        {Edit()}
      </div>
      <ResponsiveContainer>
        {loading ? (
          <LoadingIcon type="spin" color="#5bc0de" />
        ) :error?<Alert variant="danger">
        Error
      </Alert>: (
          <LineChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary}>
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: 'middle',
                  fill: theme.palette.text.primary,
                }}
              >
                Receipts
              </Label>
            </YAxis>
            <Line
              type="monotone"
              dataKey="amount"
              stroke={theme.palette.primary.main}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </React.Fragment>
  )
}
