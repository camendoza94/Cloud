import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {contestService} from "./utils/contest-service";

class AddContest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            image: '',
            url: '',
            startDate: '',
            endDate: '',
            payment: '',
            text: '',
            recommendations: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {name, image, url, startDate, endDate, payment, text, recommendations} = this.state;

        // stop here if form is invalid
        if (!(name && image && url && startDate && endDate && payment && text && recommendations)) {
            return;
        }

        this.setState({loading: true});

        contestService.addContest(name, image, url, startDate, endDate, payment, text, recommendations)
            .then(() => {
                const {from} = this.props.location.state || {from: {pathname: "/"}};
                this.props.history.push(from);
            })
            .catch(err => {
                    this.setState({error: err.toString(), loading: false});
                }
            )

    }

    render() {
        const {name, image, url, startDate, endDate, payment, text, recommendations, submitted, loading, error} = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Add new contest</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" name="name" value={name}
                               onChange={this.handleChange}/>
                        {submitted && !name &&
                        <div className="help-block alert">Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !image ? ' has-error' : '')}>
                        <label htmlFor="image">Image</label>
                        <input type="url" className="form-control" name="image" value={image}
                               onChange={this.handleChange}/>
                        {submitted && !image &&
                        <div className="help-block">Image is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !url ? ' has-error' : '')}>
                        <label htmlFor="url">URL</label>
                        <input type="text" className="form-control" name="url" value={url}
                               onChange={this.handleChange}/>
                        {submitted && !url &&
                        <div className="help-block">URL is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !startDate ? ' has-error' : '')}>
                        <label htmlFor="startDate">Start date</label>
                        <input type="date" className="form-control" name="startDate" value={startDate}
                               onChange={this.handleChange}/>
                        {submitted && !startDate &&
                        <div className="help-block">Start date is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !endDate ? ' has-error' : '')}>
                        <label htmlFor="endDate">End date</label>
                        <input type="date" className="form-control" name="endDate" value={endDate}
                               onChange={this.handleChange}/>
                        {submitted && !endDate &&
                        <div className="help-block">End date is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !payment ? ' has-error' : '')}>
                        <label htmlFor="payment">Payment</label>
                        <input type="number" className="form-control" name="payment" value={payment}
                               onChange={this.handleChange}/>
                        {submitted && !payment &&
                        <div className="help-block">Payment is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !text ? ' has-error' : '')}>
                        <label htmlFor="text">Text</label>
                        <textarea className="form-control" name="text" rows="3" value={text}
                                  onChange={this.handleChange}/>
                        {submitted && !text &&
                        <div className="help-block">Text is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !recommendations ? ' has-error' : '')}>
                        <label htmlFor="recommendations">Recommendations</label>
                        <textarea className="form-control" name="recommendations" rows="3" value={recommendations}
                                  onChange={this.handleChange}/>
                        {submitted && !recommendations &&
                        <div className="help-block">Recommendations required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" disabled={loading}>Add</button>
                        {loading &&
                        <img
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                        }
                    </div>
                    <Link to='/'>Home</Link>
                    {error &&
                    <div className={'alert alert-danger'}>{error}</div>
                    }
                </form>
            </div>
        );
    }
}

export default AddContest;