var qs = require('qs');

function paymentBackendRequest(body) {
  return qs.stringify({
    'amount': body.amount,
   'currency': body.currency,
   'card[number]': body.cardNumber,
   'card[exp_month]': body.expMonth,
   'card[exp_year]': body.expYear,
   'card[cvc]': body.cvc 
   });
  }
  
  
  
module.exports = { paymentBackendRequest}