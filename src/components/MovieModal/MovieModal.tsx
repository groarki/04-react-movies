import { useEffect } from "react";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";

interface MovieModalProps {
    movie: Movie,
    onClose: () => void
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {

    const handleKeyboard = (evt: KeyboardEvent) => {
      if (evt.code === 'Escape')
        onClose()
    }

    document.addEventListener("keydown", handleKeyboard)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = ""
    }
  }, [onClose])


  const handleBackdropClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if(evt.target === evt.currentTarget)
    onClose()
  }
  
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal} >
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}