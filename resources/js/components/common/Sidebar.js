import * as React from 'react';
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles'; 
import MuiDrawer from '@mui/material/Drawer'; 
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List'; 
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiAppBar from '@mui/material/AppBar'; 
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; 
import Typography from '@mui/material/Typography'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import ListItems from '../../listItems'; 
 
 
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
 

function CommonSidebar() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const location = useLocation(); 
  let slug = "";
  let pathName = "";
  let procSlug1 = "";
  let procSlug2 = "";
  pathName = location.pathname.split("/");
  slug = pathName[pathName.length - 1];
 
  slug = slug.charAt(0).toUpperCase() + slug.slice(1);
  slug = slug.replaceAll("-", " "); 

  procSlug1 = pathName[pathName.length - 3];
  procSlug2 = pathName[pathName.length - 2];
  
  return ( 
        <>
          <AppBar  className="top-bar" position="absolute" color="secondary" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
           className="app-toolbar"
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              className="appbar-title"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {procSlug1 == 'request' && procSlug2 == 'id' ? "Request Details" : procSlug1 == 'local-purchase-orders' 
              ? "Local Purchase Order (LPO)" : procSlug2 == 'local-purchase-orders' ? "Create New Local Purchase Order (LPO)" : procSlug1 == 'payment-approval-forms' ? 
              "Payment Approval Form (PAF)" : procSlug2 == 'payment-approval-forms' ? "Create New Payment Approval Form (PAF)" : procSlug2 == 'suppliers' ? "Create New Supplier" : procSlug1 == 'suppliers' && procSlug2 == "id" ? "Edit Supplier" :  procSlug2 == 'companies' && slug == "Create" ? "Create New Business Unit" :
              procSlug1 == 'companies' && procSlug2 == "id" ? "Edit Business Unit" : procSlug2 == 'departments' && slug == "Create" ? "Create New Department" : procSlug1 == 'departments' && procSlug2 == "id" ? "Edit Department" : procSlug2 == 'categories' && slug == "Create" ? "Create New Category" : procSlug1 == 'categories' && procSlug2 == "id" ? "Edit Category" : 
              procSlug2 == 'users' && slug == "Create" ? "Create New User" : procSlug1 == 'users' && procSlug2 == "id" ? "Edit User" : procSlug2 == 'locations' && slug == "Create" ? "Create New Location" : procSlug1 == 'locations' && procSlug2 == "id" ? "Edit Location" :
              procSlug1 == 'requests' && procSlug2 == "id" ? "View / Update My Request" : slug}
            </Typography>
           
          </Toolbar>
        </AppBar>
        <Drawer className="no-print" variant="permanent" open={open}>
          <Toolbar
          className="app-toolbar"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer} className="no-print">
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider className="no-print" />
          <List component="nav" className="no-print">
             <ListItems slug={slug} page={procSlug1} page2={procSlug2}/>
          </List>
        </Drawer>
        </>
  );
}

export default function Sidebar() {
  return <CommonSidebar />;
}