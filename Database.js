import * as SQLite from 'expo-sqlite';

let db = SQLite.openDatabase('mydatabase.db');


db.transaction((tx) => {
  tx.executeSql(
    'SELECT name FROM sqlite_master WHERE type="table" AND name="CategoryList"',
    [],
    (_, result) => {
      if (result.rows.length === 0) {
        // Category list table does not exist, call initDB function
        initDatabase();
      }
    },
    (_, error) => {
      // Handle error if necessary
      console.error('Error checking table existence:', error);
    }
  );
});

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
  
        // Create TodoList table with the 'Done' field
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS TodoList (Tid INTEGER PRIMARY KEY AUTOINCREMENT, Cid INTEGER, Title TEXT, Description TEXT, Done BOOLEAN DEFAULT 0)',
          []
        );
  
        // Insert dummy data into TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [1, 'Learn Java Basics', 'Complete Java tutorial for beginners', 0]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [1, 'Build a Java Project', 'Create a small Java project', 1]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [1, 'Explore Java Frameworks', 'Learn about popular Java frameworks', 0]
        );
  
        // Add more dummy entries in TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [2, 'Read a Classic Novel', 'Choose and read a classic novel', 0]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [2, 'Explore New Authors', 'Discover books from new authors', 1]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [2, 'Join a Book Club', 'Participate in a local book club', 0]
        );
  
        // Add more dummy entries in TodoList
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [3, 'Morning Jog', 'Go for a jog in the morning', 1]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [3, 'Strength Training', 'Include strength training exercises', 0]
        );
        tx.executeSql(
          'INSERT INTO TodoList (Cid, Title, Description, Done) VALUES (?, ?, ?, ?)',
          [3, 'Yoga Session', 'Practice yoga for flexibility', 1]
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

const getAllCategories = (callback,search="") => {
    console.log("CAT CALLED")

  db.transaction(
    (tx) => {
      tx.executeSql(
        `SELECT * FROM CategoryList where Title like '%${search}%'`,
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

const getTodosByCategoryId = (categoryId, Search="") => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM TodoList WHERE Cid = ? and title like '%${Search}%'`,
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
    console.log(Cid, Title, Description);
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO TodoList (Cid, Title, Description) VALUES (?, ?, ?)',
            [Cid, Title, Description],
            (_, result) => {
              const insertedId = result.insertId;
              // Fetch the inserted todo using the insertedId
              tx.executeSql(
                'SELECT * FROM TodoList WHERE Tid = ?',
                [insertedId],
                (_, { rows }) => {
                  const insertedTodo = rows._array[0];
                  console.log('Todo added successfully:', insertedTodo);
                  resolve(insertedTodo);
                },
                (_, error) => {
                  console.error('Error fetching inserted todo:', error);
                  reject(error);
                }
              );
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
  

  const addCategory = async (Title) => {
    console.log(Title);
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO CategoryList (Title) VALUES (?)',
            [Title],
            (_, result) => {
              const insertedId = result.insertId;
              // Fetch the inserted category using the insertedId
              tx.executeSql(
                'SELECT * FROM CategoryList WHERE Cid = ?',
                [insertedId],
                (_, { rows }) => {
                  const insertedCategory = rows._array[0];
                  console.log('Category added successfully:', insertedCategory);
                  resolve(insertedCategory);
                },
                (_, error) => {
                  console.error('Error fetching inserted category:', error);
                  reject(error);
                }
              );
            },
            (_, error) => {
              console.error('Error adding category:', error);
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
  
  
  const deleteCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          // Delete the category from CategoryList
          tx.executeSql('DELETE FROM CategoryList WHERE Cid = ?', [categoryId], (_, result) => {
            console.log('Category deleted successfully');
          });
  
          // Delete all rows with the matching Cid from TodoList
          tx.executeSql('DELETE FROM TodoList WHERE Cid = ?', [categoryId], (_, result) => {
            console.log('Todos for the category deleted successfully');
          });
        },
        (error) => {
          console.error('Error during transaction:', error);
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  };
  
  const toggleTodoDoneStatus = (tid) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE TodoList SET Done = NOT Done WHERE Tid = ?',
            [tid],
            (_, result) => {
              console.log('Todo status toggled successfully');
              resolve();
            },
            (_, error) => {
              console.error('Error toggling todo status:', error);
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
  

  const deleteTodo = (tid) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'DELETE FROM TodoList WHERE Tid = ?',
            [tid],
            (_, result) => {
              console.log('Todo deleted successfully');
              resolve();
            },
            (_, error) => {
              console.error('Error deleting todo:', error);
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
  
  
  const updateTodoTitle = async (tid, newTitle) => {
    console.log("Update Query : " , tid , newTitle)
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE TodoList SET Title = ? WHERE Tid = ?',
            [newTitle, tid],
            (_, result) => {
              console.log('Todo title updated successfully');
              resolve(result);
            },
            (_, error) => {
              console.error('Error updating todo title:', error);
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
  
  
export { initDatabase, closeDatabase, getAllCategories, getTodosByCategoryId ,
     deleteTables , addTodo , addCategory , deleteCategory , toggleTodoDoneStatus , deleteTodo
     , updateTodoTitle
};