const express = require('express');
const cors = require('cors');           // Importa cors
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());  // Habilita CORS para todas las rutas

// Tus rutas aquí
app.get('/aduana-operativos', async (req, res) => {
  const url = 'http://anbsw04.aduana.gob.bo:7551/subastas/lotelista.do?parameter=initpage';

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const lotes = [];

    $('#operativos tbody tr').each((i, row) => {
      const columnas = $(row).find('td');
      const lote = {
        idFila: $(row).attr('id'),
        nro: $(columnas[0]).text().trim(),
        clasificacion: $(columnas[1]).text().trim(),
        aduana: $(columnas[2]).text().trim(),
        oferentes: $(columnas[3]).text().trim(),
        fechaSubasta: $(columnas[4]).text().trim()
      };
      lotes.push(lote);
    });

    res.json({ total: lotes.length, lotes });
  } catch (error) {
    res.status(500).json({ error: 'Error al scrapear operativos', detalle: error.message });
  }
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en http://localhost:${PORT}`));
