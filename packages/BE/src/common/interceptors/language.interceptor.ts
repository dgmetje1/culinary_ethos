import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";

export const LANGUAGE_HEADER = "accept-language";

const SUPPORTED_LANGUAGES = ["en", "es", "fr", "ca"];

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const rawLanguage = request.headers[LANGUAGE_HEADER];
    const language = this.parseLanguage(rawLanguage);
    request.language = language;
    return next.handle();
  }

  private parseLanguage(header: string | undefined): string {
    if (!header) {
      return "en";
    }

    const firstLanguage = header.split(",")[0].trim();

    const isoCode = firstLanguage.split("-")[0].toLowerCase();

    return SUPPORTED_LANGUAGES.includes(isoCode) ? isoCode : "en";
  }
}
