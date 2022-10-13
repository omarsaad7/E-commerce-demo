import { toast } from 'react-toastify'
import staticVariables from '../General/StaticVariables/StaticVariables.json'
import axios from 'axios'

export function ApproximateToNthDigit(value, x) {
  return (
    Math.round((value + Number.EPSILON) * Math.pow(10, x)) / Math.pow(10, x)
  )
}


export async function sendReceiptMail(token, email, receiptId) {
  const headers = {
    authToken: token,
  }
  const body = {
    mail: email,
    receiptId: receiptId,
  }
  await axios
    .post(`${staticVariables.backendURL}/api/receipts/sendMail`, body, {
      headers: headers,
    })
    .then((response) => {
      toast.success(`Receipt has been sent to mail`)
      return true
    })
    .catch((error) => {
      toast.error(`OOPS!! Something went wrong. Try again`)
       
      return false
    })
}

export function logout() {
  localStorage.setItem('token', '')
  localStorage.setItem('password', '')
  localStorage.setItem('username', '')
  localStorage.setItem('userId', '')
  window.location.href = '/'
}

export function isLoggedIn() {
  if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
    return true
  } else {
    return false
  }
}

export function getWindowSize() {
  let windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // window.addEventListener("resize", getWindowSize);

  return windowSize
}

export function loginLocalStorage(token, username, password,userId) {
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)
  localStorage.setItem('password', password)
  localStorage.setItem('userId', userId)
}

export function convertTZ(date,dateStyle,timeStyle) {
  
  return (typeof date==='string'
  ? new Date(date)
  : date
).toLocaleString('en-US', {
  dateStyle: dateStyle,
  timeStyle: timeStyle,
})
}

export async function createReceipt(storeId, token, receipt) {
  const headers = {
    authToken: token,
  }
  const body = receipt.barcode?{
    storeId: storeId,
    barcode:receipt.barcode,
    receipt: {
      vatPercentage: receipt.vat,
      items: receipt.items,
      
    },
  }:{
    storeId: storeId,
    receipt: {
      vatPercentage: receipt.vat,
      items: receipt.items,
    },
  }
  let response = undefined
  await axios
    .post(`${staticVariables.backendURL}/api/receipts/create`, body, {
      headers: headers,
    })
    .then((res) => {
      toast.success(`Receipt has been created successfully`)
      response = res.data
    })
    .catch((error) => {
      toast.error(`OOPS!! Something went wrong. Try again`)
       
    })
  return response
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getCurrentDateTime() {
  let currentdate = new Date()
  let currentMonth =
    currentdate.getMonth() + 1 > 9
      ? currentdate.getMonth() + 1
      : `0${currentdate.getMonth() + 1}`
  let currentDay =
    currentdate.getDate() > 9
      ? currentdate.getDate()
      : `0${currentdate.getDate()}`
  let currentHour =
    currentdate.getHours() > 9
      ? currentdate.getHours()
      : `0${currentdate.getHours()}`
  let currentMin =
    currentdate.getMinutes() > 9
      ? currentdate.getMinutes()
      : `0${currentdate.getMinutes()}`
  let dateString = `${currentdate.getFullYear()}-${currentMonth}-${currentDay}T${currentHour}:${currentMin}`
  return dateString
}

export function getCurrentDate() {
  let currentdate = new Date()
  let currentMonth =
    currentdate.getMonth() + 1 > 9
      ? currentdate.getMonth() + 1
      : `0${currentdate.getMonth() + 1}`
  let currentDay =
    currentdate.getDate() > 9
      ? currentdate.getDate()
      : `0${currentdate.getDate()}`
  let dateString = `${currentdate.getFullYear()}-${currentMonth}-${currentDay}`
  return dateString
}