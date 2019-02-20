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
            passwordRequiredLength: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleChangePassword(e) {
        const {name, value} = e.target;
        this.setState({[name]: value, passwordRequiredLength: e.target.value.length > 5});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});
        const {email, firstName, lastName, passwordConfirm, password} = this.state;
        console.log(password.length);
        const passwordRequiredLength = password.length > 5;
        this.setState({passwordRequiredLength});
        // stop here if form is invalid
        if (!(email && password && firstName && lastName && passwordConfirm && passwordRequiredLength && (password === passwordConfirm))) {
            return;
        }

        this.setState({loading: true});

        userService.register(email, password, firstName, lastName)
            .then(() => {
                const {from} = this.props.location.state || {from: {pathname: "/"}};
                this.props.history.push(from);
            })
            .catch(() =>
                this.setState({error: "User with given email already exists.", loading: false})
            )

    }

    render() {
        const {firstName, lastName, email, password, passwordConfirm, submitted, loading, error, passwordRequiredLength} = this.state;
        return (
            <div className="col-md-6 offset-md-3">
                <h2>Register</h2>
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
                        <label htmlFor="password">Password</label>
                        <input type="password"
                               className={'form-control' + (submitted && (!password || !passwordRequiredLength) ? ' is-invalid' : (submitted && password && passwordRequiredLength) ? ' is-valid' : '')}
                               name="password" value={password}
                               onChange={this.handleChangePassword}/>
                        {submitted && !password &&
                        <div className="text-muted">Password is required</div>
                        }
                        {submitted && password && !passwordRequiredLength &&
                        <div className="text-muted">Password must be 6 or more characters long</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="passwordConfirm">Confirm password</label>
                        <input type="password"
                               className={'form-control' + (submitted && (!passwordConfirm || !passwordRequiredLength || !(password === passwordConfirm)) ? ' is-invalid' : (submitted && passwordConfirm && (password === passwordConfirm) && passwordRequiredLength) ? ' is-valid' : '')}
                               name="passwordConfirm" value={passwordConfirm}
                               onChange={this.handleChangePassword}/>
                        {submitted && !passwordConfirm &&
                        <div className="text-muted">Password confirmation is required</div>
                        }
                        {submitted && passwordConfirm && password && !(password === passwordConfirm) &&
                        <div className="text-muted">Password do not match</div>
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