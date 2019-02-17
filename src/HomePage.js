import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {contestService} from './utils/contest-service';
import Contest from "./Contest";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            contests: [],
        };
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        contestService.getAllByUser(this.state.user.id).then(response => {
            console.log(response);
            this.setState({contests: response.data.contests})
        });
    }

    render() {
        const {user, contests} = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
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