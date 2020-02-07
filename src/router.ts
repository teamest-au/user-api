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

router.delete('/api/user/team-season', async ctx => {
  if (!ctx.userId) {
    throw new Error('Unexpected authentication error.');
  }
  await userService.deleteUserTeamSeason(ctx.userId, ctx.request.body);
});

router.put('/api/user/team-season', async ctx => {
  if (!ctx.userId) {
    throw new Error('Unexpected authentication error.');
  }
  await userService.addUserTeamSeason(ctx.userId, ctx.request.body);
});

export default router;
