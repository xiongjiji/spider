var http = require('http');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var opt = {
	hostname:"movie.douban.com",
	path:"/chart"
}


http.get(opt,function(res){
	var movies = [];
	var html = '';

	res.setEncoding('utf-8');

	res.on('data',function(chunk){
		html += chunk
	})

	res.on('end',function(){
		var $ = cheerio.load(html);

		$(".pl2").each(function(){
			var movie = {
				title:$("a span",this).html(),
				link:$("a",this).attr("href")
			}
			movies.push(movie)
		})

		$(".item").each(function(index){
			var picUrl = $('.nbg img', this).attr('src');
			movies[index].picUrl = picUrl;
			downloadImg(picUrl,"img/")
		})
		saveData("./data/data.json",movies)
	})

}).on('error',function(err){
	console.log(err)
})

function saveData(path,movies){
	fs.writeFile(path,JSON.stringify(movies,null,4),function(err){
		if(err){
			console.log(err)
		}else{
			console.log("data save")
		}
	})
}

function downloadImg(url,imgDir){
	http.get(url,function(res){
		var data = '';
		
		res.setEncoding('binary');
		res.on('data',function(chunk){
			data += chunk;
		})

		res.on('end' ,function(){
			fs.writeFile(imgDir+path.basename(url),data,'binary',function(err){
				if(err){
					console.log(err)
				}
			})
		}).on("error",function(err){
			console.log(err)
		})
	})
}

