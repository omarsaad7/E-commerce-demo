import React from 'react';
import Title from './Title';
import ReceiptsTable from './ReceiptsTable'




export  function Receipts() {
  return (
    <React.Fragment>
      <Title>Recent Receipts</Title>
      <div style ={{width:'95%',marginLeft:'auto',marginRight:'auto'}}>
      <ReceiptsTable home/>
      </div>
    </React.Fragment>
  );
}





