import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { SoundGifPort } from '../core/application/ports/sound-gif.ports';
import {
  SoundGifEntity,
  SoundGifEntityMandatoryFields,
} from '../core/domain/sound-gif.entity';

export class SoundGifAdapter implements SoundGifPort {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(SoundGifEntity)
    private readonly soundGifRepository: Repository<SoundGifEntity>,
  ) {}

  public async find(whereOptions: FindManyOptions): Promise<SoundGifEntity[]> {
    this.logger.log(
      `SoundGifAdapter > find > called with whereOptions: ${whereOptions}`,
    );
    return await this.soundGifRepository.find(whereOptions);
  }

  public async findMostRecent(): Promise<SoundGifEntity[]> {
    this.logger.log('SoundGifAdapter > findMostRecent > start');
    return await this.soundGifRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async findOne(whereOptions: FindOneOptions): Promise<SoundGifEntity> {
    this.logger.log('SoundGifAdapter > findOne > start');
    return await this.soundGifRepository.findOne(whereOptions);
  }

  public async findMostShared(): Promise<SoundGifEntity[]> {
    this.logger.log('SoundGifAdapter > findMostShared > start');
    return await this.soundGifRepository.find({
      order: {
        sharedCount: 'DESC',
      },
    });
  }

  public async create(
    payload: Partial<SoundGifEntity> & SoundGifEntityMandatoryFields,
  ): Promise<SoundGifEntity> {
    this.logger.log(`SoundGifAdapter > create > called with ${payload}`);
    return await this.soundGifRepository.create(payload).save();
  }
}
