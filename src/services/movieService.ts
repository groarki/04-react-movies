import axios  from "axios";
import type { Movie } from "../types/movie"

interface FetchResponse {
  results: Movie[], 
  total_pages: number,
}


export default async function getMovies(topic: string, page: number): Promise<FetchResponse> {
    const res = await axios.get<FetchResponse>(`https://api.themoviedb.org/3/search/movie?query=${topic}`, { 
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
      params: {
        page,
      }
    })
  
  return res.data
}

