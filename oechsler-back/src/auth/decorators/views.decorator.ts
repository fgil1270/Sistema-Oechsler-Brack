import { SetMetadata } from "@nestjs/common";

export const VIEWS_KEY = 'views';

export const Views = (...views: string[]) => SetMetadata(VIEWS_KEY, views);