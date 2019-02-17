import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from "./routing/PrivateRoute";

import HomePage from './HomePage';
import Login from './Login';
import Register from "./Register";
import ContestDetail from "./components/contest/ContestDetail";
import AddContest from "./components/contest/AddContest";
import ContestEdit from './components/contest/ContestEdit';
import ParticipantRecordNew from './components/participantRecord/ParticipantRecordNew';

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
                                <Route path="/login" component={Login}/>
                                <Route path='/register' component={Register}/>
                                <Route exact path='/contests/:url' component={ContestDetail}/>
                                <Route path='/contests/:id/addParticipantRecord' component={ParticipantRecordNew}/>
                                <PrivateRoute exact path="/contests" component={HomePage}/>
                                <PrivateRoute exact path="/" component={HomePage}/>
                                <PrivateRoute exact path="/add" component={AddContest}/>
                                <PrivateRoute exact path="/contests/:id/edit" component={ContestEdit}/>
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
