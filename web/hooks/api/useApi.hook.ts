import { create } from "apisauce";
import {
  CREATE_SOUND_GIF,
  FIND_MOST_RECENT_SOUND_GIF_QUERY,
  FIND_MOST_SHARED_SOUND_GIF_QUERY,
  FIND_SOUND_GIF_QUERY,
  GET_ONE_SOUND_GIF
} from "../../constants/constants";
import { SoundgifDTO } from "../../domain/sound-gif.dto";

export const useApi = (): {
  findSoundGif: (fulltext: string) => Promise<SoundgifDTO[]>;
  findMostRecentSoundGif: () => Promise<SoundgifDTO[]>;
  findMostSharedSoundGif: () => Promise<SoundgifDTO[]>;
  getOneSoundGif: (id: string) => Promise<SoundgifDTO|undefined>;
  createSoundGif: (payload: Omit<SoundgifDTO, "id">) => Promise<SoundgifDTO[]>;
} => {


  const api = create({
    baseURL: process.env.API_URL,
  });

  const createSoundGif = async (payload: Omit<SoundgifDTO, "id">): Promise<SoundgifDTO[]> => {
    const { data } = await api.post<SoundgifDTO[]>(CREATE_SOUND_GIF, payload);
    return data ?? [];
  };

  const findSoundGif = async (fulltext: string): Promise<SoundgifDTO[]> => {
    const { data } = await api.post<SoundgifDTO[]>(FIND_SOUND_GIF_QUERY, {
      fulltext,
    });
    return data ?? [];
  };

  const findMostRecentSoundGif = async (): Promise<SoundgifDTO[]> => {
    const { data } = await api.get<SoundgifDTO[]>(FIND_MOST_RECENT_SOUND_GIF_QUERY);
    return data ?? [];
  };

  const findMostSharedSoundGif = async (): Promise<SoundgifDTO[]> => {
    const { data } = await api.get<SoundgifDTO[]>(FIND_MOST_SHARED_SOUND_GIF_QUERY);
    return data ?? [];
  };

  const getOneSoundGif = async (id: string): Promise<SoundgifDTO|undefined> => {
    const { data, ok } = await api.get<SoundgifDTO>(`${GET_ONE_SOUND_GIF}/${id}`);
    if (ok) {
      return data ?? {} as SoundgifDTO
    }
    return 
  };

  return {
    createSoundGif,
    findSoundGif,
    findMostRecentSoundGif,
    findMostSharedSoundGif,
    getOneSoundGif,
  };
};
