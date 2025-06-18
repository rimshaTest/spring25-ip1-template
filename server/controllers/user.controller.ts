import express, { Response, Router } from 'express';
import {
  UserRequest,
  User,
  UserCredentials,
  UserByUsernameRequest,
  UserResponse,
} from '../types/types';
import {
  deleteUserByUsername,
  getUserByUsername,
  loginUser,
  saveUser,
  updateUser,
} from '../services/user.service';

const userController = () => {
  const router: Router = express.Router();

  /**
   * Validates that the request body contains all required fields for a user.
   * @param req The incoming request containing user data.
   * @returns `true` if the body contains valid user fields; otherwise, `false`.
   */
  const isUserBodyValid = (req: UserRequest): boolean =>
    // TODO: Task 1 - Implement the isUserBodyValid function
    !!req.body.username &&
    typeof req.body.username === 'string' &&
    !!req.body.password &&
    typeof req.body.password === 'string';

  /**
   * Handles the creation of a new user account.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the created user or an error.
   * @returns A promise resolving to void.
   */
  const createUser = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the createUser function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const user: User = {
      username: req.body.username,
      password: req.body.password,
      dateJoined: new Date(),
    };
    try {
      const responsefromdb = await saveUser(user);

      if ('error' in responsefromdb) {
        res.status(500).json({ error: responsefromdb.error });
        return;
      }

      res.status(200).json({
        _id: responsefromdb._id?.toString(),
        username: responsefromdb.username,
        dateJoined: responsefromdb.dateJoined.toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: `Error when saving user: ${err.message}` });
      } else {
        res.status(500).json({ error: 'Error when saving user' });
      }
    }
  };

  /**
   * Handles user login by validating credentials.
   * @param req The request containing username and password in the body.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const userLogin = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the userLogin function
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    const user: UserCredentials = req.body;
    try {
      const responsefromdb = await loginUser(user);
      if ('error' in responsefromdb) {
        throw new Error(responsefromdb.error);
      }
      res.status(200).json(responsefromdb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  /**
   * Retrieves a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either returning the user or an error.
   * @returns A promise resolving to void.
   */
  const getUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the getUser function
    const { username } = req.params;
    if (typeof username !== 'string') {
      res.status(400).send('Username must be provided as a string');
      return;
    }
    try {
      const user: UserResponse = await getUserByUsername(username);
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      res.status(200).json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error retrieving user: ${err.message}`);
      } else {
        res.status(500).send('Error retrieving user');
      }
    }
  };

  /**
   * Deletes a user by their username.
   * @param req The request containing the username as a route parameter.
   * @param res The response, either the successfully deleted user object or returning an error.
   * @returns A promise resolving to void.
   */
  const deleteUser = async (req: UserByUsernameRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the deleteUser function
    const { username } = req.params;
    if (typeof username !== 'string') {
      res.status(400).send('Username must be provided as a string');
      return;
    }
    try {
      const user: UserResponse = await deleteUserByUsername(username);
      res.status(200).json(user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error retrieving user: ${err.message}`);
      } else {
        res.status(500).send('Error retrieving user');
      }
    }
  };

  /**
   * Resets a user's password.
   * @param req The request containing the username and new password in the body.
   * @param res The response, either the successfully updated user object or returning an error.
   * @returns A promise resolving to void.
   */
  const resetPassword = async (req: UserRequest, res: Response): Promise<void> => {
    // TODO: Task 1 - Implement the resetPassword function
    const { username, password } = req.body;
    if (!isUserBodyValid(req)) {
      res.status(400).send('Invalid user body');
      return;
    }
    try {
      const responsefromdb = await updateUser(username, { password });
      if ('error' in responsefromdb) {
        res.status(404).json({ error: responsefromdb.error });
        return;
      }

      const formattedResponse = {
        _id: responsefromdb._id?.toString(),
        username: responsefromdb.username,
        dateJoined:
          responsefromdb.dateJoined instanceof Date
            ? responsefromdb.dateJoined.toISOString()
            : responsefromdb.dateJoined,
      };
      res.status(200).json(formattedResponse);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  // Define routes for the user-related operations.
  // TODO: Task 1 - Add appropriate HTTP verbs and endpoints to the router
  router.post('/signup', createUser);
  router.post('/login', userLogin);
  router.get('/getUser/:username', getUser);
  router.delete('/deleteUser/:username', deleteUser);
  router.patch('/resetPassword', resetPassword);

  return router;
};

export default userController;
