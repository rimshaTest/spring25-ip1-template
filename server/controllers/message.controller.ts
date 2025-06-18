import express, { Response, Request } from 'express';
import { FakeSOSocket } from '../types/socket';
import { AddMessageRequest, Message } from '../types/types';
import { saveMessage, getMessages } from '../services/message.service';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided message request contains the required fields.
   *
   * @param req The request object containing the message data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddMessageRequest): boolean => {
  // TODO: Task 2 - Implement the isRequestValid function
    return (
      req.body &&
      req.body.messageToAdd &&
      typeof req.body.messageToAdd.msg === "string" && req.body.messageToAdd.msg.trim().length > 0 &&
      typeof req.body.messageToAdd.msgFrom === "string" && req.body.messageToAdd.msgFrom.trim().length > 0 &&
      (typeof req.body.messageToAdd.msgDateTime === "string" || req.body.messageToAdd.msgDateTime instanceof Date)
    );
  }

  /**
   * Validates the Message object to ensure it contains the required fields.
   *
   * @param message The message to validate.
   *
   * @returns `true` if the message is valid, otherwise `false`.
   */
  const isMessageValid = (message: Message): boolean => (typeof message.msg === "string");
  // TODO: Task 2 - Implement the isMessageValid function

  /**
   * Handles adding a new message. The message is first validated and then saved.
   * If the message is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddMessageRequest object containing the message and chat data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessageRoute = async (req: AddMessageRequest, res: Response): Promise<void> => {
    /**
     * TODO: Task 2 - Implement the addMessageRoute function.
     * Note: you will need to uncomment the line below. Refer to other controller files for guidance.
     * This emits a message update event to the client. When should you emit this event? You can find the socket event definition in the server/types/socket.d.ts file.
     */
    if (!isRequestValid(req)){
      res.status(400).send('Invalid request');
      return;
    }
    
    if(!isMessageValid(req.body.messageToAdd)) {
      res.status(400).send('Invalid message');
      return;
    }
    const message: Message = req.body.messageToAdd;
    try {
      const msgFromDb = await saveMessage(message);
      if ('error' in msgFromDb) {
        throw new Error(msgFromDb.error);
      }

      socket.emit('messageUpdate', { msg: msgFromDb });
      res.json(msgFromDb);
      return;
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving message: ${err.message}`);
        return;
      } else {
        res.status(500).send(`Error when saving message`);
        return;
      }
    }
  };

  /**
   * Fetch all messages in descending order of their date and time.
   * @param req The request object.
   * @param res The HTTP response object used to send back the messages.
   * @returns A Promise that resolves to void.
   */
  const getMessagesRoute = async (req: Request, res: Response): Promise<void> => {
    // TODO: Task 2 - Implement the getMessagesRoute function
    const message: Message = req.body.messageToAdd;
    try {
      const msgFromDb = await getMessages();
      res.status(200).send(msgFromDb);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving message: ${err.message}`);
        return;
      } else {
        res.status(500).send(`Error when saving message`);
        return;
      }
    }
  };

  // Add appropriate HTTP verbs and their endpoints to the router
  router.post('/addMessage', addMessageRoute);
  router.get('/getMessages', getMessagesRoute);

  return router;
};

export default messageController;
