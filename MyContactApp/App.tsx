import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddNewContact from './component/AddNewContact'
import ContactListScreen from './component/ContactListScreen';
import FavoriteContactList from './component/FavoriteContactList';
import UpdateContactScreen from './component/UpdateContactScreen';
import ViewContact from './component/ViewContact';
import { SwipeListView } from 'react-native-swipe-list-view';

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
   
    <Stack.Navigator>
  
    <Stack.Screen name='ContactList' component={ContactListScreen}></Stack.Screen>
 
    <Stack.Screen name='AddNewContact' component={AddNewContact}></Stack.Screen>
    <Stack.Screen name='ViewContact' component={ViewContact}></Stack.Screen>
    <Stack.Screen name='FavoriteContactList' component={FavoriteContactList}></Stack.Screen> 
    <Stack.Screen name='UpdateContact' component={UpdateContactScreen}></Stack.Screen> 
  </Stack.Navigator>
  );
}
export default function App() {
  return (
     <NavigationContainer>
         <Drawer.Navigator>

       <Drawer.Screen name="Home" component={MyDrawer} />
       <Drawer.Screen name="FavoriteContactList" component={FavoriteContactList} />
     </Drawer.Navigator> 
     
    

       


    </NavigationContainer>
  )
}
