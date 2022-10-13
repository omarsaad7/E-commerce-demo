const APIs = [
  {
    title: 'Create Receipt',
    description: '',
    method: 'POST',
    URL: '/api/receipts/create',
    headers: [
      {
        key: 'authToken',
        value: 'Your Subscription token',
      },
    ],
    body: {
      fields: [
        {
          name: 'storeId',
          sample: `"storeId": "store_subscription_key"`,
          description:
            'Your Store Subscription Key (sent to mail when subscription).',
          required: true,
        },
        {
          name: 'barcode',
          sample: `"barcode":"12s3456789121"`,
          description: 'Receipt barcode if exists.',
        },
        {
          name: 'receipt',
          sample: `"receipt":{
            "vatPercentage":20,
             "items": [
             {
               "name": "Test1",
               "description":"description1",
               "price": 45.99,
               "quantity": 2
             }
           ]
        }`,
          description: 'Receipt Information.',
          subfields: [
            {
              name: 'vatPercentage',
              sample: ` "vatPercentage":20`,
              description:
                'Percentage of VAT that will be calculated and added to receipt subtotal value',
              required: true,
            },
            {
              name: 'items',
              sample: ` "items": [
                {
                  "name": "Test1",
                  "description":"description1",
                  "price": 45.99,
                  "quantity": 2
                }
              ]`,
              subfields: [
                {
                  name: 'name',
                  sample: ` "name": "ITEM1"`,
                  description: 'Item Name',
                  required: true,
                },
                {
                  name: 'description',
                  sample: ` "description": "Very Good Item"`,
                  description: 'Item description',
                },
                {
                  name: 'price',
                  sample: ` "price": 45.99`,
                  description: 'Price per each',
                  required: true,
                },
                {
                  name: 'quantity',
                  sample: ` "quantity": 2`,
                  description: 'Quanity number of this Item',
                  required: true,
                },
              ],
              description: 'Items that will be shown on the receipt',
              required: true,
            },
          ],
          required: true,
        },
      ],
      sample: `{
              "storeId":"store_key",
              "barcode":"12s3456789FD12sa1",
              "receipt":{
                  "vatPercentage":20,
                   "items": [
                   {
                     "name": "Test1",
                     "description":"description1",
                     "price": 45.99,
                     "quantity": 2
                   }
                 ]
              }
           }`,
    },
    responses: [
      {
        code: 200,
        success: true,
        response: `{
        "id": "created_receipt_id",
        "qrCode": "QrCode Source"
        }`,
        details: 'Success',
      },
      {
        code: 400,
        response: `ATTRIBUTE is required`,
        details: 'Required ATTRIBUTE is missing in the request body',
      },
      {
        code: 404,
        response: `"error": "No Store exist with this key"`,
        details: 'Invalid storeId input. Insert your Subscription Key',
      },
      {
        code: 401,
        response: `Access Denied`,
        details: 'Invalid Token',
      },
      
    ],
  },
  {
    title: 'Get Store Receipts',
    description: '',
    method: 'Get',
    URL: '/api/receipts/readAllStoreReceipts/<storeId>',
    headers: [
      {
        key: 'authToken',
        value: 'Your Subscription token',
      },
    ],
   
    responses: [
      {
        code: 200,
        success: true,
        response: `{
        "data":[{receipt1},{receipt2},...]
        }`,
        details: 'Success',
      },
      {
        code: 404,
        response: `no such storeId found!`,
        details: 'You have entered a wrong store id ',
      },
    
      {
        code: 401,
        response: `Access Denied`,
        details: 'Invalid Token',
      },
      
    ],
  },
  {
    title: 'Get Single Receipt By Id',
    description: '',
    method: 'Get',
    URL: '/api/receipts/read/<receipt id>',
   
   
    responses: [
      {
        code: 200,
        success: true,
        response: `{
          "msg": "This Receipt information",
        "data":{
          "_id": "receiptId",
          "barcode": "receipt barcode",
          "storeInfo": {
            "phoneNumbers": store.phoneNumbers,
            "address": store.address,
            "storeName": store.storeName,
            "category": store.category,
            "mail": store.mail,
            "timeZone": store.timeZone,
            "backgroundColor": store.backgroundColor,
            "fontColor":store.fontColor ,
            "dateStyle": store.dateStyle,
            "timeStyle": store.timeStyle,
            "currency": store.currency,
            "createdAt": store.createdAt,
            "updatedAt": store.updatedAt
        },
          "receipt": 
          {
            "vatPercentage": ,
            "items": [
                {
                  "name": "",
                  "price": ,
                  "quantity":  
                },
                {
                  "name": "",
                  "price": ,
                  "quantity": 
                }
            ],
            "subtotal": ,
            "total": 
          }
          "date": "date of receipt issuance according to the store timezone.",
          "createdAt":"when the receipt was created",
          "updatedAt": "when the receipt was updated",
          "qrCode": "the genereated qrCode that redirects to the receipt"
        }
        }`,
        details: 'Success',
      },
      {
        code: 404,
        response: `no such receipt id found!`,
        details: 'You have entered a wrong receipt id ',
      }
      
    ],
  },
  {
    title: 'Send Receipt By Email',
    description: '',
    method: 'POST',
    URL: '/api/receipts/sendMail',
    headers: [
      {
        key: 'authToken',
        value: 'Your Subscription token',
      },
    ],
    body: {
      fields: [
        {
          name: 'mail',
          sample: `"mail": "customerEmail@gmail.com"`,
          description:
            'The email you want to send the receipt to.',
          required: true,
        },
        {
          name: 'receiptId',
          sample: `"receiptId": "602c1c4266f8e2001558b757"`,
          description:
            'The id of the created receipt that was sent in the response of creating a receipt.',
          required: true,
        }
      ],
       sample:`{
        "mail":"test@test.com",
        "receiptId":"receiptId here"
    }`
    },
    responses: [
      {
        code: 200,
        success: true,
        response: `{
          "msg": "Email Sent"
      }`,
        details: 'Success',
      },
      {
        code: 400,
        response: `ATTRIBUTE is required`,
        details: 'Required ATTRIBUTE is missing in the request body',
      },
      {
        code: 400,
        response: `ATTRIBUTE not found`,
        details: 'When the provided receipt id is wrong',
      },
      
      {
        code: 401,
        response: `Access Denied`,
        details: 'Invalid Token',
      },
      
    ],
  }
  
 
]

export default APIs