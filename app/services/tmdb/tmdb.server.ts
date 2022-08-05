import {
  ICredit,
  IMediaList,
  IMovieDetail,
  ITvShowDetail,
  IVideos,
  ListMovieType,
  ListTvShowType,
  MediaType,
  TimeWindowType,
  IListGenre,
  IGenre,
} from './tmdb.types';
import { fetcher, postFetchDataHandler, TMDB } from './utils.server';

// reusable function
const getListFromTMDB = async (url: string, type?: string): Promise<IMediaList> => {
  try {
    const fetched = await fetcher(url);

    return {
      page: fetched.page,
      totalPages: fetched.total_pages,
      items: [...postFetchDataHandler(fetched, type)],
    } as IMediaList;
  } catch (error) {
    console.error(error);
    return { page: 0, totalPages: 0, items: [] };
  }
};

/* ===========================================Trending Field========================================== */

// get a list of trending items
export const getTrending = async (
  mediaType: MediaType,
  timeWindow: TimeWindowType,
  page?: number,
): Promise<IMediaList> => {
  const url = TMDB.trendingUrl(mediaType, timeWindow, page);
  return getListFromTMDB(url);
};

/* ======================================End of Trending Field======================================== */

/* ===========================================Movie Field============================================= */

/**
 * It fetches a list of movies from the TMDB API, and returns a list of movies
 * @param {ListMovieType} type - ListMovieType
 * @param {number} [page] - number
 * @returns An object with the following properties:
 * page: number
 * totalPages: number
 * items: IMovie[]
 */
export const getListMovies = async (type: ListMovieType, page?: number): Promise<IMediaList> => {
  const url = TMDB.listMoviesUrl(type, page);
  return getListFromTMDB(url, 'movie');
};

/**
 * It fetches a movie detail from the TMDB API and returns the data if it exists, otherwise it returns
 * undefined
 * @param {number} id - number - The id of the movie you want to get the details for
 * @returns A Promise that resolves to an IMovieDetail or undefined.
 */
export const getMovieDetail = async (id: number): Promise<IMovieDetail | undefined> => {
  try {
    const fetched = await fetcher<IMovieDetail>(TMDB.movieDetailUrl(id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/* =====================================End of Movie Field============================================ */

/* ========================================Tv Show Field============================================== */

/**
 * It takes a type and a page number, and returns a promise that resolves to an object that contains a
 * list of tv shows
 * @param {ListTvShowType} type - ListTvShowType = 'airing_today' | 'on_the_air' | 'popular' |
 * 'top_rated';
 * @param {number} [page] - number
 * @returns A promise that resolves to an object of type IMediaList.
 */
export const getListTvShows = async (type: ListTvShowType, page?: number): Promise<IMediaList> => {
  const url = TMDB.listTvShowsUrl(type, page);
  return getListFromTMDB(url, 'tv');
};

export const getTvShowDetail = async (id: number): Promise<ITvShowDetail | undefined> => {
  try {
    const fetched = await fetcher<ITvShowDetail>(TMDB.tvShowDetailUrl(id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It fetches the IMDB ID of a TV show from TMDB, and if it doesn't exist, it throws an error
 * @param {number} id - number - The TV show ID from TMDB
 * @returns A Promise that resolves to a number or undefined.
 */
export const getTvShowIMDBId = async (id: number): Promise<number | undefined> => {
  try {
    const fetched = await fetcher<{ imdb_id: number | undefined }>(TMDB.tvExternalIds(id));

    if (!fetched?.imdb_id) throw new Error('This TV show does not have IMDB ID');

    return fetched.imdb_id;
  } catch (error) {
    console.error(error);
  }
};

/* ======================================End of Tv Show Field========================================= */

/* =============================================UTILS================================================= */

/**
 * It fetches a video from the TMDB API and returns the response
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - number - the id of the movie or tv show
 * @returns The return type is a Promise of IVideos or undefined.
 */
export const getVideos = async (type: 'movie' | 'tv', id: number): Promise<IVideos | undefined> => {
  try {
    const fetched = await fetcher<IVideos>(TMDB.videoUrl(type, id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It fetches a credit object from the TMDB API, and returns it if it exists
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - number,
 * @returns Promise&lt;ICredit | undefined&gt;
 */
export const getCredits = async (
  type: 'movie' | 'tv',
  id: number,
): Promise<ICredit | undefined> => {
  try {
    const fetched = await fetcher<ICredit>(TMDB.creditUrl(type, id));
    return fetched;
  } catch (error) {
    console.error(error);
  }
};

/**
 * It takes a type and an id, and returns a promise that resolves to a list of media
 * @param {'movie' | 'tv'} type - 'movie' | 'tv'
 * @param {number} id - The id of the movie or tv show
 * @returns A promise that resolves to an IMediaList object.
 */
export const getSimilar = async (type: 'movie' | 'tv', id: number): Promise<IMediaList> => {
  const url = TMDB.similarUrl(type, id);
  return getListFromTMDB(url);
};

export const getListGenre = async (type: 'movie' | 'tv'): Promise<IGenre[] | undefined> => {
  const url = TMDB.listGenre(type);
  try {
    const fetched = await fetcher<IListGenre>(url);
    return fetched.genres;
  } catch (error) {
    console.error(error);
  }
};