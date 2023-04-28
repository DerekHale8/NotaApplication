const jwt = require('jsonwebtoken');
const {secret} = require("../config.js")
const sqlite = require('sqlite3').verbose();

function dbConnect(){
    db = new sqlite.Database('./db/NotaApplication', sqlite.OPEN_READWRITE, (err) => {
        if (err) {
            console.log(`ERROR:dbConnect:\n${err.message}`)
        }else{
            console.log('Connected to the users database.');
        }
        
      });
    }

function dbAddUser(username,password){
    db.run("INSERT INTO users(username,password) VALUES (?,?)", 
    [username,password],
    function(err,row){
        if(err){
        console.log(`ERROR:DBAddUser:\n${err.message}`)
        //console.log(err.message)
        }else{
        console.log("Added ${username} to User table!");
        }
        
    });
}

function dbAddNote(token,text,date){
    const decodedData = jwt.verify(token, secret)
    const userId=decodedData.id

    db.run("INSERT INTO notes(id_user,text,date) VALUES (?,?,?)", 
    [userId,text,date],
    function(err,row){
        if(err){
        console.log(`ERROR:DBAddNote:\n${err.message}`)
        //console.log(err.message)
        }else{
        console.log(`Added user ${userId} note to User table!`);
        }
        
    });
}


function dbUpdateNoteById(token,idNote,text){
    const decodedData = jwt.verify(token, secret)
    const idUser=decodedData.id
    db.run("UPDATE notes SET text=? WHERE id_user = ? and id = ?", 
    [text,idUser,idNote],
    function(err,row){
        if(err){
        console.log(`ERROR:DBAddUser:\n${err.message}`)
        //console.log(err.message)
        }else{
        console.log(`Updated NOTE:${idNote} USER:${idUser} table!`);
        }
        
    });
}

function dbDeleteNoteById(token,idNote){
    const decodedData = jwt.verify(token, secret)
    const idUser=decodedData.id
    db.run("DELETE FROM notes WHERE id_user = ? and id = ?", 
    [idUser,idNote],
    function(err,row){
        if(err){
        console.log(`ERROR:DBAddUser:\n${err.message}`)
        //console.log(err.message)
        }else{
        console.log(`Deleted NOTE:${idNote} USER:${idUser} from notes table!`);
        }
        
    });
}


function dbGetByUsername(username){

    return new Promise((resolve, reject) => {
        db.all( "SELECT id,username,password FROM users WHERE username = ? ", 
        [username],
        function(err,row){
            if(err){
                console.log(err.message)
                reject(err)
            }else{
                resolve(row)
            }
            
        })

      
  });
  
}

function dbGetNotesByUserId(token){
    let username;
    const decodedData = jwt.verify(token, secret)
        userId=decodedData.id
        //console.log(`ID:${JSON.stringify(decodedData)}`)
        console.log(`ID:${userId}`)

        return new Promise((resolve, reject) => {
            db.all( "SELECT id,text,date FROM notes WHERE id_user = ? ", 
            [userId],
            function(err,row){
                if(err){
                    console.log(err.message)
                    reject(err)
                }else{
                    resolve(row)
                }
                
            })
    
          
      });
      


//     return new Promise((resolve, reject) => {
//         db.all( "SELECT id,text,date FROM notes WHERE id_user = ? ", 
//         [userId],
//         function(err,row){
//             if(err){
//                 console.log(err.message)
//                 reject(err)
//             }else{
//                 resolve(row)
//             }
            
//         })

      
//   });
  
}



function dbGetNoteByNoteId(token,idNote){
    let username;
    const decodedData = jwt.verify(token, secret)
    userId=decodedData.id
    //console.log(`ID:${JSON.stringify(decodedData)}`)
    console.log(`ID:${userId}`)
    
    return new Promise((resolve, reject) => {
        db.all( "SELECT id,text,date FROM notes WHERE id_user = ? and id = ?", 
        [userId,idNote],
        function(err,row){
            if(err){
                console.log(err.message)
                reject(err)
            }else{
                resolve(row)
            }
            
        })
    
        
    });

}

module.exports={
    dbConnect,
    dbAddUser,
    dbAddNote,
    dbUpdateNoteById,
    dbDeleteNoteById,
    dbGetByUsername,
    dbGetNotesByUserId,
    dbGetNoteByNoteId
};
