let request = require('request');
let cheerio = require('cheerio');
let fileSystem = require('fs');

let $;
let $movie;

function webScrapper(genre, url, nextSelector, dataItemSelector, dataSelector, pageCount = 1, maxPagesReuired = 1, recordsPerPage = 50){
    if(genre != ''){
        url = `${url}?genres=${genre}`;
    }
    dataList = [];
    //let urlItems = url.split('?')[0].split('/');
    //let pageName = urlItems[urlItems.length - 1];
    // if(pageName == ''){
    //     pageName = 'text';
    // }
    request(url, function (error, response, body){
        if(error == null){
            if(response && response.statusCode == 200){
                console.log("" + pageCount + " : Scrapping : " + url)
                $ = cheerio.load(body)
                //fileSystem.writeFileSync(`${fileSystem}.html`, body);
                let nextSet = $(nextSelector);
                let dataSet = $(dataItemSelector);
                for(let r = 0; r < dataSet.length; r++){
                    $movie = cheerio.load($(dataSet[r]).html());
                    dataList.push({
                        'RequestedGenre' : genre,
                        'Name' : $movie(dataSelector.Name).length > 0 ? $movie($movie(dataSelector.Name)[0]).html() : '',
                        'Index' : $movie(dataSelector.Index).length > 0 ? $movie($movie(dataSelector.Index)[0]).html() : '',
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
                        webScrapper(genre, `https://www.imdb.com` + $(nextSet[0]).attr('href'), nextSelector,dataItemSelector, dataSelector , pageCount + 1, maxPagesReuired);
                    }
                    else{
                        webScrapper(genre, `${url.split('&')[0]}&start=${pageCount*recordsPerPage + 1}`, nextSelector,dataItemSelector, dataSelector , pageCount + 1, maxPagesReuired)
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

function scrapeViaGerner(genre = '', movieCount = 50){
    //let next = '.lister-page-next.next-page';
    let next = '';
    let movieData = {
        'Name' : '.lister-item-header a',
        'Index' : '.lister-item-header .lister-item-index',
        'Year' : '.lister-item-header .lister-item-year',
        'Genre' : '.text-muted .genre',
        'Certificate' : '.text-muted .certificate',
        'Rating' : '.ratings-bar strong',
        'Image' : '.lister-item-image img'
    }
    let movieItem = '.lister-item.mode-advanced'
    let url = `https://www.imdb.com/search/title/`
    let genres = ['action', 'drama', 'crime', 'adventure', 'thriller', 'romance', 'comedy', 'fantasy', 'sci-fi', 'mystery', 'animation', 'family','short','war','history','horror', 'sport','western','biography','music','musical', 'reality-tv','documentary','news','talk-show','game-show','film-noir']
    if(genre == ''){
        genre = genres[Math.floor(Math.random() * genres.length)];
    }
    webScrapper(genre, url, next, movieItem, movieData, 1, Math.ceil(movieCount/50));
}

scrapeViaGerner('', 200);