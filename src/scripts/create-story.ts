import { Story, User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255},
    title: { type: 'string', maxLength: 255},
    link: { type: 'string', maxLength: 255},
  },
  required: [ 'author', 'title', 'link' ],
  type: 'object',
};

export async function main(args: { author: string, title: string, link: string }) {
  await  dataSource.initialize();

  const user = await User.findOneByOrFail({ email: args.author });

  const story = new Story();
  story.author = user;
  story.title = args.title;
  story.link = args.link;

  try{
    console.log(await story.save());
  } catch (error: any) {
    console.error(error);
  } finally {
    await dataSource.destroy();
  }
}
