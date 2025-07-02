import {
  ExecutionContext,
  UnprocessableEntityException,
  createParamDecorator,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { plainToClass, Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;

export interface ISearchOptions {
  term: string;
  searchFields: string[];
  order: 'ASC' | 'DESC';
  orderBy: string;
  filters: Record<string, any>[];
}

export interface IQueryParams extends IPaginationOptions, ISearchOptions {}

export const QueryParamOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IQueryParams => {
    const { protocol, headers, originalUrl, query } = ctx
      .switchToHttp()
      .getRequest();

    const pathAndParams: string = originalUrl
      .split('&')
      .filter((e: string) => !(e.includes('page') || e.includes('limit')))
      .join('&');
    const searchOptions = plainToClass(SearchDto, query);
    const page = query.page || DEFAULT_PAGE;
    const limit = query.limit || DEFAULT_LIMIT;

    if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
      throw new UnprocessableEntityException('Invalid pagination keys');
    }

    const route = `${protocol}://${headers.host}${
      pathAndParams || originalUrl
    }`;

    return { page, limit, route, ...searchOptions };
  },
);

const DEFAULT_ORDER = 'DESC';
const ORDERS = ['ASC', 'DESC'];
export class SearchDto implements ISearchOptions {
  @IsString()
  term = '';

  @IsArray()
  @Transform(({ value }) => value.split(','))
  searchFields: string[] = [];

  @IsString()
  orderBy = 'createdAt';

  @IsString()
  @Transform(({ value }) => {
    const result = value.toUpperCase();
    if (!ORDERS.includes(result)) return DEFAULT_ORDER;
    return result;
  })
  order: 'ASC' | 'DESC' = 'DESC';

  @IsArray()
  @Transform(
    ({ value }): Record<string, any> =>
      value.map((v: string): Record<string, any> => {
        const [key, ...values] = v.split(',');
        return { [key]: values };
      }),
  )
  filters: Record<string, any>[] = [];
}
