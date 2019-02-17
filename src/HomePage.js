import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {contestService} from './utils/contest-service';
import Contest from "./components/contest/Contest";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contests: []
        };
    }

    componentDidMount() {
        contestService.getAll().then(response => {
            this.setState({contests: response.data.contests})
        });
    }

    render() {
        const {contests} = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi!</h1>
                <Link to='/add' className="btn btn-success">Add</Link>
                {contests.map((contest, id) => {
                    return <Contest info={contest} key={id} id={id}/>
                })}
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

export default HomePage;