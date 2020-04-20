import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import BlogPost from "./blogpost";

@Table
export default class BlogPostContent extends Model<BlogPostContent> {
  @Column
  locale!: string;

  @Column
  title!: string;

  @Column(DataType.TEXT)
  content!: string;

  @ForeignKey(() => BlogPost)
  @Column
  blogpostId!: number;

  @BelongsTo(() => BlogPost)
  blogpost!: BlogPost;
}
