import { useHttp } from "../hooks/http.hook"


const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();


	const _apiBase = "https://gateway.marvel.com:443/v1/public/";
	const _apiKey = "apikey=1b8e25edcdfc2905b06a8b775c75c762";
	const _baseOffset = 210;
	const _limitComics = 8;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset= ${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}
	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	}
	const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}
	const getComic = async (id) => {
		const res = await request(`${_apiBase}/comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	}
	const getAllComics = async (offset = _limitComics) => {
		const res = await request(`https://gateway.marvel.com:443/v1/public/comics?orderBy=-onsaleDate&limit=8&offset=${offset}&apikey=1b8e25edcdfc2905b06a8b775c75c762`)
		return res.data.results.map(_transformComics)
	}
	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description,
			thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}
	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",
			url: comics.urls.url,
			price: comics.prices.price ? `${comics.prices.price}` : "not available",
			language: comics.textObjects.language || "en-us",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension
		}
	}

	return { loading, error, clearError, getAllCharacters, getCharacter, getCharacterByName, getAllComics, getComic }

}
export default useMarvelService;