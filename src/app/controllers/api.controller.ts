import { controller, ApiInfo, ApiServer, UseSessions } from '@foal/core';
import { User } from '../entities';
import { AuthController, ProfileController, StoriesController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})

@ApiServer({
  url: '/api'
})

@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
  userCookie: ctx => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.name }) : '',
})

export class ApiController {
  subControllers = [
    controller('/stories', StoriesController),
    controller('/auth', AuthController),
    controller('/profile', ProfileController)
  ];

}
