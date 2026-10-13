const express = require('express') ;

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Bonjour, je suis l'API du blog" });
});

const articles = [
  { id: 1, title: 'Bienvenue sur le blog', author: 'Admin' },
  { id: 2, title: 'Mon premier serveur Express', author: 'Aya' },
  { id: 3, title: 'Tester une API avec Postman', author: 'Aya' }
];
const users = [
  { id: 1, name: 'Mahmoud', email: 'mahmoud@gmail.com' },
  { id: 2, name: 'Salma', email: 'salma@gmail.com' },
  { id: 3, name: 'Rami', email: 'rami@gmail.com' }
];

app.get('/about', (req, res) => {
  res.json({
    appName: 'Mon App Express',
    author: 'Chadi',
    version: '1.0.0'
  });
});

app.get('/api/users', (req, res) => {
  res.json(users);
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
  const { author } = req.query;  

  let resultat = articles;
  if (author) {                  
    resultat = articles.filter(a => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
});

app.get('/api/articles', (req, res) => {
  res.json({ total: articles.length, articles: articles });
});

app.get('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: `Article non trouvé `});
  }
  res.json(article);
});

let prochainId = 4;
app.post('/api/articles', (req , res) => {
    const { title , author } = req. body ;
    if (!title || !author ) {
        return res.status(400).json ({ error : "Le titre et l'auteur sont obligatoires " }) ;
    }
    const nouvelArticle = { id: prochainId , title : title , author : author };
    prochainId = prochainId + 1;
    articles.push( nouvelArticle ) ;

    res.status(201).json({ message : 'Article créé', article : nouvelArticle }) ;
}) ;

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
