import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from "./routing/PrivateRoute";

import HomePage from './HomePage';
import Login from './Login';
import Register from "./Register";
import ContestDetail from "./components/contest/ContestDetail";
import AddContest from "./components/contest/AddContest";
import ParticipantRecordNew from './components/participantRecord/ParticipantRecordNew';
import NoMatch from "./NoMatch";
import MostPopular from "./MostPopular";

require('dotenv').config();

//Extracts from http://jasonwatmore.com/post/2018/09/11/react-basic-http-authentication-tutorial-example
class App extends Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col-sm-12">
                        <Router>
                            <div>
                                <Switch>
                                    <Route path="/login" component={Login}/>
                                    <Route path='/register' component={Register}/>
                                    <Route exact path='/contests/:url' component={ContestDetail}/>
                                    <Route path='/contests/:id/addParticipantRecord' component={ParticipantRecordNew}/>
                                    <Route path='/popular' component={MostPopular}/>
                                    <PrivateRoute exact path="/contests" component={HomePage}/>
                                    <PrivateRoute exact path="/" component={HomePage}/>
                                    <PrivateRoute exact path="/add" component={AddContest}/>
                                    <PrivateRoute exact path="/contests/:id/edit" component={AddContest}/>
                                    <PrivateRoute component={NoMatch}/>
                                </Switch>
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
