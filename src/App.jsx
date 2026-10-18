import Navbar from './components/Navbar'
import Login from './components/sections/Login';
import UserManagement from './components/sections/UserManagement';
import Home from './components/sections/Home';
import Profile from './components/sections/Profile';
import RoleSelection from './components/sections/Roleselection';
function App() {
  return (
    <div>
      <Navbar />
      <Login />
      {/*<Profile />*/}
      {/*<Home />*/}
      
      {/*<RoleSelection />*/}
      {/* <UserManagement /> */}
    </div>
  )
}

export default App