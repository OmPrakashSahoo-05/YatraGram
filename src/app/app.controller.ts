import { controller, Get, HttpResponseNotFound, IAppController, render } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';
import { Context } from 'mocha';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if ( !ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return render('./public/index.html');
  }
}
