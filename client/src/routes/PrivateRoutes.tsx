import { useSelector } from "react-redux"

const PrivateRoutes = () => {
    const currentUser = useSelector((state: any) => state.persistedReducer.user.currentUser);
  return (
    <div>PrivateRoutes</div>
  )
}

export default PrivateRoutes