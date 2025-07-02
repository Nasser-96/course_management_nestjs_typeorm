import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  NotImplementedException,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class BindEntityPipe implements PipeTransform {
  constructor(protected readonly connection: Connection) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const { data: key, metatype } = metadata;

      const entityRepo = this.connection.getRepository(
        (metatype as Type<any>)?.name,
      );

      if (!entityRepo) {
        throw new NotImplementedException(
          'No repository found for the given entity type',
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entity = await entityRepo.findOneOrFail({ [key as string]: value });

      return entity;
    } catch {
      throw new NotFoundException();
    }
  }
}
