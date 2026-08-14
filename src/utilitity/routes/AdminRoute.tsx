import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../redux/hooks"

const AdminRoute =()=>{
    const auth = useAppSelector((state)=>state.auth);
    console.log("auth in header", auth);
    const hasAccess = auth?.user?.roles?.some((role: any) => 
      ["ROLE_DEVELOPER", "ROLE_ADMIN"].includes(role.name)
    )

    return (hasAccess) ? <Outlet/> : <Navigate to="/login"/>
}

export default AdminRoute