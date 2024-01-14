
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView , Modal , TextInput , Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ItemList from './ItemList';
import { addCategory, deleteCategory, getAllCategories } from './Database';
import { MaterialIcons } from '@expo/vector-icons';


const Stack = createStackNavigator();

const CategoryListComponent = () => {
  const navigation = useNavigation();

  const [category, setCategory] = useState([]);

useEffect(()=>{
    getAllCategories((categories) => {
        console.log(categories)
        setCategory(categories)
    });
},[])

const handleCategoryPress = (category) => {
    navigation.navigate('ItemList', { category });
};

const handleDeleteCategory = async (category) => {
    try {
      await deleteCategory(category.Cid);
      // Update the categories list after deletion
      getAllCategories((categories) => {
        setCategory(categories);
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  


    const [newCategory, setNewCategory] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleCategoryAdd = async() => {
    
        try {
            await addCategory(newCategory).then((r)=>{
                setCategory([...category , r])
                setModalVisible(false)
                
            }).then(()=>{
                setNewCategory("")
            })
        } catch (error) {
            console.error('Error Adding todo:', error);
        }
        
    }

  return (
    <Stack.Navigator>
        <Stack.Screen name="Todo List">
            {() => (
            <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <Text style={styles.h1}>Your Categories:</Text>
              {category.map((category, index) => (
        <TouchableOpacity
          style={styles.categoryCard}
          key={category.Cid}
          onPress={() => handleCategoryPress(category)}
        >
          <View style={styles.categoryContent}>
            <Text style={styles.categoryTitle}>{category.Title}</Text>
            {/* Add a delete icon with onPress */}
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteCategory(category)}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
          
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
                    placeholder="Category Title"
                    onChangeText={(text) => setNewCategory(text)}
                  />
                  <View style={styles.buttonRow}>
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    <View style={styles.buttonSpacer} />
                    <Button title="Add Category" onPress={handleCategoryAdd} />
                  </View>
                </View>
              </Modal>
            </ScrollView>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
          </View>
          
            )}
            

        </Stack.Screen>
        <Stack.Screen name="ItemList" component={ItemList} />
    </Stack.Navigator>

  );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      padding: 16,
    },
    categoryContainer: {
      backgroundColor: 'rgba(0, 150, 136, 0.6)',
      borderRadius: 8,
      marginBottom: 16,
      // paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    categoryCard: {
      backgroundColor: 'rgba(176, 121, 77, 0.2)',
      borderRadius: 8,
      marginBottom: 16,
      padding: 16,
      borderBottomWidth: 6, // Add border bottom
      borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Adjust the color as needed
    },
    categoryContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#009688',
    },
    itemsCount: {
      color: '#ccc', // Optional: Adjust text color for better contrast
    },
    h1: {
        fontSize: 24, // Adjust the font size as needed
        fontWeight: 'bold',
        marginBottom: 24, // Adjust the margin as needed
      },
      addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(176, 121, 77,0.8);',
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
      deleteIcon: {
        marginTop : 16,
      },
  });
  

export default CategoryListComponent;
