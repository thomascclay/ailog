import React, {useState, useContext} from 'react';
import {UserContext} from "../context/UserContext";
import {Api} from "../api/api";
export const useApi = () => {
  const userContext = useContext(UserContext);
  // const [api, setApi] = useState(Api({username: userContext.username || '', token: userContext.token || ''}))
  //
  // React.useEffect(() => {
  //   setApi(Api({username: userContext.username || '', token: userContext.token || ''}))
  // }, [userContext.username, userContext.token])

  return Api({username: userContext.username || '', token: userContext.token || ''})
}