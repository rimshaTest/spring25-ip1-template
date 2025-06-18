import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> =>
  // TODO: Task 2 - Implement the saveMessage function. Refer to other service files for guidance.
  {
    try {
      const res = await MessageModel.create(message);
      return res;
    } catch (error) {
      return { error: 'Error when saving a user' };
    }
  };

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  // Retrieves all messages sorted by date in ascending order
  try {
    const result = await MessageModel.find({}).exec();
    return result.sort(
      (a, b) => new Date(a.msgDateTime).getTime() - new Date(b.msgDateTime).getTime(),
    );
  } catch (err: unknown) {
    return [];
  }
};
