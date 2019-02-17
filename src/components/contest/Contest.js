import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Contest extends Component {
    render() {
        return (
            <div className="card">
                <img src={this.props.info.image} className="card-img-top" alt={'Contest: ' + this.props.info.name}/>
                <div className="card-body">
                    <h5 className="card-title">{this.props.info.name}</h5>
                    <Link to={{pathname: '/contests/' + this.props.info.url, state: {info: this.props.info}}}
                          className="btn btn-primary">View detail</Link>
                </div>
            </div>
        );
    }
}

export default Contest;