import userController from '../controllers/userController.js';

export default function decideLoginMethod(req, res, next) {
    if (req.query.fromGithub) {
      return userController.githubCallback(req, res, next);
    } else {
      return userController.login(req, res, next);
    }
  }