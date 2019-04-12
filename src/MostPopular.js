import React, {Component} from 'react';
import {contestService} from './utils/contest-service';
import Popular from "./components/contest/Popular";


class MostPopular extends Component {

    constructor(props) {
        super(props);
        this.state = {
            popular: []
        }
    }

    componentDidMount() {
        contestService.getMostPopular().then((response) => {
            if (Object.keys(response.data).length !== 0)
                this.setState({popular: response.data})
        });
    }

    render() {
        const {popular} = this.state;
        return (
            popular.length > 0 ?
                <div>
                    <h3>Most popular contests right now:</h3>
                    <ol>{popular.map(contest => <Popular key={contest} contest={contest}/>)}</ol>
                </div>
                : <h4>No popular contests have been found</h4>
        );
    }
}

export default MostPopular;