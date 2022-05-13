import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import { SoundGifsList } from "../components/SoundGifsList/SoundGifsList";
import { SoundGifsVerticalList } from "../components/SoundGifsList/SoundGifsVerticalList/SoundGifsVerticalList";
import {
  Categories,
  getIconColorByCategory,
  getIconNameByCategory,
} from "../components/SoundGifsList/utils/getCategoriesIconAndColor";
import { Stages } from "../constants/constants";
import { useVozoApp } from "../context/useVozoApp.hook";
import { CategoriesWithSoundGifs, useApi } from "../hooks/api/useApi.hook";
import { useUnmute } from "../hooks/unmute/useUnmute";

type HomeProps = {
  categoriesWithSoundgifs: CategoriesWithSoundGifs[];
};

interface MapCategoriesWithSoundGifsProps {
  categoriesWithSoundgifs: CategoriesWithSoundGifs[];
}

const MapCategoriesWithSoundGifs: React.FC<MapCategoriesWithSoundGifsProps> = ({ categoriesWithSoundgifs }) => {
  return (
    <div className="flex flex-col items-center justify-space container mx-auto">
      {categoriesWithSoundgifs.map(category => {
        return (
          <SoundGifsList
            soundGifs={category.soundGifs}
            title={category.name}
            icon={getIconNameByCategory(category.name)}
            color={getIconColorByCategory(category.name)}
          />
        );
      })}
    </div>
  );
};

const Home: NextPage<HomeProps> = ({ categoriesWithSoundgifs }) => {
  const { t } = useTranslation();
  const { soundGifs, isLoading, isSearchResultEmpty } = useVozoApp();
  const shouldDisplaySearchResult = Boolean(soundGifs.length && !isLoading);
  useUnmute();
  return (
    <div className="bg-black">
      <Head>
        <title>Vozo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main className="relative overflow-hidden">
          <div className="flex flex-col items-center justify-space container mx-auto">
            {shouldDisplaySearchResult ? (
              <SoundGifsVerticalList
                soundGifs={soundGifs}
                title={Categories.Search}
                icon={getIconNameByCategory(Categories.Search)}
                color={getIconColorByCategory(Categories.Search)}
                isSearchResultLoading={isLoading}
                isSearchResultEmpty={isSearchResultEmpty}
              />
            ) : (
              <MapCategoriesWithSoundGifs categoriesWithSoundgifs={categoriesWithSoundgifs} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale?: string | undefined }) {
  const { getAllCategoriesWithSoungifs } = useApi(Stages.BUILD);
  const categoriesWithSoundgifs = await getAllCategoriesWithSoungifs();
  return {
    props: {
      categoriesWithSoundgifs,
      ...(await serverSideTranslations(locale as string, ["common", "footer"])),
    },
  };
}

export default Home;
