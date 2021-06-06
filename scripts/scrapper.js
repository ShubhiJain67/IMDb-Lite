// -------------------------------------------------- Basic Setup -------------------------------------------------

let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let $;
let $movie;

movieData = {
    type : "",
    data : []
};

attributeParameters = {
	name: 'Movie Item',
	class: '.lister-item.mode-advanced',
    pageSize : 50,
	settings: [
		{
			name: 'Name',
			setting: { class: '.lister-item-header a', index: 0, type: '' },
		},
		{
			name: 'Index',
			setting: { class: '.lister-item-header .lister-item-index', index: 0, type: '',},
		},
		{
			name: 'RunTime',
			setting: { class: '.text-muted .runtime', index: 0, type: '' },
		},
		{
			name: 'Year',
			setting: { class: '.lister-item-header .lister-item-year', index: 0, type: '', },
		},
		{
			name: 'Genre',
			setting: { class: '.text-muted .genre', index: 0, type: '' },
		},
		{
			name: 'Certificate',
			setting: { class: '.text-muted .certificate', index: 0, type: '' },
		},
		{
			name: 'Rating',
			setting: { class: '.ratings-bar strong', index: 0, type: '' },
		},
		{
			name: 'DefaultImage',
			setting: { class: '.lister-item-image img', index: 0, type: 'src' },
		},
		{
			name: 'Image',
			setting: { class: '.lister-item-image img', index: 0, type: 'loadlate' },
		},
		{
			name: 'Description',
			setting: { class: '.lister-item-content p.text-muted', index: 1, type: ''},
		},
        {
			name: 'BasicInformation',
			setting: { class: '.lister-item-content p.text-muted', index: 0, type: ''},
		},
	],
};

dataTypes = {
	Genre: {
		Name: 'genres',
		Default: 'action',
		Types: {
			Action: 'action',
			Drama: 'drama',
			Crime: 'crime',
			Adventure: 'adventure',
			Thriller: 'thriller',
			Romance: 'romance',
			Comedy: 'comedy',
			fantasy: 'fantasy',
			SciFi: 'sci-fi',
			Mystery: 'mystery',
			Animation: 'animation',
			Family: 'family',
			Short: 'short',
			War: 'war',
			History: 'history',
			Horror: 'horror',
			Sport: 'sport',
			Western: 'western',
			Biography: 'biography',
			Music: 'music',
			Musical: 'musical',
			RealityTV: 'reality-tv',
			Documentary: 'documentary',
			News: 'news',
			TalkShow: 'talk-show',
			GameShow: 'game-show',
			FilmNoir: 'film-noir',
		},
	},
	TitleType: {
		Name: 'title_type',
		Default: 'tvEpisode',
		Types: {
			TVEpisode: 'tvEpisode',
			Movie: 'movie',
			Short: 'short',
			VideoGame: 'videoGame',
			Video: 'video',
			TvSeries: 'tvSeries',
			TvMovie: 'tvMovie',
			TvMiniSeries: 'tvMiniSeries',
			TvSpecial: 'tvSpecial',
			TvShort: 'tvShort',
		},
	},
};

// -------------------------------------------------- Functions -------------------------------------------------

function webScrapper(type, typeData, url, pageCount = 1, maxPageCount = 1, pageSize = 50, offset = 0) {
	// Getting the url that is to be parsed
	if (url.split('?').length == 1 && typeData != '') {
		url = `${url}?${type}=${typeData}`;
	} 
    else if (!url.includes(`?${type}`)) {
		url = `${url}&${type}=${typeData}`;
	}

    if(offset > 0){
        url = `${url.split('&')[0]}&start=${offset + 1}`
    }

	// Scrapping the url
	request(url, function (error, response, body) {
		// If the request doesnot throw any error
		if (error == null) {
			// If the request is successfull
			if (response && response.statusCode == 200) {
				console.log("" + pageCount + " : Scrapping : " + url)
				$ = cheerio.load(body);
				let dataSet = $(attributeParameters.class);

				for (let r = 0; r < dataSet.length; r++) {
					$movie = cheerio.load($(dataSet[r]).html());
					tempData = { RequestedType: type, RequstedData: typeData };
					attributeParameters.settings.forEach((attribute) => {
						if (attribute.setting.type == '') {
							tempData[attribute.name] =	$movie(attribute.setting.class)?.length > attribute.setting.index ? $movie($movie(attribute.setting.class)[attribute.setting.index]).html() : '';
						} else {
							tempData[attribute.name] =	$movie(attribute.setting.class)?.length > attribute.setting.index ? $movie($movie(attribute.setting.class)[attribute.setting.index]).attr(attribute.setting.type) : '';
						}
					});
					movieData.data.push(tempData);
				}

				if (pageCount < maxPageCount) {
					webScrapper(type, typeData, url, pageCount + 1, maxPageCount, pageSize, offset + pageSize);
				}
				else {
					fs.writeFileSync(`${typeData}.json`, JSON.stringify(movieData));
				}
			}
            else {
				console.log('RESPONSE : ' + response);
				if (response) {
					console.log('STATUS : ' + response.statusCode);
				}
				return [];
			}
		}
        else {
			console.log('ERROR Ocurred');
			console.log(error);
			return [];
		}
	});
}

function scrapeViaGerner(type = dataType.Genre.Name, dataType = dataTypes.Genre.Default, movieCount = 50, offset = 0) {
	let url = `https://www.imdb.com/search/title/`;
    let pageCount = Math.ceil(movieCount / attributeParameters.pageSize);

    movieData.type = `${type} : ${dataType}`;
	if (pageCount >= 1) {
		webScrapper(type, dataType, url, 1, pageCount, attributeParameters.pageSize, offset);
	}
}


// -------------------------------------------------- Start -------------------------------------------------
scrapeViaGerner(dataTypes.TitleType.Name, dataTypes.TitleType.Types.TVEpisode, 120, 30);