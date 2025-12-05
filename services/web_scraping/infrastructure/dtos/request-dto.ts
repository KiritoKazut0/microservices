import { IsString, IsUrl, Matches } from "class-validator";

export class RequestDto {
  @IsString()
  @IsUrl()
  @Matches(/^https:\/\/www\.gob\.mx\/presidencia\/.*$/, {
    message: 'La URL debe pertenecer a la sección de presidencia (https://www.gob.mx/presidencia/)',
  })
  url: string;
}
