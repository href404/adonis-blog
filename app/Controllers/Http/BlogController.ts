import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Category from "App/Models/Category";
import Post from "App/Models/Post";
import UpdatePostValidator from "App/Validators/UpdatePostValidator";
import { string } from "@ioc:Adonis/Core/Helpers";
import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import Drive from "@ioc:Adonis/Core/Drive";

export default class BlogController {
  async index(ctx: HttpContextContract) {
    const page = ctx.request.input("page", 1);
    const posts = await Database.from(Post.table).paginate(page, 2);
    return ctx.view.render("blog/index", { posts });
  }

  async detail(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    await ctx.bouncer.authorize("editPost", post);
    const categories = await Category.all();
    return ctx.view.render("blog/detail", { post, categories });
  }

  async create({ view }: HttpContextContract) {
    const post = new Post();
    const categories = await Category.all();
    return view.render("blog/create", { post, categories });
  }

  async save(ctx: HttpContextContract) {
    await this.validate(ctx, new Post());
    ctx.session.flash({ success: "L'article a bien été créé" });
    return ctx.response.redirect().toRoute("home");
  }

  async update(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    await ctx.bouncer.authorize("editPost", post);
    await this.validate(ctx, post);
    ctx.session.flash({ success: "L'article a bien été sauvegardé" });
    return ctx.response.redirect().toRoute("home");
  }

  async delete(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    await post.delete();
    ctx.session.flash({ success: "L'article a bien été supprimé" });
    return ctx.response.redirect().toRoute("home");
  }

  private async validate(ctx: HttpContextContract, post: Post) {
    const data = await ctx.request.validate(UpdatePostValidator);
    const thumbnail = ctx.request.file("thumbnailFile");
    if (thumbnail) post.thumbnail = await this.saveImage(thumbnail, post);
    post
      .merge({
        title: data.title,
        categoryId: data.categoryId,
        content: data.content,
        online: data.online || false,
      })
      .save();
  }

  private async saveImage(thumbnail: MultipartFileContract, post: Post) {
    if (post.thumbnail) await Drive.delete(post.thumbnail);
    const diskName = string.generateRandom(32) + "." + thumbnail.extname;
    await thumbnail.moveToDisk("./", { name: diskName });
    return diskName;
  }
}
