// ItemList.js
import React, { useState , useEffect} from 'react';
import { Image , View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button , ScrollView , TouchableWithoutFeedback} from 'react-native';

import { addTodo, deleteTodo, getTodosByCategoryId, toggleTodoDoneStatus, updateTodoTitle } from './Database';



const ItemList = ({ route }) => {
  const { category } = route.params;
  const [newsearch,setnewsearch]=useState({search: ""})

  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [newTodo , setNewTodo] = useState({})
  const [editText , setEditText] = useState("")
  const [editTodoTid , setEditTodoTid] = useState(null)
  
  useEffect(() => {
    

    fetchTodos();
  }, [category.Cid]);
  const fetchTodos = async () => {
    try {
      const result = await getTodosByCategoryId(category.Cid,newsearch.search);
      console.log(result)
      setTodos(result);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodoHandler = async() => {
    try {
         await addTodo(category.Cid , newTodo.Title , newTodo.Description).then((r)=>{
            setModalVisible(false);
            setTodos([...todos , r])
            setNewTodo({})
        })
        
    } catch (error) {
        console.error('Error Adding todo:', error);
    }    
  };

  const onCheckboxPress = async(tid) =>{
    await toggleTodoDoneStatus(tid).then((r)=>{

        setTodos((prevTodos) => {
            const todoCopy = [...prevTodos];
            const todoIndex = todoCopy.findIndex((todo) => todo.Tid === tid);
            todoCopy[todoIndex].Done = todoCopy[todoIndex].Done ? 0 : 1;

            return todoCopy;
          });
    })
  }

  const handleDeleteTodo = async(tid)=>{
    console.log(tid)
    await deleteTodo(tid).then((r)=>{
        setTodos((prevTodos) => {
            const updatedTodos = prevTodos.filter((todo) => todo.Tid !== tid);
            return updatedTodos;
          });          

    })
  }

  const editTodoHandler = async(tid) => {
      await updateTodoTitle(tid,editText).then((r)=>{
        setTodos((prevTodo) => {
          const todoCopy = [...prevTodo];
          const todoIndex = todoCopy.findIndex((todo) => todo.Tid === tid);
          todoCopy[todoIndex].Title = editText;

          return todoCopy
        });

        setEditModal(false)
        setEditText("")
        setEditTodoTid(null)
      })


  }

  return (
    <View style={styles.container}>
      <TextInput placeholder='search' value={newsearch.search} onChangeText={(text)=> setnewsearch({...newsearch,search:text})}/>
      <Button title='Search' onPress={()=>{
        fetchTodos();
      }}/>
      <ScrollView>
      {todos && todos.length > 0 ? todos.map((todo, index) => (
        <View key={String(todo.Tid)} style={[styles.todoContainer , !todo.Done && styles.DoneBG]}>
          <View style={styles.checkboxContainer}>
      
            <TouchableWithoutFeedback onPress={() => onCheckboxPress(todo.Tid)}>
              <View>
              <Text style={[styles.checkboxText, todo.Done ? styles.todoDoneContainer : styles.todoNotDoneContainer]}>
                  {todo.Done ? '👍' : '👎'}
              </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.todoDetailsContainer}>
              <View style={styles.Textcontainer}>
                  <Text style={styles.title}>{todo.Title}</Text>
                  <View style={styles.TextbuttonsContainer}>
                      <TouchableOpacity style={styles.Textbutton}  >
                          <Text style={styles.TextbuttonText} onPress={() => {

                            setEditText(() => {
                              const todoCopy = [...todos];
                              const todoIndex = todoCopy.findIndex((todoItem) => todoItem.Tid === todo.Tid);
                      
                              return todoCopy[todoIndex].Title;
                            });

                            setEditTodoTid(todo.Tid)
                            setEditModal(!editModal);
                          }}>✎</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.Textbutton} >
                          <Text style={styles.TextbuttonText} onPress={() =>{ handleDeleteTodo(todo.Tid) }}>⌫</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            <Text style={[styles.description , !todo.Done && styles.DoneBG]}>{todo.Description}</Text>
          </View>
        </View>)) 
    :<View style={styles.emptyListContainer}>
    <Image
      source={require('./assets/EmptyListImage.jpeg')}
      style={styles.emptyListImage}
    />
    <Text style={styles.emptyListText}>
      Add Todos to see here
    </Text>
  </View>
    }
    </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) => setNewTodo({ ...newTodo, Title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => setNewTodo({ ...newTodo, Description: text })}
          />
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <View style={styles.buttonSpacer} /> 
            <Button title="Add Todo" onPress={addTodoHandler} />
          </View>

        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={false}
        visible={editModal}
        onRequestClose={() => {
          setEditModal(!editModal);
          setEditTodoTid(null);
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={editText}
            onChangeText={(text) => setEditText(text)}
          />
          <View style={styles.buttonRow}>
            <Button title="Save Changes" onPress={() => {editTodoHandler(editTodoTid)}} />
          </View>

        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoDoneContainer:{
    backgroundColor: '#55aa88',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoNotDoneContainer: {
    backgroundColor: 'hsl(0, 90%, 37%);', 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#009688',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#009688',
    marginBottom: 20,
    width: '80%',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 8,
  },
  buttonSpacer: {
    width: 10, // Adjust the width as needed for spacing
  },
  checkboxContainer: {
    position: 'absolute',
    right: 10, // Adjust the value as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    padding: 5, // Add padding as needed
    fontSize: 18, // Adjust the font size as needed
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  checkboxContainer: {
    marginRight: 16,
  },

  todoDetailsContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 16,
    color: '#888',
  },
  Textcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: 4,
  },
  TextbuttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  Textbutton: {
    backgroundColor: '#009688',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 4,
  },
  TextbuttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop :  '30%'
  },
  emptyListImage: {
    width: 250, // Adjust the width as needed
    height: 300, // Adjust the height as needed
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  emptyListText: {
    padding: 16, // Adjust the padding as needed
    fontSize: 24, // Adjust the font size as needed
    textAlign: 'center', // Center the text within its container
    color: '#123', // Adjust the text color as needed
  },
  DoneBG : {
    backgroundColor : '#e9e9d9',
    color : 'black'
  },
});

export default ItemList;