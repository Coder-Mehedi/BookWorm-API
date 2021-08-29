import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  name: string;

  @Field()
  author: string;

  @Field()
  category: string;

  @Field()
  publishedYear: string;
}
