import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import { ApproximateToNthDigit, numberWithCommas } from '../General/Functions'

export default function TotalTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell style={{ width: 20 }} align="left">
              <b>Subtotal</b>
            </TableCell>
            <TableCell style={{ width: 20 }} align="left"></TableCell>
            <TableCell style={{ width: 20 }} align="left">
              {numberWithCommas( ApproximateToNthDigit(props.subTotal,3))}{' '}{props.currency}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ width: 20 }} align="left">
              <b>VAT</b>
            </TableCell>
            <TableCell style={{ width: 20 }} align="left">
              {props.vatPercentage}%
            </TableCell>
            <TableCell style={{ width: 20 }} align="left">
              {numberWithCommas(
                ApproximateToNthDigit(
                  props.subTotal * (props.vatPercentage / 100),
                  3
                )
              )}{' '}{props.currency}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ width: 20 }} align="left">
              <b>Total</b>
            </TableCell>
            <TableCell style={{ width: 20 }} align="left"></TableCell>
            <TableCell style={{ width: 20 }} align="left">
              {numberWithCommas( ApproximateToNthDigit(props.total,3))}{' '}{props.currency}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
