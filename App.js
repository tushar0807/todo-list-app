// App.js or your main entry point
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CategoryListComponent from './Home';
import { closeDatabase, deleteTables, getAllCategories, initDatabase } from './Database';

const App = () => {

  useEffect(()=>{
    // initDatabase();

    
},[])

  return (
    <NavigationContainer>
      <CategoryListComponent />
    </NavigationContainer>
  );
};

export default App;
