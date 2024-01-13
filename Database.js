import * as SQLite from 'expo-sqlite';

let db = SQLite.openDatabase('mydatabase.db');

const openDatabaseConnection = () => {
    if (!db || !db._db) {
      db = SQLite.openDatabase('mydatabase.db');
    }
  };

const initDatabase = () => {
    db.transaction(
      (tx) => {
        // Create CategoryList table without ItemsCount
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS CategoryList (Cid INTEGER PRIMARY KEY, Title TEXT)',
          []
        );
  
        // Insert dummy data into CategoryList
        tx.executeSql(
          'INSERT INTO CategoryList (Title) VALUES (?)',
          ['Programming']
        );
        tx.executeSql(
          'INSERT INTO CategoryList (Title) VALUES (?)',
          ['Reading']
        );
  
        // Add more dummy entries
        tx.executeSql(
          'INSERT INTO CategoryList (Title) VALUES (?)',
          ['Exercise']
        );
  
        // Create TodoList table
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS TodoList (Tid INTEGER PRIMARY KEY AUTOINCREMENT, Cid INTEGER, Title TEXT, Description TEXT)',
          []
        );
  
        // Insert dummy data into TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [1, 'Learn Java Basics', 'Complete Java tutorial for beginners']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [1, 'Build a Java Project', 'Create a small Java project']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [1, 'Explore Java Frameworks', 'Learn about popular Java frameworks']
        );
  
        // Add more dummy entries in TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [2, 'Read a Classic Novel', 'Choose and read a classic novel']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [2, 'Explore New Authors', 'Discover books from new authors']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [2, 'Join a Book Club', 'Participate in a local book club']
        );
  
        // Add more dummy entries in TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [3, 'Morning Jog', 'Go for a jog in the morning']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [3, 'Strength Training', 'Include strength training exercises']
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
          [3, 'Yoga Session', 'Practice yoga for flexibility']
        );
      },
      (error) => {
        console.error('Error during database transaction:', error);
      }
    );

  };


  

const closeDatabase = () => {
  db._db.close();
};

const getAllCategories = (callback) => {
    console.log("CAT CALLED")

  db.transaction(
    (tx) => {
      tx.executeSql(
        'SELECT * FROM CategoryList',
        [],
        (_, { rows }) => {
          const categories = rows._array;
          console.log("QUERY : " + categories);
          callback(categories);
        },
        (_, error) => {
          console.error('Error during SQL execution:', error);
        }
      );
    },
    (error) => {
      console.error('Error during transaction:', error);
    }
  );
};

const getTodosByCategoryId = (categoryId) => {
    console.log("FUNC CALLED...", categoryId, typeof(categoryId));
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM TodoList WHERE Cid = ?',
            [categoryId],
            (_, results) => {
              const todos = results.rows._array;
            //   console.log("FUNC : ", todos);
              resolve(todos);
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    });
  };


  const deleteTables = () => {
    console.log("DELETE Called")
    db.transaction(
      (tx) => {
        // Drop CategoryList table
        tx.executeSql('DROP TABLE IF EXISTS CategoryList', [], (_, result) => {
          console.log('CategoryList table deleted successfully');
        });
  
        // Drop TodoList table
        tx.executeSql('DROP TABLE IF EXISTS TodoList', [], (_, result) => {
          console.log('TodoList table deleted successfully');
        });
      },
      (error) => {
        console.error('Error during transaction:', error);
      }
    );
  };

  const addTodo = async (Cid, Title, Description) => {
    console.log(Cid, Title, Description)
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
            [Cid, Title, Description],
            (_, result) => {
              console.log('Todo added successfully');
              resolve();
            },
            (_, error) => {
              console.error('Error adding todo:', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error('Error during transaction:', error);
          reject(error);
        }
      );
    });
  };
  
  
  
  
export { initDatabase, closeDatabase, getAllCategories, getTodosByCategoryId , deleteTables , addTodo };
