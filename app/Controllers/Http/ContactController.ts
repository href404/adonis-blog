import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ContactService } from "App/Services/ContactService";
import { inject } from "@adonisjs/fold";

@inject()
export default class ContactController {
  constructor(private service: ContactService) {}

  async index(ctx: HttpContextContract) {
    return ctx.view.render("contact");
  }

  async save(ctx: HttpContextContract) {
    this.service.send(ctx.request.all());
    ctx.session.flash({
      success: "Votre demande de contact a bien été envoyé",
    });
    return ctx.response.redirect().back();
  }
}
