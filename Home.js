// CategoryListComponent.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ItemList from './ItemList';
import { getAllCategories } from './Database';


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

  return (
    <Stack.Navigator>
        <Stack.Screen name="Todo List">
            {() => (
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.h1}>Your Categories:</Text>
                {category?.map((category) => (
                <TouchableOpacity
                    style={styles.categoryContainer}
                    key={category.Cid}
                    onPress={() => handleCategoryPress(category)}
                >
                    <Text style={styles.categoryTitle}>{category.Title}</Text>
                    {/* <Text style={styles.itemsCount}>{`Items Count: ${category.ItemsCount}`}</Text> */}
                </TouchableOpacity>
                ))}
            </ScrollView>
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
      backgroundColor: 'rgba(0, 150, 136, 0.6)', // Use the desired color here
      borderRadius: 8,
      marginBottom: 16,
      padding: 16,
      alignItems: 'center',
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#fff', // Optional: Add text color for better contrast
    },
    itemsCount: {
      color: '#ccc', // Optional: Adjust text color for better contrast
    },
    h1: {
        fontSize: 24, // Adjust the font size as needed
        fontWeight: 'bold',
        marginBottom: 10, // Adjust the margin as needed
      },
  });
  

export default CategoryListComponent;
