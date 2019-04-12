import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Popular extends Component {
    render() {
        return (
            <li>
                <Link to={{pathname: '/contests/' + this.props.contest}}>{this.props.contest}</Link>
            </li>
        );
    }
}

export default Popular;