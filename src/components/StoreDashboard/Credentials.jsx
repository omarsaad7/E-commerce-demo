import React, { Component } from 'react'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {  toast } from 'react-toastify'
import Card from 'react-bootstrap/Card'
import { Styles } from '../General/StaticVariables/Styles.js'


export default class Credentials extends Component {
  
  render() {
    return (
      
        <div style={Styles.centered50}>
            <Card border="success">
            <Card.Body>         
            <h1>Subscription Key</h1>
                        <InputGroup className="mb-3">
              <FormControl
                id="subs"
                class="form-control"
                placeholder="subscription"
                value={localStorage.getItem('key')}
                disabled="true"
                autofocus
              />
              <InputGroup.Append>
                <CopyToClipboard
                  text={localStorage.getItem('key')}
                  onCopy={() => {
                    toast.success('Copied to Clipboard')
                  }}
                >
              <Button variant="info">
                  <FileCopyOutlinedIcon />
                </Button>
                </CopyToClipboard>
              </InputGroup.Append>
            </InputGroup>

                  <h1>Subscription token</h1>
            <InputGroup className="mb-3">
            <textarea
              name="message"
              rows="3"
              class="form-control"
              value={localStorage.getItem('token')}
              disabled="true"
              autofocus
            />
            <InputGroup.Append>
            <CopyToClipboard
              text={localStorage.getItem('token')}
              onCopy={() => {
                toast.success('Copied to Clipboard')
              }}
            >
              <button class="btn btn-lg btn-info  text-uppercase">
                <FileCopyOutlinedIcon />
              </button>
            </CopyToClipboard>
              </InputGroup.Append>
            </InputGroup>
            </Card.Body>
            </Card>
                        </div>
      
    )
  }
}

