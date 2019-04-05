import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Contest extends Component {
    render() {
        return (
            <div className="card">
                <img style={{width: '300px'}} src={`${process.env.REACT_APP_ROOT_URL}/images/${this.props.contest.image.S}`} className="card-img-top"
                     alt={'Contest: ' + this.props.contest.name.S}/>
                <div className="card-body">
                    <h5 className="card-title">{this.props.contest.name.S}</h5>
                    <Link to={{
                        pathname: '/contests/' + this.props.contest.url.S,
                        state: {contest: this.props.contest, user: this.props.user}
                    }}
                          className="btn btn-primary">View detail</Link>
                </div>
            </div>
        );
    }
}

export default Contest;