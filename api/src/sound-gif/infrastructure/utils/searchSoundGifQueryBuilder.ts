import { Repository } from "typeorm";
import { SearchFilter } from "../../core/application/queries/find-sound-gif/find-sound-gif.query";
import { SoundGifEntity } from "../../core/domain/sound-gif.entity";

export const searchSoundGifQuery = async (
  soundGifRepository: Repository<SoundGifEntity>,
  filters?: SearchFilter,
  fulltext?: string
): Promise<SoundGifEntity[]> => {
  const soundGifsQuery = soundGifRepository.createQueryBuilder("vozo");

  if (filters?.category) {
    soundGifsQuery.where(":category = ANY (vozo.categories)", {
      category: `${filters.category}`,
    });
  }

  if (filters?.reaction) {
    soundGifsQuery.where("vozo.reactions ILIKE :reaction", {
      reaction: `%${filters.reaction}%`,
    });
  }

  if (fulltext) {
    soundGifsQuery.andWhere(
      "vozo.description ILIKE :text OR vozo.title ILIKE :text OR vozo.tags ILIKE :text",
      {
        text: `%${fulltext}%`,
      }
    );
  }

  if (filters?.mostRecent) {
    soundGifsQuery.orderBy("vozo.created_at", "DESC");
  }

  if (filters?.mostShared) {
    soundGifsQuery.orderBy("vozo.shared_count", "DESC");
  }

  soundGifsQuery
    .leftJoin("vozo.user", "u")
    .addSelect(["u.id", "u.lastname", "u.firstname", "u.picture"]);

  return soundGifsQuery.limit(filters.limit).getMany();
};
