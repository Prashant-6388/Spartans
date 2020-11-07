import React, { Component } from 'react';
import './css/App.css'; 
import Login from './login';
import Homescreen from './homescreen';
import ViewReport from './report/viewReport';
import { BrowserRouter as Router, Route, Switch,Redirect } from 'react-router-dom';
import AboutusScreen from './aboutus';
import T1Reportscreen from './report/T1Report';
import IBMReportscreen from './report/IBMReport';
import AccessManagement from './admin/accessManagement';
import DBConfig from './admin/DBConfig';
import AddReportForm from './form/AddReportForm';
import ManageReport from './report/manageReport';
import UserConfig from './admin/UserConfig';
import UserRoleConfig from './admin/UserRoleConfig';
import ReportList from './report/reportList';


class App extends Component {
  render() {
    return ( 
      <Router>
        <div className="App">
          <Switch>
            <Route exact path='/' component={Login} />
            <PrivateRoute path='/home' component={Homescreen} pageName='Home'/>
            <PrivateRoute path='/allReport' component={ReportList} pageName='All Reports' />
            <PrivateRoute path='/viewReport' component={ViewReport} pageName='ViewReport' />
            <PrivateRoute path='/t1Report' component={T1Reportscreen} pageName= 'T1Report'/>
            <PrivateRoute path='/ibmReport' component={IBMReportscreen} pageName= 'IBMReport'/>
            <PrivateRoute path='/addReport' component={AddReportForm} pageName='AddReport' />
            <PrivateRoute path='/accessManagement' component={AccessManagement} pageName='AccessManagement'/>
            <PrivateRoute path='/aboutus' component={AboutusScreen} pageName='Aboutus' />
            <PrivateRoute path='/dbConfig' component={DBConfig} pageName='DBConfig'/>
            <PrivateRoute path='/manageReport' component={ManageReport} pageName='ManageReport' />
            <PrivateRoute path='/userRoleConfig' component={UserRoleConfig} pageName='GroupRoleConfig'/>
            <PrivateRoute path='/userConfig' component={UserConfig} pageName='UserConfig'/>
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component,pageName, ...rest }) => (
  <Route {...rest} render={ props => {
    const accessPages = sessionStorage.getItem('access'); 
    console.log('access: '+accessPages);
    if (accessPages && accessPages.indexOf('ALL') === -1 && accessPages.indexOf(pageName) === -1 && pageName.indexOf('All Reports') ===-1
      && pageName.indexOf('ViewReport') === -1){
        alert('Unauthorized Access');
        return <Redirect to={{
          pathname: '/home',
          state: { from: props.location }
        }} />;
      }else if (!sessionStorage.getItem('userName')){
        return <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />;
      }
      return <Component {...props} />;
    }
  } />
);

export default App;
