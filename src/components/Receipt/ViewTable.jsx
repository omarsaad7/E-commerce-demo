import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { numberWithCommas} from '../General/Functions'


const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});



class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 70,
    rowHeight: 55,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

 

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
           
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);


 function GetItem (items,index){

  let item = {
      id:index,
      item:items[index].name,
      price:numberWithCommas(items[index].price),
      quantity:items[index].quantity,
      totalItemPrice:numberWithCommas(items[index].price * items[index].quantity)
  }
  return item;
}

function tableHeight (items){

  if(items.length<3){
    return 200;
  }
  else if(items.length===3){
    return 250;
  }
  else if(items.length===4){
    return 300;
  }
  else{
    return items.length*55 +70;
  }
  
}

export default function ReactVirtualizedTable(props) {
  return (
    <Paper style={{ height: tableHeight(props.items), width: '100%' }}>
      <VirtualizedTable
        rowCount={props.items.length}
        rowGetter={({ index }) => GetItem(props.items,index)}
        columns={[
          {
            width: 200,
            label: <b>Item</b>,
            dataKey: 'item',
          },
          {
            width: 120,
            label: <b>Price</b>,
            dataKey: 'price',
            numeric: true,
          },
          {
            width: 120,
            label: <b>Quantity</b>,
            dataKey: 'quantity',
            numeric: true,
          },
          {
            width: 120,
            label: <b>Total Price</b>,
            dataKey: 'totalItemPrice',
            numeric: true,
          },
        ]}
      />
    </Paper>
    
  );
}
