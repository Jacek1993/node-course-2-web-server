const express=require('express');
const hbs=require('hbs');
const fs=require('fs');
const port = process.env.PORT || 3000;              //zmienne process.env przechowywane sa w formie mapy key value
//jesli proces.env.PORT nie istnieje wtedy ustawiamy nasza zmienna port na 3000
//PARACA Z GITEM
//views warto a nawet trzeba dodac do repo
//server.log    nie trzeba bo to sa nasze logi i nikogo to nie obchodzi
//KONIECZNE DO DODANIE SA PLIKI:    server.js, public/, package.json
//node_modules jest foldereme ktory latwo mozna wygenerowac za pomoca npm'a 'npm install' i nie ma potrzeby a nawet nie wolno go dodawac bo jest duzy i zasmieca, i jego zawartosc zalezy od systemu operacyjnego i wersji

var app=express();

hbs.registerPartials(__dirname+'/views/partials');


app.set('view engine', 'hbs');                      //tworzymy silnik do dynamicznego renderowania stron internetowych
//__dirname zawiera sceizke do naszego projektu
app.use(express.static(__dirname+'/public'));               //zeby zadzialalo folder public musi byc w kataogu naszego projektu poniewaz __dirname odnosi sie w naszym wypadku do web-server
                                                            //jest to statyczne przelaczanie widokow wydaje mi sie ze podobne jest w php ale co do tego to pewny nie jestem

//MIDDLEWARE  w tym wykorzystujemy app.use();  argument next umozliwia przechodzenie do nastepenego zdzarzenia wywolanie 'next();'
app.use((req, res, next)=>{
var now= new Date().toString();
var log = `${now}: ${req.method} ${req.url}`;

console.log(log);
fs.appendFile('server.log', log+'\n', (err)=>{                  //pierwszy argument nazwa pliku drugi argument to co wpisujemy trzeci argument blad i obsluga gdy wystapi
    if(err){
        console.log('Unable to append to server.log');
    }
});
//console.log(`${now}: ${req.method} ${req.url}`);                //w logach wypisuje date metode http oraz url od ktorego klient sie odnosi
next();
});


app.use((req, res, next)=>{
    var now=new Date().toString();
    var log=`${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log+'\n', (err)=>{
        if(err){
            console.log('Cannot read that file something is no yes');
        }
    });

    res.render('text.hbs', {                //dzieki takiej strukturze tylko strona text.hbs bedzie caly czas pokazywana nie ma znaczenia czy nasze query bedzie /about czy /home czy /help
        pageTittle: 'Text page',            //uzywana taka struktura jest najczesciej gdy sa jakies prace renowacyjne strony i nie chcemy zeby ktos nam zaglodal
        pageContent: 'This is text'
    });

});



var data={
    name: 'Jacek',
    lastName: 'Rula'
};

var error={
    errorMessage:'Ta strona nie jest dla Ciebie paciuloku!!!!'
};

app.get('/', (request, response)=>{
    // response.send('<h1>Hello Express</h1>'+
    // +'<br>'
    // +JSON.stringify(data));

   // response.send(data);


    //nie musimy zwraca daty za kazdym razem uzyjemy registerHelper by to ulatwic

    hbs.registerHelper('getCurrentYear', ()=>{
        return new Date().getFullYear();
    });

    hbs.registerHelper('screamIt', (text)=>{
       return  text.toUpperCase();
    });




    response.render('home.hbs',{
        name: "Jacek",
        pageTittle: 'Home Page'
       // currentYear: new Date().getFullYear()                 //mozemy usunac stad currentYear bo uzywamy templatea registerHelper by nam zapewnil dostarczenie danych
    })
});

app.get('/about', (req, res)=>{
   // res.send('About Page');
    res.render('about.hbs', {                                                       //tak wyglada dynamiczne renderowanie stron w Node.js tworzymy obiekt jako drugi argument funkcji i podajemy konieczne parametry
        pageTittle: "About Page"
       // currentYear: new Date().getFullYear()                                 //mozemy usunac stad currentYear bo uzywamy templatea registerHelper by nam zapewnil dostarczenie danych
    });
});

app.get('/bat', (req, res)=>{
    res.send(error);
});


app.listen(port, ()=>{
    console.log(`Server os up on port ${port}`);                       //komunikat pojawia sie wtedy gdy server wstanie
});                        //laczy aplikacje z portem systemu operacyjnego