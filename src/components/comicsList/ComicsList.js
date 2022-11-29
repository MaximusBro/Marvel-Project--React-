import './comicsList.scss';
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [limit, setLimit] = useState(3);
	const [comicsEnded, setComicsEnded] = useState(false);

	useEffect(() => {
		onRequest(limit, true);

	}, []);

	const { loading, error, getAllComics } = useMarvelService();

	const onRequest = (limit, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllComics(limit)
			.then(onCharListLoaded)
	}
	const onCharListLoaded = (newcomicsList) => {
		let ended = false;
		if (newcomicsList.length < limit) {
			ended = true;
		}

		setComicsList(comicsList => [...newcomicsList, ...comicsList]);
		setNewItemLoading(false);
		setLimit(limit => limit + 6);
		setComicsEnded(ended)

	}


	function renderItems(arr) {
		const items = arr.map((item, index) => {
			let imgStyle = { 'objectFit': 'cover' };
			if (item.thumbnail === 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/clean.jpg') {
				imgStyle = { 'objectFit': 'unset' };
			}
			return (
				<li className="comics__item" key={index}>
					<Link to={`/comics/${item.id}`}>
						<img src={item.thumbnail} alt={item.title} className="comics__item-img" />
						<div className="comics__item-name">{item.title}</div>
						<div className="comics__item-price">{item.price}</div>
					</Link>
				</li>
			)

		})
		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}
	const items = renderItems(comicsList);
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;
	return (
		<div className="comics__list">
			{errorMessage}
			{spinner}
			{items}
			<button className="button button__main button__long"
				style={{
					"display": comicsEnded ? "none" : "block"
				}}
				disabled={newItemLoading}
				onClick={() => onRequest(limit)}>
				<div className="inner">load more</div>
			</button>
		</div>
	)

}
export default ComicsList;