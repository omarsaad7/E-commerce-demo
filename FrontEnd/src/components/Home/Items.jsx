import React, { Component } from 'react'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import backendUrls from '../General/StaticVariables/backEndUrls.json'
import { ToastContainer, toast } from 'react-toastify'
import LoadingIcon from '../General/Loading.js'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {Form, Button } from 'react-bootstrap'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {isLoggedIn} from '../General/Functions'
import uri from '../General/StaticVariables/uri.json'

export default class Items extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      addItemloading:false,
      items: [],
      error:false,
      limit:12,
      page:1,
      totalSize:0
    }
  }

  async nextPage(){
    var totalPages = Math.ceil(this.state.totalSize / this.state.limit)
    if(totalPages > this.state.page){
      await this.getItems(this.state.page+1,this.state.limit)
      this.setState({ page: this.state.page+1 })
    }
  }

  async previousPage(){
    if(this.state.page>1){
      await this.getItems(this.state.page-1,this.state.limit)
      this.setState({ page: this.state.page-1 })
    }
  }

  async getItems(page,limit){
    this.setState({ loading: true })
    await axios
      .get(
        backendUrls.host + backendUrls.item.baseUri + backendUrls.item.api.getAllItems + `?limit=${limit}&page=${page}`,
      )
      .then((response) => {
        
          this.setState({
            items: response.data.data,
            totalSize:response.data.totalSize,
            loading: false,
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


  async addItemToBag(itemId){
    if(!isLoggedIn()){
      window.location.href = uri.login;
      return
    }
    this.setState({ addItemloading: true })
    const headers = {
      Authorization: localStorage.getItem('token'),
    }
    const body = {
      itemId: itemId,
      count: 1
  }
    await axios
      .post(
        backendUrls.host + backendUrls.user.baseUri + backendUrls.user.api.addItem ,body, {
          headers: headers,
        }
      )
      .then((response) => {
        
          this.setState({
            addItemloading: false
          })
          toast.success(staticVariables.messages.itemAdded)
      })
      .catch((error) => {
        if(error.response && error.response.data && error.response.data.error)
          toast.error(error.response.data.error)
         else
          toast.error(staticVariables.messages.somethingWrong)
        this.setState({ addItemloading: false })
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
      {this.state.items.map((item) => (
        <Col>
        <div style={{paddingBottom:'20px'}}>
          <Card>
            <Card.Img variant="top" src={item.img} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>
              {item.description}
              </Card.Text>
              <Card.Text>
              Price: {this.itemPrice(item.price)}$
              </Card.Text>
              <Button 
                        disabled={this.state.addItemloading}
                        onClick={(e) => this.addItemToBag(item._id)}
                         variant="outline-success">
                 Add To Cart <AddShoppingCartIcon />
              </Button>
            </Card.Body>
          </Card>
          </div>
        </Col>
      ))}
    </Row>
    <Form inline bg="dark" variant="dark">
              <dev  style= {{paddingRight:'10px'}}>
            <Button disabled={this.state.page<=1}
                        onClick={(e) => this.previousPage(e)}
                         variant="outline-success">
                <ArrowLeftIcon /> Previous
              </Button>
              </dev>
              {'  '}
              <Button 
                        disabled={Math.ceil(this.state.totalSize / this.state.limit)<=this.state.page}
                        onClick={(e) => this.nextPage(e)}
                         variant="outline-success">
                 Next <ArrowRightIcon />
              </Button>
            </Form>
    </div>
    
                        )}
    <ToastContainer
                          position="top-center"
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



