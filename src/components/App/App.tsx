import css from "./App.module.css"
import SearchBar from "../SearchBar/SearchBar"
import getMovies from "../../services/movieService"
import { useEffect, useState } from 'react'
import type { Movie } from '../../types/movie'
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from '../MovieGrid/MovieGrid'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'


function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [topic, setTopic] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
   
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie)
  }
  const closeModal = () => {
    setSelectedMovie(null)
  }

  const handleSearch = (topic: string) => {
    setTopic(topic)
    setCurrentPage(1)
  }
  
  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies", topic, currentPage], 
    queryFn: async() => await getMovies(topic, currentPage),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
  })
   
  useEffect(() => {
    if (data && data.results.length === 0) {
     toast.error("No movies found for your request.")
   }
 }, [data])

  const totalPages = data?.total_pages ?? 0

  return <>
    <Toaster/>
    <SearchBar onSubmit={handleSearch} />
    {data && data?.total_pages > 1 && <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />}
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {data && <MovieGrid onSelect={openModal} movies={data.results} />}
    {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
 </>
}

export default App
