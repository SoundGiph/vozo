import { SoundGifEntity, SoundGifEntityMandatoryFields } from "../../domain/sound-gif.entity";
import { FindSoundGifPayload } from "../queries/find-sound-gif/find-sound-gif.query";
import { IncrementSharedCountPayload } from "../commands/increment-shared-count/increment-shared-count.command";
export abstract class SoundGifPort {
  abstract find(payload: FindSoundGifPayload): Promise<SoundGifEntity[]>;
  abstract getAllCategories(): Promise<string[]>;
  abstract create(
    payload: Partial<SoundGifEntity> & SoundGifEntityMandatoryFields
  ): Promise<SoundGifEntity>;
  abstract incrementSharedCount(payload: IncrementSharedCountPayload): Promise<void>
}
