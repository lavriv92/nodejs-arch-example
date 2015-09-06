
module.exports = function UserPresenter (user) {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar
  }
};
