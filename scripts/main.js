function addMyData(fileName) {
	fetch(`${fileName}.json`)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log('error: ' + err);
		});
}
function appendData(data) {
	var mainContainer = document.getElementById('myMovies');
	for (var i = 0; i < data.length; i++) {
		var div = document.createElement('div');
		div.innerHTML = `<div class="movie-item col-12">
                <div class="row">
                    <div class="col-2">
                        <div class="movie-image">
                            <img src="${data[i].Image}" alt="${data[i].Name}" title="${data[i].Name}">
                        </div>
                    </div>
                    <div class="col-8">
                        <h3>${data[i].Index} ${data[i].Name} <span>${data[i].Year}</span> </h3>
                        <p>${data[i].Genre}</p>
                        <p>${data[i].RunTime}</p>
                        <p>${data[i].Description}</p>
                    </div>
                    <div class="col-2"></div>
                </div>
            </div>`;
		mainContainer.appendChild(div);
		console.log(div);
	}
}