import type { NextPage } from "next";
import { GetStaticProps, GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { SearchSoundGifInput } from "../components/SearchSoundGifInput/SearchSoundGifInput";
import { SoundGifsList } from "../components/SoundGifsList/SoundGifsList";
import { SoundgifDTO } from "../domain/sound-gif.dto";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ClockIcon, FireIcon } from "@heroicons/react/solid";
import React from "react";
import { useApi } from "../hooks/api/useApi.hook"
import { useRouter } from 'next/router'
import { SoundGifItem } from "../components/SoundGifsList/SoundGifItem/SoundGifItem";

type SoundGifProps = {
  soundGif: SoundgifDTO;
};

const SoundGif: NextPage<SoundGifProps> = ({ soundGif }) => {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { t } = useTranslation()

  return (
    <div className="bg-main">
      <Head>
        <title>Vozo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header/>
        <div className="flex flex-col items-center justify-space container mx-auto">
          <SoundGifItem
            soundGif={soundGif}
            play={true}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  
  const soundGifId = context.params?.id as string
  const { getOneSoundGif } = useApi()
  const soundGif = await getOneSoundGif(soundGifId)

 if(!soundGif){
   return {
     notFound: true
   }
 }
  return {
    props: {
      soundGif,
      ...(await serverSideTranslations(context.locale as string, ["common", "footer"])),
    }
  };
};


export async function getStaticPaths() {
  const { findMostSharedSoundGif } = useApi()
  const mostSharedSoundGifs = await findMostSharedSoundGif()
  return {
    paths: mostSharedSoundGifs.map(soundGif => {
      return {
        params : { id : soundGif.id }
      }
    }),
    fallback: true
  };
}

export default SoundGif;