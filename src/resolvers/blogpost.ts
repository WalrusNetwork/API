import BlogPost from "../models/blogpost";
import BlogPostContent from "../models/blogpostcontent";
import User from "../models/user";

export default {
  Query: {
    async blogPosts(parent, args, context, info) {
      if (!args.locale) {
        args.locale = "en";
      }

      if (args.slug) {
        const blogpost = [
          BlogPost.findOne({
            where: {
              slug: args.slug,
            },
            include: [
              {
                model: BlogPostContent,
                where: { locale: args.locale },
              },
            ],
          }),
        ];

        if (!blogpost) throw new Error("Blog Post not found");
        return blogpost;
      } else {
        if (!args.page) {
          args.page = 0;
        }

        if (args.per_page && args.per_page > 10) {
          args.per_page = 10; // eslint-disable-line
        }

        if (!args.per_page) {
          args.per_page = 5; // eslint-disable-line
        }

        const offset = args.page * args.per_page;
        const limit = args.per_page;

        const blogpost = await BlogPost.findAll({
          include: [
            {
              model: BlogPostContent,
              where: { locale: args.locale },
            },
          ],
          order: [["createdAt", "DESC"]],
          offset,
          limit,
        });

        if (!blogpost) throw new Error("Blog Post not found");
        return blogpost;
      }
    },
  },

  Mutation: {
    async createBlogPost(root, { input }) {
      const user = await User.findOne({ where: { username: input.username } });
      if (!user) throw new Error("User not found");
      input.uuid = user.uuid;

      const blogpost = await BlogPost.create(input, {
        include: [BlogPostContent],
      });

      blogpost.user = user;

      return blogpost;
    },

    async modifyBlogPost(root, { input }) {
      const blogpost = await BlogPost.findOne({ where: { slug: input.slug } });
      if (!blogpost) throw new Error("Blog Post not found");

      if (input.username) {
        const user = await User.findOne({
          where: { username: input.username },
        });

        if (!user) throw new Error("User not found");

        input.uuid = user!.uuid;
        input.user = user!;

        if (input.new_slug) {
          input.slug = input.new_slug;
        }
      }

      if (input.content) {
        for (const content of input.content) {
          const result = await BlogPostContent.findOne({
            where: { locale: content.locale, blogpostId: blogpost.id },
          });
          if (!result) {
            content.blogpostId = blogpost.id;
            BlogPostContent.create(content);
          } else {
            BlogPostContent.update(content, {
              where: { locale: content.locale, blogpostId: blogpost.id },
            });
          }
        }
      }

      return blogpost.update(input);
    },

    async deleteBlogPost(root, { slug }) {
      const blogpost = await BlogPost.findOne({ where: { slug } });

      if (!blogpost) throw new Error("Blog Post not found");

      blogpost.destroy();
      return "Blog Post successfully destroyed";
    },
  },
};
