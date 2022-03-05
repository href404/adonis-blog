import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "App/Models/Post";

export default class BlogController {
  async index({ view }: HttpContextContract) {
    const posts = await Post.all();
    return view.render("blog/index", { posts });
  }
}
