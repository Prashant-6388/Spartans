import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { Paper, withStyles, Grid, TextField,} from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import Box from '@material-ui/core/Box'
import { Redirect } from 'react-router-dom';
import Background from './img/login_bg.jpg';
import './css/App.css';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { CircularProgress } from '@material-ui/core';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false,
            loginResponse: '',
            open: false
        }

        this.displayLoadingIndicator = this.displayLoadingIndicator.bind(this);
        this.hideLoadingIndicator = this.hideLoadingIndicator.bind(this);
    }
    render() {        
        console.log(this.state.username);
        const { classes } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/home' } }
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
            return <Redirect to={from} />
        }
        return (
            <div className="Login-Bg" style={{
                backgroundImage: `url(${Background})`
            }}>            
            <Box width={1 / 4} style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '347px'
            }}>
                    
                <Paper className={classes.margin}>
                    <fieldset>
                        <legend>Sign In</legend>
                        <div className={classes.padding}>                            
                            <Grid container spacing={8} alignItems="flex-end">
                                <Grid item>
                                    <Face />
                                </Grid>
                                <Grid item md={true} sm={true} xs={true}>
                                    <TextField id="username" label="Username" fullWidth autoFocus required 
                                        defaultValue={this.state.username}
                                        onChange={event => {
                                            const { value } = event.target;
                                            this.setState({ username: value });
                                        }}/>
                                </Grid>
                            </Grid>
                            <Grid container spacing={8} alignItems="flex-end">
                                <Grid item>
                                    <Fingerprint />
                                </Grid>
                                <Grid item md={true} sm={true} xs={true}>                            
                                    <TextField id="password" label="Password" type="password" fullWidth required 
                                        onChange={event => {
                                            const { value } = event.target;
                                            this.setState({ password: value });
                                        }}/>
                                </Grid>
                            </Grid>                
                            <Grid container justify="center" style={{ marginTop: '10px' }}>
                                    <MuiThemeProvider>
                                    <RaisedButton label="Login" primary={true}  onClick={(event) => this.handleClick(event)} />
                                        </MuiThemeProvider>
                            </Grid>                            
                        </div>
                    </fieldset>
                </Paper>
            </Box> 
                <Dialog open={this.state.open}>
                    <DialogContent 
                        disableBackdropClick
                        disableEscapeKeyDown>
                        <CircularProgress />
                    </DialogContent>
                </Dialog>                   
            </div>
        );
    }

    displayLoadingIndicator(){
        this.setState({ open: true });
    }

    hideLoadingIndicator(){
        this.setState({ open: false });
    }

    handleClick(event) {
        
        if (!this.state.username ) {
            alert("Username is mandatory");
        } else if (!this.state.password){
            alert("Password is mandatory");
        }else {            
        var loginApiUrl = "http://localhost:9000/login";
     var payload = {
         "userName": this.state.username,
         "password": this.state.password
     }
            var self = this;
            try { 
                self.displayLoadingIndicator();
                axios.post(loginApiUrl, payload).then(function(response){
                    console.log('Got response from login API'+ response.status)
                    if (response.status === 200) {
                        console.log('Login service reponse: '+response.data);
                        if(Array.isArray(response.data) && response.data.length && response.data[1]){
                            sessionStorage.setItem('userName', self.state.username);
                            sessionStorage.setItem('userGroup', response.data[0]);
                            sessionStorage.setItem('access', response.data[1]);
                            self.setState(() => ({
                                redirectToReferrer: true,
                                open: false
                            }))                              
                        } else if (!response.data[0]){
                            alert('The user do not have any groups assigned');
                        } else 
                        {
                            alert('Please enter valid credentials');
                        }
                    }
                    else if (response.data.code === 204) {
                        console.log("Username password do not match");
                        alert("username password do not match")
                    }
                    else {
                        console.log("Username does not exists");
                        alert("Username does not exist");
                    }
                }).catch(ex => {
                    console.log("An error occurred while validating login details");
                    alert("A technical error occurred");
                });                
            }catch(error){
                console.log('Axios request failed: ${e}');
                alert('A technical error occured');
            }finally{
                self.hideLoadingIndicator();
            }
            
        }    
    }
}
const styles = theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    padding: {
        padding: theme.spacing(1)
    } 
});

export default withStyles(styles)(Login);