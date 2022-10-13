import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import createReceipt from './createReceipt.PNG'
import sendRecipt from './send.PNG'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import {  toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

function getSteps(loggedin) {
  if (!loggedin)
    return [
      'Subscribe',
      'Try creating a receipt',
      'Show receipt QrCode',
      'Try sending the receipt by mail',
    ]
  else
    return [
      'Try creating a receipt',
      'Show receipt QrCode',
      'Try sending the receipt by mail',
    ]
}
function notify() {
  toast.success('Copied to clipboard')
}

function getStepContent(step, classes, loggedin) {
  if (!loggedin) {
    switch (step) {
      case 0:
        return (
          <Typography>
            Kindly go to our{' '}
            <a href="/subscribe" target="_blank">
              subscription page
            </a>{' '}
            and fill in your data to be provided with your store key and the
            token you are going to use to access our APIs.
          </Typography>
        )
      case 1:
        return (
          <div>
            <p>
              Make a post request with a body and a header like what in the APIs
              below and here is an example code.
            </p>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Code example using javascript and axios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <img style={{ width: '100%' }} src={createReceipt} alt="create receipt code example"/>
              </AccordionDetails>
              <CopyToClipboard text={createReceiptCodeSample} onCopy={notify}>
                <button
                  style={{
                    width: '12%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}
                  class="btn btn-lg btn-block  btn-info  text-uppercase"
                >
                  Copy
                  <FileCopyOutlinedIcon />
                </button>
              </CopyToClipboard>

              <br />
            </Accordion>
          </div>
        )
      case 2:
        return 'After creating the receipt, you receive a qrCode image and the receipt id as a response. You could take the qrCode from the responce and set it as an src of an img (HTML component). i.e (<img src={res.data.qrCode}></img>)'
      case 3:
        return (
          <div>
            <Typography>
              After creating the receipt and receiving the receipt id in the
              response, you could use this id and the email of the customer (you
              want to send the receipt by email to) in the body of a post
              request you could make using our APIs, and here is an example
              code.
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Code example using javascript and axios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <img style={{ width: '100%' }} src={sendRecipt} alt="send receipt code example"/>
              </AccordionDetails>
              <CopyToClipboard text={sendMailCodeSample} onCopy={notify}>
                <button
                  style={{
                    width: '12%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}
                  class="btn btn-lg btn-block  btn-info  text-uppercase"
                >
                  Copy
                  <FileCopyOutlinedIcon />
                </button>
              </CopyToClipboard>

              <br />
            </Accordion>
          </div>
        )
      default:
        return 'Unknown step'
    }
  } else {
    switch (step) {
      case 0:
        return (
          <div>
            <p>
              Make a post request with a body and a header like what in the APIs
              below and here is an example code.
            </p>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Code example using javascript and axios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <img style={{ width: '100%' }} src={createReceipt} alt="create receipt code example"/>
              </AccordionDetails>
              <CopyToClipboard text={createReceiptCodeSample} onCopy={notify}>
                <button
                  style={{
                    width: '12%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}
                  class="btn btn-lg btn-block  btn-info  text-uppercase"
                >
                  Copy
                  <FileCopyOutlinedIcon />
                </button>
              </CopyToClipboard>

              <br />
            </Accordion>
          </div>
        )
      case 1:
        return 'After creating the receipt, you receive a qrCode image and the receipt id as a responce. You could take the qrCode from the responce and set it as an src of an img (HTML component). i.e (<img src={res.data.qrCode}></img>)'
      case 2:
        return (
          <div>
            <Typography>
              After creating the receipt and receiving the receipt id in the
              response, you could use this id and the email of the customer (you
              want to send the receipt by email to) in the body of a post
              request you could make using our APIs, and here is an example code
              using javascript and axios.
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Code example using javascript and axios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <img style={{ width: '100%' }} src={sendRecipt} alt="send receipt code example"/>
              </AccordionDetails>
              <CopyToClipboard text={sendMailCodeSample} onCopy={notify}>
                <button
                  style={{
                    width: '12%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                  }}
                  class="btn btn-lg btn-block  btn-info  text-uppercase"
                >
                  Copy
                  <FileCopyOutlinedIcon />
                </button>
              </CopyToClipboard>

              <br />
            </Accordion>
          </div>
        )
      default:
        return 'Unknown step'
    }
  }
}

export default function IntegrationSteps(props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState({})
  const steps = getSteps(props.loggedin)

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  // const handleComplete = () => {
  //   const newCompleted = completed
  //   newCompleted[activeStep] = true
  //   setCompleted(newCompleted)
  //   handleNext()
  // }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  const checkSubscribe = () => {
    alert('herr')
    const newCompleted = completed
    newCompleted[0] = true
    setCompleted(newCompleted)
    handleNext()
  }
  return (
    <div className={classes.root}>
      <h1>Integration Steps</h1>
      {checkSubscribe}
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton
              onClick={handleStep(index)}
              completed={completed[index]}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep, classes, props.loggedin)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <></>
                  // <Button
                  //   variant="contained"
                  //   color="primary"
                  //   onClick={handleComplete}
                  // >
                  //   {completedSteps() === totalSteps() - 1
                  //     ? 'Finish'
                  //     : 'Complete Step'}
                  // </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const createReceiptCodeSample = ` 
axios
.post(
staticVariables.BTRapi+"/receipts/create",
{  storeId:storeId,//the store key returned for you from after subscription
receipt:{ 
  vatPercentage:0,//value added taxes if it exists 
  items:this.state.lineItems// an array of products 
       }}
,
 //create authToken key in the request header and set its value with the token returned for you from after subscription
{headers: { authToken : token }}
)
.then(res => {
this.setState({ 
//the response provides you with the receipt id and the qr code image as a link to use as an image src
             id: res.data.id ,
             qr: res.data.qrCode
           })
})
.catch(error => {
alert(error.message)
})`
const sendMailCodeSample = `await axios
.post(staticVariables.BTRapi+"/receipts/sendMail", 
{
  mail: this.state.mail,// the email you want to send the receipt to
  receiptId: this.state.id // the receipt id that was returned in the response of creating the receipt
}
,
 //create authToken key in the request header and set its value with the token returned for you from after subscription
{headers: { authToken : token }})
.then((res)=>{
  alert("sent successfully!")
  
})
.catch(error => {
  alert(error.message)
})`
