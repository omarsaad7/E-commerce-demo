import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import {Styles} from '../General/StaticVariables/Styles.js'



const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}))

const PrettoSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
    // width:'200%',
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

export default function CustomizedSlider(props) {
  const classes = useStyles()
  const sendDataToParentComponent = (data) => {
    props.parentCallback(data)
  }
  return (
    <div className={classes.root}>
      <Typography gutterBottom>{props.title}</Typography>
      <br/>
      <div style={Styles.slider}>
      <PrettoSlider
        valueLabelDisplay="on"
        aria-label="pretto slider"
        defaultValue={props.defaultValue}
        step={props.step}
        max={props.max}
        min = {props.min}
        onChange={(e, value) => sendDataToParentComponent(value)}
      />
      </div>
      <br/>
    </div>
  )
}
