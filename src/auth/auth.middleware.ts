import Koa from 'koa';
const { OAuth2Client } = require('google-auth-library');

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

import { UserAuthType } from '@vcalendars/models/web';
import ICustomContext from '../custom-context';
import userService from '../services/user.service';

export default async function AuthMiddleware(
  ctx: Koa.BaseContext & ICustomContext,
  next: () => Promise<any>,
) {
  const authType: UserAuthType = ctx.headers['x-auth-type'];
  let userId: string;
  switch (authType) {
    case 'google':
      const ticket = await googleAuthClient.verifyIdToken({
        idToken: ctx.headers['authorization'],
        audience: process.env.GOOGLE_AUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const authenticationId = payload['sub'];

      userId = await userService.ensureUserExists('google', authenticationId);

      break;
    default:
      throw new Error(`Unknown authentication type ${authType}`);
  }

  ctx.userId = userId;

  return next();
}
