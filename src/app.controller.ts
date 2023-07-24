import { Controller, Get } from "@nestjs/common";


@Controller()
export class AppController {

  @Get()
  public getHealth() {
    const object = {
      date: new Date().toLocaleString('es-co'),
      status: 'OK'
    }

    return object;
  }
}