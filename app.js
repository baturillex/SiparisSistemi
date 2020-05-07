const express = require('express');
//const ejs = require('ejs');
const bp = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

var multer = require('multer');
var storage = multer.memoryStorage(); // resim yüklemek için eklendi.
var upload = multer({ storage: storage }); // resim yüklemek için eklendi.

const port = 443;
const login = require('./loginOperations');
app.use(
  session({
    secret: 'Özel-Anahtar',
    resave: false,
    saveUninitialized: true,
  })
);

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/oturumac', login.UyeOl);
app.post('/oturumac', login.userUyeOl);

app.get('/unutmaoncesi', login.SifreOncesi);
app.post('/unutmaoncesi', login.userSifreOncesi);
app.post('/sifremiunuttum', login.usersifreunutmak);

app.get('/Login', login.KullaniciLogin);

app.post('/Login', login.kullaniciGiris);

app.get('/Anasayfa', function (req, res) {
  res.render('Anasayfa');

});


app.get('/mekanSahibiProfili/siparisionayla/:MekanAdi', login.MekanProfile);

app.get('/mekanSahibiProfili/restaurantgelenkutusu/:MekanAdi', login.MekanProfile);

app.get('/Profilim/kullanicigelenkutusu/:KullaniciAdi', login.kullanicimesajkutusu);




app.get('/restaurantuye', login.PatronLogin);
app.post('/restaurantuye', upload.single('İmageUpload'), login.userMekanUye);

app.get('/Profilim/:KullaniciAdi', login.Profile);
// app.get('/mekanSahibiProfili', login.MekanProfile);
app.get('/menu', login.MekanProfile);

app.get('/mekanSahibiProfili/:MekanAdi', login.MekanProfile);


app.get('/mekanSahibiProfili/siparisonayla/:MekanAdi', login.denemesiparisonay);

app.get('/restaurantgelenkutusu/:MekanAdi', login.restaurantmesaj);
app.post('/mekanSahibiProfili/restaurantgelenkutusu/:MekanAdi', login.messagerestaurant);



app.post('/mekanSahibiProfili/siparisonayla/:MekanAdi', login.sil);


app.post('/mekanSahibiProfili', login.MekanGuncelle);
//app.post(userUyeOl);

app.get('/mekanlogin/:MekanAdi', login.sahipLogin);
app.post('/mekan', login.sahipGiris);
// kanka burda sıkıntı olabilir
// her sayfada yaptığımın aynısını yapıyorum bi fark yok aslında
app.get('/mekanLogin', function (req, res) {
  res.render('mekanLogin');
});

app.get('/siparisver/:MekanAdi', login.siparisver);
app.post('/siparisver', login.siparisverpost);


// Kategoriler  
app.get('/hamburger', login.hamburger);


app.get('/balik', login.balik);
app.get('/pizza', login.pizza);
app.get('/doner', login.doner);
app.get('/pide', login.pide);
app.get('/fastfood', login.fastfood);


// mesaj yollama *Kullanıcı
app.post('/sendmessage', login.sendmessage);






app.post('/Login', login.kullaniciGiris);


app.get('/mekanBilgileri/:MekanAdi', login.mekanbilgileri);
app.post('/sendmessage', login.sendmessage);


app.post('/adminpanellogin', login.userGirisPanel);
app.get('/adminpanellogin', function (req, res) {
  res.render('adminpanellogin');
});
app.get('/istatistikler', login.istatistik);
app.listen(port, () => console.log(`Port Çalışıyor :  ${port}!`));
