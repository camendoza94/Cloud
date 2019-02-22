import React, {Component} from 'react';

class ParticipantRecordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            observations: '',
            audioFile: '',
            submitted: false,
            loading: false,
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {firstName, lastName, email, observations} = this.state;
        // stop here if form is invalid
        if (!(firstName && lastName && email && observations && this.audioFile.files)) {
            return;
        }
        const file = this.audioFile.files[0];
        const formData = new FormData();
        formData.append('originalFile', file);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('observations', observations);

        this.setState({loading: true});

        this.props.onSubmitForm(formData);
    }

    componentDidUpdate(prevProps) {
        if (this.props.error !== prevProps.error) {
            if (this.props.error) {
                this.setState({loading: false});
            }
        }
    }


    render() {
        const {firstName, lastName, email, audioFile, submitted, loading, error, observations} = this.state;
        return <div className="col-md-6">
            <form name="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input type="text"
                           className={'form-control' + (submitted && !firstName ? ' is-invalid' : (submitted && firstName) ? ' is-valid' : '')}
                           name="firstName" value={firstName}
                           onChange={this.handleChange}/>
                    {submitted && !firstName &&
                    <div className="text-muted">First name is required</div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input type="text"
                           className={'form-control' + (submitted && !lastName ? ' is-invalid' : (submitted && lastName) ? ' is-valid' : '')}
                           name="lastName" value={lastName}
                           onChange={this.handleChange}/>
                    {submitted && !lastName &&
                    <div className="text-muted">Last name is required</div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email"
                           className={'form-control' + (submitted && !email ? ' is-invalid' : (submitted && email) ? ' is-valid' : '')}
                           name="email" value={email}
                           onChange={this.handleChange}/>
                    {submitted && !email &&
                    <div className="text-muted">Email is required</div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="audioFile">Audio file</label>
                    <input type="file"
                           className={'form-control' + (submitted && !audioFile ? ' is-invalid' : (submitted && audioFile) ? ' is-valid' : '')}
                           name="audioFile" ref={ref => this.audioFile = ref}
                           onChange={this.handleChange} accept="audio/*"/>
                    {submitted && !audioFile &&
                    <div className="text-muted">Audio file is required</div>
                    }
                </div>
                <div className="form-group">
                    <label htmlFor="observations">Observations</label>
                    <textarea
                        className={'form-control' + (submitted && !observations ? ' is-invalid' : (submitted && observations) ? ' is-valid' : '')}
                        name="observations" value={observations}
                        onChange={this.handleChange}/>
                    {submitted && !observations &&
                    <div className="text-muted">Observations are required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" disabled={loading}>Submit voice</button>
                    {loading &&
                    <img
                        alt=""
                        src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                    }
                </div>
                {(error || this.props.error) &&
                <div className={'alert alert-danger'}>{error || this.props.error}</div>
                }
            </form>
        </div>;
    }
}

export default ParticipantRecordForm;