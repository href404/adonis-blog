import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";
import UpdatePostValidator from "App/Validators/UpdatePostValidator";

export default class BlogController {
  async index({ view }: HttpContextContract) {
    const posts = await Post.all();
    return view.render("blog/index", { posts });
  }

  async detail(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    return ctx.view.render("blog/detail", { post });
  }

  async update(ctx: HttpContextContract) {
    const post = await Post.findOrFail(ctx.params.id);
    post.merge(await ctx.request.validate(UpdatePostValidator)).save();
    ctx.session.flash({ success: "L'article a bien été sauvegardé" });
    return ctx.response.redirect().toRoute("home");
  }
}
