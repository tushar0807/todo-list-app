// ItemList.js
import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button , ScrollView } from 'react-native';

import { addTodo, getTodosByCategoryId } from './Database';



const ItemList = ({ route }) => {
  const { category } = route.params;

  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodo , setNewTodo] = useState({})

  let db = 

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const result = await getTodosByCategoryId(category.Cid);
        console.log(result)
        setTodos(result);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [category.Cid ]);

  const addTodoHandler = async() => {
    try {
        const resp = await addTodo(category.Cid , newTodo.Title , newTodo.Description).then((r)=>{
            setModalVisible(false);
            setTodos([...todos , newTodo])
            setNewTodo({})
        })
        
    } catch (error) {
        console.error('Error Adding todo:', error);
    }
    
    
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {todos?.map((todo , index) => (
          <View key={String(index)} style={styles.todoContainer}>
            <Text style={styles.title}>{todo.Title}</Text>
            <Text style={styles.description}>{todo.Description}</Text>
          </View>
        ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoContainer: {
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
});

export default ItemList;