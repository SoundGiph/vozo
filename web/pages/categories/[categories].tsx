import axios from "axios";
import { locale } from "faker";
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SoundGifsVerticalList } from "../../components/SoundGifsList/SoundGifsVerticalList/SoundGifsVerticalList";
import {
  Categories,
  getIconColorByCategory,
  getIconNameByCategory,
} from "../../components/SoundGifsList/utils/getCategoriesIconAndColor";
import { useVozoApp } from "../../context/useVozoApp.hook";
import { useApi } from "../../hooks/api/useApi.hook";
import { useUnmute } from "../../hooks/unmute/useUnmute";

const Category: NextPage = () => {
  const { soundGifs, isLoading, isSearchResultEmpty, setSearchFilters } = useVozoApp();
  const { t } = useTranslation();
  const { query } = useRouter();
  const category = query.categories as Categories;
  const isMostRecentCategory = Boolean(category === Categories.mostRecent);
  const isMostSharedCategory = Boolean(category === Categories.mostShared);
  useUnmute();
  useEffect(() => {
    if (isMostRecentCategory) return setSearchFilters({ mostRecent: true });
    if (isMostSharedCategory) return setSearchFilters({ mostShared: true });
    setSearchFilters({ category });
    return () => {
      setSearchFilters({});
    };
  }, [category]);
  return (
    <div className="bg-black overflow-hidden">
      <Head>
        <title>Vozo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative overflow-hidden">
        <div>
          <SoundGifsVerticalList
            soundGifs={soundGifs}
            title={t(`categories.${category}`)}
            icon={getIconNameByCategory(category)}
            color={getIconColorByCategory(category)}
            isSearchResultLoading={isLoading}
            isSearchResultEmpty={isSearchResultEmpty}
          />
        </div>
      </main>
    </div>
  );
};

interface getStaticPathsParams {
  params: { categories: Categories; locale: string | undefined };
}

export const getStaticPaths: GetStaticPaths = ({ locales }: { locales?: string[] | undefined }) => {
  const categories = Object.values(Categories);
  const paths: getStaticPathsParams[] = [];
  categories.forEach(category => {
    locales?.forEach((locale: string) => {
      paths.push({ params: { categories: category, locale } });
    });
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }: { locale?: string | undefined }) => {
  const { findSoundGif } = useApi();
  const soundgifs = findSoundGif({});
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["common", "footer"])),
    },
  };
};

export default Category;
