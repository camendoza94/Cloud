import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {contestService} from './utils/contest-service';
import Contest from "./components/contest/Contest";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contests: [],
            page: 0,
            user: {}
        };
        this.getContests = this.getContests.bind(this);
    }

    componentDidMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem('user')),
        });
        this.getContests(null, true);
    }

    getContests(lek, forward) {
        contestService.getAll(lek, forward).then(response => {
            const newPage = forward ? this.state.page + 1 : this.state.page - 1;
            this.setState({contests: response.data.contests, lek: response.data.lek, page: newPage})
        });
    }

    render() {
        const {contests, user, lek, page} = this.state;
        return (
            <div className="col-md-12">
                <h1>Hi!</h1>
                <div className="row col-md-3 offset-md-10">
                    <Link to='/add' className="btn btn-success">Add</Link>
                    <Link to="/login">Logout</Link>
                </div>
                <div>
                    {contests.map((contest, id) => {
                        return <Contest contest={contest} user={user} key={id} id={id}/>
                    })}
                </div>
                <div className="container">
                    <ul className="pagination">
                        {page !== 1 &&
                        <li className="page-item">
                            <button className="page-link" onClick={() => {
                                this.getContests(lek, false)
                            }}>
                                &#x3C;
                            </button>
                        </li>}
                        {lek &&
                        <li className="page-item">
                            <button className="page-link" onClick={() => {
                                this.getContests(lek, true)
                            }}>
                                &#x3E;
                            </button>
                        </li>}
                    </ul>
                </div>
            </div>
        );
    }
}

export default HomePage;