import Router from '@koa/router';

import userService from './services/user.service';
import authMiddleware from './auth/auth.middleware';
import ICustomContext from './custom-context';

const router = new Router<ICustomContext, ICustomContext>();
router.use(authMiddleware);

router.get('/api/user/team-season', async ctx => {
  if (!ctx.userId) {
    throw new Error('Unexpected authentication error.');
  }
  const result = await userService.getUserTeamSeasons(ctx.userId);
  ctx.response.status = 200;
  ctx.response.body = result;
});

export default router;
