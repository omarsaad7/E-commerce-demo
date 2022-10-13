import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Badge from 'react-bootstrap/Badge'
import AccordionBootstrap from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import HeadersTable from './HeadersTable.jsx'
import BodyTable from './BodyTable.jsx'
import ResponseTable from './ResponseTable.jsx'
import APIData from './APIsData.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import { Styles } from '../General/StaticVariables/Styles.js'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    'font-weight': 'bold',
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
}))

const apiaccordianColor = '#ececec'
export default function Api() {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const notify = () => toast.success('Copied to clipboard')

  const handleBadge = (method) => {
    switch (method.toLowerCase()) {
      case 'post':
        return 'success'
      case 'delete':
        return 'danger'
      case 'get':
        return 'primary'
      case 'update':
        return 'info'
      default:
        return 'dark'
    }
  }

  return (
    <div className={classes.root}>
      <h1 style={{ display: 'inline' }}>APIs </h1>{' '}
      <h2 style={{ display: 'inline', color: 'gray', fontSize: '1em' }}>
        {staticVariables.backendURL}/{`{url_of_needed_api}`}
      </h2>
      <br />
      <br />
      {APIData.map((api) => (
        <Accordion
          expanded={expanded === `panel${APIData.indexOf(api)}`}
          onChange={handleChange(`panel${APIData.indexOf(api)}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>{api.title}</Typography>

            <Typography className={classes.secondaryHeading}>
              <Badge pill variant={handleBadge(api.method)}>
                {api.method}
              </Badge>
              {'      '}
              {api.URL}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography style={Styles.center90}>
              <AccordionBootstrap defaultActiveKey="0">
                {api.headers && (
                  <Accordion style={{ backgroundColor: apiaccordianColor }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Headers
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <HeadersTable headers={api.headers} />
                    </AccordionDetails>
                  </Accordion>
                )}
                {api.body && (
                  <Card>
                    <Accordion style={{ backgroundColor: apiaccordianColor }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>
                          Body
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Card.Body>
                          <BodyTable body={api.body} />
                          <Card
                            style={{
                              width: '50%',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}
                          >
                            <Card.Header as="h5">Body Example</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                <div style={Styles.lineSpace}>
                                  {api.body.sample &&
                                    api.body.sample
                                      .split('\n')
                                      .map((sampleLine) => (
                                        <p class="small">{sampleLine}</p>
                                      ))}
                                </div>
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                              <CopyToClipboard
                                text={api.body.sample}
                                onCopy={notify}
                              >
                                <button class="btn btn-lg  btn-info  text-uppercase">
                                  <FileCopyOutlinedIcon />
                                </button>
                              </CopyToClipboard>
                            </Card.Footer>
                          </Card>
                        </Card.Body>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                )}
                <Card>
                  <Accordion style={{ backgroundColor: apiaccordianColor }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.heading}>
                        Response
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ResponseTable responses={api.responses} />
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </AccordionBootstrap>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
