let request = require('request');
let cheerio = require('cheerio');
let $;
let $movie;

function webScrapper(type, typeData, url, nextSelector, dataItemSelector, dataSelector, pageCount = 1, maxPagesReuired = 1, recordsPerPage = 50, domain = 'https://www.imdb.com'){
    if(url.split('?').length == 1 && typeData != ''){
        url = `${url}?${type}=${typeData}`;
    }
    else if(!url.includes(`?${type}`)){
        url = `${url}&${type}=${typeData}`;
    }
    dataList = [];
    request(url, function (error, response, body){
        if(error == null){
            if(response && response.statusCode == 200){
                console.log("" + pageCount + " : Scrapping : " + url)
                $ = cheerio.load(body)
                let nextSet = $(nextSelector);
                let dataSet = $(dataItemSelector);
                for(let r = 0; r < dataSet.length; r++){
                    $movie = cheerio.load($(dataSet[r]).html());
                    dataList.push({
                        'RequestedType' : type,
                        'RequstedData' : typeData,
                        'Name' : $movie(dataSelector.Name).length > 0 ? $movie($movie(dataSelector.Name)[0]).html() : '',
                        'Index' : $movie(dataSelector.Index).length > 0 ? $movie($movie(dataSelector.Index)[0]).html() : '',
                        'RunTime' : $movie(dataSelector.RunTime).length > 0 ? $movie($movie(dataSelector.RunTime)[0]).html() : '',
                        'Year' : $movie(dataSelector.Year).length > 0 ? $movie($movie(dataSelector.Year)[0]).html() : '',
                        'Genre' : $movie(dataSelector.Genre).length > 0 ? $movie($movie(dataSelector.Genre)[0]).html() : '',
                        'Certificate' : $movie(dataSelector.Certificate).length > 0 ? $movie($movie(dataSelector.Certificate)[0]).html() : '',
                        'Rating' : $movie(dataSelector.Rating).length > 0 ? $movie($movie(dataSelector.Rating)[0]).html() : '',
                        'DefaultImage' : $movie(dataSelector.Image).length > 0 ? $movie($movie(dataSelector.Image)[0]).attr('src') : '',
                        'Image' : $movie(dataSelector.Image).length > 0 ? $movie($movie(dataSelector.Image)[0]).attr('loadlate') : ''
                    });
                }
                console.log(dataList);
                if(pageCount < maxPagesReuired){
                    if($(nextSet[0]).attr('href') != undefined){
                        webScrapper(type, typeData, `${domain}` + $(nextSet[0]).attr('href'), nextSelector,dataItemSelector, dataSelector , pageCount + 1, maxPagesReuired);
                    }
                    else{
                        webScrapper(type, typeData, `${url.split('&')[0]}&start=${pageCount*recordsPerPage + 1}`, nextSelector,dataItemSelector, dataSelector , pageCount + 1, maxPagesReuired)
                    }
                }
            }
            else{
                console.log("RESPONSE : " + response)
                if(response){
                    console.log("STATUS : " + response.statusCode)
                }
                return [];
            }
        }
        else{
            console.log("ERROR Ocurred");
            console.log(error);
            return [];
        }
    });
}

function scrapeViaGerner(type = dataType.Genre.Name , dataType = '', movieCount = 50){
    //let next = '.lister-page-next.next-page';
    let next = '';
    let movieData = {
        'Name' : '.lister-item-header a',
        'Index' : '.lister-item-header .lister-item-index',
        'Year' : '.lister-item-header .lister-item-year',
        'RunTime' : '.text-muted .runtime',
        'Genre' : '.text-muted .genre',
        'Certificate' : '.text-muted .certificate',
        'Rating' : '.ratings-bar strong',
        'Image' : '.lister-item-image img'
    }
    let movieItem = '.lister-item.mode-advanced'
    let url = `https://www.imdb.com/search/title/`
    if(dataType == ''){
        if(type == dataType.Genre.Name){
            dataType = dataType.Genre.Default;
        }
        else{
            dataType = dataType.TitleType.Default;
        }
    }
    pageCount = 1;
    totalPageCount =  Math.ceil(movieCount/50);
    if(pageCount <= totalPageCount){
        webScrapper(type, dataType, url, next, movieItem, movieData, pageCount, totalPageCount);
    }
}

dataTypes = {
    Genre :{
        Name : 'genres',
        Default : 'action',
        Types : {
            Action : 'action',
            Drama : 'drama',
            Crime : 'crime',
            Adventure : 'adventure',
            Thriller : 'thriller',
            Romance : 'romance',
            Comedy : 'comedy',
            fantasy : 'fantasy',
            SciFi : 'sci-fi',
            Mystery : 'mystery',
            Animation : 'animation',
            Family : 'family',
            Short : 'short',
            War : 'war',
            History : 'history',
            Horror :'horror',
            Sport : 'sport',
            Western : 'western',
            Biography : 'biography',
            Music : 'music',
            Musical : 'musical',
            RealityTV : 'reality-tv',
            Documentary : 'documentary',
            News : 'news',
            TalkShow : 'talk-show',
            GameShow : 'game-show',
            FilmNoir : 'film-noir'
        }
    },
    TitleType :{
        Name : 'title_type',
        Default : 'tvEpisode',
        Types : {
            TVEpisode : 'tvEpisode',
            Movie : 'movie',
            Short : 'short',
            VideoGame : 'videoGame',
            Video : 'video',
            TvSeries : 'tvSeries',
            TvMovie : 'tvMovie',
            TvMiniSeries : 'tvMiniSeries',
            TvSpecial : 'tvSpecial',
            TvShort : 'tvShort'
        }
    }
}

//scrapeViaGerner(dataTypes.Genre.Name, dataTypes.Genre.Types.History, 70);
scrapeViaGerner(dataTypes.TitleType.Name, dataTypes.TitleType.Types.Movie, 70);