
module.exports = function UserPresenter (user) {
  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    address: user.address
  };
};
