import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import PeopleIcon from '@material-ui/icons/People'
import BarChartIcon from '@material-ui/icons/BarChart'
import LayersIcon from '@material-ui/icons/Layers'
import AssignmentIcon from '@material-ui/icons/Assignment'
import ReceiptIcon from '@material-ui/icons/Receipt'
import HomeIcon from '@material-ui/icons/Home';
import EditIcon from '@material-ui/icons/Edit'
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ReactTooltip from 'react-tooltip'
import DeleteStore from './DeleteStore.jsx'

const ActiveItemColor = '#353A40'
const DefaultItemColor = 'white'



export function MainListItems(props) {
  const sendDataToParentComponent = (data) => {
    props.parentCallback(data)
  }
  const list = [
    {
      name: 'Home',
      icon:(style,toolTipID)=> {
        return(
        <HomeIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'home',
    },
    {
      name: 'Receipts',
      icon:(style,toolTipID)=> {
        return(
        <ReceiptIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'receipts',
    },
    {
      name: 'Analytics',
      icon:(style,toolTipID)=> {
        return(
        <BarChartIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'analytics',
    },
    {
      name: 'Customize Receipt',
      icon:(style,toolTipID)=> {
        return(
        <EditIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'customize',
    },
    {
      name: 'Create Receipt',
      icon:(style,toolTipID)=> {
        return(
        <NoteAddIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'create Receipt',
    },
    {
      name: 'Integration',
      icon:(style,toolTipID)=> {
        return(
        <LayersIcon
          data-tip
          data-for={toolTipID}
          style={style}
        />)
        },
      toolTipID: 'integration',
    },
    // {
    //   name: 'Account',
    //   icon:(style,toolTipID)=> {
    //     return(
    //     <PeopleIcon
    //       data-tip
    //       data-for={toolTipID}
    //       style={style}
    //     />)
    //     },
    //   toolTipID: 'account',
    // },
  ]
  const [activeItem, setActiveItem] = React.useState(list[0].name)
  return (
    <div>
      {list.map((item) => (
        <ListItem
          button
          onClick={() => {
            setActiveItem(item.name)
            sendDataToParentComponent(item.name)
          }}
          style={activeItem === item.name
            ? { backgroundColor: ActiveItemColor,color: DefaultItemColor }
            : {}}
        >
          <ListItemIcon>
         
            {item.icon( activeItem === item.name
              ? { color: DefaultItemColor }
              : {},item.toolTipID)}
            {!props.open && (
              <ReactTooltip id={item.toolTipID} type="dark">
                <span>{item.name}</span>
              </ReactTooltip>
            )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  )
}


export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
)

export function thirdListItems(open) {
  return (
    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
      {/* <ListSubheader inset>Saved reports</ListSubheader> */}
      {/* <Button variant="danger" block onClick={(e) => alert('Coming Soon')}>
        {open ? 'Delete Account' : <DeleteForeverIcon />}
      </Button> */}
      <DeleteStore open={open}/>
    </div>
  )
}

