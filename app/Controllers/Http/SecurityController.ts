import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SecurityController {
  async index(ctx: HttpContextContract) {
    return ctx.view.render("auth/login");
  }

  async save(ctx: HttpContextContract) {
    const email = ctx.request.input("email");
    const password = ctx.request.input("password");

    try {
      await ctx.auth.use("web").attempt(email, password);
      ctx.response.redirect().toRoute("home");
    } catch (error) {
      ctx.session.flash({ error: "Identifiants incorrect" });
      ctx.response.redirect().toRoute("login");
    }
  }
}
