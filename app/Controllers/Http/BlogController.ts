import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BlogController {
  async index({ view }: HttpContextContract) {
    return view.render("blog/index");
  }
}
