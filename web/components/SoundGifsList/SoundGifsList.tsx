import { ReactNode } from "react";
import { SoundgifDTO } from "../../domain/sound-gif.dto";
import { SoundGifItem } from "./SoundGifItem/SoundGifItem";

type SoundGifsListProps = {
  soundGifs: SoundgifDTO[];
  title: string;
  icon: ReactNode;
};

export const SoundGifsList: React.FC<SoundGifsListProps> = ({ soundGifs, title, icon }) => {
  if (!soundGifs) return null;

  return (
    <div className="w-full h-full px-4 py-10 bg-cover card bg-base">
      <div className="flex flex-row justify-space">
        {icon}
        <p className="card-title ml-5">{title}</p>
      </div>
      <div className="flex flex-row overflow-x-scroll justify-start">
        {soundGifs.map(soundGif => {
          return <SoundGifItem soundGif={soundGif} play={true}/>;
        })}
      </div>
    </div>
  );
};
