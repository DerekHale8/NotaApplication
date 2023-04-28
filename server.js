const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const db =require('./db/controller.js')

const app = express();


app.set('view engine', 'ejs');

const PORT = 3000;





const createPath = (page) => path.resolve(__dirname, 'templates', `${page}.ejs`);

app.listen(PORT
  , (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.use(express.static('css'));
app.use(express.static('scripts'));

db.dbConnect();

app.use('/auth',authRouter)

app.get('/', authMiddleware, (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

// app.get('/auth', (req, res) => {
//   const title = 'Authorization';
//   res.render(createPath('auth'), { title });
// });


app.get('/edit',authMiddleware, (req, res) => {
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

app.get('/notes/:id', authMiddleware,(req, res) => {
  //console.log(req)
  const id=req.params.id
  const title = 'Notes';
  const token=req.cookies.jwt;
  db.dbGetNoteByNoteId(token,id).then((note)=>{
    console.log(`NOTE:${JSON.stringify(note[0])}`)
    note=note[0]
    res.render(createPath('edit'), { title, note });
  })
  // const note = {
  //   id: '1', 
  //   text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
  //   date: '05.05.2021'
  // };
  // res.render(createPath('edit'), { title, note });
});

app.get('/notes',authMiddleware, (req, res) => {
  //console.log(`GET:${req.cookies.jwt}`);
  const title = 'Notes';
  const notes2=db.dbGetNotesByUserId(req.cookies.jwt).then((notes)=>{
    //console.log(`NOTES:${notes}`)
    res.render(createPath('notes'), { title, notes });
  })
  //console.log(`NOTES:${notes2}`)
  // const notes = [
  //   {
  //     id: '1', 
  //     text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
  //     date: '05.05.2021'
  //   },
  //   {
  //     id: '1', 
  //     text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente quidem provident, dolores, vero laboriosam nemo mollitia impedit unde fugit sint eveniet, minima odio ipsum sed recusandae aut iste aspernatur dolorem.',
  //     date: '05.05.2021'
  //   },
    
  // ];
  // res.render(createPath('notes'), { title, notes });
});

app.post('/save', (req, res) => {
  // Get the content from the request body
  console.log(req.body)
  const content = req.body.content;
  const token=req.cookies.jwt;
  const idNote=req.body.idNote;

  const date = new Date();
  let currentDay= String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth()+1).padStart(2,"0");
  let currentYear = date.getFullYear();
  let currentDate = `${currentDay}.${currentMonth}.${currentYear}`;
  if(content===''){
    db.dbDeleteNoteById(token,idNote)
  }else if(idNote===''){
    db.dbAddNote(token,content,currentDate)
  }else{
    db.dbUpdateNoteById(token,idNote,content)
  }
  //db.dbAddNote(token,content,currentDate)
  //db.dbUpdateNoteById(token,idNote,content)

  // // Save the content to a file
  // fs.writeFile('content.txt', content, (err) => {
  //   if (err) {
  //     // If an error occurs, send an error response
  //     res.status(500).json({ error: 'Failed to save content' });
  //   } else {
  //     // If content is saved successfully, send a success response
  //     res.status(200).json({ message: 'Content saved successfully' });
  //   }
  // });
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

// app.use((req, res) => {
//   const title = 'Error Page';
//   res
//     .status(404)
//     .render(createPath('error'), { title });
// });


module.exports=createPath

