import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {contestService} from './utils/contest-service';
import Contest from "./components/contest/Contest";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contests: [],
            user: {}
        };
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        contestService.getAll().then(response => {
            this.setState({contests: response.data.contests})
        });
    }

    render() {
        const {contests, user} = this.state;
        return (
            <div className="col-md-12 offset-md-3">
                <h1>Hi!</h1>
                <div className="row col-md-3 offset-md-9">
                    <Link to='/add' className="btn btn-success">Add</Link>
                    <Link to="/login">Logout</Link>
                </div>
                <div>
                {contests.map((contest, id) => {
                    return <Contest contest={contest} user={user} key={id} id={id}/>
                })}
                </div>
            </div>
        );
    }
}

export default HomePage;