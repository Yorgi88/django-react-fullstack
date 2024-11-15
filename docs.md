we installed all in the req.txt file

then we create a new django project, to do that, django-admin startproject backend
now cd into the backend dir and make an app... so we can write our own custom views and custom code

type-- python manage.py startapp api

next you go into the backend, go to the settings.py , => now pay attention to the code
don't miss a thing

from datetime import timedelta
from dotenv import load_dotenv
import os
import this all

now say load_dotenv() this loads a file, so we use as credentials for our databse
ALLOWED_HOSTS = ("*") for avoiding errors when hosting the app

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

<!-- for this we need them when workin on the jwt tokens 
we see that access token expires in 30 mins
refresh token expires in one day
-->

next , move to installed apps and add a thing or two
add, api, the name of the app(dir), you created
    "api",
    "rest_framework",
    "corsheaders",

qdd this to the middleware part:  "corsheaders.middleware.CorsMiddleware",

now go below, to the very down part and add:
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWS_CREDENTIALS = True



_______________________________
explaining a jwt token

A json web token acts as authentication everytime we access a websites
note that the frontend is separate from our backend, so anytime we make req to our backend
the backend needs to know who we are and what we have permissions to do

we include a token along with our request to the backend
the backend then decodes it and understands it

when a frontend sends a req to the backend, a response is then received from the backend

credentials are passed from the frontend to the backend

the backend then responses with a refresh token and access token
the access token is what we use with all of our req
the refresh token is used to refresh the access token

the frontend then stores the access and refresh token so it can continue to use them for future reqs


now wen access token gets expired, it submits the refresh token to a specific route on the backend
and if valid, a new access token is sent back to us


now lets figure out a way to create a new user, we can store the username and pass for them to access the access token

in the api dir you created, create a serializers.py file

from django.contrib.auth.models import User  #to create a new 
from rest_framework import serializers

django uses an ORM it maps python obj to the corresponding code that needs to be executed to make a change in the database

remember we use json to communicate within our full stack app
the serializer takes python obj and convert it to json data that can be used in the communication with other apps


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  #used to repr s user
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only" : True}}  #we want to accept password when creating a new suer
                                                            #but we don't wanna return the password when are giving info about the user
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    the fields are checked, if valid, it passed through the create function
    it will take as validated_data



    next, go to views.py,  write a simple view that allows us to create a new user
    yes, we have the serializer, but we still need the view or the path to make the USER

    import somethings

    from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# Create your views here.



class CreateUserView(generics.CreateAPIView):
    """ generics helps us to auto create a new user or new objs for us"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    """ this tells what kind of data we need to accept to make a new user"""
    permission_classes = [AllowAny]
    """ allow any one to use the view to create a new user"""




next move to the urls.py in the second backend dir
# we need to config all of our different urls so we can link em up and go to the correct route
from django.contrib import admin
from django.urls import path
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
]
<!-- we are gonna set or should i say write a few paths here that will be needed to connect
to our frontend -->

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth', include('rest_frameworks.urls'))
]


since we done, we need to make migrations
so go to the terminal and type python manage.py makemigrations

once you've typed that you need to actually migrate
so type "python manage.py migrate"


note that whenever you want to connect the new database, u need to use the same migrate steps

now run python manage.py runserver to run it

then you see a 404 error and that's because we haven't defined all these routes

so we define em, so on the browser, type api/user/register/ so we have an error still

so we go to the views.py and change it "serializer_class = UserSerializer"

now it will display Create User output, so try inputting a simple username and pass to get started

username => moses
pass => 1234
then click post

So we've created a user 
Now in the browser type in api/token to get our access token, you'd see Token Obtain Pair

so type in the username and pass to obtain the access token
you see this:
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMDkwODUxNiwiaWF0IjoxNzMwODIyMTE2LCJqdGkiOiJkYTI1OTA4MmIyNzQ0MDZjODhkMjc2MWZkZTJjNzhkYyIsInVzZXJfaWQiOjF9.mYtUZZBh5_sVb4rlsa3pEYz7_pWKE58hyMqcX-sqWF0",

    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwODIzOTE2LCJpYXQiOjE3MzA4MjIxMTYsImp0aSI6IjA1ODQ5NDhmNjM2MDQzMmM4ODkzMzgzMDliNWQwOTYwIiwidXNlcl9pZCI6MX0._83ZpFAoT6G-IoHYwHGvr_2jpJ_AFc7fWxmrwZfgzaQ"
}

this is what our frontend will store, and it will use the access token with every req that it sends in order to access the diff protected routes

so go to api/token/refresh/ and paste in the refresh token
it gives us a new access token

ALL seems to be working now

now lets start writing the routes for our authenticated users, so now we now have the ability to authenticate them using this tokens so only these users can create notes, delete notes


so, ctrl +c the server

go to the models.py in the api dir to make for our notes
import the django.contrib...

remember that django uses ORM so we write out the model definition in python then django automatically handle it by converting it into the correct database code
so in the models.py, make a class Note:

then we specify the type of fields we wanna store in this model or should we say data

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return self.title
    

Now lets talk about the author var, specifically the foreign key => the author var specifies who made this note
a foreign key can link something like a user with some data that belongs to that user,
so in this case, one user can have many notes

models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes') => we linking it to the user, on_delete means if we were to delete this user, so all the user's notes will be gone
the related name "notes" tells us the field name we want to put on the user that refs all of its notes

so user.notes() gives us the whole notes details{title, content, etc} that the user has created


Now that we have our model created, we gonna make a serializer for the model, we need to conv into json data

so in the serializers.py import the model there

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {"author": {"read_only" : True}}
        
    in the extra_kwargs we make the author read only, so when a user creates a note, the suer becomes the author, the user auto-becomes the author

    we move into the views.py to make the views for our notes

    class NotesListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # we want to get the user that is authenticated
        #return Note.objects.all()   #to get all the notes
        return Note.objects.filter(author=user)  #notes written by a specific user

    you cannot call this route unless you're authenticated which involves passing a valid jwt token
    also,the filter also means a user can only view the notes written by that user

        def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)

        this function or should i say method, checks the seralizers.py file : it checks if the data entered
        are valid a new note is created, else it gives out error

        we adding the author since we set it to read only, so we have to manually add it ourself


        now in the views.py lets continue and create a class for deleting a note

        class NoteDelete(generics.Destroy....):

        class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    <!-- only authenticated users can make, save, delete note -->

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


now in the app dir, or should i say the api dir, create the urls.py for the views

from django.urls import path
from . import views


urlpatterns = [
    path('notes/', views.NotesListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
]

now go to the base dir's urls.py and import/set the urls of the app

path('api/', include('api.urls'))

now to TEST, you need to make migrations
python manage.py makemigrations


api/user/register/
api/user/token/
api/notes/

when you try this and if it works we're good,
now if we go to the notes/ part you see something like unauthorized
and "auth credentials not provided" don't worry this is good according to the tutor




_________________________________
moving along to create the frontend, phew!
vite js with react was used
cd into the frontend
you need to install axios, react router, jwt-decodes
so type in npm install axios react-router-dom jwt-decode


so go to the frontend dir and create some files
first we deleted the app and index.css files
we cleaned up some codes snippets

then we created three dirs pages, styles, components
we also created two files constants.js, api.js

we also made an environment var file
so on the frontend dir, right click and create a .env file

Now, in the constants.js file write an export
export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';

why we are puttin these here is because we gonna use local storage to store both in our browser and we need a key(export...)  so we can use to access them in our local storage

next we go into api.js
we are going to write an interceptor code using axios
axios is a really clean way of sending network requests back and forth

so axios checks if we have an access token, if we do, it will automatically add it to the request we wanna send

so in the api.js:

import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

now what we are going to do, is get the api

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
what this allows us to do is import anything that's specified inside an environment var file
not sure what that means, but go to the .env file

and specify:
write : VITE_API_URL = "http://localhost:8000"
# url of our backend server


now go back to the api.js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
// all we need to do is specify the path we want to access. We dont need to specify the base url

api.interceptors.request.use(
    (config) => {
        // we gonna accept the config func, and look in our local storage and see if we have access_token
        // if we do, add it as an auth-header to our reqs else, nothing to do
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
)

this is how you pass a jwt access token
you create auth header and it needs to start with Bearer add space, then ${token}

so next add a statement if the if statement does not work
then export default api;


Next, we want to get our token and also protect diff routes on the frontend and back

now in the components dir, create a ProtectedRoutes.jsx
tis repr a wrapper for protectin routes, so if we wrap something in it we need to have an auth-token before we can access the route

so in the ProtectedRoute file: 


function ProtectedRoute({children}) {
    // i think the children means the other sub components that will be wrapped in this ProtectedRoute
    // we need to check if we are authorized, before we allow someone to access this route
    //otherwise we just redirect em and tell em they should log in

    const [isAuthorized, setIsAuthorized] = useState(null);

    const refreshToken = async () => {
        // this refreshes the token for us automatically
    }

    const auth = async () => {
        // this checks if we need to refresh the token or if we are good to go

    }

    if (isAuthorized == null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to={'/login'}/>
    // this means if authorized ? then pass in the sub-comps, else
}

next, go to the auth func in the ProtectedRoute
the idea is look at the access token if there's one, check if its expired or not
if expired, auto refresh the token, and if we cannot refresh, or its expired, user has to login


we started writing out the auth function logic then after, we went to the refreshToken func logic

    const refreshToken = async () => {
        // this refreshes the token for us automatically
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // we send a req to our backend with the refresh token to get a new access token
            const resp = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });  //in our django backend urls.py
            if (resp.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, resp.data.access);
                setIsAuthorized(true);
            }else{
                setIsAuthorized(false);
            }

now i hope u got it

cause next we wanna right a useEffect, so go below the useState code written, [isAuth] of the function ProtectedRoute.jsx
and write the useEffect code

    useEffect(()=>{
        auth().catch(() => setIsAuthorized(false));
    }, [])




PHEW!

next in the pages dir create some files in pages dir(login, register, home, not_found), start with the login.jsx

next go to the app.jsx and write the navs with the use of react router 
import all the files that's in pages in the app.jsx

then write a func for logout:
function Logout() {
  localStorage.clear();
  return <Navigate to={'/login'}/>>
}

then we write one more function
RegisterAndLogout
in this func, we need to clear the localStorage so that we don't end up submitting access tokens to the register route which could bring an error

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>

        <Route path='login' element={<Login/>}/>
         <Route path='/register' element={<RegisterAndLogout/>}/>

         we passed in RegisterAndLogout to avoid access token error
      </Routes>
    </BrowserRouter>
     
    </>
  )
}



NEXT we need to make a form to collect username or password and submit it to the either the register route or login route

so in the components.jsx make a Form.jsx

import couple of things:
import React from 'react'
import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'

now we will write a func which will take 2 props, route , method
the route is the route we wanna go to, when we submit the form, could be the token route or the register route
the method tells us if we are registering or loggin in

next create the state to hold the username and pass

const Form = ({route, method}) => {
    const [username, setUsername] = useState('');
    // state for storin the username and pass that the user is typing in
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    // to keep track if its loading or not

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    const name = method === 'login' ? 'Login' : 'Register'; 
    we will look at the method that is passed as prop, so if the meth == login we render the login comp, else, render the register
    i think



  return (
    <form action="" onSubmit={handleSubmit} className='form-container'>
        <h1>
            {name}
        </h1>

                <input type="text"  className='form-input' 
        value={username} 
        onChange={(e)=> setUsername(e.target.value)} 
        placeholder='username'/>

        <input type="password"  className='form-input' 
        value={password} 
        onChange={(e)=> setPassword(e.target.value)} 
        placeholder='password'/>

        <button className='form-button' type='submit'>{name}</button>
    </form>
  )
}

now lets write handle submit method
we gonna use the api that we wrote, its gonna send a post req to whatever the route is
pass in the username and pass, wait till you get a resp back

write the control logic for it
read and try to understand the logic


KEEP GOING, THEY MAY CALL YOU A PHONY. BUT KEEP GOING,

I BELIEVE IN YOU


lets apply the styling
we've done it already


nOW WE have form.jsx, we are going to use that from the login and from the register comp

we started with the Register.jsx

import React from 'react'
//import Form.jsx here

import Form from '../components/Form';
const Register = () => {
  return (
    <div><Form/></div>
    we returned the Form comp, so we gonna pass 2 props to it, 
    when we are registering, we wanna go to the /api/user/register/ route
    method = 'register'
  )
}

export default Register;


import React from 'react'
//import Form.jsx here

import Form from '../components/Form';
const Login = () => {
  return (
    <div>
        <Form route='/api/token/' method='login'/>
    </div>
  )
}

export default Login;

ok we've run the npm run dev to test, and it seems to work from the frontend aspect
now lets check if the tokens are working, so lets run the backend code also


now run the python manage.py runserver on terminal, don't forget to split the terminal


now in the terminal for the backend, copy the server route http//s/s/...8000 that one sha

then in the env file on the frontend, paste it in, remove the trailing slash

phew!, seems to be working, now lets build the notes section


so lets write in the homepage, go to the Home.jsx

and build, we wanna be able to view notes, create new notes, delete notes

so lets start importing a few things


import React from 'react';
import { useState, useEffect } from 'react';
import api from '../api';


const Home = () => {
    // keep track with all of the notes that we have grabbed from the server
    // we send an authorised req to get the notes we've created
    const [notes, setNotes] = useState([]);

    // we then need some state for the form that will allow us to create a new note
    const [content, setContent] = useState('');

    const [title, setTitle] = useState('');

    // now lets write some func that will send reqs to the server
    look down for the funcs

    we write a function getNotes to get all the note the particlular user has written
    to access, remember we have written the paths in our backend, so lets write it in our frontend to access those routes and perfrom the particular func
    const getNote = () => {

    }

  return (
    <div>

    </div>
  )
}

export default Home;


    const getNotes = () => {
        api.get('/api/notes/')
        .then((res) => res.data)
        // This first .then receives the entire response object (usually includes headers, status, and data).
        // res.data extracts just the data portion, which likely contains an array of note objects (e.g., titles, content).
        
        .then((data)=> {setNotes(data); console.log(data);

        This second .then takes the extracted data (the notes) and does two things:
Sets the notes state: setNotes(data); stores the notes in the notes state using setNotes. This lets the app display the list of notes wherever needed.
Logs the data: console.log(data); prints the notes to the console, useful for debugging and confirming that the data was fetched correctly.
        })
        // this will give all the notes the user has written
        // go to the urls.py in the base dir in the backend

    }

    now lets see if it these endpoints would work

to test the getNotes func use a useEffect
useEffect(() => {
    getNotes();
}, [])

you would see like an array in the console when you run it
this is good sign we communicating with backend wella



now lets have a way to delete notes, so create a function for deleting notes
so we create deleteNote
    const deleteNote = (id) => {
      api.delete('/api/notes/delete/${id}/')
      .then((res)=> {
        if (res.status === 200) {
          alert('Note deleted')
        }else{
          alert('fail to delete note')
        }
      }).catch((error)=> alert(error))
      // the idea is after deleting a note, we should display whatever notes left on the screen
      //not the most optimal way though, using [] is better
      getNotes();
    };


Now the last function is to createNote, so, write the func in the home.jsx
    const createNote = (e) => {
      // since it will come from the form, we need e.preventdefault
      e.preventDefault();
      api.post('/api/notes/', {content, title})
      .then((res)=> {
        if (res.status === 201) {
          alert('Note created')
        }else{
          alert('Failed to create note')
        }
      }).catch((error)=> alert(error));
      getNotes();
      // making a post req to the django backend and we also pass in the content, state and title state in along


      we used Tim's own code for github in tis createNote func. For some reason our own code did't work
      oh it worked just that you should change the 200 to 201
      for the delete section, the res.status is 204 not 200
      201 means new resource created
    }
    

now lets write the html
put in the onSubmit event, in the form and passin the createNote

    <div>

   

    <div>
        {/* write a structure for displaying the note */}
        <h2>Notes</h2>
    </div>

    <h2>Create a note</h2>
    <form action="" onSubmit={createNote}></form>
      <label htmlFor="title">Title</label>
      <br />
      <input type="text" id='title' name='title' required onChange={(e)=> setTitle(e.target.value)}
      value={title} />

     <label htmlFor="content">content</label>
     <textarea name="content" id="content" required value={content} onChange={(e)=> setContent(e.target.value)}></textarea>
     <br />

     <input type="submit" value='Submit' />
    </div>

    the inner div Notes div
    this displays all of the notes that are in

    the other part creates a note, when we submit the form its gonna call the createNote func
    and also gonna pass the title and the content

wen we created the note, it didn't update right away, so fix it by putting the getNote() in the .then block


next create a Note.jsx in the components dir
we'll use it to render all of our notes easily

Now that we have our Note.jsx so we go back to our Home.jsx and use it there we pass in two props
note, onDelete, so in the Home.jsx
<div>Notes</div> section render it there


we changed the deleteNote func details, its supposed to use a backtick ``


phew, lets now style it, oh! don't forget the loading_indicator.css
we'll add it to the login aspect, i think register aspect too

so go to the components dir and create a LoadingIndicator.jsx

import '../styles/loading-indicator.css';

import React from 'react'

const LoadingIndicator = () => {
  return (
    <div className='loader-container'>
        <div className='loader'>

        </div>
    </div>
  )
}

export default LoadingIndicator;

so we import it in the Form.jsx







Moving to deployment--hoorah!
there we done, Now we deploy it , we using choreo
we start with the database first, so in chrome, go to choreo.dev

create an account, we used akinmade220

after creating an account, 
you'd see the homepage.
Go to the dependencies tab on the left side
then click on databases
select create +
then select postgreSQL
you'd need a service name, we named ours db
click next
then you select region for hosting, u can only have one option since we are using the free tier
for region we picked US and digitalocean
now since its a free tier, the db will go off every hour, but you can come back and power it normally

so we would copy all the details, host, status, port etc
and set it up in an env file in our backend

so go to the backend dir, the very first backend dir, not the one you have to cd into
so create a new file and name it .env 
now start setting up, in the env file

DB_HOST = 
DB_PORT = 
DB_USER = 
DB_NAME = 
DB_PASSWORD = 

in in the choreo website copy the values and paste accordingly, in str format
now that we are done creating the database, we want to connect to it from django

so go to the backend dir, settings.py file and make some configs
in the settings.py go to the databases section
in the "ENGINE" section change ot to 'ENGINE': 'django.db.backends.postgresql',
now for the NAME section use os to target the env var: 'NAME': os.getenv("DB_NAME"),

why this works is because at the start of this project we loaded in our env file load_dotenv()
if you remember

Now keep adding more params in the DATABASES section in the settings.py file

THEN AFTER type in python manage.py migrate wait for it to migrate
then run the server, using runserver command

and the react app too, now we need to make new users since we are using a new db 
so in the urls field in chrome to to the /register
then register as a new user
then login and boom! 

NOW LETS DEPLOY backend, we'll need git repo
so create a gitignore file in the outer django-react-with-tim dir
.gitignore

the .gitignore file is there in the outer file because because we are going ignore our venv that is in the very outer dir, so in this gitignore file write venv/

then, go to the frontend's gitignore file and add the .env in the file which means to ignore the .env file that's in the frontend dir go to the .gitignore and write .env below, this targets the .env in the frontend dir


next, go to the the outer backend dir, not the inner , create a .gitignore file
then write  .env
           db.sqlite3

then we need to make a few deployment related files inside our directory
so in the outer backend dir, make a .choreo folder not a file, a folder

and inside the .choreo folder, create a endpoints.yaml file => we wanna specify the endpoints we wanna deploy
and we want to expose the backend:
in the yaml file write : 

version: 0.1

endpoints: 
  - name: "REST API"  => since we using RESTFUL apis
    port: 8000  => django port since we deploying the 
    type: REST
    networkVisibility: Public  => means anyone will be able to view this, u also could write project, organization
    context: /      => base path of the api we wanna expose, so in this case, we wanna expose all we we just use the forward slash


next in the outer backend dir we will also create a file called Procfile
this file specifies the command to start executing our application
web: python manage.py runserver 0.0.0.0:8000 => type this in the procfile

the 0.0.0.0 means run on any origin or any ip address


Now all we have to do is add this all to github

so in the terminal django-react-with-tim => git init
then git add .
then git status
then git commit -m "first commit"

then to change the branch from master to main
git branch -M main

next i think we push it to github
create a new repo from your github account we named it django-react-fullstack
then below look for this git remote add origin https://github.com/Yorgi88/django-react-fullstack.git

then ypu PUSH => git push -u origin main

so in your github, refresh the page and you should see the project in its full glory all the env files gone

now lets move to DEPLOYMENT so in the choreo main page, go to the overview tab and click on create project
we gonna call it Django-React-Fullstack
then select service, which will be for our rest API
you'd see component name, just enter backend
select python as your build pack

then connect your repo(github) with the choreo , search for the directory django-react-fullstack in your repo
then the repo is found

then select the backend dir then click next, then select the python 3.10 version

then click create


Now lets create the frontend service this time , instead of service, we'll select web application
in the very tab of where you created the backend project, which is Django-React-Fullstack
look for a create button and start selecting web app since we used react to build our frontend

then again link your choreo with github and select your repo which is django-react-fullstack


then in the project directory tab, select the frontend dir

in the build command tab write => npm install && npm run build

for the build path tab, write  => /dist

for the node version write 18.17

then click create


next we want to build each of the components(backend, frontend) and then deploy

now on the top click on the Django-React-Fullstack then click on the backend

then on the left side pane click the build tab

then click on build latest then wait

then in the left side of the pane click deploy
then click configure and deploy

then on the right side we need to add some env configs

value => 3333
name => AkinmadeMoses454

we skipped the rest and a deploy button appears

so deploy then find the endpoint configurations

ERROR i'm not sure how to do this at all!














































LETS___ TALK ABOUT DJANGO AND EACH OF THE FILES IN IT => referencing the "learn django in twenty mins"
_________________________________________________________________________
you first need to install the BASE app or ADMIN app as i like to call it django-admin startproject backend
the "backend" part could be any name you want 
__init__.py => This special file tells python to treat this the dir like a python package

asgi.py and wsgi.py => this are special files that we don't need to deal with, these allows django to communicate with the web server

settings.py => we go to the settings.py when we need to install different django applications and install plugins, change some of our middleware, and do things like modify database engines

urls.py => allow us to configure diff url routes that we can route

manage.py => acts as a command line tool, allows us to run special commands to do things like make db migrations, run python server and all kind of other things like creating users for django admin panel



Now WE need to talk about django applications,we have something called django project
this apps contain stuffs like database models, different views or routes, templates and all kind of other stuffs
to create an app , cd into the dir , in this case, backend and type python manage.py startapp myapp


now go to the original dir, in this case, backend dir , go to the settings.py, under the installed apps, you add the app name installed, in this case our app is called "api"

in the app, admin.py allows us to to register database models, so we can view them on our admin panel

models.py where we place our database models
tests.py where we can write automated tests cases


in the app, not admin or base , go to the views.py and create the views, then create the routes in the urls.py
in the video, in created a urls.py file in the app dir
now in the base dir he went to the urls.py file and set the app dir's urls
path("app_name", include("app_name.urls"))

so in the apps's urls.py if we set the path name to "home"
it will be app_name/home in the browser


__________________________________
learn django in twenty mins cont'd
MODELS, which deals in databases

django is great cause it deals in ORM's, this means we can write python code, to create database models

to create models, lets create something simple

class TodoItem(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
now what we need is to register the model in the admin panel

go to admin's .py in the app's dir this ins the file where we register different models, so that they can appear inside of our admin panel allowing us to modify and view them

so in the admin.py

import the TodoItem, make it like this:

from .models import TodoItem

admin.site.register(TodoItem)

now make your migrations type in python manage.py makemigrations in the terminal
then type python manage.py migrate


so after, he went to the views.py to render the template that will view the todolist items that we have
from .models import TodoItem  ==> we importin the database
def todos(request):
return render(request, "todos.html", {"todo.......})












