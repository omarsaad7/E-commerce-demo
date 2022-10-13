import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import backendUrls from '../General/StaticVariables/backEndUrls.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Button } from 'react-bootstrap'


export default class Order extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      addItemloading:false,
      placeOrderloading:false,
      items: [],
      error:false,
      limit:12,
      page:1,
      totalSize:0
    }
  }


  async getItems(){
    this.setState({ loading: true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    await axios
      .get(
        backendUrls.host + backendUrls.user.baseUri + backendUrls.user.api.getUserById.replace(':id', localStorage.getItem('userId')),{
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            items: response.data.data.cart,
            totalSize:response.data.totalSize,
            loading: false
          })
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ loading: false, error: true })
      })
  }


  async removeItemFromBag(itemId,i){
    this.setState({ addItemloading: true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    const body = {
      itemId: itemId
  }
    await axios
      .post(
        backendUrls.host + backendUrls.user.baseUri + backendUrls.user.api.removeItem ,body, {
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            addItemloading: false
          })
          toast.success(staticVariables.messages.itemRemove)
          var arrItems = this.state.items
          arrItems.splice(i, 1)
          this.setState({
            items:arrItems
          })
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ addItemloading: false })
      })
  }

  async placeOrder(){
    this.setState({ addItemloading: true, placeOrderloading:true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    const body = {
      
  }
    await axios
      .post(
        backendUrls.host + backendUrls.order.baseUri + backendUrls.order.api.createOrder ,body, {
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            addItemloading: false,
            placeOrderloading:false
          })
          toast.success(staticVariables.messages.itemRemove)
          window.location.href = '/store/dashboard'
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
          this.setState({
            addItemloading: false,
            placeOrderloading:false
          })
      })
  }

  async componentDidMount() {
    this.getItems(this.state.page,this.state.limit)
  }

  itemPrice(priceInCents){
    var priceInDollars = priceInCents/100
    return priceInDollars.toFixed(2)
  }

  render() {
  return (
    <div>
      {this.state.loading?( <LoadingIcon type="spin" color="#00ff00" />):this.state.items.length===0?(<h1>{staticVariables.messages.noItemsTOShow}</h1>):(
        <div>
    <Row xs={1} md={3} className="g-4">
      {this.state.items.map((item,i) => (
        <Col>
        <div style={{paddingBottom:'20px'}}>
          <Card>
            <Card.Img variant="top" src={item.item.img} />
            <Card.Body>
              <Card.Title>{item.item.name}</Card.Title>
              <Card.Text>
              {item.item.description}
              </Card.Text>
              <Card.Text>
              Price per each: {this.itemPrice(item.item.price)}$
              </Card.Text>
              <Card.Text>
              Quantity: {item.count}
              </Card.Text>
              <Card.Text>
              Total Price: {this.itemPrice(item.item.price * item.count)}$
              </Card.Text>
              <Button 
                        disabled={this.state.addItemloading}
                        onClick={(e) => this.removeItemFromBag(item.item._id,i)}
                         variant="outline-danger">
                 Remove From Cart <RemoveShoppingCartIcon />
              </Button>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
    <Button 
    variant="success"
     size="lg" block
     onClick={(e) => this.placeOrder()}
     >{!this.state.placeOrderloading ? (
      'Make Order'
    ) : (
      <LoadingIcon color="#ffffff" />
    )}</Button>
    </div>
    
                        )}
    <ToastContainer
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                        />
    </div>
  );
  }
}



