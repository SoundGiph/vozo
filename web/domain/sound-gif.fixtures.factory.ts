import * as faker from "faker";
import * as uuid from "uuid";
import { SoundgifDTO } from "./sound-gif.dto";

export const soundGifFixtureFactory = (
  partialSoundGif: Partial<SoundgifDTO>
): SoundgifDTO => {
  return Object.assign({
    id: uuid.v4(),
    tags: [faker.random.word(), faker.random.word()],
    description: faker.company.catchPhrase(),
    title: faker.name.title(),
    audioUrl: `https://soundgiph.blob.core.windows.net/sounds/AlkpotePute.mp3`,
    imageUrl: faker.image.imageUrl(),
    ...partialSoundGif,
  }) as SoundgifDTO;
};
