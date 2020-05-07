const sql = require('mssql');


var webconfig = {
  user: 'batuhan61',
  password: 'batuhan28',
  server: '192.168.2.136',
  database: 'bitirmeProjesi',
};
// Üye İşlemleri
module.exports.userUyeOl = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_UyeKontrol ('" + req.body.uye_kullanici_Adi + "','" + req.body.uye_EMail + "') as varmi", function (err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function (kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Kullanıcı adı bulunmaktadır ' });
        } else {
          request1.query(
            "INSERT INTO Uye(Adi,Soyadi,Sifre,Email,KullaniciAdi)  VALUES('" +
            req.body.uye_Adi +
            "','" +
            req.body.uye_Soyadi +
            "','" +
            req.body.uye_Sifre +
            "','" +
            req.body.uye_EMail +
            "','" +
            req.body.uye_kullanici_Adi +
            "')",
            function (err, data) {
              if (err) {
                console.log(err);
              }
              res.render('oturumac', { hata: '' });
            }
          );
        }
      });
    });
  });
};

module.exports.UyeOl = function (req, res) {
  res.render('oturumac', { hata: '' });
};

// Kullanıcı Giriş Kontrol
module.exports.kullaniciGiris = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_UyeVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function (err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function (kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Uye where KullaniciAdi='" + req.body.ad + "'", function (err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }
            res.render('Anasayfa', { veri: data.recordset });
            sql.close();
            sql.close();
          });
        } else {
          res.render('Login', { hata: 'Kullanıcı adı veya sifre hatalı' });
          // sql.close(); // buradan olabilir
        }
      });
    });
  });
};
// // MEKAN KONTROL YENİ
module.exports.sahipGiris = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_MekanVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function (err, verisonucu) {
      if (err) {
        console.log(err);
      }

      verisonucu.recordset.forEach(function (kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Mekan where MekanAdi='" + req.body.ad + "'", function (err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }

            res.render('menu', { veri: data.recordset });
            sql.close();
            // sql.dispose();
            //  sql.close();
          });
        } else {
          res.render('mekanLogin', { hata: 'Kullanıcı adı veya sifre hatalı' });
          // sql.close();
        }
      });
    });
  });
};

// Mekan Üyeliği
module.exports.userMekanUye = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select  dbo.fn_MekanKontrol ('" + req.body.mekan_Adi + "') as varmi", function (err, control) {
      if (err) {
        console.log(err);
      }
      control.recordset.forEach(function (kullanici) {
        if (kullanici.varmi == 'Evet') {
          res.render('oturumac', { hata: 'Bu mekan sisteme kayıtlıdır. ' });
        } else {
          request1.query(
            "INSERT INTO Mekan(MekanAdi,AdıSoyadı,Sifre,Lokasyon,MekanResim,AcilisSaati,KapanisSaati,PaketSiparis,Kategori)  VALUES('" +
            req.body.mekan_Adi +
            "','" +
            req.body.uye_Adi_Soyadi +
            "','" +
            req.body.mekan_Sifre +
            "','" +
            req.body.mekan_lokasyon +
            "',CAST( '" +
            req.file.buffer.toString('base64') +
            "'  AS VARBINARY(MAX)) ,'" +
            req.body.mekan_acilisSaati +
            "','" +
            req.body.mekan_kapanisSaati +
            "','" +
            req.body.paketSiparis +
            "','" +
            req.body.kategori +
            "')",

            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_1) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_1 +
            "','" +
            req.body.Fiyat_1 +
            "','" +
            req.body.Tur_1 +
            "','" +
            req.body.Kategori_1 +
            "','" +
            req.body.Servis_1 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_2) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_2 +
            "','" +
            req.body.Fiyat_2 +
            "','" +
            req.body.Tur_2 +
            "','" +
            req.body.Kategori_2 +
            "','" +
            req.body.Servis_2 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_3) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_3 +
            "','" +
            req.body.Fiyat_3 +
            "','" +
            req.body.Tur_3 +
            "','" +
            req.body.Kategori_3 +
            "','" +
            req.body.Servis_3 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_4) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_4 +
            "','" +
            req.body.Fiyat_4 +
            "','" +
            req.body.Tur_4 +
            "','" +
            req.body.Kategori_4 +
            "','" +
            req.body.Servis_4 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_5) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_5 +
            "','" +
            req.body.Fiyat_5 +
            "','" +
            req.body.Tur_5 +
            "','" +
            req.body.Kategori_5 +
            "','" +
            req.body.Servis_5 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_6) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_6 +
            "','" +
            req.body.Fiyat_6 +
            "','" +
            req.body.Tur_6 +
            "','" +
            req.body.Kategori_6 +
            "','" +
            req.body.Servis_6 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_7) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_7 +
            "','" +
            req.body.Fiyat_7 +
            "','" +
            req.body.Tur_7 +
            "','" +
            req.body.Kategori_7 +
            "','" +
            req.body.Servis_7 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_8) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_8 +
            "','" +
            req.body.Fiyat_8 +
            "','" +
            req.body.Tur_8 +
            "','" +
            req.body.Kategori_8 +
            "','" +
            req.body.Servis_8 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }

        if (req.body.Urun_9) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_9 +
            "','" +
            req.body.Fiyat_9 +
            "','" +
            req.body.Tur_9 +
            "','" +
            req.body.Kategori_9 +
            "','" +
            req.body.Servis_9 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        if (req.body.Urun_10) {
          request1.query(
            "INSERT INTO Menu(Ad,Fiyat,Tur,Kategori,Servis,MekanAdi)  SELECT '" +
            req.body.Urun_10 +
            "','" +
            req.body.Fiyat_10 +
            "','" +
            req.body.Tur_10 +
            "','" +
            req.body.Kategori_10 +
            "','" +
            req.body.Servis_10 +
            "','" +
            req.body.mekan_Adi +
            "'",
            function (err, data) {
              if (err) {
                console.log(err);
              }
            }
          );
        }
        res.render('oturumac', { hata: '' });

        // buraya sql.close eklemen gerekebilir.
      });
    });
  });
};
module.exports.hamburger = function (req, res) {
  // hamburger
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Hamburger'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }



        res.render('hamburger', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};

// module.exports.mekanss = function (req, res) {
//   // Hamburger kategorisi
//   sql.connect(webconfig, function (err) {
//     if (err) console.log(err);
//     var request1 = new sql.Request();
//     request1.query("select * from Mekan where MekanAdi='" + req.body.ad + "'", function (err, verisonucu) {
//       if (err) {
//         console.log(err);
//       }

//       res.render('mekanLogin', { veri: verisonucu.recordset });
//     });
//   });
// };

module.exports.Profile = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    var request3 = new sql.Request();
    var request4 = new sql.Request();

    request4.query("select * from Siparisler where UyeAdi  ='" + req.params.KullaniciAdi + "' and Durum='Reddedildi'", function (err, verisonucu4) {

      request3.query("select * from Siparisler where UyeAdi  ='" + req.params.KullaniciAdi + "' and Durum='Onaylandi'", function (err, verisonucu3) {

        request2.query("select * from Siparisler where UyeAdi  ='" + req.params.KullaniciAdi + "' and Durum='Beklemede'", function (err, verisonucu2) {
          request1.query("select * from Uye where KullaniciAdi  ='" + req.session.ad + "'", function (err, verisonucu) {

            if (err) {
              console.log(err);
            }

            console.log('', req.session.ad);

            res.render('Profilim', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset, veri4: verisonucu4.recordset });
            sql.close();
          }); // BAŞLIKLAR DÜZENLENEMEZ HATASI VERECEK.
        });
      });
    });
  });
};

module.exports.MekanProfile = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();
    var request4 = new sql.Request();
    var request5 = new sql.Request();

    request5.query("select COUNT(DISTINCT id) as BekleyenSiparis from Siparisler where Durum='Beklemede'", function (err, verisonucu5) {
      request4.query("select * from Siparisler where MekanAdi  ='" + req.params.MekanAdi + "' and Durum='Beklemede'", function (err, verisonucu4) {
        request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {
          request2.query("select Id,Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='İcecek'", function (
            err,
            verisonucu
          ) {
            request3.query("select Id,Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='Yiyecek'", function (
              err,
              verisonucu3
            ) {
              if (err) {
                console.log(err);
              }

              console.log('', req.params.MekanAdi);

              res.render('mekanSahibiProfili', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset, veri4: verisonucu4.recordset, veri5: verisonucu5.recordset });
              sql.close();
              sql.close();
            });
          });
        });
      });
    });
  });

};
module.exports.MekanGuncelle = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      // MEKAN GÜNCELLE
      `
        UPDATE Mekan set 
        AdıSoyadı = '${req.body.isimsoyisim}',
        MekanAdi = '${req.body.mekanadi}',
        Lokasyon = '${req.body.yeniadres}',
        PaketSiparis = '${req.body.paketsiparisvarmi}',
        AcilisSaati = '${req.body.mekan_acilis}',
        KapanisSaati = '${req.body.mekan_kapanis}'
        WHERE id = '${req.body.guncellenecekEtkinlikId}'
        `,
      function (err, dataresult) {
        if (err) {
          console.log(err);
        } else {
          res.send('Güncellendi');
        }
      }
    );
  });
};

module.exports.MenuYemek = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      // Menü İnsert
      "INSERT INTO Menu(Yemek,İçecek)  VALUES('" + req.body.yemek1 + "','" + req.body.icecek1 + "')",
      function (err, dataresult) {
        if (err) {
          console.log(err);
        } else {
          res.send('Güncellendi');
        }
      }
    );
  });
};

module.exports.KullaniciLogin = function (req, res) {
  res.render('Login', { hata: '' });
};
module.exports.sahipLogin = function (req, res) {
  res.render('mekanLogin', { hata: '' });
};

module.exports.PatronLogin = function (req, res) {
  res.render('restaurantuyeol', { hata: '' });
};

// Mekan Girişi
module.exports.PatronGiris = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_MekanVarmi('" + req.body.ad + "','" + req.body.sifre + "') as Sonuc", function (err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function (kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Mekan where MekanAdi='" + req.body.ad + "'", function (err, data) {
            req.session.ad = req.body.ad;
            if (err) {
              console.log(err);
            }

            res.render('mekanSahibiProfili', { veri: data.recordset });
          });
        } else {
          res.render('mekanLogin', { hata: 'Kullanıcı adı veya sifre hatalı' });
        }
      });
    });
  });
};

module.exports.SifreOncesi = function (req, res) {
  res.render('unutmaoncesi', { varmı: '' });
};

module.exports.userSifreOncesi = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_SifreOncesis('" + req.body.emailcontrol + "','" + req.body.kullaniciname + "') as varmı", function (
      err,
      verisonucu
    ) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function (kullanici) {
        if (kullanici.varmı == 'Evet') {
          res.render('sifremiunuttum', { Email: req.body.emailcontrol, KullaniciAdi: req.body.kullaniciname });
        } else {
          res.render('unutmaoncesi', { varmı: 'Kullanıcı adı veya email hatalı' });
        }
      });
    });
  });
};

module.exports.usersifreunutmak = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      "update Uye set Sifre='" + req.body.sifre_forget +
      "' where Email='" +
      req.body.eemailadi +
      "' and KullaniciAdi='" +
      req.body.kkullaniciadi +
      "'",
      function (err, data) {
        if (err) {
          console.log(err);
        }

        res.render('Login', { hata: 'Kullanıcı adı veya sifre hatalı' });
      }
    );
  });
};

module.exports.userGirisPanel = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query("select dbo.fn_AdminVarmiİ('" + req.body.userid + "','" + req.body.pswrd + "') as Sonuc", function (err, verisonucu) {
      if (err) {
        console.log(err);
      }
      verisonucu.recordset.forEach(function (kullanici) {
        if (kullanici.Sonuc == 'Evet') {
          request1.query("select * from Adminler where AdminAdi='" + req.body.userid + "'", function (err, veri) {
            if (err) {
              console.log(err);
            }

            sql.close();
            res.render('adminpanel', { veri: verisonucu.recordset });
          });
        } else {
          res.render('adminpanellogin', { hata: 'Kullanıcı adı veya sifre hatalı' });
          sql.close();
        }
      });
    });
  });
};
module.exports.istatistik = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    // console.log(req.body);

    request1.query('select COUNT(DISTINCT id) from Mekan as ToplamMekanSayısı ', function (err, verisonucu) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('istatistikler', { veri: verisonucu.recordset });
    });
  });
};

module.exports.mekanbilgileri = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();
    var request4 = new sql.Request();


    request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {
      request4.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu4) {
        request2.query("select Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='İcecek'", function (
          err,
          verisonucu
        ) {
          request3.query("select Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='Yiyecek'", function (
            err,
            verisonucu3
          ) {
            if (err) {
              console.log(err);
            }

            console.log('', req.params.MekanAdi);

            res.render('mekanBilgileri', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset, veri4: verisonucu4.recordset });

            sql.close();
            sql.close();
          });
        });
      });
    });
  });
};
module.exports.siparisver = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);

    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();

    request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {

      request2.query("select Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu) {
        request3.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu3) {


          if (err) {
            console.log(err);
          }

          res.render('siparisver', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset });
          sql.close();
          sql.close();
          sql.close();
        });
      });
    });
  });
};

module.exports.siparisverpost = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log('ad :', req.session.ad);
    if (req.body.Urun) {

      request1.query(
        "INSERT INTO Siparisler(Siparis,MekanAdi,OdemeSekli,Adres,TotalFiyat,UyeAdi)  SELECT '" +
        req.body.Urun +
        "','" +
        req.body.siparisverilenmekanadi +
        "','" +
        req.body.nakitkredi +
        "','" +
        req.body.Aciklamaİki +
        "','" +
        req.body.totalfiyat +
        "','" +
        req.body.ad +
        "'",

        function (err, data) {
          if (err) {
            console.log(err);
          }
        }
      );
    }

    if (err) {
      console.log(err);
    }
    res.send('Siparişiniz Başarıyla Alınmıştır Sayın :    ' + req.session.ad);
  });
};
// SİPARİŞ ONAYLAMA

module.exports.siparisionayla = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();
    var request4 = new sql.Request();


    request4.query("select * from Siparisler where MekanAdi  ='" + req.params.MekanAdi + "' and Durum='Beklemede'", function (err, verisonucu4) {
      request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {
        request2.query("select Id,Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='İcecek'", function (
          err,
          verisonucu
        ) {
          request3.query("select Id,Ad,Fiyat,Tur,Kategori,Servis from Menu where MekanAdi='" + req.params.MekanAdi + "' and Tur='Yiyecek'", function (
            err,
            verisonucu3
          ) {
            if (err) {
              console.log(err);
            }

            console.log('', req.params.MekanAdi);

            res.render('siparisionayla', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset, veri4: verisonucu4.recordset });
            sql.close();
            sql.close();
          });
        });
      });
    });
  });
};

module.exports.denemesiparisonay = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();
    var request4 = new sql.Request();


    request4.query("select * from Siparisler where MekanAdi  ='" + req.params.MekanAdi + "' and Durum='Beklemede'", function (err, verisonucu4) {
      request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {

        if (err) {
          console.log(err);
        }

        console.log('', req.params.MekanAdi);

        res.render('siparisonayla', { veri2: verisonucu2.recordset, veri4: verisonucu4.recordset });
        sql.close();
        sql.close();
      });
    });
  });

};

// request3.query('delete from  Siparisler where id= ' + req.body.delete, function (err, verisonucu3) {



module.exports.sil = function (req, res) {

  // Üye Silme Admin Paneli
  sql.connect(webconfig, function (err) {
    var request1 = new sql.Request();
    var request2 = new sql.Request();

    // console.log(req.body);
    console.log(req.body.delete);
    request2.query("update Siparisler set Durum='Reddedildi'   where id= '" + req.body.siparisreddet + "'", function (err, verisonucu3) {

      request1.query("update Siparisler set Durum='Onaylandi' where id='" + req.body.deletex + "'", function (err, verisonucu) {


        res.redirect('/mekanSahibiProfili/siparisonayla/' + req.params.MekanAdi);
        sql.close();

      });
    });
  });
};

module.exports.balik = function (req, res) {
  // balık kategorisi
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Balik'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }
        res.render('balik', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};
module.exports.pizza = function (req, res) {
  // Pizza kategorisi
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Pizza'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }
        res.render('pizza', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};

module.exports.doner = function (req, res) {
  // Döner kategorisi
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Doner'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }
        res.render('doner', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};
module.exports.pide = function (req, res) {
  // Pide kategorisi
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Pide'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }
        res.render('pide', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};

module.exports.fastfood = function (req, res) {
  // Fast Food kategorisi
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    request1.query("select * from Uye where KullaniciAdi='" + req.session.ad + "'", function (err, verisonucu2) {
      request2.query("select * from Mekan where Kategori = 'Fast Food'", function (err, verisonucu) {
        if (err) {
          console.log(err);
        }
        res.render('fastfood', { veri2: verisonucu2.recordset, veri: verisonucu.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};

module.exports.sendmessage = function (req, res) {
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      // Menü İnsert
      "INSERT INTO tbl_Message(GelenMesaj,GonderenUye,MekanAdi)  VALUES('" + req.body.sikayet + "','" + req.session.ad + "','" + req.body.sikayetedilenmekanadi + "')",
      function (err, dataresult) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('mekanBilgileri/' + req.body.sikayetedilenmekanadi);
          sql.close();
        }
      }
    );
  });
};

module.exports.restaurantmesaj = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request(); // yeni sql bağlantısı açarak 2 sorguyu kullan.
    var request3 = new sql.Request();
    var request4 = new sql.Request();


    request4.query("select * from tbl_Message where MekanAdi  ='" + req.params.MekanAdi + "' and Durum='Okunmadı'", function (err, verisonucu4) {
      request1.query("select * from Mekan where MekanAdi='" + req.params.MekanAdi + "'", function (err, verisonucu2) {

        if (err) {
          console.log(err);
        }

        console.log('', req.params.MekanAdi);

        res.render('restaurantgelenkutusu', { veri2: verisonucu2.recordset, veri4: verisonucu4.recordset });
        sql.close();
        sql.close();
      });
    });
  });
};


module.exports.messagerestaurant = function (req, res) {

  // Restaurant Mesaj Atma
  sql.connect(webconfig, function (err) {
    var request1 = new sql.Request();
    var request2 = new sql.Request();

    request2.query("INSERT INTO KullanıcıGelenKutusu(Mesaj,GonderenMekan,Restaurantcevap)  VALUES('" + req.body.mekanadi_message + "','" + req.params.MekanAdi + "','" + req.body.message_ + "')",
      function (err, verisonucu3) {
        request1.query("update tbl_Message set Durum='" + req.body.message_ + "' where Id='" + req.body.deletex + "'", function (err, verisonucu) {


          res.redirect('/restaurantgelenkutusu/' + req.params.MekanAdi);
          sql.close();

        });
      });
  });
};

module.exports.kullanicimesajkutusu = function (req, res) {
  // Profilim
  sql.connect(webconfig, function (err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    var request2 = new sql.Request();
    var request3 = new sql.Request();




    request3.query("select * from tbl_Message where Gonderenuye  ='" + req.params.KullaniciAdi + "' and Durum IS NOT NULL", function (err, verisonucu3) {
      request2.query("select * from Siparisler where UyeAdi  ='" + req.params.KullaniciAdi + "' and Durum='Beklemede'", function (err, verisonucu2) {
        request1.query("select * from Uye where KullaniciAdi  ='" + req.session.ad + "'", function (err, verisonucu) {

          if (err) {
            console.log(err);
          }

          console.log('', req.session.ad);

          res.render('kullanicigelenkutusu', { veri: verisonucu.recordset, veri2: verisonucu2.recordset, veri3: verisonucu3.recordset });
          sql.close();
        });
      });
    });
  });

};