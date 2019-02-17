import React, {Component} from 'react';

class ParticipantRecordForm extends Component {

    constructor(props){
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


        this.setState({loading: true});

        this.props.onSubmitForm(formData);
    }


    render() {
        const { firstName, lastName, email, observations, audioFile, submitted, loading, error } = this.state;
        return <div className="col-md-6 col-md-offset-3">
                    <h2>Sumbit voice participation</h2>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !firstName ? ' has-error' : '')}>
                            <label htmlFor="firstName">First name</label>
                            <input type="text" className="form-control" name="firstName" value={firstName}
                                onChange={this.handleChange}/>
                            {submitted && !firstName &&
                            <div className="help-block alert">First name is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !lastName ? ' has-error' : '')}>
                            <label htmlFor="lastName">Last name</label>
                            <input type="text" className="form-control" name="lastName" value={lastName}
                                onChange={this.handleChange}/>
                            {submitted && !lastName &&
                            <div className="help-block">Last name is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" name="email" value={email}
                                onChange={this.handleChange}/>
                            {submitted && !email &&
                            <div className="help-block">Email is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !audioFile ? ' has-error' : '')}>
                            <label htmlFor="audioFile">Audio file</label>
                            <input type="file" className="form-control" name="audioFile" ref={ ref => this.audioFile = ref}
                                onChange={this.handleChange} accept="audio/*"/>
                            {submitted && !audioFile &&
                            <div className="help-block">Audio file is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !observations ? ' has-error' : '')}>
                            <label htmlFor="observations">Observations</label>
                            <textarea rows="5" className="form-control" name="observations" value={observations}
                                onChange={this.handleChange}></textarea>
                            {submitted && !observations &&
                            <div className="help-block">Audio file is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" disabled={loading}>Sumbit voice</button>
                            {loading &&
                            <img
                                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                            }
                        </div>
                        {error &&
                        <div className={'alert alert-danger'}>{error}</div>
                        }
                    </form>
                </div>;
    }
}

export default ParticipantRecordForm;