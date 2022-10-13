import './App.css'
import React, { Component } from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import SignUp from './components/signUp/signUp.jsx'
import Receipt from './components/Receipt/Receipt.jsx'
import Error from './components/Error/Error.jsx'
import Documentation from './components/Documentation/Documentation.jsx'
import Home from './components/Home/Home.jsx'
import Trial from './components/Trial/Trial.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Cart from './components/ShoppingCart/Cartt'
import Order from './components/Order/Order'
import StoreDashboard from './components/StoreDashboard/Dashboard.js'
import uri from './components/General/StaticVariables/uri.json'

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={() => <Home />} />
            <Route exact path={uri.signUp} component={() => <SignUp />} />
            <Route exact path={uri.cart} component={() => <Cart />} />
            <Route exact path={uri.order} component={() => <Order />} />
            <Route
              exact
              path="/receipt/:id"
              component={(props) => <Receipt {...props} />}
            />
            <Route
              exact
              path="/documentation"
              component={() => <Documentation />}
            />
            <Route exact path="/trial" component={() => <Trial />} /> 
            <Route exact path={uri.login} component={() => <SignIn />} />
            <Route
              exact
              path="/store/dashboard"
              component={() =>
                localStorage.getItem('token') &&
                localStorage.getItem('token') !== '' ? (
                  <StoreDashboard />
                ) : (
                  <Error errorCode="401" errorMessage="Unauthorized" />
                )
              }
            />
            {/* <Route exact path="/details/:id" render={(props) => <DetailsPage globalStore={globalStore} {...props} /> } /> */}

            {/* <Route exact path="/main/:type"  component={(props)=><Navbar key="1" {...props} type={localStorage.getItem("type")} value={localStorage.getItem('token')} />} />

   <Route exact path="/receipt/:id/:price"  component={Receipt}  />
   <Route exact path="/main/receipt"  component={()=><Invoice key="1" value={this.state.token} />}  /> */}

            <Route
              component={() => (
                <Error errorCode="404" errorMessage="Page Not Found" />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
