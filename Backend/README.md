# E-Commerce-Demo

### Overview
A web Platform that simulates the e-commerce-platforms main processes.



### Demo

Visit [**app**](https://sports-hub-livid.vercel.app/) and start exploring.  

### API Reference

You can find a postman collection for all the backend apis used.

### Built With

* MongoDB
* Node
* Express
* React
* Vercel
* Heroku

### Deployment

Deployment made using Vercel for frontend and Heroku for backend
* [Front-end](https://sports-hub-livid.vercel.app/)

* [Back-end](https://e-commerce-demo-api.herokuapp.com/)

Note: Heroku makes the app sleeps after a while of not using it. So backend deployment takes a little bit longer time for the first api call as it starts the application

## Run and test app on your local machine

### Prerequisites
You need to install git and npm on your machine.

### Installing

Clone the repo

```
git clone https://github.com/AtosBeatTheReceipt/AtosBTR
```
#### Run back-end server
Get inside back-end folder
```
cd Backend
```
Install needed packages
```
npm i
```
Run back-end server on port 5000
```
npm start
```

#### Run front-end server
Get inside front-end folder
```
cd FrontEnd
```
Install needed packages
```
npm i
```
Run front-end server on port 3000
```
npm start
```
### Testing
* You can signup and start testing but for admin access you need to sign in using 
  username : admin
  Password : admin
* Admin Apis has no frontend so you can test them from backend. All admin Apis are found in admin folder in the postman collection provided.
* For successfull payment process please enter one of the valid testing card found in this [**Link**](https://stripe.com/docs/testing).

### Note
* The application is designed to be used in stores, integrated to the Point of Sales (POS) systems and run on PCs. While it also functions on mobile devices, it is recommended to view the screen in landscape mode.
* The delete receipt and delete all receipts features in the dashboard are for testing only but when entering the market they will not appear as it is against the law to delete existing receipts for taxes calculations.


## Author

* [**Omar Saad**](https://www.linkedin.com/in/omar-saad-90862a163/)



