import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {userService} from "./utils/user-service";

class Register extends Component {
    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
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
        const {email, firstName, lastName, passwordConfirm, password} = this.state;

        // stop here if form is invalid
        if (!(email && password && firstName && lastName && passwordConfirm)) {
            return;
        }

        this.setState({loading: true});

        userService.register(email, password, firstName, lastName)
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
        const {firstName, lastName, email, password, passwordConfirm, submitted, loading, error} = this.state;
        return (
            <div className="col-md-6 offset-md-3">
                <h2>Register</h2>
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
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password}
                               onChange={this.handleChange}/>
                        {submitted && !password &&
                        <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !passwordConfirm ? ' has-error' : '')}>
                        <label htmlFor="passwordConfirm">Confirm password</label>
                        <input type="password" className="form-control" name="passwordConfirm" value={passwordConfirm}
                               onChange={this.handleChange}/>
                        {submitted && !passwordConfirm &&
                        <div className="help-block">Password confirmation is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary" disabled={loading}>Register</button>
                        {loading &&
                        <img alt=""
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                        }
                    </div>
                    <p>Already have an account? Click <Link to='/login'>here</Link></p>
                    {error &&
                    <div className={'alert alert-danger'}>{error}</div>
                    }
                </form>
            </div>
        );
    }
}

export default Register;