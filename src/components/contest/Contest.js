import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Contest extends Component {
    render() {
        return (
            <div className="card">
                <img src={this.props.contest.image} className="card-img-top"
                     alt={'Contest: ' + this.props.contest.name}/>
                <div className="card-body">
                    <h5 className="card-title">{this.props.contest.name}</h5>
                    <Link to={{
                        pathname: '/contests/' + this.props.contest.url,
                        state: {contest: this.props.contest, user: this.props.user}
                    }}
                          className="btn btn-primary">View detail</Link>
                </div>
            </div>
        );
    }
}

export default Contest;