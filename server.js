const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

const createPath = (page) => path.resolve(__dirname, 'templates', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

app.use(express.static('css'));
app.use(express.static('scripts'));

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.get('/edit', (req, res) => {
    const title = 'Home';
    const note = {
      text : ""
    };
    res.render(createPath('edit'), { title , note});
  });

// app.get('/contacts', (req, res) => {
//   const title = 'Contacts';
//   const contacts = [
//     { name: 'YouTube', link: 'http://youtube.com/YauhenKavalchuk' },
//     { name: 'Twitter', link: 'http://github.com/YauhenKavalchuk' },
//     { name: 'GitHub', link: 'http://twitter.com/YauhenKavalchuk' },
//   ];
//   res.render(createPath('contacts'), { contacts, title });
// });

app.get('/notes/:id', (req, res) => {
  const title = 'Notes';
  const note = {
    id: '1', 
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
    date: '05.05.2021'
  };
  res.render(createPath('edit'), { title, note });
});

app.get('/notes', (req, res) => {
  const title = 'Notes';
  const notes = [
    {
      id: '1', 
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
      date: '05.05.2021'
    },
    {
      id: '1', 
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
      date: '05.05.2021'
    },
    
  ];
  res.render(createPath('notes'), { title, notes });
});

// app.post('/add-post', (req, res) => {
//   const { title, author, text } = req.body;
//   const post = {
//     id: new Date(),
//     date: (new Date()).toLocaleDateString(),
//     title,
//     author,
//     text,
//   };
//   res.render(createPath('post'), { post, title });
// });

// app.get('/add-post', (req, res) => {
//   const title = 'Add Post';
//   res.render(createPath('add-post'), { title });
// });

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});