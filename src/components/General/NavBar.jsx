import React from 'react'
import { Navbar, Nav, Form, Button } from 'react-bootstrap'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ReactTooltip from 'react-tooltip'
import { logout } from '../General/Functions'
import {isLoggedIn} from '../General/Functions'
import uri from '../General/StaticVariables/uri.json'

export default class NavBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
  }

  componentDidMount() {
    if(isLoggedIn()){
      this.setState({ loggedIn: true })
    }
    else{
      this.setState({ loggedIn: false })
    }
  }

  render() {
    if (!this.state.loggedIn) {
      return (
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/logo.png"
                width="60"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className="mr-auto">
              {/* <Nav.Link href="/">Home</Nav.Link> */}
              <Nav.Link href="/documentation">Documentation</Nav.Link>
              <Nav.Link href={'/trial'}>Trial</Nav.Link>
            </Nav>
            <Form inline bg="dark" variant="dark">
              <dev  style= {{paddingRight:'10px'}}>
            <Button href={uri.signUp} variant="outline-success">
                <PersonAddAlt1RoundedIcon /> Sign Up
              </Button>
              </dev>
              {'  '}
              <Button href={uri.login} variant="outline-success">
                <AccountCircleIcon /> Sign In
              </Button>
            </Form>
          </Navbar>
          <ReactTooltip />
        </div>
      )
    } else {
      return (
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/logo.png"
                width="60"
                height="30"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Nav className="mr-auto"/>
              
            
            <Form inline bg="dark" variant="dark">
              <div>
                <IconButton
                  aria-label="delete"
                  onClick={() => (window.location.href = '/store/dashboard')}
                >
                  {/* <div style={{ color: 'white' }}> */}
                  <DashboardIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="dashboard"
                  />
                  <ReactTooltip id="dashboard" type="dark">
                    <span>Dashboard</span>
                  </ReactTooltip>
                  {/* </div> */}
                </IconButton>
                <IconButton aria-label="delete" onClick={logout}>
                  <ExitToAppIcon
                    style={{ color: 'white' }}
                    data-tip
                    data-for="logout"
                  />
                  <ReactTooltip id="logout" type="dark">
                    <span>Log Out</span>
                  </ReactTooltip>
                </IconButton>
              </div>
            </Form>
          </Navbar>
          <ReactTooltip />
        </div>
      )
    }
  }
}
