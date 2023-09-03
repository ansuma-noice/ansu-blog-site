const fs=require('fs')
const express=require('express')
const morgan=require('morgan')
const mongoose=require('mongoose')
const Blog = require('./models/blog');

const blogRoutes = require('./routes/blogRoutes');

const mongoDb=require('mongodb');
const { result } = require('lodash');
const { append } = require('express/lib/response');
// express app
const app=express()

// connect to mongoDb
const dbURI='mongodb+srv://ansuman:test123@nodetuts.iggnfhw.mongodb.net/note-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    app.listen(3000);// listen for requests
    // console.log('connet');
})
.catch((err)=>{console.log(err);}) 

// register view engine
app.set('view engine','ejs')


app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
// app.use(morgan('tiny'))
app.use(express.static('public'))

// mongoose and mongo sandbox routes
app.get('/add-blog',(req,res)=>{
    const blog=new Blog({
        title:'new blog2',
        snippet:'about my blog',
        body:'more about my new blog'
    })

    blog.save()
    .then((result)=> res.send(result))
    .catch((err)=> console.log(err))
})
app.get('/all-blogs',(req,res)=>{
    Blog.find()
    .then((result)=>res.send(result))
    .catch((err)=>console.log(err))
})
app.get('/single-blog',(req,res)=>{
    Blog.findById()
    .then((result)=>res.send(result))
    .catch((err)=>console.log(err))

})



app.get('/',(req,res)=>{
    res.redirect('/blogs')
})


app.get('/about',(req,res)=>{
    res.render('about',{title:'About'})
})


// blog routes

// app.get('/blogs',(req,res)=>{
//     Blog.find().sort({createdAt:-1})
//     .then((result)=>{
//          res.render('index',{title:'All Blogs',blogs:result})
//     })
//     .catch((err)=>console.log(err))
// })

// app.post('/blogs',(req,res)=>{

//     const blog = new Blog(req.body);

//   blog.save()
//     .then(result => {
//       res.redirect('/blogs');
//     })
//     .catch(err => {
//       console.log(err);
//     });

// })
// app.get('/blogs/:id', (req, res) => {
//     const id = req.params.id;
//     Blog.findById(id)
//       .then(result => {
//         res.render('details', { blog: result, title: 'Blog Details' });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });

// app.get('/blogs/create',(req,res)=>{
//     res.render('create',{title:'Create Blogs'})
// })

// app.delete('/blogs/:id', (req, res) => {
//     const id = req.params.id;
    
//     Blog.findByIdAndDelete(id)
//       .then(result => {
//         res.json({ redirect: '/blogs' });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   });

app.use('/blogs', blogRoutes);

// 404 page
app.use((req,res)=>{ //use Fn IS USED FOR EVERY REQUEST
    res.status(404).render('404',{title:'404'}) 
})