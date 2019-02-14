import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from "./routing/PrivateRoute";
import HomePage from './HomePage';
import Login from './Login';

require('dotenv').config();

//Extracts from http://jasonwatmore.com/post/2018/09/11/react-basic-http-authentication-tutorial-example
class App extends Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        <Router>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <Route path="/login" component={Login}/>
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
