const express = require('express') ;

const articleRoutes = require('./routes/articleRoutes') ;

const userRoutes = require('./routes/userRoutes') ;

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/articles', articleRoutes) ;
app.use('/api/users', userRoutes) ;

app.get('/', (req, res) => {
  res.json({ message: " API du Blog - Serveur Modulaire Opé rationnel ( SoC)" });
});

app.listen(PORT , () => {
    console.log(`Serveur modulaire en écoute sur http://localhost:${PORT}`) ;
});

/*


app.get('/about', (req, res) => {
  res.json({
    appName: 'Mon App Express',
    author: 'Chadi',
    version: '1.0.0'
  });
});

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

app.get('/api/articles', (req, res) => {
  res.json({ total: articles.length, articles: articles });
});



app.post('/contact', (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  res.status(200).json({ message: 'Merci, votre message a bien été reçu' });
});

app.listen(PORT , () => {
    console.log(`Serveur disponible sur http://localhost:${PORT}`) ;
}) ;

*/
