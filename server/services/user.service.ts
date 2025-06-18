import UserModel from '../models/users.model';
import { User, UserCredentials, UserResponse } from '../types/types';

/**
 * Saves a new user to the database.
 *
 * @param {User} user - The user object to be saved, containing user details like username, password, etc.
 * @returns {Promise<UserResponse>} - Resolves with the saved user object (without the password) or an error message.
 */
export const saveUser = async (user: User): Promise<UserResponse> => {
  // TODO: Task 1 - Implement the saveUser function. Refer to other service files for guidance.
  try {
    const res = await UserModel.create(user);
    const plainUser = res.toObject();
    const { password: _pw, ...safeUser } = plainUser;
    return safeUser;
  } catch (error) {
    return { error: 'Error when saving a user' };
  }
}

/**
 * Retrieves a user from the database by their username.
 *
 * @param {string} username - The username of the user to find.
 * @returns {Promise<UserResponse>} - Resolves with the found user object (without the password) or an error message.
 */
export const getUserByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
      return { error: 'User not found' };
    }
    const { password, ...safeUser } = user;
    return safeUser;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: `Error when fetching user by username: ${err.message}` };
    } else {
      return { error: 'Error when fetching user by username' };
    }
  }
}

/**
 * Authenticates a user by verifying their username and password.
 *
 * @param {UserCredentials} loginCredentials - An object containing the username and password.
 * @returns {Promise<UserResponse>} - Resolves with the authenticated user object (without the password) or an error message.
 */
export const loginUser = async (loginCredentials: UserCredentials): Promise<UserResponse> =>
  // TODO: Task 1 - Implement the loginUser function. Refer to other service files for guidance.
  {
    try{
      const {username, password} = loginCredentials;
      const user = await UserModel.findOne({ username}).lean();

      if (!user) {
        return { error: 'User not found' };
      }

      if (user.password && user.password !== password) {
        return { error: 'Password does not match' };
      }

      if (user.password) {
        const { password: _pw, ...safeUser } = user;
        return safeUser;
      }
      return user;
    } catch (error) {
      return { error: 'Error during authentication' };
    }
  }

/**
 * Deletes a user from the database by their username.
 *
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<UserResponse>} - Resolves with the deleted user object (without the password) or an error message.
 */
export const deleteUserByUsername = async (username: string): Promise<UserResponse> =>{
  // TODO: Task 1 - Implement the deleteUserByUsername function. Refer to other service files for guidance.
  try {
    const deletedUser = await UserModel.findOneAndDelete({ username }).lean();
    
    if (!deletedUser) {
      return { error: 'User not found' };
    }

    if (deletedUser.password) {
      const { password, ...safeUser } = deletedUser;
      return safeUser;
    }
    
    return deletedUser;
  } catch (error) {
    return { error: 'Error when deleting user' };
  }
}


/**
 * Updates user information in the database.
 *
 * @param {string} username - The username of the user to update.
 * @param {Partial<User>} updates - An object containing the fields to update and their new values.
 * @returns {Promise<UserResponse>} - Resolves with the updated user object (without the password) or an error message.
 */
export const updateUser = async (username: string, updates: Partial<User>): Promise<UserResponse> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      updates,
      { new: true}
    ).lean();
    if (!updatedUser) {
      return { error: 'User not found' };
    }
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  } catch (error) {
    return { error: 'Error when updating user' };
  }
}
