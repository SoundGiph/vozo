import {useTranslation} from 'next-i18next';
import {SearchCircleIcon} from '@heroicons/react/solid';
import { SoundgifDTO } from '../../domain/sound-gif.dto';
import { useApi } from '../../hooks/api/useApi.hook';

interface ISearchSoundGifInputProps {
  updateSearchResultCallback : (soundGifs: SoundgifDTO[]) => void
}

export const SearchSoundGifInput : React.FC<ISearchSoundGifInputProps> = ({updateSearchResultCallback}) => {
  const {t} = useTranslation();
  const { findSoundGif } = useApi()

   const onChangeCallback = async (text : string ) => {
    const searchResult = await findSoundGif(text)

    if (searchResult.length > 0){
      updateSearchResultCallback(searchResult)
    }
    else {
      updateSearchResultCallback([])
    }
  }

  return (
    <div className="form-control w-full">
      <div className="relative w-11/12 items-center self-center max-w-screen-lg">
        <input
          type="text"
          placeholder={t('search')}
          className="w-full pr-16 h-16 input input-primary input-bordered max-w bg-neutral text-xl"
          onChange={event => onChangeCallback(event.target.value)}
        />
        <button className="absolute h-16 top-0 right-0 rounded-l-none btn btn-primary">
          <SearchCircleIcon className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};
