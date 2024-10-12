import "react-native-gesture-handler"; // Ensure this is at the top
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import TabBar from "./components/TabBar";
import { useFonts } from 'expo-font'; // For loading custom fonts


import OnBoard01 from "./screens/OnBoard/OnBoard01";
import OnBoard02 from "./screens/OnBoard/OnBoard02";
import Profile from "./screens/Home/Profile";
import Favourite from "./screens/Home/Favourite";
import book from "./screens/Home/Book";
import Details01 from "./screens/Details/Details01";



import HealthAdvisorOnBoardScreen from "./HealthAdvisor/HealthAdvisorOnBoardScreen";
import HealthAdvisorHomeScreen from "./HealthAdvisor/HealthAdvisorHomeScreen";
import HealthAdvisorDetailsScreen from "./HealthAdvisor/HealthAdvisorDetailsScreen";
import HealthAdvisorDateTimeScreen from "./HealthAdvisor/HealthAdvisorDateTimeScreen";
import HealthAdvisorAppointmentScreen from "./HealthAdvisor/HealthAdvisorAppointmentScreen";
import HealthAdvisorSearchScreen from "./HealthAdvisor/HealthAdvisorSearchScreen";

import TravelGuideOnboardScreen from "./TravelGuide/TravelGuideOnboardScreen";
import TravelGuideHomeScreen from "./TravelGuide/TravelGuideHomeScreen";
import TravelGuideDetailsScreen from "./TravelGuide/TravelGuideDetailsScreen";
import TravelGuideTimeScreen from "./TravelGuide/TravelGuideTimeScreen";
import TravelGuideAppointmentScreen from "./TravelGuide/TravelGuideAppointmentScreen";
import TravelGuideBookedListScreen from "./TravelGuide/TravelGuideBookedListScreen";
import { ToastProvider } from "react-native-toast-notifications";


import GoalHomeScreen from "./screens/GoalSetting/GoalHome";
import MapScreen from "./screens/GoalSetting/Map";
import TravelUpdate from "./screens/GoalSetting/TravelUpdate";
import MyGoalList from "./screens/GoalSetting/MyGoalList";






// Import your screens
import Home from './screens/HomeScreen';
import LogIn from './screens/LoginScreen';
import SignUp from './screens/SignupScreen';
import JournalHome from "./screens/JournalHome";
import MyJournals from "./screens/Journal/MyJournals";
import PublicJournals from "./screens/Journal/PublicJournals";
import JournalDetails from "./screens/Journal/JournalDetails";
import Temp01 from "./screens/Journal/AddJournal_temp01";
import Temp02 from "./screens/Journal/AddJournal_temp02";
import EditJournal from "./screens/Journal/EditJournal";


import BookedListScreen from "./screens/BookedListScreen";



// Create the stack navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // Create a Tab navigator

// Define your Tab Layout
function BottomTabs() {
  return (
    <Tab.Navigator >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Appointments"
        component={BookedListScreen}
      
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {

   // Load custom fonts
   const [fontsLoaded] = useFonts({
    'PatricHand': require('./assets/PatrickHand-Regular.ttf'),
    
  });

  // Show nothing until the fonts are loaded
  if (!fontsLoaded) {
    return null; // Prevent app from rendering before fonts are ready
  }

  return (
    <Stack.Navigator initialRouteName="OnBoard01">
      <Stack.Screen
        name="OnBoard01"
        component={OnBoard01}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OnBoard02"
        component={OnBoard02}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Book"
        component={book}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Details01"
        component={Details01}
        options={{
          headerShown: false,
        }}
      />

      {/* The BottomTabs Navigator will show on all its screens */}
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="HealthAdvisorOnBoardScreen"
        component={HealthAdvisorOnBoardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthAdvisorHomeScreen"
        component={HealthAdvisorHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthAdvisorDetailsScreen"
        component={HealthAdvisorDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthAdvisorDateTimeScreen"
        component={HealthAdvisorDateTimeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthAdvisorAppointmentScreen"
        component={HealthAdvisorAppointmentScreen}
        options={{ headerShown: false }}
      />

<Stack.Screen
          name="HealthAdvisorSearchScreen"
          component={HealthAdvisorSearchScreen}
          options={{ headerShown: false }}
        />

<Stack.Screen name="Travel Guide Onboard" component={TravelGuideOnboardScreen} options={{headerShown:false}}/>       
          <Stack.Screen name="Travel Guide Home" component={TravelGuideHomeScreen} options={{headerShown:false}}/>      
          <Stack.Screen name="Travel Guide Details" component={TravelGuideDetailsScreen} />      
          <Stack.Screen name="Select Time" component={TravelGuideTimeScreen} />      
          <Stack.Screen name="Appointment" component={TravelGuideAppointmentScreen} />      
          <Stack.Screen name="Appointment List" component={TravelGuideBookedListScreen} />



        <Stack.Screen name="Goal" component={GoalHomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="list" component={MyGoalList} />
        <Stack.Screen name="TravelUpdate" component={TravelUpdate} /> 


        <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LogIn" component={LogIn}  options={{headerShown:false}}/>
          <Stack.Screen name="SignUp" component={SignUp}  options={{headerShown:false}}/>
          <Stack.Screen name="JournalHome" component={JournalHome} />
          <Stack.Screen name="MyJournals" component={MyJournals} />
          <Stack.Screen name="PublicJournals" component={PublicJournals} />
          <Stack.Screen name="JournalDetails" component={JournalDetails} />
          <Stack.Screen name="Template 01" component={Temp01} />
          <Stack.Screen name="Template 02" component={Temp02} />
          <Stack.Screen name="EditJournal" component={EditJournal} />


    </Stack.Navigator>

  
  );
}
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
