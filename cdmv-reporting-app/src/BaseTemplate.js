import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { AppBar, Toolbar,  Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import upsicon from './img/ups.ico';
import { useHistory } from 'react-router-dom';
import './css/App.css';
import './css/menu.css';
import Menu from './Menu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    backgroundColor : 'rgba(71, 0, 0, 1)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
	opacity: 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));
export default function MiniDrawer() {
  const classes = useStyles();
  let history = useHistory();
  const signout = () => {
    sessionStorage.removeItem('userName');
    history.push('/');
  }
  var user = sessionStorage.getItem('userName'); 
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar  position="fixed"
        className={classes.appBar}>
        <Toolbar>      
          <img
						alt="ups-logo"
            src={upsicon}

	    		/>
            CDMv Dashboard
           <div style={{ right: 10, position: "fixed", top: 5 }}>
            Welcome <span className="userName">{user}</span><br/>
            <Button color="inherit" className="signout" onClick={signout} >Sign out</Button>
          </div>
        </Toolbar>
        <Menu />
      </AppBar>      
    </div>
  );
}