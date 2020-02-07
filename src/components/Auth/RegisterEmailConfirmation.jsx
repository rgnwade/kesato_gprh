import { Component } from "react";

import auth from "../../services/authService";

class RegisterEmailConfirmation extends Component {
  state = {
    data: [],
    notification: []
  };

  async componentDidMount() {
    const user = await auth.getConfirmUser(this.props.match.params.token);
    const token = auth.signinAuto(user);
    console.log(auth.getAuthUser());
    if (user && token) {
      const userData = auth.getAuthUser();
      if (userData.role.role === 'student') window.location = "/auth/student/profile/2";
      else window.location = "/auth/user/profile/2";
    }
  }

  render() {
    return null;
  }
}

export default RegisterEmailConfirmation;
