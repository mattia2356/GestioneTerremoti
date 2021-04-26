$(document).ready(function () 
{
    $('.btn').click(function () 
    {
        //gestione tabella
        if ($(this).text().indexOf("MOSTRA TABELLA") >= 0) 
        {
            //creazione variabili
            var oggi = new Date();
            var giornoIn; var giornoFin; var mese; var anno; var ultimoGiorno;
            var s;

            //mese
            switch (s) 
            {
                case 'Gennaio':
                    mese = 1;
                    ultimoGiorno = 31;
                    break;
                case 'Febbraio': mese = 2;
                    ultimoGiorno = 28;
                    break;
                case 'Marzo': mese = 3;
                    ultimoGiorno = 31;
                    break;
                case 'Aprile': mese = 4;
                    ultimoGiorno = 30;
                    break;
                case 'Maggio': mese = 5;
                    ultimoGiorno = 31;
                    break;
                case 'Giugno': mese = 6;
                    ultimoGiorno = 30;
                    break;
                case 'Luglio': mese = 7;
                    ultimoGiorno = 31;
                    break;
                case 'Agosto': mese = 8;
                    ultimoGiorno = 31;
                    break;
                case 'Settembre': mese = 9;
                    ultimoGiorno = 30;
                    break;
                case 'Ottobre': mese = 10;
                    ultimoGiorno = 31;
                    break;
                case 'Novembre': mese = 11;
                    ultimoGiorno = 30;
                    break;
                case 'Dicembre': mese = 12;
                    ultimoGiorno = 31;
                    break;
                default:
                    mese = oggi.getMonth();
                    ultimoGiorno = oggi.getDate();
                    break;
            }
            
            
            if ($('#selFine').val() < ultimoGiorno) 
            {
                
                if ($('#selInizio').val() <= $('#selFine').val()) 
                {
                    
                    giornoIn = $('#selInizio').val();
                    giornoFin = $('#selFine').val();
                    ultimoGiorno = $('#selFine').val();
                } 
            }
            else 
            {
                if ($('#selInizio').val() <= ultimoGiorno) 
                {
                    giornoIn = $('#selInizio').val();
                    giornoFin = ultimoGiorno;
                } 
                else 
                {
                    giornoIn = ultimoGiorno;
                    giornoFin = ultimoGiorno;
                }
            }

            
            anno = $('#selAnno').val();

            
            var inizio = anno + "-" + mese + "-" + giornoIn;
            var fine = anno + "-" + mese + "-" + giornoFin;

            //url
            url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + inizio + "&endtime=" + fine;
            
            $.ajax({
                url: url,
            }).then(function (data) 
            {
                $('#totale').empty();
                $('#contenuto').empty();
                var nDati;
                 var s = "<table border='4' bgcolor='#e6e6ff'>";
                 s += '<tr><td>Luogo</td><td>latitudine</td><td>longitudine</td><td>magnitudo</td></tr>';
                 nDati = 0;
         
                 for (i = 0; i < data.features.length; i++) 
                 {
                    if (parseFloat(data.features[i].properties.mag) > $('#selMin').val() && parseFloat(data.features[i].properties.mag) < $('#selMax').val())
                    {
                        
                        if(data.features[i].properties.mag > 2 && data.features[i].properties.mag < 3)
                        {
                            s += '<tr><td>' + data.features[i].properties.place + '</td><td>' + data.features[i].geometry.coordinates[0] + '</td><td>' + data.features[i].geometry.coordinates[1] + '</td><td bgcolor="#fca903">' + data.features[i].properties.mag + '</td></tr>';
                        }
                        else if(data.features[i].properties.mag > 3)
                        {
                            s += '<tr><td>' + data.features[i].properties.place + '</td><td>' + data.features[i].geometry.coordinates[0] + '</td><td>' + data.features[i].geometry.coordinates[1] + '</td><td bgcolor="#ff8080">' + data.features[i].properties.mag + '</td></tr>';
                        }
                        else 
                        {
                            s += '<tr><td>' + data.features[i].properties.place + '</td><td>' + data.features[i].geometry.coordinates[0] + '</td><td>' + data.features[i].geometry.coordinates[1] + '</td><td bgcolor="#99e600">' + data.features[i].properties.mag + '</td></tr>';
                        }
                        nDati++;
                    }
                 }
                 s += '</table>';
                $('#totale').text("Totale Terremoti: ").append(nDati);
                $('#contenuto').append(s);
            });
        } 

        //sezione mappa
        else if ($(this).text().indexOf("MOSTRA MAPPA") >= 0) 
        {
            var oggi = new Date();
            var url = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + oggi.getFullYear() + "-" + oggi.getMonth() + "-" + (oggi.getDate() - 5) + "&endtime=" + oggi.getFullYear() + "-" + oggi.getMonth() + "-" + oggi.getDate();

            $.ajax({
                url: url,
            }).then(function (data) 
            {
                $('#totale').empty();
                var magnitudo = 0.0;
                var stato = " ";

                magnitudo = $('#magMappa').val();
                if ($('#statoMappa').val().indexOf("")>=0) 
                {
                    stato = $('#statoMappa').val();
                }

                var nDati = 0, i = 0;
                var terremoti = [];

                var i=0;
                var num=0;
                //visualizzare ultimi 10 terremoti
                while(i<data.features.length && num<=10)
                {
                    if (parseFloat(data.features[i].properties.mag) > magnitudo && data.features[i].properties.place.indexOf(stato)>=0) 
                    {
                        terremoti.push(data.features[i].geometry.coordinates[0]);
                        terremoti.push(data.features[i].geometry.coordinates[1]);
                        terremoti.push(data.features[i].properties.mag);
                        nDati++;
                        num++;
                    }
                    i++;
                }
                $('#totale').text("TOTALE TERREMOTI: ").append(nDati);
                
                //mappa
                var frame = document.getElementById('mappa');
                frame.contentWindow.postMessage(terremoti, '*');
            });
        }
    });
});
