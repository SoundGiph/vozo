import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindManyOptions, ILike } from 'typeorm';
import { SoundGifEntity } from '../../../domain/sound-gif.entity';
import { SoundGifPort } from '../../ports/sound-gif.ports';
import {
  FindMostSharedSoundGifQueryResult,
  FindSoundGifQuery,
} from './find-sound-gif.query';

@QueryHandler(FindSoundGifQuery)
export class FindSoundGifQueryHandler
  implements IQueryHandler<FindSoundGifQuery>
{
  constructor(
    @Inject(SoundGifEntity)
    private readonly findSoundGifPort: Pick<SoundGifPort, 'find'>,
  ) {}

  public async execute({
    payload,
  }: FindSoundGifQuery): Promise<FindMostSharedSoundGifQueryResult> {
    const { fulltext } = payload;
    const whereOptions: FindManyOptions = Boolean(fulltext)
      ? {
          where: [
            { description: ILike(`%${fulltext}%`) },
            { personalityName: ILike(`%${fulltext}%`) },
            { audioTitle: ILike(`%${fulltext}%`) },
          ],
        }
      : {};
    const soundGifs = await this.findSoundGifPort.find(whereOptions);
    return new FindMostSharedSoundGifQueryResult(soundGifs);
  }
}
