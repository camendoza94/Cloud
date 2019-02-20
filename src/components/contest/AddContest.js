import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {contestService} from "../../utils/contest-service";

class AddContest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: (this.props.location.state && this.props.location.state.name) || '',
            image: '',
            url: (this.props.location.state && this.props.location.state.url) || '',
            startDate: (this.props.location.state && this.props.location.state.startDate.substr(0, 10)) || '',
            endDate: (this.props.location.state && this.props.location.state.endDate.substr(0, 10)) || '',
            payment: (this.props.location.state && this.props.location.state.payment) || '',
            text: (this.props.location.state && this.props.location.state.text) || '',
            recommendations: (this.props.location.state && this.props.location.state.recommendations) || '',
            edit: (this.props.location.state && this.props.location.state.edit) || false,
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {name, image, url, startDate, endDate, payment, text, recommendations, edit} = this.state;

        // stop here if form is invalid
        if (!(name && image && url && startDate && endDate && payment && text && recommendations && (new Date(startDate) >= new Date(endDate)))) {
            return;
        }

        this.setState({loading: true});
        const file = this.imageFile.files[0];
        if (edit) {
            contestService.updateContest(this.props.match.params.id, name, file, url, startDate, endDate, payment, text, recommendations)
                .then(() => {
                    this.props.history.push({pathname: "/"});
                })
                .catch(err => {
                        this.setState({error: err.toString(), loading: false});
                    }
                )
        } else {
            contestService.addContest(name, file, url, startDate, endDate, payment, text, recommendations)
                .then(() => {
                    const {from} = this.props.location.state || {from: {pathname: "/"}};
                    this.props.history.push(from);
                })
                .catch(err => {
                        this.setState({error: err.toString(), loading: false});
                    }
                )
        }

    }

    handleChangeFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        const {name, value} = e.target;
        this.setState({[name]: value});
        reader.onload = (event) => {
            this.setState({imageSrc: event.target.result})
        };

        reader.readAsDataURL(file);
    }

    render() {
        const {name, image, url, startDate, endDate, payment, text, recommendations, submitted, loading, error, imageSrc} = this.state;
        return (
            <div className="col-md-8 offset-md-2">
                <h2>Add new contest</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text"
                               className={'form-control' + (submitted && !name ? ' is-invalid' : (submitted && name) ? ' is-valid' : '')}
                               name="name" value={name}
                               onChange={this.handleChange}/>
                        {submitted && !name &&
                        <div className="text-muted">Name is required</div>
                        }
                    </div>
                    {((this.props.location.state && this.props.location.state.image) || imageSrc) &&
                    <img
                        src={(this.imageFile && imageSrc) || `${process.env.REACT_APP_ROOT_URL}/images/${this.props.location.state.image}`}
                        alt={`Event: ${name}`} className="img-thumbnail"/>}
                    <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <input type="file"
                               className={'form-control' + (submitted && !image ? ' is-invalid' : (submitted && image) ? ' is-valid' : '')}
                               name="image" value={image}
                               ref={ref => this.imageFile = ref} accept="image/*"
                               onChange={this.handleChangeFile}/>
                        {submitted && !image &&
                        <div className="text-muted">Image is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="url">URL</label>
                        <input type="text"
                               className={'form-control' + (submitted && !url ? ' is-invalid' : (submitted && url) ? ' is-valid' : '')}
                               name="url" value={url}
                               onChange={this.handleChange}/>
                        {submitted && !url &&
                        <div className="text-muted">URL is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start date</label>
                        <input type="date"
                               className={'form-control' + (submitted && !startDate ? ' is-invalid' : (submitted && startDate) ? ' is-valid' : '')}
                               name="startDate" value={startDate}
                               onChange={this.handleChange}/>
                        {submitted && !startDate &&
                        <div className="text-muted">Start date is required</div>
                        }
                        {submitted && (new Date(endDate) < new Date(startDate)) &&
                        <div className="text-muted">End date can't be before start date</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End date</label>
                        <input type="date"
                               className={'form-control' + (submitted && !endDate ? ' is-invalid' : (submitted && endDate) ? ' is-valid' : '')}
                               name="endDate" value={endDate}
                               onChange={this.handleChange}/>
                        {submitted && !endDate &&
                        <div className="text-muted">End date is required</div>
                        }
                        {submitted && (new Date(endDate) < new Date(startDate)) &&
                        <div className="text-muted">End date can't be before start date</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="payment">Payment</label>
                        <input type="number"
                               className={'form-control' + (submitted && !payment ? ' is-invalid' : (submitted && payment) ? ' is-valid' : '')}
                               name="payment" value={payment}
                               onChange={this.handleChange}/>
                        {submitted && !payment &&
                        <div className="text-muted">Payment is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="text">Text</label>
                        <textarea
                            className={'form-control' + (submitted && !text ? ' is-invalid' : (submitted && text) ? ' is-valid' : '')}
                            name="text" rows="3" value={text}
                            onChange={this.handleChange}/>
                        {submitted && !text &&
                        <div className="text-muted">Text is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <label htmlFor="recommendations">Recommendations</label>
                        <textarea
                            className={'form-control' + (submitted && !recommendations ? ' is-invalid' : (submitted && recommendations) ? ' is-valid' : '')}
                            name="recommendations" rows="3" value={recommendations}
                            onChange={this.handleChange}/>
                        {submitted && !recommendations &&
                        <div className="text-muted">Recommendations required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" disabled={loading}>Save</button>
                        {loading &&
                        <img alt=""
                             src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                        }
                        <Link className="btn btn-danger" to='/'>Home</Link>
                    </div>

                    {error &&
                    <div className={'alert alert-danger'}>{error}</div>
                    }
                </form>
            </div>
        );
    }
}

export default AddContest;