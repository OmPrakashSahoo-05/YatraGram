import { Context, Get, File, HttpResponseNoContent, Post, UserRequired, ValidateQueryParam, dependency } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { User } from '../../entities';

export class ProfileController {
  @dependency
  disk: Disk;

  @Get('/avatar')
  @ValidateQueryParam('userId', { type: 'number' }, { required: false })
  async readProfileImage(ctx: Context<User|null>) {
    let user = ctx.user;

    const userId: number|undefined =  ctx.request.query.userId;
    if( userId !== undefined ) {
      user = await User.findOneBy({ id: userId })
    }

    if(!user || !user.avatar ) {
      return this.disk.createHttpResponse('images/profiles/default.png')
    }

    return this.disk.createHttpResponse(user.avatar);
  }

  @Post()
  @UserRequired()
  @ParseAndValidateFiles(
    {
      avatar: { required: false, saveTo: 'images/profiles/uploaded' }
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 255 }
      },
      required: ['name']
    }
  )
  async updateProfileImage(ctx: Context<User>) {
    ctx.user.name = ctx.request.body.name;

    const file: File|undefined = ctx.files.get('avatar')[0];
    if(file) {
      if(ctx.user.avatar) {
        await this.disk.delete(ctx.user.avatar);
      }
      ctx.user.avatar = file.path;
    }
    await ctx.user.save();

    return new HttpResponseNoContent();
  }

}
